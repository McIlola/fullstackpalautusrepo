const Persons = ({ showPerson, handleDelete }) => (
  <ul>
    {showPerson.map((person, i) => 
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
      </li>
    )}
  </ul>
)

export default Persons