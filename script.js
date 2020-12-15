const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

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

let shuffledColors = shuffle(COLORS);

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

let firstPick;

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  console.log("you just clicked", event.target);

  //set the color of the clicked card
  event.target.style.backgroundColor = event.target.className;

  //logic to handle pick
  if (firstPick) {

    if (event.target === firstPick){

      //Do nothing if the user just picked the same card twice.
      console.log("Same card! Try again.");

    } else if (event.target.className !== firstPick.className) {

      //Remove event handling from all divs while we wait for timeout
      let frozenDivs = document.querySelectorAll("#game div");
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

      //If the two were a match, clear firstpick and go on to the next one!
      firstPick = "";

    }

  } else {
    firstPick = event.target;
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);
