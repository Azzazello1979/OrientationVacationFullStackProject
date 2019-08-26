    // constants:
    const backUri = 'http://localhost:5000';
    
    // middlewares:
    // capitalizes 1st letter and rest is lowercase
    import { toNoun } from './middlewares/toNoun.js';
    

    //on load of window, show all auto parts and cars in database
    window.onload = () => {
      showCars();
      let countParts = document.querySelector('.allParts');
      countPartsQuery();
      function countPartsQuery() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `${backUri}/parts`, true);
        xhr.onload = function () {
          let rows = JSON.parse(this.response); //same as xhr.response
          //console.log(rows.length);
          countParts.innerHTML = `Current number of auto parts: ${rows.length}`;
        }
        xhr.send();
      }
      // fills up 'parts' table body ...
      let partsToFill = document.querySelector('.parts');
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `${backUri}/parts`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        if (this.status === 200 && this.readyState === 4) { // "this" here is the same as "event.target" above. "this" is also the same as "xhr" here.
          //console.log(this);
          let partsTable = JSON.parse(this.response); // same as JSON.parse(xhr.response);
          //console.log(partsTable);
          partsTable.forEach(part => {
            let newRow = document.createElement('tr');
            let newID = document.createElement('td');
            newID.textContent = part.id;
            let newPartName = document.createElement('td');
            newPartName.textContent = part.partName;
            let newUniversalCode = document.createElement('td');
            newUniversalCode.textContent = part.universalCode;
            let newPartPrice = document.createElement('td');
            newPartPrice.textContent = part.partPrice;
            let newStock = document.createElement('td');
            newStock.textContent = part.stock;
            //we create the delete BUTTON for each record, with each cycle,
            //so at the XHR DELETE request below, the delete button is bound to the ${part.id} of the record!  
            let newDeleteButton = document.createElement('button');
            newDeleteButton.textContent = 'delete';
            newDeleteButton.addEventListener('click', (event) => {
              let xhr = new XMLHttpRequest();
              xhr.open('DELETE', `${backUri}/delete/parts/${part.id}`, true);
              xhr.onload = function () {
                window.alert('Record successfully deleted!');
                location.reload(); //this refreshes the window
              };
              xhr.send();
            });
            newRow.appendChild(newID);
            newRow.appendChild(newPartName);
            newRow.appendChild(newUniversalCode);
            newRow.appendChild(newPartPrice);
            newRow.appendChild(newStock);
            newRow.appendChild(newDeleteButton);
            partsToFill.appendChild(newRow);
          });
        } else {
          console.log(`Error with xhr connection. STATUS: ${this.status}, READYSTATE: ${this.readyState}.`);
        }
      }
      xhr.send();
    };
    //fills up 'cars' table body ...
    function showCars() {
      let carsToFill = document.querySelector('.cars');
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `${backUri}/cars`, true);
      xhr.setRequestHeader('Content-Type','application-json');
      xhr.onload = function(){
        if(this.status === 200 & this.readyState === 4){
          let carsTable = JSON.parse(this.response);
          console.log(carsTable);
          carsTable.forEach(car => {
           let newRow = document.createElement('tr');
           let newID = document.createElement('td');
           newID.textContent = car.id;
           let newMake = document.createElement('td');
           newMake.textContent = car.make;
           let newModel = document.createElement('td');
           newModel.textContent = car.model;
           let newYear = document.createElement('td');
           newYear.textContent = car.year;
           let newPrice = document.createElement('td');
           newPrice.textContent = car.price;
           let newStock = document.createElement('td');
           newStock.textContent = car.stock;
           let newDescription = document.createElement('td');
           newDescription.textContent = car.description;   
            let cols = [newID, newMake, newModel, newYear, newPrice, newStock, newDescription];
            
            /*for(let i=0 ; i<cols.length ; i++){
              newRow.appendChild(cols[i]);
            }*/
            cols.forEach(e=> newRow.appendChild(e));
            carsToFill.appendChild(newRow);
          });
        } else {
          console.log(`Error with xhr connection. STATUS: ${this.status}, READYSTATE: ${this.readyState}.`);
        }
      }
      xhr.send();
    };
    // this is needed for the range slider @ "Add new stock:"
    function updateTextInput(x) {
      document.getElementById('textInput').value = x;
    }
    // target html form, attach event listener 'submit', save form data in object, xhr send to endpoint
    //
    // add data to CUSTOMERS table 
    let addCustomerForm = document.querySelector('.customersInputForm');
    addCustomerForm.addEventListener('submit', (event) => {
      let formData = event.target.elements;
      let validFirstName = toNoun(formData.first_name.value);
      let validLastName = toNoun(formData.last_name.value);
      let validCountry = toNoun(formData.country.value);
      let validCity = toNoun(formData.city.value);
      let validState = (formData.state.value).toUpperCase();
      let validEmail = (formData.email.value).toLowerCase();
      let bodyToSend = {
        first_name: validFirstName,
        last_name: validLastName,
        address: formData.address.value,
        country: validCountry,
        city: validCity,
        state: validState,
        email: validEmail
      };
      let xhr = new XMLHttpRequest();
      xhr.open('POST', `${backUri}/customers`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        let message = JSON.parse(this.response);
        window.alert(message.info);
      }
      xhr.send(JSON.stringify(bodyToSend));
    });
    // add data to CARS table 
    let addCarForm = document.querySelector('.carsInputForm');
    addCarForm.addEventListener('submit', (event) => {
      let formData = event.target.elements;
      let validMake = toNoun(formData.make.value);
      let validModel = toNoun(formData.model.value);
      let bodyToSend = {
        make: validMake,
        model: validModel,
        year: formData.year.value,
        price: formData.price.value,
        stock: formData.stock.value,
        description: formData.description.value
      };
      if (formData.description.value.length <= 200) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${backUri}/cars`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
          let message = JSON.parse(this.response);
          window.alert(message.info);
        }
        xhr.send(JSON.stringify(bodyToSend));
      } else {
        window.alert('Please use max. 200 characters for description!');
      }
    });
    // add data to PARTS table
    let addStockForm = document.querySelector('.partsInputForm');
    addStockForm.addEventListener('submit', (event) => {
      //event.preventDefault(); //<-- only used for de-bugging
      let formData = event.target.elements;
      let validPartName = (formData.partName.value).toLowerCase();
      let bodyToSend = {
        partName: validPartName,
        universalCode: formData.universalCode.value,
        partPrice: formData.partPrice.value,
        stock: formData.stock.value
      };
      let xhr = new XMLHttpRequest();
      xhr.open('POST', `${backUri}/parts`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        let message = JSON.parse(this.response);
        window.alert(message.info);
      }
      xhr.send(JSON.stringify(bodyToSend));
    });
    // update any data type in any table any column, based on record ID
    let updateDataForm = document.querySelector('.updateData');
    updateDataForm.addEventListener('submit', (event) => {
      //event.preventDefault(); //<-- only used for de-bugging
      let formData = event.target.elements;
      //console.log(formData.table.value);
      let bodyToSend = {
        table: formData.table.value,
        id: formData.id.value,
        column: formData.column.value,
        newValue: formData.newValue.value
      };
      let table = formData.table.value;
      let id = formData.id.value;
      let column = formData.column.value;
      let newValue = formData.newValue.value;
      let xhr = new XMLHttpRequest();
      xhr.open('PUT', `${backUri}/update/${table}/${id}/${column}/${newValue}`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        let message = JSON.parse(this.response);
        window.alert(message.info);
      }
      xhr.send(JSON.stringify(bodyToSend));
    });
    // OPEN-COLLAPSE buttons for input forms
    //
    //CUSTOMERS
    let customersLink = document.querySelector('.input-customers');
    customersLink.addEventListener('click', () => {
      //window.alert('Hey Customers Link was clicked!');
      document.querySelector('.customersFormDiv').style.display = 'block';
    });
    let collapseCustomersButton = document.querySelector('.collapseCustomers');
    collapseCustomersButton.addEventListener('click', () => {
      document.querySelector('.customersFormDiv').style.display = 'none';
      location.reload();
    })
    //CARS
    let carsLink = document.querySelector('.input-cars');
    carsLink.addEventListener('click', () => {
      document.querySelector('.carsFormDiv').style.display = 'block';
    });
    let collapseCarsButton = document.querySelector('.collapseCars');
    collapseCarsButton.addEventListener('click', () => {
      document.querySelector('.carsFormDiv').style.display = 'none';
      location.reload();
    })
    //PARTS
    let partsLink = document.querySelector('.input-parts');
    partsLink.addEventListener('click', () => {
      document.querySelector('.partsFormDiv').style.display = 'block';
    });
    let collapsePartsButton = document.querySelector('.collapseParts');
    collapsePartsButton.addEventListener('click', () => {
      document.querySelector('.partsFormDiv').style.display = 'none';
      location.reload();
    })
    // when POSTing via xhr, you need to use the setRequestHeader(); method after open(); but before send();
    // specify what kind of data you are sending inside the req.body
    // examples:
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');