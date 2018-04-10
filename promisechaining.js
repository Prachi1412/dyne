new Promise((sum, reject) =>{

  sum(1+2);

}).then(function(result) {

  console.log("sum = "+result); 

  return new Promise(function(mul, reject){ 
    mul(result*5);
  }).then(function(result) { 

  console.log("multiply = "+result); 


})
});

// function sum(numberA ,numberB){
// 	return new Promise((resolve,reject)=>resolve(numberA+numberB))
// } 

// sum(1,2)
// .then(result=> result*5)
// .then(output=>console.log(output))
// .catch(e=>console.log(e))