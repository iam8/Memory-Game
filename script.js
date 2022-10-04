// Ioana A Mititean
// 9/24/22
// Unit 4.5: Memory Game

console.log("4.5: Memory Game");

const COLORS = [
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "cyan",
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "cyan"
];

const gameContainer = document.querySelector("#game");
const currScoreHeading = document.querySelector("#curr_score");
const bestScoreHeading = document.querySelector("#best_score");
let clickedCards = [];  // Array to hold the elements of a pair of clicked cards
let currScore = 0;  // Increments by 1 with each guess
let cardsRemaining = COLORS.length;  // Cards left on the board (not matched yet)

// Retrieve the player's all time best score from local storage
let bestScore = parseInt(localStorage.getItem("bestScore")) || "";

// A helper function to shuffle an array. Returns the same array with values shuffled.
// Based on an algorithm called Fisher Yates.
function shuffle(array)
{
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0)
    {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

// This function loops over the array of colors.
// It creates a new div and gives it a class with the value of the current color.
// The new div is then appended to the game container.
function createDivsForColors(colorArray)
{
    for (let color of colorArray)
    {
        // Create a new div
        const newDiv = document.createElement("div");

        // Add some text to the div
        const cardText = document.createElement("span");
        cardText.innerText = "Click to flip over";
        newDiv.append(cardText);

        // Give it a class attribute for the value we are looping over
        newDiv.classList.add(color);

        // Give it an attribute to denote whether card has just been clicked or not
        newDiv.setAttribute("isclicked", "false");

        // Append the div to the element with an id of 'game'
        gameContainer.append(newDiv);
    }
}

// Handles click events on the 'cards' on the page.
function handleCardClick(event)
{
    eTarget = event.target;

    // Exit handler if the game container itself was clicked or a pair of cards is already selected
    if (eTarget.id === "game" || clickedCards.length === 2)
    {
        return;
    }

    // If the card text is clicked on instead of the containing div, set the target to be that div
    if (eTarget.tagName === "SPAN")
    {
        eTarget = eTarget.parentElement;
    }

    // If the clicked card has already been clicked, exit click handler
    if (eTarget.getAttribute("isclicked") === "true")
    {
        return;
    }

    // Change 'isclicked' attribute to reflect that the card is now selected
    eTarget.setAttribute("isclicked", "true");

    // Change card label to reflect selection
    eTarget.firstElementChild.innerText = "Selected";

    // Change the background color of the clicked card to be its class color
    eTarget.style.backgroundColor = eTarget.className;

    // Add the clicked card to the clicked pair array
    clickedCards.push(eTarget);

    // If this clicked card is the second of a pair
    if (clickedCards.length === 2)
    {
        // Increment the score (number of guesses) by 1
        currScore++;

        // Display the new current score on the page
        currScoreHeading.innerText = `Current score: ${currScore}`;

        // If the card pair matches
        if (clickedCards[0].className === clickedCards[1].className)
        {
            // Card label should reflect that the card has been matched
            clickedCards[0].firstElementChild.innerText = "MATCHED!";
            clickedCards[1].firstElementChild.innerText = "MATCHED!";

            clickedCards = [];  // Empty the array of clicked cards immediately
            cardsRemaining -= 2;

            // If all pairs have been matched
            if (cardsRemaining === 0)
            {
                // Display a game-end message
                const gameEndDiv = document.createElement("div");
                gameEndDiv.innerText = "You've matched all the pairs!";
                gameEndDiv.style.fontSize = "30px";
                gameEndDiv.style.marginTop = "10px";
                document.body.append(gameEndDiv);

                // Save the current score to localStorage if it is the player's first score or
                // all-time best score
                if (!bestScore || currScore < bestScore)
                {
                    bestScore = currScore;
                    bestScoreHeading.innerText = `Best score: ${bestScore}`;
                    localStorage.setItem("bestScore", bestScore);
                }
            }
        }

        // If the colors of the card pair don't match
        else
        {
            function resetNonMatchingCards()
            {
                // Reset card labels
                clickedCards[0].firstElementChild.innerText = "Click to flip over";
                clickedCards[1].firstElementChild.innerText = "Click to flip over";

                // Reset card colors
                clickedCards[0].style.removeProperty("background-color");
                clickedCards[1].style.removeProperty("background-color");

                // Change the cards' isclicked attribute back to reflect de-selection
                clickedCards[0].setAttribute("isclicked", "false");
                clickedCards[1].setAttribute("isclicked", "false");

                // Empty the array of clicked cards
                clickedCards = [];
            }

            // The unmatched cards will be reset after 1 second
            setTimeout(resetNonMatchingCards, 1000);
        }
    }
}

// Main --------------------------------------------------------------------------------------------

// Shuffle given colors
let shuffledColors = shuffle(COLORS);

// Display the player's best score on the screen
bestScoreHeading.innerText = `Best score: ${bestScore}`;

// When the DOM loads, create divs for the color cards
createDivsForColors(shuffledColors);

// Add event listener for entire game container (event delegation)
gameContainer.addEventListener("click", handleCardClick);

