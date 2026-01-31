// Calculator state
const calculator = {
    currentOperand: '0',
    previousOperand: '',
    operation: undefined,
    waitingForNewOperand: false
};

// DOM Elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const themeToggleButton = document.getElementById('theme-toggle');
const calculatorElement = document.querySelector('.calculator');

// Update display
function updateDisplay() {
    currentOperandElement.textContent = calculator.currentOperand;
    
    if (calculator.operation) {
        previousOperandElement.textContent = 
            `${calculator.previousOperand} ${calculator.operation}`;
    } else {
        previousOperandElement.textContent = calculator.previousOperand;
    }
}

// Add digit to current operand
function addDigit(digit) {
    const { currentOperand, waitingForNewOperand } = calculator;
    
    if (waitingForNewOperand) {
        calculator.currentOperand = digit;
        calculator.waitingForNewOperand = false;
    } else {
        calculator.currentOperand = 
            currentOperand === '0' ? digit : currentOperand + digit;
    }
    
    updateDisplay();
}

// Add decimal point
function addDecimal() {
    if (calculator.waitingForNewOperand) {
        calculator.currentOperand = '0.';
        calculator.waitingForNewOperand = false;
        updateDisplay();
        return;
    }
    
    if (!calculator.currentOperand.includes('.')) {
        calculator.currentOperand += '.';
        updateDisplay();
    }
}

// Handle operator selection
function chooseOperation(operation) {
    const { currentOperand, previousOperand } = calculator;
    
    if (currentOperand === '' && previousOperand === '') return;
    
    if (previousOperand !== '' && !calculator.waitingForNewOperand) {
        calculateResult();
    }
    
    calculator.operation = operation;
    calculator.previousOperand = calculator.currentOperand;
    calculator.waitingForNewOperand = true;
    
    updateDisplay();
}

// Perform calculation
function calculateResult() {
    const { currentOperand, previousOperand, operation } = calculator;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    let result;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '−':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert("Division by zero is not allowed!");
                clearCalculator();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Format result to avoid long decimal numbers
    result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
    
    calculator.currentOperand = result.toString();
    calculator.previousOperand = '';
    calculator.operation = undefined;
    calculator.waitingForNewOperand = true;
    
    updateDisplay();
}

// Clear calculator
function clearCalculator() {
    calculator.currentOperand = '0';
    calculator.previousOperand = '';
    calculator.operation = undefined;
    calculator.waitingForNewOperand = false;
    
    updateDisplay();
}

// Delete last digit
function deleteDigit() {
    if (calculator.waitingForNewOperand) return;
    
    if (calculator.currentOperand.length === 1) {
        calculator.currentOperand = '0';
    } else {
        calculator.currentOperand = calculator.currentOperand.slice(0, -1);
    }
    
    updateDisplay();
}

// Toggle theme
function toggleTheme() {
    calculatorElement.classList.toggle('light');
    const icon = themeToggleButton.querySelector('i');
    
    if (calculatorElement.classList.contains('light')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        themeToggleButton.setAttribute('title', 'Switch to dark theme');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        themeToggleButton.setAttribute('title', 'Switch to light theme');
    }
}

// Handle keyboard input
function handleKeyboardInput(event) {
    const { key } = event;
    
    // Prevent default behavior for calculator keys
    if (/[\d+\-*/.=]|Enter|Escape|Backspace/.test(key)) {
        event.preventDefault();
    }
    
    if (key >= '0' && key <= '9') {
        addDigit(key);
    } else if (key === '.') {
        addDecimal();
    } else if (key === '+') {
        chooseOperation('+');
    } else if (key === '-') {
        chooseOperation('−');
    } else if (key === '*') {
        chooseOperation('×');
    } else if (key === '/') {
        chooseOperation('÷');
    } else if (key === '=' || key === 'Enter') {
        calculateResult();
    } else if (key === 'Escape') {
        clearCalculator();
    } else if (key === 'Backspace') {
        deleteDigit();
    }
}

// Initialize calculator
function initCalculator() {
    // Set up button event listeners
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            addDigit(button.getAttribute('data-number'));
        });
    });
    
    document.querySelectorAll('[data-operation]').forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.getAttribute('data-operation'));
        });
    });
    
    document.querySelector('[data-action="equals"]').addEventListener('click', calculateResult);
    document.querySelector('[data-action="clear"]').addEventListener('click', clearCalculator);
    document.querySelector('[data-action="delete"]').addEventListener('click', deleteDigit);
    document.querySelector('[data-action="decimal"]').addEventListener('click', addDecimal);
    
    // Theme toggle
    themeToggleButton.addEventListener('click', toggleTheme);
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
    
    // Initialize display
    updateDisplay();
}

// Start calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', initCalculator);