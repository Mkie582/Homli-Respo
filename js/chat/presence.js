
/* =========================================================
   CAMPUSNEST — USER PRESENCE SERVICE
   Phase 7.8.5.2

   Responsibilities:
   - Online / Offline status
   - Last seen
   - Presence heartbeat
   - Supabase Realtime subscriptions
   - Presence freshness checks
   - Subscription cleanup

   IMPORTANT:
   This file does not automatically initialize itself.
   CampusChat will control its lifecycle.
   ========================================================= */


const CampusPresence = {

    // ==========================================
    // CONFIGURATION
    // ==========================================

    heartbeatInterval: 30000,

    freshnessLimit: 90000,

    currentUserId: null,

    heartbeatTimer: null,

    subscriptions: new Map(),

    initialized: false,

    visibilityHandler: null,

    pageHideHandler: null,


    // ==========================================
    // INITIALIZE PRESENCE SERVICE
    // ==========================================

    async init(userId = null) {

        try {

            console.log(
                "Initializing CampusNest Presence Service..."
            );


            // ----------------------------------
            // Prevent duplicate initialization
            // ----------------------------------

            if (this.initialized) {

                console.log(
                    "Presence service is already initialized."
                );

                return this.currentUserId;
            }


            // ----------------------------------
            // Get authenticated user if needed
            // ----------------------------------

            if (!userId) {

                const {
                    data,
                    error
                } =
                    await campusSupabase.auth.getUser();


                if (error) {

                    throw error;

                }


                userId =
                    data.user?.id || null;

            }


            if (!userId) {

                console.warn(
                    "Presence initialization stopped: no authenticated user."
                );

                return null;

            }


            this.currentUserId =
                userId;


            // ----------------------------------
            // Mark user online
            // ----------------------------------

            const online =
                await this.setOnline();


            if (!online) {

                console.warn(
                    "Presence could not be marked online."
                );

                this.currentUserId = null;

                return null;

            }


            // ----------------------------------
            // Start heartbeat
            // ----------------------------------

            this.startHeartbeat();


            // ----------------------------------
            // Register browser lifecycle events
            // ----------------------------------

            this.registerLifecycleEvents();


            this.initialized = true;


            console.log(
                "CampusNest Presence Service initialized."
            );


            return this.currentUserId;


        } catch (error) {

            console.error(
                "Presence initialization failed:",
                error
            );


            return null;

        }

    },


    // ==========================================
    // SET CURRENT USER ONLINE
    // ==========================================

    async setOnline() {

        if (!this.currentUserId) {

            console.warn(
                "Cannot set presence online: missing user ID."
            );

            return false;

        }


        const now =
            new Date().toISOString();


        try {

            const {
                error
            } =
                await campusSupabase
                    .from("user_presence")
                    .upsert(
                        {
                            user_id:
                                this.currentUserId,

                            is_online:
                                true,

                            last_seen:
                                now,

                            updated_at:
                                now
                        },
                        {
                            onConflict:
                                "user_id"
                        }
                    );


            if (error) {

                throw error;

            }


            console.log(
                "CampusNest user marked ONLINE."
            );


            return true;


        } catch (error) {

            console.error(
                "Could not update online presence:",
                error
            );


            return false;

        }

    },


    // ==========================================
    // SET CURRENT USER OFFLINE
    // ==========================================

    async setOffline() {

        if (!this.currentUserId) {

            return false;

        }


        const now =
            new Date().toISOString();


        try {

            const {
                error
            } =
                await campusSupabase
                    .from("user_presence")
                    .update(
                        {
                            is_online:
                                false,

                            last_seen:
                                now,

                            updated_at:
                                now
                        }
                    )
                    .eq(
                        "user_id",
                        this.currentUserId
                    );


            if (error) {

                throw error;

            }


            console.log(
                "CampusNest user marked OFFLINE."
            );


            return true;


        } catch (error) {

            console.error(
                "Could not update offline presence:",
                error
            );


            return false;

        }

    },


    // ==========================================
    // START HEARTBEAT
    // ==========================================

    startHeartbeat() {

        // Prevent duplicate timers

        this.stopHeartbeat();


        console.log(
            "Starting presence heartbeat..."
        );


        this.heartbeatTimer =
            setInterval(
                async () => {

                    if (
                        document.visibilityState === "visible"
                    ) {

                        await this.setOnline();

                    }

                },
                this.heartbeatInterval
            );

    },


    // ==========================================
    // STOP HEARTBEAT
    // ==========================================

    stopHeartbeat() {

        if (this.heartbeatTimer) {

            clearInterval(
                this.heartbeatTimer
            );

            this.heartbeatTimer = null;

        }

    },


    // ==========================================
    // BROWSER LIFECYCLE EVENTS
    // ==========================================

    registerLifecycleEvents() {

        this.removeLifecycleEvents();


        // ----------------------------------
        // Tab becomes visible again
        // ----------------------------------

        this.visibilityHandler =
            async () => {

                if (
                    document.visibilityState === "visible"
                ) {

                    console.log(
                        "CampusNest tab is active again."
                    );


                    await this.setOnline();

                }

            };


        document.addEventListener(
            "visibilitychange",
            this.visibilityHandler
        );


        // ----------------------------------
        // Page is leaving
        // ----------------------------------

        this.pageHideHandler =
            () => {

                // Best-effort update.
                // Browsers may stop asynchronous requests
                // during page navigation or closing.

                this.stopHeartbeat();

                this.setOffline();

            };


        window.addEventListener(
            "pagehide",
            this.pageHideHandler
        );

    },


    // ==========================================
    // REMOVE LIFECYCLE EVENTS
    // ==========================================

    removeLifecycleEvents() {

        if (this.visibilityHandler) {

            document.removeEventListener(
                "visibilitychange",
                this.visibilityHandler
            );

            this.visibilityHandler = null;

        }


        if (this.pageHideHandler) {

            window.removeEventListener(
                "pagehide",
                this.pageHideHandler
            );

            this.pageHideHandler = null;

        }

    },


    // ==========================================
    // GET A USER'S PRESENCE
    // ==========================================

    async getUserPresence(userId) {

        if (!userId) {

            return null;

        }


        try {

            const {
                data,
                error
            } =
                await campusSupabase
                    .from("user_presence")
                    .select(
                        "user_id,is_online,last_seen,updated_at"
                    )
                    .eq(
                        "user_id",
                        userId
                    )
                    .maybeSingle();


            if (error) {

                throw error;

            }


            if (!data) {

                return null;

            }


            return {

                ...data,

                online: this.isFresh(data)

            };


        } catch (error) {

            console.error(
                "Could not load user presence:",
                error
            );


            return null;

        }

    },


    // ==========================================
    // CHECK WHETHER PRESENCE IS FRESH
    // ==========================================

    isFresh(presence) {

        if (!presence) {

            return false;

        }


        if (!presence.is_online) {

            return false;

        }


        if (!presence.last_seen) {

            return false;

        }


        const lastSeen =
            new Date(
                presence.last_seen
            ).getTime();


        if (!Number.isFinite(lastSeen)) {

            return false;

        }


        const age =
            Date.now() - lastSeen;


        return (
            age >= 0 &&
            age < this.freshnessLimit
        );

    },


    // ==========================================
    // SUBSCRIBE TO ONE USER'S PRESENCE
    // ==========================================

    subscribeToUser(
        userId,
        callback
    ) {

        if (!userId || typeof callback !== "function") {

            console.error(
                "Presence subscription requires a user ID and callback."
            );

            return null;

        }


        // ----------------------------------
        // Avoid duplicate subscriptions
        // ----------------------------------

        if (this.subscriptions.has(userId)) {

            console.log(
                "Presence subscription already exists:",
                userId
            );

            return this.subscriptions.get(userId);

        }


        console.log(
            "Subscribing to user presence:",
            userId
        );


        const channel =
            campusSupabase
                .channel(
                    `campus-presence-${userId}`
                )
                .on(
                    "postgres_changes",
                    {
                        event: "*",

                        schema: "public",

                        table: "user_presence",

                        filter:
                            `user_id=eq.${userId}`

                    },
                    (payload) => {

                        console.log(
                            "User presence changed:",
                            payload
                        );


                        const presence =
                            payload.eventType === "DELETE"
                                ? null
                                : payload.new;


                        callback({

                            userId,

                            presence,

                            online:
                                this.isFresh(presence),

                            event:
                                payload.eventType

                        });

                    }
                )
                .subscribe(
                    (status) => {

                        console.log(
                            `Presence subscription (${userId}):`,
                            status
                        );

                    }
                );


        this.subscriptions.set(
            userId,
            channel
        );


        return channel;

    },


    // ==========================================
    // UNSUBSCRIBE FROM ONE USER
    // ==========================================

    async unsubscribeFromUser(userId) {

        if (!userId) {

            return;

        }


        const channel =
            this.subscriptions.get(userId);


        if (!channel) {

            return;

        }


        try {

            await campusSupabase.removeChannel(
                channel
            );


            this.subscriptions.delete(
                userId
            );


            console.log(
                "Presence subscription removed:",
                userId
            );


        } catch (error) {

            console.error(
                "Could not remove presence subscription:",
                error
            );

        }

    },


    // ==========================================
    // UNSUBSCRIBE FROM ALL USERS
    // ==========================================

    async unsubscribeAll() {

        const channels =
            Array.from(
                this.subscriptions.values()
            );


        this.subscriptions.clear();


        await Promise.all(
            channels.map(
                async (channel) => {

                    try {

                        await campusSupabase.removeChannel(
                            channel
                        );

                    } catch (error) {

                        console.error(
                            "Presence channel cleanup failed:",
                            error
                        );

                    }

                }
            )
        );


        console.log(
            "All presence subscriptions removed."
        );

    },


    // ==========================================
    // FORMAT LAST SEEN
    // ==========================================

    formatLastSeen(lastSeen) {

        if (!lastSeen) {

            return "Offline";

        }


        const date =
            new Date(lastSeen);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Offline";

        }


        const difference =
            Date.now() - date.getTime();


        if (difference < 0) {

            return "Offline";

        }


        const seconds =
            Math.floor(
                difference / 1000
            );


        if (seconds < 60) {

            return "Last seen just now";

        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        if (minutes < 60) {

            return `Last seen ${minutes} min ago`;

        }


        const hours =
            Math.floor(
                minutes / 60
            );


        if (hours < 24) {

            return `Last seen ${hours} hr ago`;

        }


        const days =
            Math.floor(
                hours / 24
            );


        if (days === 1) {

            return "Last seen yesterday";

        }


        if (days < 7) {

            return `Last seen ${days} days ago`;

        }


        return `Last seen ${date.toLocaleDateString(
            [],
            {
                month: "short",
                day: "numeric"
            }
        )}`;

    },


    // ==========================================
    // CLEAN UP PRESENCE SERVICE
    // ==========================================

    async destroy(
        options = {}
    ) {

        const {
            markOffline = false
        } = options;


        console.log(
            "Cleaning up CampusNest Presence Service..."
        );


        this.stopHeartbeat();


        this.removeLifecycleEvents();


        await this.unsubscribeAll();


        if (markOffline) {

            await this.setOffline();

        }


        this.initialized = false;

        this.currentUserId = null;


        console.log(
            "CampusNest Presence Service cleaned up."
        );

    }

};


// ==========================================
// EXPOSE SERVICE GLOBALLY
// ==========================================

window.CampusPresence =
    CampusPresence;


console.log(
    "CampusNest presence.js loaded — Presence Service ready."
);
