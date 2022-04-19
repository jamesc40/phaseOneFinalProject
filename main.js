document.addEventListener('DOMContentLoaded', () => {
    formEvent();
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
        searchForFilter(dropDown.value, capitalizeFirstLetter(input.value));
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