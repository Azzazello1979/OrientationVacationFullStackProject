// a Promise is an object that holds the eventual result of an async operation.
// It also holds the scenario for failure

const p = new Promise((bingo, fail) => {
  // start some async operation
  setTimeout(function(){
    bingo('Promise resolved!');
    //fail(new Error('message'));
  }, 5000);

  //resolve('Promise resolved!');
  //reject(new Error('message'));
});

p.then(result => console.log('Result is ' + result))
.catch(err => console.log('Error is: ', err.message));

