/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
if(localStorage.getItem('kittens')){
  kittens = JSON.parse(localStorage.getItem('kittens'));
  let x = document.getElementById("welcome");
  x.style.display = "none";
}
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
let parsedKittens;
let started = false;
let mood;

function addKitten(event) {
  let kitten_name = event.target.kitten_name.value;
  if(kittens.some(kitten => kitten.name === kitten_name)){
    alert(`You already have a kitten named ${kitten_name}!`);
    event.preventDefault()
  }else if(kitten_name !== ''){
  event.preventDefault()
  //generate key
  let key = generateId()
  //create new kittne based off user input & params
  let new_kitten = {
    id: key, name: event.target.kitten_name.value, mood: 'tolerant', affection: 5
  }
  kittens.push(new_kitten);
  event.target.reset();
  //saving kitten
  saveKittens();
  drawKittens();
  if(started===false){
    getStarted();
  }
}else{
  alert("You must name the kitten!");
  event.preventDefault();
}
}

//delete a kitten
function removeKitten(id){
  let newArr = kittens.filter(kitten => kitten.id !== id);
  localStorage.clear();
  kittens = newArr;
  saveKittens();
}

//Clear all kittens and local storage
function clearAll(){
  localStorage.clear();
  kittens = [];
  parsedKittens = [];
  loadKittens()
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  localStorage.setItem('kittens', JSON.stringify(kittens));
  loadKittens();
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let kittenString = JSON.parse(localStorage.getItem("kittens"));
  parsedKittens = kittenString;
  drawKittens();
}
/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  //remove previous elements
  let parent = document.getElementById("kitten_list");
  parent.innerHTML = '';

  parsedKittens.map((val)=>{

    var node = document.createElement("LI");                 // Create a <li> node

    let alive = `<div id="${val.id}" class="card kitten cat">
    <a class="delete" style="color:red" onClick={removeKitten("${val.id}")}>x</a>
    <p>${val.name}</p>
    <image src="https://robohash.org/${val.name}?set=set4" />
    <p id="${val.id}mood" class="kitten-mood">${val.mood}: ${val.affection}</p>
    <button id="petbtn" onClick={pet("${val.id}")}>Pet</button>
    <button id="catnipbtn" onClick={catnip("${val.id}")}>Catnip</button>
  </div>`

    let gone = `<div id="${val.id}" class="card kitten cat gone">
    <a class="delete" style="color:red" onClick={removeKitten("${val.id}")}>x</a>
    <p>${val.name}</p>
    <image src="https://robohash.org/${val.name}?set=set4" />
    <p id="${val.id}mood" class="kitten-mood">${val.mood}: ${val.affection}</p>
  </div>`

    if(val.mood === 'Gone'){
      node.innerHTML = gone;
    }else{
      node.innerHTML = alive;
    }

    document.getElementById("kitten_list").appendChild(node);     // Append <li> to <ul> with id="myList"
  })

}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(k => k.id == id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  //Get kitten
  let kitten = findKittenById(id);
  //generate random number for affection change
  var num = Math.floor(Math.random()*10) + 1;
  //change affection
  if(num > 7){
    kitten.affection += 1;
  }else if(kitten.affection > 0){
    kitten.affection += -1;
  }
  //set mood
  setKittenMood(kitten);
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
//Get kitten
let kitten = findKittenById(id);
//reset kitten affection
kitten.affection = 5;
//set mood
setKittenMood(kitten);
}

/**kitten.affection += num;
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  if(kitten.affection > 3 && kitten.affection < 6){
    kitten.mood = "Tolerant";
    document.getElementById(kitten.id+"mood").innerHTML = `Tolerant`;
  }else if(kitten.affection >= 6){
    kitten.mood = "Happy";
    document.getElementById(kitten.id+"mood").innerHTML = `Happy`;
  }else if(kitten.affection > 0 && kitten.affection < 4){
    kitten.mood = "Angry";
    document.getElementById(kitten.id+"mood").innerHTML = `Angry`;
  }else{
    kitten.mood = "Gone";
    document.getElementById(kitten.id+"mood").innerHTML = `Gone`;

  }
  //save all changes to kitten
  reflectMood(kitten);
  saveKittens();
}

//change style based on moods
function reflectMood(kitten){

}

function getStarted() {
  document.getElementById("welcome").remove();
  loadKittens();
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

loadKittens();