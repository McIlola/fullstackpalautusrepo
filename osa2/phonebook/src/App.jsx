import { useState, useEffect } from 'react'
import personservice from './persons'
import Notification from './components/notification'
import Filter from './components/filter'
import PersonForm from './components/personform'
import Persons from './components/person'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [newMessage, setMessage] = useState(null)

  useEffect(() => {
    personservice
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.find(person => person.name === newName)
    
    if (nameExists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      ){
      const updatePerson = { ...nameExists, number: newNumber }
      personservice
        .update(nameExists.id, updatePerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== nameExists.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage({ text: `Updated ${returnedPerson.name} number`, isError: false })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage({ text: `Information of ${nameExists.name} has already been removed from server`, isError: true})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== nameExists.id))
        })
      }
    } else {
    const personObject = { 
      name: newName, 
      number: newNumber
    }
    personservice
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMessage({ text: `Added ${returnedPerson.name}`, isError: false })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    }
  }

  const showPerson = persons.filter(person =>
    person.name.toLowerCase().includes(filterName.toLowerCase())
  )

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personservice
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setMessage({ text: `${name} has been deleted`, isError: false })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }
  
  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={newMessage} isError={newMessage?.isError}/>

      <Filter value={filterName} onChange={(event) => setFilterName(event.target.value)}/>
      
      <h3>Add a new</h3>

      <PersonForm 
        onSubmit={addPerson} 
        newName={newName}
        handleNameChange={(event) => setNewName(event.target.value)}
        newNumber={newNumber}
        handleNumberChange={(event) => setNewNumber(event.target.value)}
      />

      <h3>Numbers</h3>
      
      <Persons showPerson={showPerson} handleDelete={handleDelete}/>
    </div>
  )
}

export default App