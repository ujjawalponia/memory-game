// Global Variables
const cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-leaf", "fa-bicycle"];
const originalBodyHTML = document.body.innerHTML;
let moves, stars, minutesLabel, secondsLabel, cardBox;
let openCards, movesCount, matchedCards, gameStart, timer, totalSeconds;
// Success Message
const successAnimation = `
    <div class="check_mark">
        <div class="sa-icon sa-success animate">
            <span class="sa-line sa-tip animateSuccessTip"></span>
            <span class="sa-line sa-long animateSuccessLong"></span>
            <div class="sa-placeholder"></div>
            <div class="sa-fix"></div>
        </div>
    </div>
    `;

// Start The Game
start();
// Restart the Game
document.body.addEventListener("click", reset, false);

function start(){
    getElements();
    initiateData();
    // Shuffle The Cards
    const cardList = shuffle(cards.concat(cards));
    const fragmentList = document.createDocumentFragment();
    for (const card of cardList){
        const li = document.createElement("li");
        li.className = "card";
        const i = document.createElement("i");
        i.className = "fa " + card;
        li.appendChild(i);
        fragmentList.appendChild(li);
    }
    cardBox.appendChild(fragmentList);
    // Add event listener to the card main-box
    cardBox.addEventListener("click", displayCard, false);
}

function getElements(){
    moves = document.querySelector(".moves");
    stars = document.querySelectorAll(".fa.fa-star");
    minutesLabel = document.getElementById("minutes");
    secondsLabel = document.getElementById("seconds");
    cardBox = document.querySelector(".cardBox");
}

function initiateData(){
    openCards = [];
    movesCount = 0;
    matchedCards = 0;
    gameStart = false;
    timer = null;
    // Second counter
    totalSeconds = 0;
}
    
// Shuffle function
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function displayCard(event){
    const currNode = event.target;
    // Check clicked element
    if(currNode.nodeName === "LI"){
        if(!gameStart){
            gameStart = true;
            timer = setInterval(setTime, 1000);
        }
        if(!currNode.className.includes("match")){
            checkCard(currNode);
        }
    }
}

function checkCard(node){
    if(openCards.length < 2){
        node.className += " open show flip";
        openCards.push(node);
        if(openCards.length > 1){
            const firstCard = openCards[0];
            // Same card should not be clicked more then one time
            if(firstCard !== node && (firstCard.querySelector("i").className === node.querySelector("i").className)){
                setTimeout(matchCards, 500);
                incrementMoveCounter();
            } else {
                // Shaking animation with red background
                setTimeout(addWrongAnimation, 500);
                setTimeout(hideCards, 1500);
                if(firstCard !== node){
                    incrementMoveCounter();
                }
            }
        }
    }
}

function matchCards(){
    openCards.forEach((card) => {card.className = "card match"});
    openCards = [];
    // Record game progress
    matchedCards += 1;
    if(matchedCards === cards.length){
        // Stop timer
        clearInterval(timer);
        setTimeout(statistics, 1000);
    }
}

function addWrongAnimation(){
    openCards.forEach((card) => {card.className += " wrong"});
}

function hideCards(){
    openCards.forEach((card) => {card.className = "card"});
    openCards = [];
}

// Update Move Counter.
function incrementMoveCounter(){
    movesCount += 1;
    moves.textContent = movesCount;
    if(12 < movesCount && movesCount <= 16){
        stars[stars.length - 1].className = "fa fa-star-o";
    } else if (movesCount > 16){
        stars[stars.length - 2].className = "fa fa-star-o";
    }
}

// Timer Function 
function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    const valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

// Show Progress After Game Is Finished
function statistics(){
    document.body.style.background = "#2e3d49";
    document.body.style.color = "#ffffff";
    document.body.innerHTML = `
    <div class="main-box center">
        ${successAnimation}
        <h1>Congratulations! You Won!</h1> 
        <p>You have completed the game with ${movesCount} moves and ${document.querySelectorAll(".fa.fa-star").length} stars.</p>
        <p>&amp; you took only ${minutesLabel.textContent} minute ${secondsLabel.textContent} seconds to complete the game.</p>
        <p>Awesome !!</p>
        <button class="btn reset" type="submit">Play again</button>
    </div>`;
}

// Restart The Game
function reset(event){
    let currClasses = event.target.className;
    if (currClasses.includes("reset")){
        document.body.innerHTML = originalBodyHTML;
        document.body.style.background = "#ffffff";
        document.body.style.color = "#000";
        clearInterval(timer);
        initiateData();
        start();
    }
}
