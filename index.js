const express = require('express');
const app = express();
const port = process.env.PORT || 3000 ;
app.get('/', (req, res) =>{
    res.send("Hello World !!! Can you here me ?")
});

app.get('/api/courses', (req, res) => {
    res.send([1,2,3,4,5,6,7,8,9])
})

// Route Parameters
app.get('/api/courses/:id', (req, res)=>{
    res.send(req.params.id)
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
