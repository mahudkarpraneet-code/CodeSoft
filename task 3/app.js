const buttonsEl = document.querySelectorAll("button");
const inputFieldEl = document.getElementById("result");

for (let i = 0; i < buttonsEl.length; i++) {
  buttonsEl[i].addEventListener("click", () => {
    const buttonValue = buttonsEl[i].textContent;
    if (buttonValue === "C") {
      clearResult();
    } else if (buttonValue === "=") {
      calculateResult();
    } else {
      appendValue(buttonValue);
    }
  });
}

// Add keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key >= 0 && e.key <= 9) {
    appendValue(e.key);
  } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    appendValue(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calculateResult();
  } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
    clearResult();
  } else if (e.key === "." || e.key === ",") {
    appendValue(".");
  } else if (e.key === "Backspace") {
    inputFieldEl.value = inputFieldEl.value.slice(0, -1);
  }
});

function clearResult() {
  inputFieldEl.value = "";
}

function calculateResult() {
  try {
    // Validate input before evaluation
    if (inputFieldEl.value.trim() === "") {
      return;
    }
    inputFieldEl.value = eval(inputFieldEl.value);
  } catch (error) {
    inputFieldEl.value = "Error";
    setTimeout(clearResult, 1500);
  }
}

function appendValue(buttonValue) {
  // Prevent multiple decimal points in a number
  const lastNumber = inputFieldEl.value.split(/[\+\-\*\/]/).pop();
  if (buttonValue === "." && lastNumber.includes(".")) {
    return;
  }
  
  inputFieldEl.value += buttonValue;
}