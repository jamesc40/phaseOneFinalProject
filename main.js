
const url = "https://swapi.dev/api/";
const dbUrl = 'http://localhost:3000/images'

let num = 1;
const pageNum = (someNum) =>  `?page=${someNum}`
let traitResults = '';

let currentImage = '';
const image = document.querySelectorAll('.images');
let i = 0;

const counterUp = document.querySelector("#votesUp")
const counterDown = document.querySelector("#votesDown")

const p = document.querySelector('#question-area');
const form = document.querySelector('#question-form'); 
const check = document.querySelector('#answer');


function fetchApi(filter, page){
    return fetch(`${url}/${filter}/${pageNum(page)}`)
    .then(res => res.json())
}

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

function makeSlideShow(){
    currentImage = image[0]
    currentImage.removeAttribute('class')   

    fetchVotes(i + 1);

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
    let thumbUp = document.querySelector("#thumbUp")
    let thumbDown = document.querySelector("#thumbDown")

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
    let key = pickQuestion()
    let answer = character[key];

    console.log(answer);

    p.textContent = `What is ${character.name}'s ${key}?`

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (check.value.length === 0) return
        console.log(check.value)

        check.value === answer ? p.textContent = 'The Force is with you!' : p.textContent = 'Try not. Do… or do not. There is no try.'

        form.reset();
    })
}

function pickQuestion () {
    const options = ['hair_color', 'skin_color', 'eye_color', 'gender'];
    return options[randomNumber(options.length)]
}

makeSlideShow();
thumbsWork();
loadQuestion();
quizButton();