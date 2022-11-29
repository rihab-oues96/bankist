'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // to delete 2 static elements
  // .textContent = 0

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
        <div class="movements__type 
        movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov} EUR</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//////////////// calcul balance ////////

const calcDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance} EUR`;
};

/////////////////

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} EUR`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} EUR`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} EUR`;
};

//////////////////

const createUsersNames = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsersNames(accounts);

///////////// update UI ///////
const updateUI = function (acount) {
  // Display movements
  displayMovements(acount.movements);

  // display balance
  calcDisplayBalance(acount);

  // Display summary
  calcDisplaySummary(acount);
};

/////////// Event handler /////////
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    // display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    // update UI
    updateUI(currentAccount);
  }
});

///////////////

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movements
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

/////////// transfer money //////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    account => account.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
});

////////////// close account //////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    console.log(index);

    // delete account
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;
  }
});

///////// sort /////////
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////
////// LECTURE //////////////////////////
/////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*
////////////////// challenge 1 //////////////////

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJulia2 = dogsJulia.slice(1, -2);
  console.log(dogsJulia2);

  const dogsAges = [...dogsJulia2, ...dogsKate];
  console.log(dogsAges);

  dogsAges.forEach(function (dogAge, i) {
    dogAge >= 3
      ? console.log(
          `dog number ${i + 1} is an adult and is ${dogAge} years old`
        )
      : console.log(`dog number ${i + 1} is still a puppy`);
  });
};
const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [9, 16, 6, 8, 3];
checkDogs(dogsJulia, dogsKate);
*/

////////////////// challenge 2 //////////////////
/*
const calculInHumanAge = function (dogsAges) {
  const humanAges = dogsAges.map(dogAge => {
    if (dogAge <= 2) {
      return 2 * dogAge;
    } else {
      return 16 + dogAge * 4;
    }
  });
  console.log(humanAges);

  const majorDogs = humanAges.filter(dogsAges => {
    if (dogsAges >= 18) {
      return dogsAges;
    }
  });
  console.log(majorDogs);

  const average =
    majorDogs.reduce((acc, dogsAges) => acc + dogsAges, 0) / majorDogs.length;
  console.log(average);
};
const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];
calculInHumanAge(data1);
calculInHumanAge(data2);
*/

////////////////// challenge 3 //////////////////
/*
const calculInHumanAge2 = dogAges =>
  dogAges
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const data11 = calculInHumanAge2([5, 2, 4, 1, 15, 8, 3]);
const data22 = calculInHumanAge2([16, 6, 10, 5, 6, 1, 4]);

console.log(data11, data22);
*/

///////////////// challenge 4 //////////
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// 2
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `sarah's dog is eating ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  }`
);

// 3
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4
console.log(`${ownersEatTooMuch.join(' and ')} 's dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little`);

// 5
console.log(dogs.some(dog => dog.curFood === dog.recFood));

// 6
const checkEatingOk = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log(dogs.some(checkEatingOk));

// 7
console.log(dogs.filter(checkEatingOk));

// 8
// sort it by recommended food portion in an ascending order
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);

/////////////// map() /////////////
/*
const eurToUsd = 1.1;
const movementsUSD = movements.map(mov => mov * eurToUsd);
console.log(movements);
console.log(movementsUSD);


////////////////////// filter() /////////////
const deposits = movements.filter(mov => mov > 0);
console.log(movements);
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

//////////////// reduce() /////////
// accumulator => snowball
const balance = movements.reduce((acc, currentValue) => acc + currentValue, 0);
console.log(balance);

///////// maximum value with reduce() ////////////////
const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);
console.log(max);
*/

/////////// find() /////////////
/*
const firstWidthdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWidthdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/

///////////// includes / some / every ////////////
/*
// equality
console.log(movements.includes(-130));

// some : condition
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// seperate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

//////////////// flat /flatMap ////////////////
/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// flat
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

// flatMap
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);
*/

/////////// sort ///////////
/*
// strings
const owners = ['jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners);
console.log(owners.sort());
console.log(owners);

// numbers
console.log(movements);

//return < 0, A, B  (keep order)
//return > 0, B, A  (switch order)

//ascending
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a > b) return -1;
});

movements.sort((a, b) => a - b);
console.log(movements);
*/

////////////////// array methods practice ///////////////////
/*

// 1
const bankDepositSum = accounts
  .flatMap(account => account.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);

// 2
//const mumDeposits1000 = accounts
//.flatMap(account => account.movements)
//.filter(mov => mov >= 1000).length;

const mumDeposits1000 = accounts
  .flatMap(account => account.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0); //++count
console.log(mumDeposits1000);

// 3
//object that contains the sum of the deposits and withdrawal
const { deposits, withdrawals } = accounts
  .flatMap(account => account.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

// 4
// function which  convert any string to title case
// this is a nice title => This Is a Nice Title

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exeptions = ['a', 'an', 'the', 'but', 'and', 'or', 'on', 'in', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exeptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/
