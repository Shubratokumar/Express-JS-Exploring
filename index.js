const express = require('express');
const Joi = require('joi');
const helmet = require("helmet");
const morgan = require("morgan");
const config = require('config');
const debug = require('debug')('app:startup');
// const startupDebugger = require('debug')('app:startup');
// const dbDebugger = require('debug')('app:db');
const logger = require('./Logger');
const authenticate = require('./Authentication') 
const app = express();
const port = process.env.PORT || 3000 ;


// template engines
app.set('view engine', 'pug');
app.set('views', './views'); // default


// Environment(current)
/* console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`) */


// Build-in Middlewares
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended : true })); // key=value&key=value
app.use(express.static('public'))  // for html css txt files. with the help of the middleware we can serve the static files.

// Third party Middlewares
app.use(helmet());

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
// console.log('Mail Password: ' + config.get('mail.password'));

// Knowing Environment
if( app.get('env') === 'development'){
    app.use(morgan("tiny"));
    debug("Morgan enabled ...")
}
/* // DB work
dbDebugger('Connected to the Database...') */

// middleware
app.use(logger);
app.use(authenticate);

const courses = [
    { id: 1, name: "course1"},
    { id: 2, name: "course2"},
    { id: 3, name: "course3"},
    { id: 4, name: "course4"},
    { id: 5, name: "course5"},
    { id: 6, name: "course6"},
]

app.get('/', (req, res) =>{
    res.render('index', { title: "My Express App", message: "Hello"});
});

app.get('/api/courses', (req, res) => {
    res.send(courses)
});

// POST API
app.post('/api/courses', (req, res)=>{
    // input validation
    /* const {error} = validateCourse(req.body);

    if(error) return  res.status(400).send(error.details[0].message); */

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

// PUT api
app.put('/api/courses/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if(!course) return res.status(404).send("The course you finding with the given ID was not found.");

    const {error} = validateCourse(req.body);

    if(error) return  res.status(400).send(error.details[0].message)
    // Update Course
    course.name = req.body.name;
    res.send(course);
})

function validateCourse (course){
    const schema = {
        name : Joi.string().min(3).required()
    };
    return Joi.string().validate(course, schema);
}

// Delete api
app.delete('/api/courses/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if(!course) return res.status(404).send("The course you finding with the given ID was not found.");

    // Delete 
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})

// Route Parameters
app.get('/api/courses/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if(!course) return res.status(404).send("The course you finding with the given ID was not found.")
    res.status(200).send(course);
})

// Multiple Route Parameters
app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
}) 
// Query Parameters
app.get('/api/post/:year/:month', (req, res) => { // "/api/posts/:year/:month?sortBy=name"
    res.send(req.query);
}) 
app.listen(port, () => {
    console.log(`My express server is running on port ${port}.`)
})
