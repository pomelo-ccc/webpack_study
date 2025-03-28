export const name = '01.js';
export const hello = function say(){
    console.log('Hello, 01.js');
}

const version = '1.0.0';
function getVersion(){
    return version;
}
export {
    getVersion,
    version
}

export default function(){
    console.log('default 01.js');
}




setTimeout(() => {
    console.log('setTimeout 01.js');
}
, 1000);

setTimeout(function(){
    console.log('setTimeout 01.js');
});

setTimeout(function say(){
    console.log('setTimeout 01.js');
}
, 1000);