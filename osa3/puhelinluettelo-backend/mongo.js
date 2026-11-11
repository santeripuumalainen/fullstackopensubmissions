const mongoose = require('mongoose')

// Käyttö:
//   node mongo.js <salasana>                  listaa puhelinluettelon
//   node mongo.js <salasana> <nimi> <numero>  lisää uuden henkilön
// Jos nimessä on välilyöntejä, laita se lainausmerkkeihin: "Arto Vihavainen"

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// Salasana tulee komentoriviltä, joten sitä ei tallenneta tähän.
const url = `mongodb+srv://fullstack:${encodeURIComponent(password)}@cluster0.4p7sswg.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const main = async () => {
  await mongoose.connect(url, { family: 4 })

  if (process.argv.length === 3) {
    const persons = await Person.find({})
    console.log('phonebook:')
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
  } else if (process.argv.length === 5) {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4]
    })
    await person.save()
    console.log(`added ${person.name} number ${person.number} to phonebook`)
  } else {
    console.log('usage: node mongo.js <password> [<name> <number>]')
  }

  await mongoose.connection.close()
}

main().catch((error) => {
  console.error('error:', error.message)
  mongoose.connection.close()
  process.exit(1)
})
