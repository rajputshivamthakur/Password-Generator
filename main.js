const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handelSlider();
// set strength circle colour to grey
setIndicator("#ccc");

// set passwordLength
function handelSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
  console.log("Password Length: " + passwordLength);
}

function setIndicator(color) {
  indicator.style.background = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 122));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 90));
}

function generateSymbol() {
  const randomNumber = getRandomInteger(0, symbols.length);
  return symbols.charAt(randomNumber);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied!";
  } catch (e) {
    copyMsg.innerText = "Failed!";
  }

  //to make copy wala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  // Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handelSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  // none of the checkbox are selected
  if (checkCount == 0) {
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handelSlider();
  }

  // let's start the journey to find the new password
  console.log("Starting the journey");
  // remove old password
  password = "";

  // let's put the stuff mentioned by checkbox
  /*
    if(uppercaseCheck.checked){
        password += generateUpperCase();
    }

    if(lowercaseCheck.checked){
        password += generateLowerCase();
    }

    if(numbersCheck.checked){
        password += generateRandomNumber();
    }

    if(symbolsCheck.checked){
        password += generateSymbol();
    }
    */

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }

  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }

  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }

  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  // compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("Compulsory addition done");

  // remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randomIndex = getRandomInteger(0, funcArr.length);
    console.log("ramdomIndex " + randomIndex);
    password += funcArr[randomIndex]();
  }
  console.log("Remaining addition done");

  // shuffle the password
  password = shufflePassword(Array.from(password));
  console.log("Shuffling addition done");

  // show in UI
  passwordDisplay.value = password;
  console.log("UI addition done");

  // calculate strength
  calcStrength();
});
