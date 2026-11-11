const express = require('express')
const morgan = require('morgan')

const app = express()

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

let persons = [
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
  response.json(persons)
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

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter((p) => p.id !== request.params.id)
  response.status(204).end()
})

const generateId = () => String(Math.floor(Math.random() * 1_000_000_000))

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body || !body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  if (persons.some((p) => p.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
