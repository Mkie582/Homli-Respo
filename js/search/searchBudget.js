const SearchBudget = {

    min: 300,

    max: 1500,

    render(){

    return `

        <div class="budget-container">

            <div class="budget-values">

                <div class="budget-box">

                    <small>Minimum</small>

                    <strong id="minBudget">

                        $300

                    </strong>

                </div>

                <div class="budget-box">

                    <small>Maximum</small>

                    <strong id="maxBudget">

                        $1500

                    </strong>

                </div>

            </div>

            <div class="budget-slider">

                <div class="budget-track">

                    <div
                        class="budget-range"
                        id="budgetRange"
                    ></div>

                    <div
                        class="budget-thumb left"
                        id="leftThumb"
                    ></div>

                    <div
                        class="budget-thumb right"
                        id="rightThumb"
                    ></div>

                </div>

            </div>

        </div>

    `;

},

bindEvents(){

    const leftThumb =

        document.getElementById("leftThumb");

    const rightThumb =

        document.getElementById("rightThumb");

    const range =

        document.getElementById("budgetRange");

    const track =

    document.querySelector(".budget-track");

let dragging = false;

leftThumb.addEventListener("mousedown", () => {

    dragging = true;

});

document.addEventListener("mouseup", () => {

    dragging = false;

});

document.addEventListener("mousemove", (e) => {

    if(!dragging){

        return;

    }

    const rect = track.getBoundingClientRect();

    let x = e.clientX - rect.left;

    const rightPosition =

    parseFloat(rightThumb.style.left) ||

    rect.width;

if(x < 0){

    x = 0;

}

if(x > rightPosition - 20){

    x = rightPosition - 20;

}

    if(x < 0){

        x = 0;

    }

    if(x > rect.width){

        x = rect.width;

    }

    leftThumb.style.left = x + "px";

this.updateRange();

this.updatePrices();

});

let draggingRight = false;

rightThumb.addEventListener("mousedown", () => {

    draggingRight = true;

});

document.addEventListener("mouseup", () => {

    draggingRight = false;

});

document.addEventListener("mousemove", (e) => {

    if(!draggingRight){

        return;

    }

    const rect = track.getBoundingClientRect();

    let x = e.clientX - rect.left;

    const leftPosition =

    parseFloat(leftThumb.style.left) ||

    0;

if(x < leftPosition + 20){

    x = leftPosition + 20;

}

if(x > rect.width){

    x = rect.width;

}

    if(x < 0){

        x = 0;

    }

    if(x > rect.width){

        x = rect.width;

    }

    rightThumb.style.left = x + "px";

this.updateRange();

this.updatePrices();

});

},

updateRange(){

    const leftThumb =

        document.getElementById("leftThumb");

    const rightThumb =

        document.getElementById("rightThumb");

    const range =

        document.getElementById("budgetRange");

    const left =

        parseFloat(leftThumb.style.left) || 0;

    const right =

        parseFloat(rightThumb.style.left) ||

        leftThumb.parentElement.offsetWidth;

    range.style.left =

        left + "px";

    range.style.width =

        (right - left) + "px";

},

updatePrices(){

    const track =

        document.querySelector(".budget-track");

    const leftThumb =

        document.getElementById("leftThumb");

    const rightThumb =

        document.getElementById("rightThumb");

    const minPrice =

        document.getElementById("minBudget");

    const maxPrice =

        document.getElementById("maxBudget");

    const left =

        parseFloat(leftThumb.style.left) || 0;

    const right =

        parseFloat(rightThumb.style.left) ||

        track.offsetWidth;

    const min = 300;

    const max = 1500;

    const leftValue = Math.round(

        min +

        (left / track.offsetWidth) *

        (max - min)

    );

    const rightValue = Math.round(

        min +

        (right / track.offsetWidth) *

        (max - min)

    );

    minPrice.textContent =

        "$" + leftValue;

    maxPrice.textContent =

        "$" + rightValue;

        SearchFilters.set(

    "budget",

    {

        min:leftValue,

        max:rightValue

    }

);

},

};