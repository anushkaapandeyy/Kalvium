const express = require("express");
const app = express();
const fs = require('fs');
const math = require('mathjs');

const operationHistory = loadHistory();


app.use(express.urlencoded({ extended: true }));

const performOperation = (exp) => {
    switch (operator) {
        case 'plus':
            return num1 + num2;
        case 'minus':
            return num1 - num2;
        case 'into':
            return num1 * num2;
        case 'divide':
            return num1 / num2;
        case 'power':
            return math.pow(num1, num2);
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
app.use(express.static(__dirname + '/public'));
app.get('/history-json', (req, res) => {
    // var data = require('./operation-history.json')
    //console.log(data)
    // res.send(operationHistory)
    const history = loadHistory();
    res.json(history);
    //res.sendFile(__dirname + '/public/output.html');

});
//res.sendFile(__dirname + '/public/output.html');
app.use(express.static(__dirname + '/public'));
// Serve the HTML file
app.get('/history', (req, res) => {
    fs.readFile(__dirname + '/public/output.html', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading HTML file.');
        } else {
            res.send(data);
        }
    });
});


app.get('/:first*', (req, res) => {
    console.log(req.params)
    first = req.params.first
    exp = req.params['0']
    exp = first + exp
    exp = exp
        .replace(new RegExp('/', 'g'), '')
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/into/g, '*')
        .replace(/over/g, '/')
        .replace(/power/g, '^')
    try {
        const result = math.evaluate(exp);
        const response = { exp, result };

        operationHistory.push(response);

        if (operationHistory.length > 20) {
            operationHistory.shift();
        }
        saveHistory();
        res.json(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
    // saveHistory();
    //res.json(response);
});
// Route to get the history of operations


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});