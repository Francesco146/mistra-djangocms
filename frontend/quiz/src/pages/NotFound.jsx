import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-gray-100 p-4">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Pagina non trovata</h2>
      <p className="mt-2 text-gray-600">La pagina che stai cercando non esiste.</p>
      <Link to="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Torna alla Home
      </Link>
    </div>
  )
}

export default NotFound
