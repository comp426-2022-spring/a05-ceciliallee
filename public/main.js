// Focus div based on nav button click
const home = document.getElementById("homenav");
const single = document.getElementById("singlenav");
const multi = document.getElementById("multinav");
const guess = document.getElementById("guessnav");

// Flip one coin and show coin image to match result when button clicked
single.addEventListener("click", flipCoin);
function flipCoin() {
  fetch("http://localhost:5000/app/flip/", { mode: "cors" })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      console.log(result);
      document.getElementById("result").innerHTML = result.flip;
      document
        .getElementById("quarter")
        .setAttribute("src", result.flip + ".jpg");
      single.disabled = true;
    });
  let flip = "FLIPPED";
  document.getElementById("single").innerHTML = flip;
  console.log("Coin has been flipped. Result: " + flip);
}

multi.addEventListener("click", flipCoins);
function flipCoins() {
  fetch("http://localhost:5000/app/flip/", { mode: "cors" })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      console.log(result);
      document.getElementById("resultmult").innerHTML = result.flip;
      document
        .getElementById("quarter")
        .setAttribute("src", result.flip + ".jpg");
      single.disabled = true;
    });
  let flip = "FLIPPED";
  document.getElementById("multi").innerHTML = flip;
  console.log("Coins have been flipped. Result: " + flip);
}
// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button
