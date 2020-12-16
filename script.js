const gameContainer = document.getElementById("game");
const startButton = document.getElementById("newGame");
const scores = document.getElementById("scores");
const currentScoreDisplay = document.getElementById("currentScore");
const pairsInput = document.getElementById("pairs");

//Initialize currentScore as 0
let currentScore = 0;

//Create function to create array of pairs of random colors
function randomColors (pairs) {
  let colors = [];
  for (let i = 0; i < pairs; i++) {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    //Push twice to create a pair!
    colors.push(`rgb(${r},${g},${b})`);
    colors.push(`rgb(${r},${g},${b})`);
  }
  return colors;
}

//Writing a reusable function that adds the best score display, since we do that in two parts of the code
function showBestScore(score) {
  const bestScoreDisplay = document.createElement('span');
  bestScoreDisplay.id = "bestScore"
  bestScoreDisplay.innerText = `Best Score: ${score}`;
  scores.append(bestScoreDisplay);
}

//If there is a bestScore, put it on the page to start, if not we'll add it later
let bestScore = JSON.parse(localStorage.getItem('bestScore'));
if (bestScore) {
  showBestScore(bestScore);
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
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

// let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

//This var will be used to capture the first pick in a two-pick sequence for comparison. It will be cleared whenever two cards have been picked consecutively.
let firstPick;

function handleCardClick(event) {
  console.log("you just clicked", event.target);

  //Increase the score and display new one
  currentScore++;
  currentScoreDisplay.innerText = `Current Score: ${currentScore}`;

  //set the color of the clicked card
  event.target.style.backgroundColor = event.target.className;

  //logic to handle pick
  if (firstPick) {

    if (event.target === firstPick){

      //Do nothing if the user just picked the same card twice.
      console.log("Same card! Try again.");

    } else if (event.target.className !== firstPick.className) {

      //Remove event handling from all unmatched divs while we wait for timeout
      let frozenDivs = document.querySelectorAll("#game div:not(.matched)");
      for (let div of frozenDivs) {
        div.removeEventListener('click', handleCardClick);
      }

      //Clear colors after a second and return event handler to all frozen divs
      setTimeout(function() {
        firstPick.style.backgroundColor = "";
        event.target.style.backgroundColor = "";
        firstPick = "";
        for (let div of frozenDivs) {
          div.addEventListener('click', handleCardClick);
        }
      }, 1000);

    } else {

      //If the two were a match, remove eventListeners, add matched class, clear firstpick and go on to the next one!
      firstPick.removeEventListener('click', handleCardClick);
      firstPick.classList.add('matched')
      event.target.removeEventListener('click', handleCardClick);
      event.target.classList.add('matched');
      firstPick = "";

    }

  } else {
    //If there is not an existing pick, then the targeted element is the first pick.
    firstPick = event.target;
  }

  //Check if the game has ended (all elements have matched class)
  let matchedDivs = document.querySelectorAll('.matched');
  let allDivs = document.querySelectorAll("#game div");
  if (matchedDivs.length === allDivs.length) {

    //Logic for setting best score
    if (bestScore) {
      //If new score is lower than existing best, store and display new score
      if (currentScore < bestScore) {
        localStorage.setItem('bestScore', currentScore);
        let bestScoreDisplay = document.querySelector("#bestScore");
        bestScoreDisplay.innerText = `Best Score: ${currentScore}`;
      }
    } else {
      //If best score did not previously exist, this is now the best score! Create the display object.
      bestScore = currentScore;
      localStorage.setItem('bestScore', currentScore);
      showBestScore(currentScore);
    };

    //Create play again button
    const playAgain = document.createElement('button')
    playAgain.id = "playagain";
    playAgain.innerText = "Play again?";

    //Add a listener to the button that will re-shuffle and re-set the divs and then clear the button
    playAgain.addEventListener('click', function() {
      //Save number of pairs we have now
      let replayPairs = matchedDivs.length / 2;

      //Remove existing divs
      for (let div of matchedDivs) {
        div.remove();
      }
      //Add divs back with the same number we just played
      let shuffledColors = shuffle(randomColors(replayPairs));
      createDivsForColors(shuffledColors);

      //Remove play again button
      playAgain.remove()
      //Reset Score
      currentScore = 0;
      currentScoreDisplay.innerText = "Current Score: 0";
    });

    //Append button to the scores div
    scores.append(playAgain);
  }
}

// when the DOM loads
startButton.addEventListener('click', function (event) {
  event.preventDefault();
  //Clear existing divs, if there are any
  let existingDivs = document.querySelectorAll("#game div");
  for (let div of existingDivs) {
    div.remove();
  };

  //Clear score
  currentScore = 0;
  currentScoreDisplay.innerText = "Current Score: 0";

  //If play again button is on-screen, remove it
  let playAgain = document.getElementById("playagain");
  if (playAgain) {
    playAgain.remove();
  }

  //Create new divs
  let shuffledColors = shuffle(randomColors(pairsInput.value));
  createDivsForColors(shuffledColors);
});
