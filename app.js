"use strict";
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

const account1 = {
  owner: "Sahir Bhagat",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};
const account2 = {
  owner: "Ronit Tyade",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Bhargav Garge",
  movements: [500000, 3400, -150, 790, -210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,
};

const accounts = [account1, account2, account3];

const date = document.querySelector(".date");
const currBal = document.querySelector(".current-value");
const SumIn = document.querySelector(".summary__value--in");
const SumOut = document.querySelector(".summary__value--out");
const SumInerest = document.querySelector(".summary__value--interest");

const main = document.querySelector(".main");
const recordApp = document.querySelector(".record");
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const h1 = document.querySelector(".username");
//TOPIC
//creating function that display all type of record . deposit and withdrawal
const displayRecord = function (movements, sort = false) {
  recordApp.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    //here mov will display record and i will give the index one after another
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `<div class="record-row">
    <div class="record-type movements__type--${type}">${i + 1} ${type}</div>
    
    <div class="record-value">${Math.abs(mov)}₹</div>
  </div>`;

    recordApp.insertAdjacentHTML("afterbegin", html);
  });
};

//TOPIC
//displaying total amount

const displayTotal = function (acc) {
  acc.bal = acc.movements.reduce((acc, mov) => acc + mov, 0);
  currBal.textContent = `${acc.bal}₹`;
};

//TOPIC
//display total deposit
const displayTotalSummary = function (acc) {
  //for sumin
  const incomeIn = acc.movements
    .filter((mov) => mov > 0)
    .reduce((mov, acc) => mov + acc, 0);
  SumIn.textContent = `${incomeIn}₹`;
  //sumout
  const incomeOut = acc.movements
    .filter((mov) => mov < 0)
    .reduce((mov, acc) => mov + acc, 0);
  SumOut.textContent = `${Math.abs(incomeOut)}₹`;
  //interest
  const incomeInte = acc.movements
    .filter((mov) => mov > 0)
    .map((int) => (int * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((mov, acc) => mov + acc, 0);

  SumInerest.textContent = `${incomeInte}₹`;
};

//TOPIC
//Making owner name short as username
//such as Bhargav garge = bg

const createId = function (ids) {
  ids.forEach(function (id) {
    id.user = id.owner
      .toLowerCase()
      .split(" ")
      .map((n) => n[0])
      .join("");
  });
};
createId(accounts);

//NOTE filter method give new array while find return element itself

//Applying Login
//TOPIC

const updateUI = function (acc) {
  // Display movements
  displayRecord(acc.movements);

  // Display balance
  displayTotal(acc);

  // Display summary
  displayTotalSummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

//Date
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0); //TODO understand
const year = now.getFullYear();
date.textContent = `${day}/${month}/${year}`;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.user === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    h1.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    main.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.user === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    //TODO understand
    amount > 0 &&
    receiverAcc &&
    currentAccount.bal >= amount &&
    receiverAcc?.user !== currentAccount.user
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

//closing account

btnClose.addEventListener("click", function (e) {
  //BUG
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.user &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex((acc) => acc.user === currentAccount.user);
    accounts.splice(index, 1);

    main.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = "";
});

//loan

btnLoan.addEventListener("click", function (e) {
  //BUG
  e.preventDefault();
  const amt = Number(inputLoanAmount.value);
  if (amt > 0 && currentAccount.movements.some((mov) => mov >= amt * 0.1)) {
    currentAccount.movements.push(amt);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

//sort

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayRecord(currentAccount.movements, true);
});
// function checkAns() {
//   let ans;
//   answer.forEach((n) => {
//     if (n.startQuiz) {
//       ans = n.id;
//     }
//   });
//   return ans;
// }
// // checkAns();

// function uncheckAns() {
//   answer.forEach((n) => {
//     n.checkAns = false;
//   });
// }
