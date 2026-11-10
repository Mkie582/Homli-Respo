
/* =========================================================
   CAMPUSNEST CHAT SYSTEM
   PHASE 7.8.5.3 — INBOX + MESSAGING + PRESENCE

   Supports:
   - Student and landlord inboxes
   - One conversation per student/property
   - Conversation history
   - Supabase Realtime
   - Unread messages and read receipts
   - Inbox search and filters
   - Responsive mobile navigation
   - CampusPresence integration
   - Profile avatars and fallback initials

   Existing database tables are preserved.
   ========================================================= */


/* =========================================================
   1. APPLICATION STATE
   ========================================================= */

let currentConversation = null;
let currentUser = null;
let currentListing = null;

const CampusChat = {

    initialized: false,

    currentUserId: null,
    currentUserRole: null,
    currentProfile: null,

    conversations: [],
    filteredConversations: [],

    activeConversation: null,
    activeParticipant: null,
    activeListing: null,

    realtimeChannels: new Map(),
    messageIds: new Set(),

    activeFilter: "all",
    searchTerm: "",

    isSending: false,

    presenceParticipantId: null,
    presenceSubscription: null,

    elements: {},


    /* =====================================================
       2. INITIALIZE
       ===================================================== */

    async init() {

        if (this.initialized) return;

        this.initialized = true;

        console.log("Initializing CampusNest messaging...");

        this.cacheElements();
        this.setupEvents();

        try {

            const user = await this.getCurrentUser();

            if (!user) {
                this.showError(
                    "Please sign in to access your messages."
                );
                return;
            }

            const profile = await this.loadCurrentProfile();

            if (!profile) {
                this.showError(
                    "We couldn't load your CampusNest account profile."
                );
                return;
            }

            if (
                profile.role !== "student" &&
                profile.role !== "landlord"
            ) {
                this.showError(
                    "Your account does not have permission to use this messaging inbox."
                );
                return;
            }

            this.currentProfile = profile;
            this.currentUserRole = profile.role;

            // Initialize the shared presence service once.
            if (
                window.CampusPresence &&
                typeof CampusPresence.init === "function"
            ) {

                try {

                    await CampusPresence.init(
                        this.currentUserId
                    );

                } catch (presenceError) {

                    console.warn(
                        "Presence initialization failed:",
                        presenceError
                    );

                }

            } else {

                console.warn(
                    "CampusPresence was not found. Check the script order in chat.html."
                );

            }

            console.log(
                "CampusNest role:",
                this.currentUserRole
            );

            await this.loadInbox();

            await this.openConversationFromUrl();

            this.hideLoading();

            console.log(
                "CampusNest messaging initialized successfully."
            );

        } catch (error) {

            console.error(
                "CampusNest initialization error:",
                error
            );

            this.showError(
                "Something went wrong while loading your messages. Please refresh and try again."
            );

        }

    },


    /* =====================================================
       3. CACHE HTML ELEMENTS
       ===================================================== */

    cacheElements() {

        const ids = [

            "chatApp",

            "chatInbox",
            "chatInboxCount",
            "chatInboxSearch",
            "clearChatSearch",
            "chatConversationList",
            "chatInboxLoading",
            "chatInboxEmpty",
            "chatInboxNoResults",

            "chatWelcome",
            "chatActiveConversation",

            "chatBackButton",
            "chatInboxBackButton",

            "chatAvatar",
            "chatLandlordName",

            "chatPresenceDot",
            "chatPresenceStatus",

            "chatOptionsButton",
            "chatOptionsMenu",

            "chatListingBar",
            "chatListingImage",
            "chatListingTitle",
            "chatListingName",
            "chatViewListing",

            "chatMessages",
            "chatMessagesLoading",

            "chatForm",
            "chatMessageInput",
            "chatSendButton",
            "chatCharacterCount",

            "chatLoading",
            "chatError",
            "chatErrorMessage",
            "chatErrorBack",
            "chatPropertyDetailsPanel",
            "chatPropertyDetailsContent",
            "chatPropertyDetailsClose",

        ];

        ids.forEach(id => {

            this.elements[id] =
                document.getElementById(id);

        });

    },


    /* =====================================================
       4. AUTHENTICATION
       ===================================================== */

    async getCurrentUser() {

        const {
            data,
            error
        } = await campusSupabase.auth.getUser();

        if (error) throw error;

        if (!data.user) return null;

        currentUser = data.user;

        this.currentUserId = data.user.id;

        return data.user;

    },


    /* =====================================================
       5. LOAD USER PROFILE
       ===================================================== */

    async loadCurrentProfile() {

        const {
            data,
            error
        } = await campusSupabase
            .from("profiles")
            .select(
                "id,first_name,last_name,email,role,avatar_url"
            )
            .eq(
                "id",
                this.currentUserId
            )
            .maybeSingle();

        if (error) throw error;

        return data;

    },


    /* =====================================================
       6. LOAD INBOX
       ===================================================== */

    async loadInbox() {

        console.log(
            "Loading inbox for:",
            this.currentUserRole
        );

        if (this.elements.chatInboxLoading) {
            this.elements.chatInboxLoading.hidden = false;
        }

        if (this.elements.chatInboxEmpty) {
            this.elements.chatInboxEmpty.hidden = true;
        }

        if (this.elements.chatInboxNoResults) {
            this.elements.chatInboxNoResults.hidden = true;
        }

        const participantColumn =
            this.currentUserRole === "landlord"
                ? "landlord_id"
                : "student_id";

        const {
            data,
            error
        } = await campusSupabase
            .from("conversations")
            .select("*")
            .eq(
                participantColumn,
                this.currentUserId
            )
            .order(
                "updated_at",
                { ascending: false }
            );

        if (error) throw error;

        const conversations = data || [];

        if (!conversations.length) {

            this.conversations = [];
            this.filteredConversations = [];

            this.renderInbox();
            this.hideInboxLoading();
            this.showInboxEmpty();
            this.updateInboxCount();

            return;

        }

        const participantIds = [
            ...new Set(
                conversations.map(conversation => {

                    return this.currentUserRole === "landlord"
                        ? conversation.student_id
                        : conversation.landlord_id;

                })
            )
        ];

        const listingIds = [
            ...new Set(
                conversations.map(conversation => {
                    return conversation.listing_id;
                })
            )
        ];

        const [
            profilesResult,
            listingsResult
        ] = await Promise.all([

            campusSupabase
                .from("profiles")
                .select(
                    "id,first_name,last_name,email,role,avatar_url"
                )
                .in("id", participantIds),

            campusSupabase
                .from("listings")
                .select("*")
                .in("id", listingIds)

        ]);

        if (profilesResult.error) {
            throw profilesResult.error;
        }

        if (listingsResult.error) {
            throw listingsResult.error;
        }

        const profilesById = new Map(
            (profilesResult.data || []).map(profile => [
                String(profile.id),
                profile
            ])
        );

        const listingsById = new Map(
            (listingsResult.data || []).map(listing => [
                String(listing.id),
                listing
            ])
        );

        const enrichedConversations = await Promise.all(

            conversations.map(async conversation => {

                const participantId =
                    this.currentUserRole === "landlord"
                        ? conversation.student_id
                        : conversation.landlord_id;

                const participant =
                    profilesById.get(
                        String(participantId)
                    ) || null;

                const listing =
                    listingsById.get(
                        String(conversation.listing_id)
                    ) || null;

                const [
                    latestResult,
                    unreadResult
                ] = await Promise.all([

                    campusSupabase
                        .from("messages")
                        .select(
                            "id,message_text,sender_id,is_read,created_at"
                        )
                        .eq(
                            "conversation_id",
                            conversation.id
                        )
                        .order(
                            "created_at",
                            { ascending: false }
                        )
                        .limit(1),

                    campusSupabase
                        .from("messages")
                        .select(
                            "id",
                            {
                                count: "exact",
                                head: true
                            }
                        )
                        .eq(
                            "conversation_id",
                            conversation.id
                        )
                        .eq("is_read", false)
                        .neq(
                            "sender_id",
                            this.currentUserId
                        )

                ]);

                if (latestResult.error) {
                    console.warn(
                        "Latest message error:",
                        latestResult.error
                    );
                }

                if (unreadResult.error) {
                    console.warn(
                        "Unread count error:",
                        unreadResult.error
                    );
                }

                return {

                    ...conversation,

                    participant,

                    listing,

                    latestMessage:
                        latestResult.data?.[0] || null,

                    unreadCount:
                        unreadResult.count || 0

                };

            })

        );

        this.conversations =
            enrichedConversations;

        this.sortConversations();

        this.applyInboxFilters();

        this.hideInboxLoading();

        this.updateInboxCount();

        this.subscribeToInboxRealtime();

        console.log(
            "Inbox conversations loaded:",
            this.conversations.length
        );

    },


    sortConversations() {

        this.conversations.sort((a, b) => {

            const dateA = new Date(
                a.latestMessage?.created_at ||
                a.updated_at
            ).getTime();

            const dateB = new Date(
                b.latestMessage?.created_at ||
                b.updated_at
            ).getTime();

            return dateB - dateA;

        });

    },


    /* =====================================================
       7. RENDER INBOX
       ===================================================== */

    
renderInbox() {

    const container =
        this.elements.chatConversationList;

    if (!container) return;

    container.innerHTML = "";

    const conversations =
        this.filteredConversations;

    // Hide the list when there are no matching conversations.
    if (!conversations.length) {

        container.hidden = true;

        if (this.conversations.length) {

            if (this.elements.chatInboxNoResults) {
                this.elements.chatInboxNoResults.hidden = false;
            }

            if (this.elements.chatInboxEmpty) {
                this.elements.chatInboxEmpty.hidden = true;
            }

        } else {

            this.showInboxEmpty();

        }

        return;

    }

    // IMPORTANT: Make the conversation list visible.
    container.hidden = false;

    if (this.elements.chatInboxEmpty) {
        this.elements.chatInboxEmpty.hidden = true;
    }

    if (this.elements.chatInboxNoResults) {
        this.elements.chatInboxNoResults.hidden = true;
    }

    conversations.forEach(conversation => {

        const item =
            document.createElement("button");

        item.type = "button";
        item.className = "chat-conversation-item";

        item.dataset.conversationId =
            conversation.id;

        const isActive =
            String(this.activeConversation?.id) ===
            String(conversation.id);

        item.setAttribute(
            "aria-selected",
            String(isActive)
        );

        if (isActive) {
            item.classList.add("active");
        }

        if (conversation.unreadCount > 0) {
            item.classList.add("unread");
        }

        const avatarWrapper =
            document.createElement("div");

        avatarWrapper.className =
            "chat-conversation-avatar-wrapper";

        const avatar =
            document.createElement("div");

        avatar.className =
            "chat-conversation-avatar";

        this.renderAvatar(
            avatar,
            conversation.participant
        );

        avatarWrapper.appendChild(avatar);

        const details =
            document.createElement("div");

        details.className =
            "chat-conversation-details";

        const top =
            document.createElement("div");

        top.className =
            "chat-conversation-top";

        const name =
            document.createElement("span");

        name.className =
            "chat-conversation-name";

        name.textContent =
            this.getParticipantName(
                conversation.participant
            );

        const time =
            document.createElement("span");

        time.className =
            "chat-conversation-time";

        time.textContent =
            this.formatRelativeTime(
                conversation.latestMessage?.created_at ||
                conversation.updated_at
            );

        top.append(name, time);

        const property =
            document.createElement("span");

        property.className =
            "chat-conversation-property";

        property.textContent =
            conversation.listing?.title ||
            "Housing conversation";

        const meta =
            document.createElement("div");

        meta.className =
            "chat-conversation-meta";

        const preview =
            document.createElement("span");

        preview.className =
            "chat-conversation-preview";

        if (conversation.latestMessage) {

            const prefix =
                String(conversation.latestMessage.sender_id) ===
                String(this.currentUserId)
                    ? "You: "
                    : "";

            preview.textContent =
                prefix +
                conversation.latestMessage.message_text;

        } else {

            preview.textContent =
                "Start your conversation";

        }

        meta.appendChild(preview);

        if (conversation.unreadCount > 0) {

            const badge =
                document.createElement("span");

            badge.className =
                "chat-unread-badge";

            badge.textContent =
                conversation.unreadCount > 99
                    ? "99+"
                    : conversation.unreadCount;

            meta.appendChild(badge);

        }

        details.append(top, property, meta);

        item.append(
            avatarWrapper,
            details
        );

        container.appendChild(item);

    });

},

    renderAvatar(container, profile) {

        if (!container) return;

        container.innerHTML = "";

        const avatarUrl =
            profile?.avatar_url;

        if (avatarUrl) {

            const image =
                document.createElement("img");

            image.src = avatarUrl;
            image.alt = "";
            image.className = "chat-avatar-image";

            image.onerror = () => {
                image.remove();
                container.textContent =
                    this.getInitials(
                        this.getParticipantName(profile)
                    );
            };

            container.appendChild(image);

        } else {

            container.textContent =
                this.getInitials(
                    this.getParticipantName(profile)
                );

        }

    },


    /* =====================================================
       8. FILTER INBOX
       ===================================================== */

    applyInboxFilters() {

        let results =
            [...this.conversations];

        if (this.activeFilter === "unread") {

            results = results.filter(conversation => {
                return conversation.unreadCount > 0;
            });

        }

        if (this.searchTerm) {

            const term =
                this.searchTerm.toLowerCase();

            results = results.filter(conversation => {

                const participantName =
                    this.getParticipantName(
                        conversation.participant
                    ).toLowerCase();

                const listingTitle =
                    (
                        conversation.listing?.title || ""
                    ).toLowerCase();

                const listingLocation =
                    (
                        conversation.listing?.location || ""
                    ).toLowerCase();

                const preview =
                    (
                        conversation.latestMessage?.message_text || ""
                    ).toLowerCase();

                return (
                    participantName.includes(term) ||
                    listingTitle.includes(term) ||
                    listingLocation.includes(term) ||
                    preview.includes(term)
                );

            });

        }

        this.filteredConversations = results;

        this.renderInbox();

    },


    /* =====================================================
       9. OPEN CONVERSATION
       ===================================================== */

    async openConversation(conversationId) {

        const conversation =
            this.conversations.find(item => {

                return String(item.id) ===
                    String(conversationId);

            });

        if (!conversation) {
            console.warn(
                "Conversation not found:",
                conversationId
            );
            return;
        }

        // Prevent an old participant's presence from remaining.
        this.stopPresenceForConversation();

        this.activeConversation = conversation;
        currentConversation = conversation;

        this.activeParticipant =
            conversation.participant;

        this.activeListing =
            conversation.listing;

        currentListing =
            conversation.listing;

        this.messageIds.clear();

        this.showConversationPanel();

        this.updateConversationHeader();
        this.updateListingUI();

        this.renderInbox();

        await this.loadMessages();

        // Check the active conversation again before marking read.
        if (
            String(this.activeConversation?.id) ===
            String(conversation.id)
        ) {
            await this.markConversationRead();

            this.startPresenceForConversation();
        }

        this.subscribeToConversationRealtime(
            conversation.id
        );

        this.updateUrl(conversation.id);

        console.log(
            "Opened conversation:",
            conversation.id
        );

    },


    /* =====================================================
       10. LOAD MESSAGES
       ===================================================== */

    async loadMessages() {

        const container =
            this.elements.chatMessages;

        if (!container || !this.activeConversation) {
            return;
        }

        const conversationId =
            this.activeConversation.id;

        if (this.elements.chatMessagesLoading) {
            this.elements.chatMessagesLoading.hidden = false;
        }

        container.innerHTML = "";

        const {
            data,
            error
        } = await campusSupabase
            .from("messages")
            .select("*")
            .eq(
                "conversation_id",
                conversationId
            )
            .order(
                "created_at",
                { ascending: true }
            );

        if (
            String(this.activeConversation?.id) !==
            String(conversationId)
        ) {
            return;
        }

        if (this.elements.chatMessagesLoading) {
            this.elements.chatMessagesLoading.hidden = true;
        }

        if (error) {

            console.error(
                "Message history error:",
                error
            );

            this.showMessageNotice(
                "We couldn't load these messages. Please try again."
            );

            return;

        }

        const messages = data || [];

        if (!messages.length) {

            this.showMessageNotice(
                "This is the beginning of your conversation. Send a message to get started."
            );

            return;

        }

        messages.forEach(message => {
            this.addMessage(message);
        });

        this.scrollToBottom();

    },


    /* =====================================================
       11. ADD MESSAGE TO SCREEN
       ===================================================== */

    addMessage(message) {

        if (!message || !message.id) return;

        const container =
            this.elements.chatMessages;

        if (!container) return;

        const messageId =
            String(message.id);

        if (this.messageIds.has(messageId)) return;

        this.messageIds.add(messageId);

        const notice =
            container.querySelector(
                ".chat-message-notice"
            );

        if (notice) notice.remove();

        const isMine =
            String(message.sender_id) ===
            String(this.currentUserId);

        const row =
            document.createElement("div");

        row.className =
            `chat-message ${isMine ? "sent" : "received"}`;

        row.dataset.messageId = messageId;

        const bubble =
            document.createElement("div");

        bubble.className =
            "chat-message-bubble";

        bubble.textContent =
            message.message_text;

        const time =
            document.createElement("div");

        time.className =
            "chat-message-time";

        time.textContent =
            this.formatTime(message.created_at);

        row.append(bubble, time);

        if (isMine && message.is_read) {

            const receipt =
                document.createElement("span");

            receipt.className =
                "chat-message-read";

            receipt.textContent = "Read";

            row.appendChild(receipt);

        }

        container.appendChild(row);

        this.scrollToBottom();

    },


    /* =====================================================
       12. SEND MESSAGE
       ===================================================== */

    async sendMessage() {

        if (this.isSending) return;

        const input =
            this.elements.chatMessageInput;

        if (!input) return;

        const messageText =
            input.value.trim();

        if (!messageText) return;

        if (!this.activeConversation) return;

        if (!this.currentUserId) return;

        const conversationId =
            this.activeConversation.id;

        this.isSending = true;

        if (this.elements.chatSendButton) {
            this.elements.chatSendButton.disabled = true;
        }

        try {

            const {
                data,
                error
            } = await campusSupabase
                .from("messages")
                .insert({

                    conversation_id: conversationId,
                    sender_id: this.currentUserId,
                    message_text: messageText

                })
                .select("*")
                .single();

            if (error) throw error;

            // Realtime may arrive before this response.
            if (
                String(this.activeConversation?.id) ===
                String(conversationId)
            ) {
                this.addMessage(data);
            }

            input.value = "";
            input.style.height = "auto";

            this.updateCharacterCount();

            await this.refreshConversation(
                conversationId
            );

        } catch (error) {

            console.error(
                "Message sending error:",
                error
            );

            alert(
                "Your message could not be sent. Please try again."
            );

        } finally {

            this.isSending = false;

            if (this.elements.chatSendButton) {
                this.elements.chatSendButton.disabled = false;
            }

            input.focus();

        }

    },


    /* =====================================================
       13. MARK CONVERSATION AS READ
       ===================================================== */

    async markConversationRead() {

        if (!this.activeConversation) return;

        const conversationId =
            this.activeConversation.id;

        const {
            error
        } = await campusSupabase
            .from("messages")
            .update({
                is_read: true
            })
            .eq(
                "conversation_id",
                conversationId
            )
            .neq(
                "sender_id",
                this.currentUserId
            )
            .eq("is_read", false);

        if (error) {

            console.error(
                "Read receipt update error:",
                error
            );

            return;

        }

        const conversation =
            this.conversations.find(item => {

                return String(item.id) ===
                    String(conversationId);

            });

        if (conversation) {
            conversation.unreadCount = 0;
        }

        if (
            String(this.activeConversation?.id) ===
            String(conversationId)
        ) {
            this.activeConversation.unreadCount = 0;
        }

        this.updateInboxCount();
        this.applyInboxFilters();

    },


    /* =====================================================
       14. REFRESH CONVERSATION
       ===================================================== */

    async refreshConversation(conversationId) {

        const {
            data,
            error
        } = await campusSupabase
            .from("messages")
            .select(
                "id,message_text,sender_id,is_read,created_at"
            )
            .eq(
                "conversation_id",
                conversationId
            )
            .order(
                "created_at",
                { ascending: false }
            )
            .limit(1);

        if (error) {
            console.error(error);
            return;
        }

        const conversation =
            this.conversations.find(item => {

                return String(item.id) ===
                    String(conversationId);

            });

        if (!conversation) return;

        conversation.latestMessage =
            data?.[0] || null;

        if (data?.[0]?.created_at) {
            conversation.updated_at =
                data[0].created_at;
        }

        this.sortConversations();
        this.applyInboxFilters();

    },


    /* =====================================================
       15. REALTIME — INBOX AND MESSAGES
       ===================================================== */

    subscribeToInboxRealtime() {

        this.conversations.forEach(conversation => {

            this.subscribeToConversationRealtime(
                conversation.id
            );

        });

    },


    subscribeToConversationRealtime(conversationId) {

        const key =
            String(conversationId);

        if (this.realtimeChannels.has(key)) return;

        const channel =
            campusSupabase
                .channel(`campus-chat-${key}`)
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages",
                        filter: `conversation_id=eq.${key}`
                    },
                    async payload => {

                        const message =
                            payload.new;

                        const isActive =
                            String(this.activeConversation?.id) === key;

                        if (isActive) {

                            this.addMessage(message);

                            if (
                                String(message.sender_id) !==
                                String(this.currentUserId)
                            ) {
                                await this.markConversationRead();
                            }

                        }

                        await this.refreshConversation(
                            conversationId
                        );

                        if (!isActive) {

                            await this.refreshUnreadCount(
                                conversationId
                            );

                        }

                    }
                )
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "messages",
                        filter: `conversation_id=eq.${key}`
                    },
                    payload => {

                        this.updateMessageReceipt(
                            payload.new
                        );

                        this.refreshUnreadCount(
                            conversationId
                        );

                    }
                )
                .subscribe(status => {

                    console.log(
                        `CampusNest Realtime ${key}:`,
                        status
                    );

                });

        this.realtimeChannels.set(key, channel);

    },


    /* =====================================================
       16. UPDATE READ RECEIPTS
       ===================================================== */

    updateMessageReceipt(message) {

        if (
            !message ||
            String(message.sender_id) !==
            String(this.currentUserId)
        ) {
            return;
        }

        const row =
            document.querySelector(
                `[data-message-id="${message.id}"]`
            );

        if (!row || !message.is_read) return;

        let receipt =
            row.querySelector(
                ".chat-message-read"
            );

        if (!receipt) {

            receipt =
                document.createElement("span");

            receipt.className =
                "chat-message-read";

            row.appendChild(receipt);

        }

        receipt.textContent = "Read";

    },


    /* =====================================================
       17. REFRESH UNREAD COUNT
       ===================================================== */

    async refreshUnreadCount(conversationId) {

        const {
            count,
            error
        } = await campusSupabase
            .from("messages")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            )
            .eq(
                "conversation_id",
                conversationId
            )
            .eq("is_read", false)
            .neq(
                "sender_id",
                this.currentUserId
            );

        if (error) {
            console.error(error);
            return;
        }

        const conversation =
            this.conversations.find(item => {

                return String(item.id) ===
                    String(conversationId);

            });

        if (!conversation) return;

        conversation.unreadCount =
            count || 0;

        if (
            String(this.activeConversation?.id) ===
            String(conversationId)
        ) {
            conversation.unreadCount = 0;
        }

        this.updateInboxCount();
        this.applyInboxFilters();

    },


    /* =====================================================
       18. CONVERSATION HEADER
       ===================================================== */

    updateConversationHeader() {

        const participant =
            this.activeParticipant;

        const name =
            this.getParticipantName(participant);

        if (this.elements.chatLandlordName) {
            this.elements.chatLandlordName.textContent = name;
        }

        if (this.elements.chatAvatar) {

            this.renderAvatar(
                this.elements.chatAvatar,
                participant
            );

        }

        this.updatePresenceUI(false, null);

    },


    /* =====================================================
       19. LISTING CONTEXT
       ===================================================== */

    updateListingUI() {

        const listing =
            this.activeListing;

        if (!listing) {

            if (this.elements.chatListingBar) {
                this.elements.chatListingBar.hidden = true;
            }

            return;

        }

        if (this.elements.chatListingBar) {
            this.elements.chatListingBar.hidden = false;
        }

        if (this.elements.chatListingTitle) {
            this.elements.chatListingTitle.textContent =
                "Conversation about";
        }

        if (this.elements.chatListingName) {
            this.elements.chatListingName.textContent =
                listing.title || "Housing listing";
        }

        if (this.elements.chatListingImage) {

            if (listing.image_url) {

                this.elements.chatListingImage.src =
                    listing.image_url;

                this.elements.chatListingImage.hidden = false;

            } else {

                this.elements.chatListingImage.removeAttribute("src");
                this.elements.chatListingImage.hidden = true;

            }

        }

        if (this.elements.chatViewListing) {

            this.elements.chatViewListing.hidden =
                listing.is_active === false;

        }

    },


