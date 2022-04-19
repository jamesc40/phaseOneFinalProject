document.addEventListener('DOMContentLoaded', () => {
    // formEvent();
    // searchForFilter('vehicles', 'C-9979 landing craft');
    console.log(capitalizeFirstLetter('sand crawler'));
})

const url = "https://swapi.dev/api/";
let num = 1;
const pageNum = (num) =>  `?page=${num}`

const body = document.querySelector('body');
const results = document.querySelector('#search-results');
const searchTitle = document.querySelector('#search-name');


function fetchStuff(filter){
    return fetch(`${url}/${filter}/${pageNum(num)}`)
    .then(res => res.json())
}

function printResult(result){

    for (let key in result){
        let trait = document.createElement('p')
        trait.textContent = `${key}: ${result[key]}`
        results.append(trait);
    }

}

const searchForFilter = (filter, input) => {
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

const capitalizeFirstLetter = (string) => {
    let words = string.split(' ');
    words.map((word) => {
        return word[0].toUpperCase() + word.substring(1);
    }).join(' ');
    return words
}

function formEvent(){
    const form = document.querySelector('form');
    const input = document.querySelector('input')
    const dropDown = document.querySelector('select')

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(capitalizeFirstLetter(input.value))
        // searchForFilter(dropDown.value, capitalizeFirstLetter(input.value));
    })
}

