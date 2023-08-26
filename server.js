const express = require("express");
const app = express();
const fs = require('fs');
const math = require('mathjs');

const operationHistory = loadHistory();


app.use(express.urlencoded({ extended: true }));

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

app.get('/history', (req, res) => {
    res.json(operationHistory);
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
    try {
        const result = math.evaluate(exp);
        const response = { exp, result };

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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});