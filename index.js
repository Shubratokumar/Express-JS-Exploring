const express = require('express');
const app = express();
const port = process.env.PORT || 3000 ;

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
})

// Route Parameters
app.get('/api/courses/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if(!course) res.status(404).send("The course you finding with the given ID was not found.")
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