openPropertyDetails() {

    const panel = this.elements.chatPropertyDetailsPanel;

    if (!panel || !this.activeListing) return;

    this.renderPropertyDetails();

    panel.hidden = false;

    this.elements.chatPropertyDetailsClose?.focus();

},



closePropertyDetails() {

    const panel = this.elements.chatPropertyDetailsPanel;

    if (panel) {
        panel.hidden = true;
    }

    this.elements.chatViewListing?.focus();

},


renderPropertyDetails() {

    const listing = this.activeListing;

    const container =
        this.elements.chatPropertyDetailsContent;

    if (!listing || !container) return;

    container.innerHTML = "";

    const createElement = (tag, className, value) => {

        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        element.textContent = value || "";

        return element;

    };

    // PROPERTY IMAGE
    if (listing.image_url) {

        const image = document.createElement("img");

        image.src = listing.image_url;
        image.alt = listing.title || "Housing property";

        image.className = "chat-property-details-image";

        container.appendChild(image);

    }

    // PROPERTY TITLE
    container.appendChild(
        createElement(
            "h4",
            "chat-property-details-title",
            listing.title || "Housing listing"
        )
    );

    // PROPERTY LOCATION
    if (listing.location) {

        container.appendChild(
            createElement(
                "p",
                "chat-property-details-location",
                listing.location
            )
        );

    }

    // PROPERTY PRICE
    if (listing.budget !== null && listing.budget !== undefined) {

        const price = Number(listing.budget);

        if (Number.isFinite(price)) {

            container.appendChild(
                createElement(
                    "p",
                    "chat-property-details-price",
                    `CA$${price.toLocaleString("en-CA")} / month`
                )
            );

        }

    }

    // PROPERTY DESCRIPTION
    if (listing.description) {

        container.appendChild(
            createElement(
                "h5",
                "chat-property-details-heading",
                "About this property"
            )
        );

        container.appendChild(
            createElement(
                "p",
                "chat-property-details-description",
                listing.description
            )
        );

    }

    // ADDITIONAL PROPERTY INFORMATION
    const details = [

        ["Housing type", listing.housing_type],
        ["Availability", listing.availability],
        ["Move-in date", listing.move_in],
        ["Gender preference", listing.gender],
        ["Furnished", listing.furnished],
        ["Parking", listing.parking],
        ["Utilities", listing.utilities],
        ["Smoking", listing.smoking],
        ["Pets", listing.pets]

    ];

    const availableDetails = details.filter(([label, value]) => {

        return value !== null &&
            value !== undefined &&
            String(value).trim() !== "";

    });

    if (availableDetails.length) {

        container.appendChild(
            createElement(
                "h5",
                "chat-property-details-heading",
                "Property information"
            )
        );

        const list = document.createElement("div");

        list.className = "chat-property-details-list";

        availableDetails.forEach(([label, value]) => {

            const row = document.createElement("div");

            row.className = "chat-property-detail-row";

            row.append(
                createElement("span", "", label),
                createElement("strong", "", String(value))
            );

            list.appendChild(row);

        });

        container.appendChild(list);

    }

},


    /* =====================================================
       20. OPEN CONVERSATION FROM URL
       ===================================================== */

    async openConversationFromUrl() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const listingId =
            params.get("listing");

        const conversationId =
            params.get("conversation");

        if (conversationId) {

            const match =
                this.conversations.find(item => {

                    return String(item.id) ===
                        String(conversationId);

                });

            if (match) {
                await this.openConversation(match.id);
            }

            return;

        }

        if (!listingId) return;

        const match =
            this.conversations.find(item => {

                return String(item.listing_id) ===
                    String(listingId);

            });

        if (match) {

            await this.openConversation(match.id);

            return;

        }

        if (this.currentUserRole === "student") {

            await this.createConversationFromListing(
                listingId
            );

        }

    },


    /* =====================================================
       21. CREATE STUDENT CONVERSATION
       ===================================================== */

    async createConversationFromListing(listingId) {

        if (this.currentUserRole !== "student") return;

        const {
            data: listing,
            error: listingError
        } = await campusSupabase
            .from("listings")
            .select(
                "id,title,location,image_url,is_active,owner_id,category"
            )
            .eq("id", listingId)
            .eq("category", "Housing")
            .eq("is_active", true)
            .maybeSingle();

        if (listingError) throw listingError;

        if (!listing) {

            this.showError(
                "This housing listing is unavailable."
            );

            return;

        }

        if (
            String(listing.owner_id) ===
            String(this.currentUserId)
        ) {

            this.showError(
                "You cannot start a conversation with yourself."
            );

            return;

        }

        const {
            data: existing,
            error: findError
        } = await campusSupabase
            .from("conversations")
            .select("*")
            .eq("listing_id", listing.id)
            .eq("student_id", this.currentUserId)
            .maybeSingle();

        if (findError) throw findError;

        let conversation = existing;

        if (!conversation) {

            const {
                data,
                error
            } = await campusSupabase
                .from("conversations")
                .insert({

                    listing_id: listing.id,
                    student_id: this.currentUserId,
                    landlord_id: listing.owner_id

                })
                .select("*")
                .single();

            if (error) {

                if (error.code === "23505") {

                    const retry =
                        await campusSupabase
                            .from("conversations")
                            .select("*")
                            .eq("listing_id", listing.id)
                            .eq("student_id", this.currentUserId)
                            .single();

                    if (retry.error) throw retry.error;

                    conversation = retry.data;

                } else {

                    throw error;

                }

            } else {

                conversation = data;

            }

        }

        await this.loadInbox();

        const createdConversation =
            this.conversations.find(item => {

                return String(item.id) ===
                    String(conversation.id);

            });

        if (createdConversation) {

            await this.openConversation(
                createdConversation.id
            );

        }

    },


    /* =====================================================
       22. PRESENCE INTEGRATION
       ===================================================== */

    async startPresenceForConversation() {

        if (!window.CampusPresence) return;

        const participantId =
            this.activeParticipant?.id;

        if (!participantId) return;

        this.stopPresenceForConversation();

        this.presenceParticipantId =
            participantId;

        try {

            const presence =
                await CampusPresence.getUserPresence(
                    participantId
                );

            if (
                String(this.presenceParticipantId) !==
                String(participantId)
            ) {
                return;
            }

            const online =
                CampusPresence.isFresh(presence);

            this.updatePresenceUI(
                online,
                presence
            );

        } catch (error) {

            console.warn(
                "Could not load participant presence:",
                error
            );

            this.updatePresenceUI(false, null);

        }

        try {

            this.presenceSubscription =
                CampusPresence.subscribeToUser(
                    participantId,
                    update => {

                        if (
                            String(this.presenceParticipantId) !==
                            String(participantId)
                        ) {
                            return;
                        }

                        this.updatePresenceUI(
                            update.online,
                            update.presence
                        );

                    }
                );

        } catch (error) {

            console.warn(
                "Presence subscription error:",
                error
            );

        }

    },


    stopPresenceForConversation() {

        if (
            this.presenceParticipantId &&
            window.CampusPresence
        ) {

            CampusPresence.unsubscribeFromUser(
                this.presenceParticipantId
            );

        }

        this.presenceParticipantId = null;
        this.presenceSubscription = null;

        this.updatePresenceUI(false, null);

    },


    updatePresenceUI(online, presence) {

        const dot =
            this.elements.chatPresenceDot;

        const status =
            this.elements.chatPresenceStatus;

        if (dot) {

            dot.classList.toggle(
                "online",
                Boolean(online)
            );

        }

        if (status) {

            if (online) {

                status.textContent = "Online";

            } else if (
                presence?.last_seen &&
                window.CampusPresence
            ) {

                status.textContent =
                    CampusPresence.formatLastSeen(
                        presence.last_seen
                    );

            } else {

                status.textContent = "Offline";

            }

        }

    },


    /* =====================================================
       23. CONVERSATION PANEL NAVIGATION
       ===================================================== */

    showConversationPanel() {

        if (this.elements.chatWelcome) {
            this.elements.chatWelcome.hidden = true;
        }

        if (this.elements.chatActiveConversation) {
            this.elements.chatActiveConversation.hidden = false;
        }

        if (this.elements.chatApp) {
            this.elements.chatApp.classList.add(
                "conversation-open"
            );
        }

    },


    showInboxPanel() {

        this.stopPresenceForConversation();

        if (this.elements.chatApp) {
            this.elements.chatApp.classList.remove(
                "conversation-open"
            );
        }

        this.activeConversation = null;
        this.activeParticipant = null;
        this.activeListing = null;

        currentConversation = null;
        currentListing = null;

        if (this.elements.chatActiveConversation) {
            this.elements.chatActiveConversation.hidden = true;
        }

        if (this.elements.chatWelcome) {
            this.elements.chatWelcome.hidden = false;
        }

        this.renderInbox();

    },


    updateUrl(conversationId = null) {

        const url =
            new URL(window.location.href);

        url.searchParams.delete("listing");

        if (conversationId) {

            url.searchParams.set(
                "conversation",
                conversationId
            );

        } else {

            url.searchParams.delete("conversation");

        }

        window.history.replaceState(
            {},
            "",
            url
        );

    },


    /* =====================================================
       24. EVENT LISTENERS
       ===================================================== */

    setupEvents() {

        const list =
            this.elements.chatConversationList;

        if (list) {

            list.addEventListener(
                "click",
                event => {

                    const item =
                        event.target.closest(
                            "[data-conversation-id]"
                        );

                    if (!item) return;

                    this.openConversation(
                        item.dataset.conversationId
                    );

                }
            );

        }

        const search =
            this.elements.chatInboxSearch;

        if (search) {

            search.addEventListener(
                "input",
                () => {

                    this.searchTerm =
                        search.value.trim();

                    if (this.elements.clearChatSearch) {

                        this.elements.clearChatSearch.style.display =
                            this.searchTerm ? "flex" : "none";

                    }

                    this.applyInboxFilters();

                }
            );

        }

        if (this.elements.clearChatSearch) {

            this.elements.clearChatSearch.addEventListener(
                "click",
                () => {

                    if (search) search.value = "";

                    this.searchTerm = "";

                    this.elements.clearChatSearch.style.display =
                        "none";

                    this.applyInboxFilters();

                }
            );

        }

        document.querySelectorAll(
            "[data-inbox-filter]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    this.activeFilter =
                        button.dataset.inboxFilter;

                    document.querySelectorAll(
                        "[data-inbox-filter]"
                    ).forEach(filterButton => {

                        const active =
                            filterButton === button;

                        filterButton.classList.toggle(
                            "active",
                            active
                        );

                        filterButton.setAttribute(
                            "aria-pressed",
                            String(active)
                        );

                    });

                    this.applyInboxFilters();

                }
            );

        });

        if (this.elements.chatForm) {

            this.elements.chatForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    this.sendMessage();

                }
            );

        }

        if (this.elements.chatMessageInput) {

            this.elements.chatMessageInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" &&
                        !event.shiftKey
                    ) {

                        event.preventDefault();

                        this.sendMessage();

                    }

                }
            );

            this.elements.chatMessageInput.addEventListener(
                "input",
                () => {

                    const input =
                        this.elements.chatMessageInput;

                    input.style.height = "auto";

                    input.style.height =
                        `${Math.min(input.scrollHeight, 120)}px`;

                    this.updateCharacterCount();

                }
            );

        }

        if (this.elements.chatBackButton) {

            this.elements.chatBackButton.addEventListener(
                "click",
                () => {

                    this.showInboxPanel();

                    this.updateUrl();

                }
            );

        }

        if (this.elements.chatInboxBackButton) {

            this.elements.chatInboxBackButton.addEventListener(
                "click",
                () => {

                    window.history.back();

                }
            );

        }

        if (this.elements.chatOptionsButton) {

    this.elements.chatOptionsButton.addEventListener(
        "click",
        () => {

            const menu = this.elements.chatOptionsMenu;

            if (!menu) return;

            menu.hidden = !menu.hidden;

            this.elements.chatOptionsButton.setAttribute(
                "aria-expanded",
                String(!menu.hidden)
            );

        }
    );

}

        document.addEventListener(
            "click",
            event => {

                const menu =
                    this.elements.chatOptionsMenu;

                const button =
                    this.elements.chatOptionsButton;

                if (
                    menu &&
                    button &&
                    !menu.contains(event.target) &&
                    !button.contains(event.target)
                ) {

                    menu.hidden = true;

                }

            }
        );

        // ======================================
