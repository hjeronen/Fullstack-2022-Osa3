const { response } = require('express')
const express = require('express')
const { json } = require('express/lib/response')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))
morgan.token('post', function(req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
});

app.use(cors())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    let numbers = persons.length
    let date = new Date()
    let info = '<p>Phonebook has info for ' + numbers + ' people</p>' + '<p>' + date + '</p>'
    res.send(info)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
  
    res.status(204).end()
  })

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'missing name'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'missing number'
        })
    }

    const name = persons.filter(p => p.name === body.name)
    if (name.length !== 0) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 100),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})