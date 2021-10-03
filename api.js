const express = require('express');
const Joi = require('joi');

const PORT = 3000;

const app = express();
app.use(express.json());

const people = [
    { id: 1, name: "Daniel", age: 32 },
    { id: 2, name: "Emily", age: 45 },
    { id: 3, name: "Marko", age: 23 }
];

app.get('/', (req, res) => {
    res.send('Howya!');
});

app.get('/api/people', (req, res) => {
    res.send(people);
});

app.post('/api/people', (req, res) => {

    const { error } = validatePerson(req.body);
 
    if(error) return res.status(400).send(error.details.message);
        
    const person = {
        id: people.length + 1,
        name: req.body.name,
        age: Math.random()*80
    }
    people.push(person);
    res.send(person);
});

app.put('/api/people/:id', (req,res) => {
    const person = people.find(p => p.id === parseInt(req.params.id));
    if (!person) return res.status(404).send('No person corresponding to given id'); 

    const { error } = validatePerson(req.body);
    if (error) return res.status(400).send(error.details.message);

    person.name = req.body.name;
    res.send(person);
})

app.get('/api/people/:id', (req,res) => {
    const person = people.find(p => p.id === parseInt(req.params.id));
    if (!person) return res.status(404).send('No person corresponding to given id');

    res.send(person);
})

function validatePerson(person){
    const schema = {
        name: Joi.string().min(3).required()
    }

    return(Joi.validate(person, schema));
}

app.delete('/api/people/:id', (req,res) => {
    const person = people.find(p => p.id === parseInt(req.params.id));
    if(!person) return res.status(404).send('No person corresponding to given id');

    const index = people.indexOf(person);
    people.splice(index);

    res.send(person);
});

const port = process.env.PORT || PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));