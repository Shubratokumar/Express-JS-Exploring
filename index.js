const express = require('express');
const Joi = require('joi');
const logger = require('./Logger');
const authenticate = require('./Authentication') 
const app = express();
const port = process.env.PORT || 3000 ;

app.use(express.json());

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
    res.send("Hello World !!! Can you here me ?")
});

app.get('/api/courses', (req, res) => {
    res.send(courses)
});

// POST API
app.post('/api/courses', (req, res)=>{
    // input validation
    const {error} = validateCourse(req.body);

    if(error) return  res.status(400).send(error.details[0].message);

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