// PROPERTY DETAILS MENU ACTIONS
// ======================================

if (this.elements.chatOptionsMenu) {

    this.elements.chatOptionsMenu.addEventListener(
        "click",
        event => {

            const button = event.target.closest(
                "[data-chat-action]"
            );

            if (!button) return;

            const action = button.dataset.chatAction;

            this.elements.chatOptionsMenu.hidden = true;

            if (this.elements.chatOptionsButton) {
                this.elements.chatOptionsButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

            if (action === "view-property") {
                this.openPropertyDetails();
            }

            if (action === "close-menu") {
                this.elements.chatOptionsMenu.hidden = true;
            }

        }
    );

}

// View button on the property context card
if (this.elements.chatViewListing) {

    this.elements.chatViewListing.addEventListener(
        "click",
        () => this.openPropertyDetails()
    );

}

// Close housing details panel
if (this.elements.chatPropertyDetailsClose) {

    this.elements.chatPropertyDetailsClose.addEventListener(
        "click",
        () => this.closePropertyDetails()
    );

}

        if (this.elements.chatErrorBack) {

            this.elements.chatErrorBack.addEventListener(
                "click",
                () => {

                    window.location.href = "index.html";

                }
            );

        }

        window.addEventListener(
            "beforeunload",
            () => {

                this.stopPresenceForConversation();

                this.realtimeChannels.forEach(channel => {

                    campusSupabase.removeChannel(channel);

                });

                this.realtimeChannels.clear();

            }
        );

    },


    /* =====================================================
       25. CHARACTER COUNTER
       ===================================================== */

    updateCharacterCount() {

        const input =
            this.elements.chatMessageInput;

        const counter =
            this.elements.chatCharacterCount;

        if (!input || !counter) return;

        counter.textContent =
            `${input.value.length}`;

    },


    /* =====================================================
       26. UI HELPERS
       ===================================================== */

    showMessageNotice(message) {

        const container =
            this.elements.chatMessages;

        if (!container) return;

        container.innerHTML = "";

        const notice =
            document.createElement("div");

        notice.className =
            "chat-message-notice";

        notice.textContent = message;

        notice.style.cssText = `
            margin: auto;
            max-width: 320px;
            padding: 18px;
            color: #718096;
            font-size: 13px;
            line-height: 1.7;
            text-align: center;
        `;

        container.appendChild(notice);

    },


    showInboxEmpty() {

        if (this.elements.chatInboxEmpty) {
            this.elements.chatInboxEmpty.hidden = false;
        }

        if (this.elements.chatInboxNoResults) {
            this.elements.chatInboxNoResults.hidden = true;
        }

    },


    hideInboxLoading() {

        if (this.elements.chatInboxLoading) {
            this.elements.chatInboxLoading.hidden = true;
        }

    },


    hideLoading() {

        if (this.elements.chatLoading) {
            this.elements.chatLoading.hidden = true;
        }

    },


    showError(message) {

        console.error(
            "CampusNest chat:",
            message
        );

        this.hideLoading();

        if (this.elements.chatErrorMessage) {
            this.elements.chatErrorMessage.textContent =
                message;
        }

        if (this.elements.chatError) {
            this.elements.chatError.hidden = false;
        }

    },


    updateInboxCount() {

        if (!this.elements.chatInboxCount) return;

        const unreadTotal =
            this.conversations.reduce(
                (total, conversation) => {

                    return total +
                        (conversation.unreadCount || 0);

                },
                0
            );

        this.elements.chatInboxCount.textContent =
            unreadTotal > 99 ? "99+" : unreadTotal;

    },


    scrollToBottom() {

        const container =
            this.elements.chatMessages;

        if (!container) return;

        container.scrollTop =
            container.scrollHeight;

    },


    /* =====================================================
       27. FORMATTING HELPERS
       ===================================================== */

    getParticipantName(profile) {

        if (!profile) {
            return "CampusNest user";
        }

        const fullName = [
            profile.first_name,
            profile.last_name
        ].filter(Boolean).join(" ").trim();

        return fullName ||
            profile.email ||
            "CampusNest user";

    },


    getInitials(name) {

        return String(name || "CN")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(part => part.charAt(0).toUpperCase())
            .join("");

    },


    formatTime(timestamp) {

        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) return "";

        return date.toLocaleTimeString(
            [],
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    },


    formatRelativeTime(timestamp) {

        if (!timestamp) return "";

        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) return "";

        const difference =
            new Date().getTime() - date.getTime();

        const minutes =
            Math.floor(difference / 60000);

        if (minutes < 1) return "Now";

        if (minutes < 60) {
            return `${minutes}m`;
        }

        const hours =
            Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours}h`;
        }

        const days =
            Math.floor(hours / 24);

        if (days < 7) {
            return `${days}d`;
        }

        return date.toLocaleDateString(
            [],
            {
                month: "short",
                day: "numeric"
            }
        );

    }

};


/* =========================================================
   28. START CAMPUSNEST CHAT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        CampusChat.init();

    }
);


console.log(
    "CampusNest chat.js loaded — Phase 7.8.5.3."
);
