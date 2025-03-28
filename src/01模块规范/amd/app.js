define('app',["calculator"], function (calculator) {
  return {
    init: function init() {
      console.log("AMD模块加载成功");
      document.getElementById("result").innerHTML = `
            <p><strong>AMD模块加载成功</strong></p>
            <p>calculator.add(1, 2) = ${calculator.add(1, 2)}</p>
            <p>calculator.subtract(1, 2) = ${calculator.subtract(1, 2)}</p>
            <p>calculator.multiply(1, 2) = ${calculator.multiply(1, 2)}</p>
            <p>calculator.divide(1, 2) = ${calculator.divide(1, 2)}</p>
            
            `;
    },
  };
});
