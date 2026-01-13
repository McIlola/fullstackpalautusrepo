require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');
const path = require('path')

app.use(express.json());
app.use(cors());
app.use(express.static('dist'))

morgan.token('body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const url = process.env.MONGODB_URI;
mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error.message));

/* let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]; */

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const time = new Date();
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${time}</p>
      `);
    })
    .catch(error => next(error));
});

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }
      response.json(person);
    })
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });
  newPerson.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number} = request.body;
  const updatedPerson = {name, number};

  Person.findByIdAndUpdate(
    request.params.id,
    {name, number},
    {new: true, runValidators: true, context: 'query'}
  )
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))

});
app.get(/.*/, (request, response) => {
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

app.use((error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
