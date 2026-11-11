import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const resetForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const updateNumber = (person) => {
    const ok = window.confirm(
      `${person.name} is already added to phonebook, replace the old number with a new one?`
    )
    if (!ok) {
      return
    }

    const changedPerson = { ...person, number: newNumber }

    personService
      .update(person.id, changedPerson)
      .then((returnedPerson) => {
        setPersons(
          persons.map((p) => (p.id === person.id ? returnedPerson : p))
        )
        notify(`Changed number of ${returnedPerson.name}`)
        resetForm()
      })
      .catch(() => {
        notify(
          `Information of ${person.name} has already been removed from server`,
          'error'
        )
        setPersons(persons.filter((p) => p.id !== person.id))
      })
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((person) => person.name === newName)
    if (existingPerson) {
      updateNumber(existingPerson)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson))
      notify(`Added ${returnedPerson.name}`)
      resetForm()
    })
  }

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name} ?`)) {
      return
    }

    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== person.id))
        notify(`Deleted ${person.name}`)
      })
      .catch(() => {
        notify(
          `Information of ${person.name} has already been removed from server`,
          'error'
        )
        setPersons(persons.filter((p) => p.id !== person.id))
      })
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App
