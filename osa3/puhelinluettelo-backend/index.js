require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())

// 3.8: tiny-formaatti, jonka perään POST-pyyntöjen runko.
// Runko muutetaan JSONiksi suoraan formaattifunktiossa, koska morgan
// escapoi lainausmerkit (\") token-arvoista.
app.use(
  morgan((tokens, request, response) =>
    [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, 'content-length') || '-',
      '-',
      tokens['response-time'](request, response),
      'ms',
      request.method === 'POST' ? JSON.stringify(request.body) : ''
    ].join(' ')
  )
)

// Kovakoodattu lista on vielä reittien /info ja GET /:id käytössä.
// Ne siirretään tietokantaan tehtävässä 3.18.
const persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find((p) => p.id === request.params.id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body || !body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  // 3.14: nimen yksikäsitteisyyttä ei tässä vaiheessa tarkasteta
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// tuntemattomiin osoitteisiin kohdistuvien pyyntöjen käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// virheellisten pyyntöjen käsittely, tämän on oltava viimeinen middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
