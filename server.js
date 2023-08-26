const express = require("express");
const app = express();
const fs = require('fs');

const operationHistory = loadHistory();


app.use(express.urlencoded({ extended: true }));

const performOperation = (num1, operator, num2) => {
    switch (operator) {
        case 'plus':
            return num1 + num2;
        case 'minus':
            return num1 - num2;
        case 'into':
            return num1 * num2;
        case 'divide':
            return num1 / num2;
        default:
            throw new Error('Invalid operator.');
    }
};
function saveHistory() {
    fs.writeFileSync('operation-history.json', JSON.stringify(operationHistory));
}

function loadHistory() {
    try {
        const data = fs.readFileSync('operation-history.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

app.get('/:num1/:operator/:num2', (req, res) => {
    const num1 = parseFloat(req.params.num1);
    const operator = req.params.operator;
    const num2 = parseFloat(req.params.num2);

    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).send('Invalid numbers.');
    }

    try {
        const result = performOperation(num1, operator, num2);
        const expression = `${num1} ${operator} ${num2}`;
        const response = { expression, result };

        operationHistory.push(response);

        if (operationHistory.length > 20) {
            operationHistory.shift();
        }

        res.json(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
    saveHistory();
    res.json(response);
});
// Route to get the history of operations
app.get('/history', (req, res) => {
    res.json(operationHistory);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});