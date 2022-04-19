document.addEventListener('DOMContentLoaded', () => {
    formEvent();
    makeSlideShow();
    // searchForFilter('vehicles', 'C-9979 landing craft');
    // capitalizeFirstLetter('sand crawler');
})

const url = "https://swapi.dev/api/";
let num = 1;
const pageNum = (num) =>  `?page=${num}`
let traitResults = '';

const body = document.querySelector('body');
const results = document.querySelector('#search-results');
const searchTitle = document.querySelector('#search-name');
let currentImage = '';

//fetches fro  API
function fetchStuff(filter){
    return fetch(`${url}/${filter}/${pageNum(num)}`)
    .then(res => res.json())
}

//makes form work
function formEvent(){
    const form = document.querySelector('form');
    const input = document.querySelector('input')
    const dropDown = document.querySelector('select')

    form.addEventListener('submit', (e) => {

        e.preventDefault();

        if (dropDown.value !== 'none'){
            searchForFilter(dropDown.value, capitalizeFirstLetter(input.value));
        } else {
            window.alert('select a search option');
        }

    })
}

//applies filter to fetch and searches for input
function searchForFilter(filter, input){

    fetchStuff(filter)
    .then(data => {
        if (data.next !== null){
            data.results.forEach(el => {
                if(el.name === input){
                    printResult(el)
                }
            })

            num++
            searchForFilter(filter, input)

        } else {

            window.alert('try using a different search option');
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
    
    let image = document.querySelectorAll('.images');
    let i = 0;
    console.log(image)

    currentImage = image[0]
    currentImage.removeAttribute('class')


    // let [anh, esb, roj, tpm, aoc, ros ] = image;

    const left = document.querySelector('#left');
    const right = document.querySelector('#right');


    left.addEventListener('click', (e) => {
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

    })

    right.addEventListener('click', (e) => {

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

    })
}



// Votes
    let thumbUp = document.getElementById("thumbUp")
    let counterUp = document.getElementById("votesUp")
    thumbUp.addEventListener("click", e =>{
        counterUp.innerText = parseInt(counterUp.innerText) + 1
    })

    let thumbDown = document.getElementById("thumbDown")
    let counterDown = document.getElementById("votesDown")
    thumbDown.addEventListener("click", e=>{
        counterDown.innerText = parseInt(counterDown.innerText) -1
    })

    

   