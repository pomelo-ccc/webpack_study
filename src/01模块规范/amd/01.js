
console.log('calculator','--start')

define("calculator", [], function () {
    return {
        add: function (a, b) {
            return a + b;
        },
        subtract: function (a, b) {
            return a - b;
        },
        multiply: function (a, b) {
            return a * b;
        },
        divide: function (a, b) {
            if(b === 0) {
                throw new Error("Division by zero");
            }
            return a / b;
        }
    }
});

console.log('calculator','--end')
