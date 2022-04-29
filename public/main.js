const coin = document.getElementById("coin")
// Add event listener for coin button in div#single
coin.addEventListener("click", flipCoin)
// Set up an asynchronous function so that it will await a response.
async function flipCoin() {
  // Build up the endpoint URL
  const endpoint = "app/flip/"
  // DOM knows what the URI is so that we don't have to hard code it.
  const url = document.baseURI + endpoint
  // This sends a GET request to the API endpoint and waits for a response
  await fetch(url)
    // This receives the response as JSON
    .then(function (response) {
      return response.json();
    })
    // This processes the JSON into DOM calls that replace the existing corresponding elements in index.html 
    .then(function (result) {
      console.log(result);
      document.getElementById("result").innerHTML = result.flip;
      document.getElementById("quarter").setAttribute("src", "assets/img/" + result.flip + ".png");
    });
};
// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

const coins = document.getElementById("coins")

coins.addEventListener("submit", flipCoins)

async function flipCoins(event) {
  
  event.preventDefault();

  const endpoint = "app/flip/coins/"
  const url = document.baseURI + endpoint
  
  const formEvent = event.currentTarget
  
  try {
    const formData = new FormData(formEvent);
    
    const flips = await sendFlips({ url, formData });
    
    console.log(flips);

    document.getElementById("heads").innerHTML = "Heads: " + flips.summary.heads;
    document.getElementById("tails").innerHTML = "Tails: " + flips.summary.tails;
    document.getElementById("coinlist").innerHTML = coinList(flips.raw);
  } catch (error) {
    console.log(error);
  }
}
const call = document.getElementById("call")
call.addEventListener("submit", flipCall)
async function flipCall(event) {
  event.preventDefault();
  const endpoint = "app/flip/call/"
  const url = document.baseURI + endpoint
  const formEvent = event.currentTarget
  try {
    const formData = new FormData(formEvent);
    const results = await sendFlips({ url, formData });
    console.log(results);
    document.getElementById("choice").innerHTML = "Guess: " + results.call;
    document.getElementById("actual").innerHTML = "Actual: " + results.flip;
    document.getElementById("results").innerHTML = "Result: " + results.result;
    document.getElementById("coingame").innerHTML = '<li><img src="assets/img/' + results.call + '.png" class="bigcoin" id="callcoin"></li><li><img src="assets/img/' + results.flip + '.png" class="bigcoin"></li><li><img src="assets/img/' + results.result + '.png" class="bigcoin"></li>';
  } catch (error) {
    console.log(error);
  }
}
async function sendFlips({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJson = JSON.stringify(plainFormData);
  console.log(formDataJson);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: formDataJson
  };
  const response = await fetch(url, options);

  return response.json()
}

function homeNav() {
  document.getElementById("homenav").className = "active";
  document.getElementById("home").className = "active";
  document.getElementById("singlenav").className = "";
  document.getElementById("single").className = "inactive";
  document.getElementById("multinav").className = "";
  document.getElementById("multi").className = "inactive";
  document.getElementById("guessnav").className = "";
  document.getElementById("guesscoin").className = "inactive";
}
function singleNav() {
  document.getElementById("homenav").className = "";
  document.getElementById("home").className = "inactive";
  document.getElementById("singlenav").className = "active";
  document.getElementById("single").className = "active";
  document.getElementById("multinav").className = "";
  document.getElementById("multi").className = "inactive";
  document.getElementById("guessnav").className = "";
  document.getElementById("guesscoin").className = "inactive";
}
function multiNav() {
  document.getElementById("homenav").className = "";
  document.getElementById("home").className = "inactive";
  document.getElementById("singlenav").className = "";
  document.getElementById("single").className = "inactive";
  document.getElementById("multinav").className = "active";
  document.getElementById("multi").className = "active";
  document.getElementById("guessnav").className = "";
  document.getElementById("guesscoin").className = "inactive";
}
function guessNav() {
  document.getElementById("homenav").className = "";
  document.getElementById("home").className = "inactive";
  document.getElementById("singlenav").className = "";
  document.getElementById("single").className = "inactive";
  document.getElementById("multinav").className = "";
  document.getElementById("multi").className = "inactive";
  document.getElementById("guessnav").className = "active";
  document.getElementById("guesscoin").className = "active";
}

function coinList(array) {
  let text = "";
  let arrayLength = array.length
  for (let i = 0; i < arrayLength; i++) {
    text += '<li><img src="assets/img/' + array[i] + '.png" class="bigcoin"></li>';
  }
  return text
}