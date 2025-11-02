var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require("./routes/users")

let SalesMan = require("./public/javascripts/SalesMan");
let SocialPerformanceRecord = require("./public/javascripts/SocialPerformanceRecord");

const app = express();
app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// Hard-coded sample data
const salesmen = [
    new SalesMan('John', 'Doe', 'German', 'Berlin', 1, 'M', '1990-01-01'),
    new SalesMan('Jane', 'Smith', 'US', 'New York', 2, 'F', '1992-05-10')
];

// Add a sample SocialPerformanceRecord to John Doe
salesmen[0].addPerformanceRecord(new SocialPerformanceRecord(2024, [8,7,9,8,10,9,7,8,6,7,9,10]));


// Create a new salesman
app.post('/salesmen', (req, res) => {
    const { firstName, lastName, nationality, address, employeeId, gender, dateOfBirth } = req.body;
    const newSalesman = new SalesMan(firstName, lastName, nationality, address, employeeId, gender, dateOfBirth);
    salesmen.push(newSalesman);
    res.status(201).json(newSalesman);
});

// Get all salesmen
app.get('/salesmen', (req, res) => {
    res.json(salesmen);
});

// Get salesman by employee_id
app.get('/salesmen/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = salesmen.findIndex(s => s.employeeId === id);
    if (index === -1) return res.status(404).json({ error: 'Salesman not found' });
    res.json(salesmen[index]);
});

// Delete a salesman by ID
app.delete('/salesmen/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = salesmen.findIndex(s => s.employeeId === id);
    if (index === -1) return res.status(404).json({ error: 'Salesman not found' });
    salesmen.splice(index, 1);          // opposite of push()
    res.sendStatus(204);
});

// --- Performance Records endpoints ---

// Add a performance record for a salesman
app.post('/salesmen/:id/performanceRecords', (req, res) => {
    const id = parseInt(req.params.id);
    const salesman = salesmen.find(s => s.employeeId === id);
    if (!salesman) return res.status(404).json({ error: 'Salesman not found' });

    const { year, scores } = req.body;
    const existing = salesman.getPerformanceRecords().find(r => r.year === year);
    if (existing) return res.status(400).json({ error: `Performance record for year ${year} already exists` });

    const record = new SocialPerformanceRecord(year, scores);
    salesman.addPerformanceRecord(record);
    res.status(201).json(record);
});

// Get all performance records for a salesman
app.get('/salesmen/:id/performanceRecords', (req, res) => {
    const id = parseInt(req.params.id);
    const salesman = salesmen.find(s => s.employeeId === id);
    if (!salesman) return res.status(404).json({ error: 'Salesman not found' });
    res.json(salesman.getPerformanceRecords());
});

// Delete a performance record by year
app.delete('/salesmen/:id/performanceRecords/:year', (req, res) => {
    const id = parseInt(req.params.id);
    const year = parseInt(req.params.year);
    const salesman = salesmen.find(s => s.employeeId === id);
    if (!salesman) return res.status(404).json({ error: 'Salesman not found' });

    const newRecords = salesman.performanceRecords.filter(r => r.year !== year);
    salesman.performanceRecords = newRecords;
    res.sendStatus(204);
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

module.exports = app;
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});