const SearchCalendar = {

    // ======================================
    // CURRENT MONTH BEING DISPLAYED
    // ======================================

    currentDate: new Date(),

    // ======================================
    // USER'S SELECTED DATE
    // ======================================

    selectedDate: null,

    // ======================================
    // MONTH NAMES
    // ======================================

    months: [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ],


    // ======================================
    // FORMAT DATE AS YYYY-MM-DD
    // ======================================

    formatDate(date){

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    },


    // ======================================
    // GET TODAY AT MIDNIGHT
    // ======================================

    getToday(){

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        return today;

    },


    // ======================================
    // CHECK CURRENT MONTH
    // ======================================

    isCurrentMonth(){

        const today =
            this.getToday();

        return (

            this.currentDate.getFullYear()
                === today.getFullYear()

            &&

            this.currentDate.getMonth()
                === today.getMonth()

        );

    },


    // ======================================
    // RENDER CALENDAR
    // ======================================

    render(){

        return `

            <div class="calendar-container">


                <!-- ==========================
                     HEADER
                =========================== -->

                <div class="calendar-header">


                    <!-- PREVIOUS MONTH -->

                    <button
                        id="prevMonth"
                        type="button"
                        ${this.isCurrentMonth()
                            ? "disabled"
                            : ""}
                    >

                        <i
                            class="fa-solid fa-chevron-left"
                        ></i>

                    </button>


                    <!-- MONTH / YEAR -->

                    <h3 class="calendar-title">

                        ${this.months[
                            this.currentDate.getMonth()
                        ]}

                        ${this.currentDate.getFullYear()}

                    </h3>


                    <!-- NEXT MONTH -->

                    <button
                        id="nextMonth"
                        type="button"
                    >

                        <i
                            class="fa-solid fa-chevron-right"
                        ></i>

                    </button>


                </div>


                <!-- ==========================
                     WEEKDAYS
                =========================== -->

                <div class="calendar-weekdays">

                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>

                </div>


                <!-- ==========================
                     DAYS
                =========================== -->

                <div
                    class="calendar-days"
                    id="calendarDays"
                >

                    ${this.generateDays()}

                </div>


            </div>

        `;

    },


    // ======================================
    // GENERATE DAYS
    // ======================================

    generateDays(){

        const year =
            this.currentDate.getFullYear();

        const month =
            this.currentDate.getMonth();


        // First weekday of month

        const firstDay =
            new Date(
                year,
                month,
                1
            ).getDay();


        // Number of days

        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        let html = "";


        // ======================================
        // TODAY
        // ======================================

        const today =
            this.getToday();


        // ======================================
        // EMPTY DAYS
        // ======================================

        for(
            let i = 0;
            i < firstDay;
            i++
        ){

            html += `

                <div
                    class="calendar-day empty"
                ></div>

            `;

        }


        // ======================================
        // ACTUAL DAYS
        // ======================================

        for(
            let day = 1;
            day <= daysInMonth;
            day++
        ){

            const date = new Date(

                year,
                month,
                day

            );


            date.setHours(
                0,
                0,
                0,
                0
            );


            // ==================================
            // PAST DATE
            // ==================================

            const isPast =
                date < today;


            // ==================================
            // TODAY
            // ==================================

            const isToday =
                date.getTime()
                ===
                today.getTime();


            // ==================================
            // SELECTED DATE
            // ==================================

            const isSelected =

                this.selectedDate &&

                this.selectedDate
                    .getFullYear()
                    === year

                &&

                this.selectedDate
                    .getMonth()
                    === month

                &&

                this.selectedDate
                    .getDate()
                    === day;


            // ==================================
            // CREATE DAY
            // ==================================

            html += `

                <div

                    class="calendar-day
                        ${isPast ? "disabled" : ""}
                        ${isToday ? "today" : ""}
                        ${isSelected ? "selected" : ""}
                    "

                    data-day="${day}"

                    data-date="${this.formatDate(date)}"

                >

                    ${day}

                </div>

            `;

        }


        return html;

    },


    // ======================================
    // BIND EVENTS
    // ======================================

    bindEvents(){


        // ======================================
        // DATE SELECTION
        // ======================================

        document

            .querySelectorAll(

                ".calendar-day" +
                ":not(.empty)" +
                ":not(.disabled)"

            )

            .forEach(day => {


                day.addEventListener(

                    "click",

                    () => {


                        const selectedDay =
                            Number(
                                day.dataset.day
                            );


                        // ==========================
                        // CREATE SELECTED DATE
                        // ==========================

                        this.selectedDate =
                            new Date(

                                this.currentDate
                                    .getFullYear(),

                                this.currentDate
                                    .getMonth(),

                                selectedDay

                            );


                        this.selectedDate
                            .setHours(
                                0,
                                0,
                                0,
                                0
                            );


                        // ==========================
                        // FORMAT DATE
                        // ==========================

                        const formatted =
                            this.formatDate(
                                this.selectedDate
                            );


                        // ==========================
                        // SAVE TO FILTER
                        // ==========================

                        SearchFilters.set(

                            "moveIn",

                            formatted

                        );


                        // ==========================
                        // CLOSE POPUP
                        // ==========================

                        SearchPopup.close();

                    }

                );

            });


        // ======================================
        // PREVIOUS MONTH
        // ======================================

        document

            .getElementById("prevMonth")

            ?.addEventListener(

                "click",

                (e) => {

                    e.stopPropagation();

                    this.previousMonth();

                }

            );


        // ======================================
        // NEXT MONTH
        // ======================================

        document

            .getElementById("nextMonth")

            ?.addEventListener(

                "click",

                (e) => {

                    e.stopPropagation();

                    this.nextMonth();

                }

            );

    },


    // ======================================
    // PREVIOUS MONTH
    // ======================================

    previousMonth(){

        // Never go before current month

        if(this.isCurrentMonth()){

            return;

        }


        this.currentDate = new Date(

            this.currentDate.getFullYear(),

            this.currentDate.getMonth() - 1,

            1

        );


        SearchPopup.refreshCalendar();

    },


    // ======================================
    // NEXT MONTH
    // ======================================

    nextMonth(){

        this.currentDate = new Date(

            this.currentDate.getFullYear(),

            this.currentDate.getMonth() + 1,

            1

        );


        SearchPopup.refreshCalendar();

    }

};