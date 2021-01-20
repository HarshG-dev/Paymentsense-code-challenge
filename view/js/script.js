const DROPBOX = document.querySelector("#user-select");
const SHOWBUTTON = document.querySelector("#submit-btn");
let loadIcon = document.querySelector("#loader-view");

SHOWBUTTON.addEventListener("click", selectItem);

let backendAPI = "https://jsonmock.hackerrank.com/api/transactions?userId";


function selectItem() {
    var id = DROPBOX.options[DROPBOX.selectedIndex].value;
    // Make sure only valid selection
    if (id >= 1){
        getDataFromBackend(id);
    }
    console.log(id);
}

// Get Data from backend and display
function getDataFromBackend(selectedUserID) {
    var callURL = backendAPI + "=" + selectedUserID;
    //var httpRes;    
    console.log(callURL);
    
    loadIcon.style.display = "block";
    
    fetch(callURL)
    .then((resp) => resp.json())
    .then(function(respData) {
      userDetails(respData.data[0].userName);
      monthlyData((respData.data), (respData.total_pages));
      
    })
    .catch(function(error) {
      console.log(error);
    });
    
    loadIcon.style.display = "none";
}

// Display User Name
function userDetails(name) {
    let userName = document.querySelector("#user-name");
    userName.innerHTML = name;
}

// Display balance amount
function displayFinalAmount(amount) {
    let balance = document.querySelector("#user-balance");
    balance.innerHTML = amount;
}

// Display monthly statement and all the pages
function monthlyData(statements, pages) {
    let statement = document.querySelector("#monthly-statements");
    let card, cardBalance, cardDate, node, cardLocation, cardAddress, cardCity,	cardZipCode;
    
    // Removing the previously selected items
    while(statement.firstChild) {
        statement.removeChild(statement.lastChild);
    }
    // TODO - Handle pages less than two
    // Sorting the Statement Card in date order
    statements.sort(function(a, b) { 
        var c = new Date(a.timestamp); 
        var d = new Date(b.timestamp); 
        return d-c; 
    });
    
    displayFinalAmount(statements[0].amount);
    
    for(let i=0; i<pages; i++) {
        card = document.createElement("div");
        card.classList.add("statement-card");
        
        cardBalance = document.createElement("div");
        let statementAmount;
        if(statements[i].txnType == "debit"){
            statementAmount = '<p class="monthly-balance monthly-debit">';
        }else {
            statementAmount = '<p class="monthly-balance monthly-credit">';
        }
        cardBalance.innerHTML = statementAmount + statements[i].amount + '</p>';
        card.appendChild(cardBalance);
        
        cardDate = document.createElement("div");
        let date = new Date(statements[i].timestamp);
        cardDate.innerHTML = '<p class="month-year">' + date.toLocaleDateString('en-GB') + '</p>';
        card.appendChild(cardDate);
        
        cardLocation = document.createElement("div");
        cardLocation.classList.add("card-location");
        let address = '<p>' + statements[i].location.address + '</p>' + '<p>' + statements[i].location.city + '</p>' + '<p>' + statements[i].location.zipCode + '</p>';
        cardLocation.innerHTML = address;
        card.appendChild(cardLocation);
        
        statement.appendChild(card);  
    }  
}