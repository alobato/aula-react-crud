import React, { useState, useEffect } from 'react'

const App = () => {

  const initialUserData = {
    name: '',
    email: '',
    age: '',
    gender: ''
  }

  const [userFormData, setUserFormData] = useState(initialUserData)
  const [ageFrom, setAgeFrom] = useState('')
  const [ageTo, setAgeTo] = useState('')
  const [gender, setGender] = useState('M')
  const [users, setUsers] = useState([])

  const getUsers = async () => {
    const response = await fetch('http://localhost:8000/users')
    const data = await response.json()
    setUsers(data.users)
  }

  useEffect(() => {
    getUsers()
  }, [])

  const filteredUsers = (users, gender, ageFrom, ageTo) => {    

    return users.filter(user => {
      let condition = true

      if (gender) {
        condition = user.gender === gender
      }

      if (ageFrom && ageTo) {
        condition = user.age >= Number(ageFrom) && user.age <= Number(ageTo)
      }

      return condition
    })

  }

  const handleChangeGender = (event) => {
    setGender(event.target.value)
  }

  const handleChangeAgeFrom = (event) => {
    setAgeFrom(event.target.value)
  }

  const handleChangeAgeTo = (event) => {
    setAgeTo(event.target.value)
  }

  const handleChangeUserFormData = event => {
    setUserFormData({...userFormData, [event.target.name]: event.target.value})
  }

  const handleSubmitForm = async (event) => {
    event.preventDefault()

    const user = {
      user: userFormData
    }

    const response = await fetch('http://localhost:8000/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) })
    const data = await response.json()

    if (data.user) alert('Salvo com sucesso')

    setUserFormData(initialUserData)

    getUsers()

  }

  return (
    <div>

      <div>
        Sexo:
        <select value={gender} onChange={handleChangeGender}>
          <option></option>
          <option>M</option>
          <option>F</option>
        </select>
      </div>

      <div>
        Idade de: <input value={ageFrom} onChange={handleChangeAgeFrom} />
        
      </div>

      <div>
        Idade até: <input value={ageTo} onChange={handleChangeAgeTo} />
      </div>

      <table style={{border: '1px solid black'}}>
        <tbody>
          <tr>
            <th>Nome</th> 
            <th>Email</th>
            <th>Sexo</th>
            <th>Idade</th>
          </tr>

          {filteredUsers(users, gender, ageFrom, ageTo).map(user => (
            <tr key={user.id}>
              <td style={{border: '1px solid black'}}>{user.name}</td>
              <td style={{border: '1px solid black'}}>{user.email}</td>
              <td style={{border: '1px solid black'}}>{user.gender}</td>
              <td style={{border: '1px solid black'}}>{user.age}</td>
            </tr>
          ))}

        </tbody>
      </table>

      <br /><br />
      <form onSubmit={handleSubmitForm}>
        <input placeholder='Nome' name='name' value={userFormData.name} onChange={handleChangeUserFormData} />
        <br />
        <input placeholder='Email' name='email' value={userFormData.email} onChange={handleChangeUserFormData} />
        <br />
        <input placeholder='Idade' name='age' value={userFormData.age} onChange={handleChangeUserFormData} />
        <br />
        <select name='gender' value={userFormData.gender} onChange={handleChangeUserFormData}>
          <option></option>
          <option>M</option>
          <option>F</option>
        </select>
        <br />
        <button type='submit'>Salvar</button>
      </form>

    </div>
  )
}

export default App
