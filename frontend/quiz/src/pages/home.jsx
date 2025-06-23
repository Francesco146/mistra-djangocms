import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [tests, setTests] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/tests/') 
      .then(res => res.json())
      .then(data => setTests(data))
      .catch(err => console.error('Errore nel fetch dei test:', err))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Elenco Quiz Disponibili</h1>
      <ul className="space-y-4">
        {tests.map(test => (
          <li key={test.id} className="border rounded p-4">
            <h2 className="text-xl font-semibold">{test.name}</h2>
            <p className="text-gray-700">{test.description}</p>
            <p className="text-sm text-gray-500">Punteggio minimo richiesto: {test.min_score}</p>
            <Link to={`/quiz/${test.id}`} className="text-blue-600 hover:underline mt-2 inline-block">
              Inizia Quiz
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
