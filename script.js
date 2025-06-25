const inputSlider=document.querySelector("[data-lengthSlider]")
const lengthDisplay=document.querySelector("[data-lengthNumber]")
const dataPwdDisplay=document.querySelector("[data-password-display]")
const copyBtn=document.querySelector("[data-copy]")
const copyMsg=document.querySelector("[data-copyMsg]")
const uppercaseCheck=document.querySelector("#uppercase")
const lowercaseCheck=document.querySelector("#lowercase")
const symbolCheck=document.querySelector("#symbols")
const numberCheck=document.querySelector("#numbers")
const indicator=document.querySelector("[data-indicator]")
const generateBtn=document.querySelector(".generateButton")
const allcheckBox=document.querySelectorAll("input[type=checkbox]")
const symbol="!@#$%^&*()_+={}[]|:;?><,./~";
let password="";
let passwordLength=10
let checkCount=0;
handleSlider()
//set password length
function handleSlider(){
      inputSlider.value=passwordLength;
      lengthDisplay.innerText=passwordLength;
      const min=inputSlider.min;
      const max=inputSlider.max;
      inputSlider.style.backgoundSize=((passwordLength - min)*100/(max-min))+"% 100%";
}

// set indicator
setindicator("grey");
function setindicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;

}

function getRandInteger(min,max){
  return Math.floor(Math.random()*(max-min)) + min;
}

function getRandomNumber(){
    return getRandInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandInteger(65,91));
}

function generateSymbols(){
    return symbol.charAt(getRandInteger(0,symbol.length));
}


function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNumber=false;
    let hasSymbol=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNumber=true;
    if(symbolCheck.checked) hasSymbol=true;

    if(hasUpper && hasLower && hasSymbol && hasNumber  && passwordLength>=8){
        setindicator("#0f0");
    } else if((hasUpper || hasLower) && (hasNumber||hasSymbol) && passwordLength>=5){
        setindicator("#ff0");
    } else{
        setindicator("#f00");
    }
}


function shufflepassword(array){
    // fisher yakes method
    for(let i=array.length-1;i>0;i--){
     const j=Math.floor(Math.random()*(i+1));
     const temp=array[i];
     array[i]=array[j];
     array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}


function handleCheckBoxChange(){
    checkCount=0;
    allcheckBox.forEach((checkBox)=>{
        if(checkBox.checked)
            checkCount++;
});

if(passwordLength < checkCount){
    passwordLength=checkCount;
    handleSlider()
}
}
allcheckBox.forEach((checkBox)=>{
    checkBox.addEventListener('change',handleCheckBoxChange)
}
)

async function copyContent(){
    try{
        await navigator.clipboard.writeText(dataPwdDisplay.value);
        copyMsg.innerText="copied";
    }catch(e){
           copyMsg.innerText="failed";
    }
    //to make copy span visible here
   copyMsg.classList.add("active");
   setTimeout(() => copyMsg.classList.remove("active"),2000);
}

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(dataPwdDisplay.value){
        copyContent();
    }
});


generateBtn.addEventListener('click',()=>{
    //none of the checkbox selected
    if(checkCount<=0) return;
    if(passwordLength < checkCount){
    passwordLength=checkCount;
    handleSlider();
    }
// new password
password="";
let funcArray=[];
if(uppercaseCheck.checked)
    funcArray.push(generateUpperCase);

if(lowercaseCheck.checked)
    funcArray.push(generateLowerCase);

if(numberCheck.checked)
     funcArray.push(getRandomNumber);

if(symbolCheck.checked)
     funcArray.push(generateSymbols);

// compulsary
for(let i=0;i<funcArray.length;i++){
    password+=funcArray[i]();
}


// remaining
for(let j=0;j<passwordLength-funcArray.length;j++){
    let randIndex = getRandInteger(0,funcArray.length-1);
    password += funcArray[randIndex](); 
}
//shuffle password
password=shufflepassword(Array.from(password));
//show in ui
dataPwdDisplay.value=password;
console.log(password)
// calculate strength
calcStrength();

})