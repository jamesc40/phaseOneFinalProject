
const url = "https://swapi.dev/api/";
const dbUrl = 'http://localhost:3000/images'

let num = 1;
const pageNum = (num) =>  `?page=${num}`
let traitResults = '';

const body = document.querySelector('body');
const results = document.querySelector('#search-results');
const searchTitle = document.querySelector('#search-name');

let currentImage = '';
let image = document.querySelectorAll('.images');
let i = 0;

let counterUp = document.querySelector("#votesUp")
let counterDown = document.querySelector("#votesDown")

const searchForm = document.querySelector('form');
const input = document.querySelector('input')
const dropDown = document.querySelector('select')

//fetches from  API
function fetchApi(filter, page){
    return fetch(`${url}/${filter}/${pageNum(page)}`)
    .then(res => res.json())
}

//fetches to db.json
const fetchDb = (id) => {
    return fetch(`${dbUrl}/${id}`)
    .then(res => res.json());
}

function fetchVotes(id){

    fetchDb(id)
    .then(data => {

        counterUp.textContent = data.votesUp;
        counterDown.textContent = data.votesDown;

    })

}

function patchVotes(id){

    fetch(`${dbUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            'votesUp': counterUp.textContent,
            "votesDown": counterDown.textContent
        })

    })
}

//makes form work
function formEvent(){

    let button = document.querySelector('#search-btn');

    button.addEventListener('click', (e) => {

        // e.preventDefault();

        if (dropDown.value !== 'none'){
            searchForFilter(dropDown.value, capitalizeFirstLetter(input.value));
        } else {
            window.alert('select a search option');
        }

    })
}

function searchForFilter(filter, input){

    fetchApi(filter, num)
    .then(data => {
        if (data.next !== null){

            let finder = data.results.find(el => el.name === input)
            if (finder !== undefined){
                printResult(finder);
            } 

            num++
            searchForFilter(filter, input)

        } else {
            num = 1
            return; 
        }

    })
}
//capitalizes first lettter regardless of spaces or capitalization
const capitalizeFirstLetter = (string) => {

    let words = string.split(' ');

    newString = words.map((word) => {
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }).join(' ');
    
    return newString
}

//adds search results to screen
function printResult(result){
    let trait = '';
    let count = 0;
    for (let key in result){
        count++
        if (key === 'name'){
            searchTitle.textContent = result.name;
        } else {
            for(let i = 0; i < count; i++){
                if (document.querySelectorAll('.traits')[i] === undefined){
                    trait = document.createElement('p')
                    trait.classList = 'traits';
                    results.append(trait);
                } else {
                    trait = document.querySelectorAll('.traits')[i];
                }
            }
            trait.textContent = `${key}: ${result[key]}`
        }
    }
}

function makeSlideShow(){
    
    currentImage = image[0]
    currentImage.removeAttribute('class')

    // const left = document.querySelector('#left');
    // const right = document.querySelector('#right');

    document.onkeydown = (e) =>{
        patchVotes(i + 1);
        if(e.keyCode === 37){
            if(i !== 0){
                currentImage.classList.add('images'); 
                currentImage = image[i - 1];
                currentImage.removeAttribute('class')   
                i--
            } else {
                i = image.length - 1;
                currentImage.classList.add('images'); 
                currentImage = image[i];
                currentImage.removeAttribute('class')   
            } 
        } else if (e.keyCode === 39) {
            if(i !== image.length - 1){
                currentImage.classList.add('images'); 
    
                currentImage = image[i + 1];
                currentImage.removeAttribute('class')   
                i++
            } else {
                i = 0;
                currentImage.classList.add('images');
                currentImage = image[i];
                currentImage.removeAttribute('class');
            }

        }
        fetchVotes(i + 1);
    }
}


function thumbsWork(){

    let thumbUp = document.getElementById("thumbUp")
    let thumbDown = document.getElementById("thumbDown")

    thumbUp.addEventListener("click", (e) => {
        counterUp.textContent = parseInt(counterUp.textContent) + 1
    })

    thumbDown.addEventListener("click", (e) => {
        counterDown.textContent =  parseInt(counterDown.textContent) + 1
    })

}

const randomNumber = (max = 82) => {
   return Math.floor(Math.random() * max)
}

function loadQuestion(){
    fetch(`${url}/people/${randomNumber()}`)
    .then(res => res.json())
    .then(data => printQuestion(data))
}

function quizButton (){
    let button = document.querySelector('#randomizer');
    button.addEventListener('click', () => loadQuestion())
}

function printQuestion(character){
    let p = document.querySelector('#question-area');
    let form = document.querySelector('#question-form'); 
    let check = document.querySelector('#answer');

    let key = pickQuestion()
    let answer = character[key];

    console.log(answer);

    p.textContent = `What is ${character.name}'s ${key}?`

    form.addEventListener('submit', (e) => {

        e.preventDefault();
        if (check.value.length === 0) return
        console.log(check.value)

        if (check.value === answer){
            p.textContent = 'The Force is with you!'
        } else {
            return
        }

        form.reset();
    })
}

function pickQuestion () {
    const options = ['hair_color', 'skin_color', 'eye_color', 'gender'];
    return options[randomNumber(options.length)]
}

formEvent();
makeSlideShow();
thumbsWork();
loadQuestion();
quizButton();