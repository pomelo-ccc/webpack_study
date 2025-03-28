import {
    getCount,
    getIncrementButton  
} from './dom.js'

console.log('listeners.js')


const addEvent = () => {
    let counter = 0;
    const count = getCount();
    const incrementButton = getIncrementButton();
    incrementButton.addEventListener('click', () => {
        counter++;
        count.textContent = counter;
    })
}


export default addEvent;
