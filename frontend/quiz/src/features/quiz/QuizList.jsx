// src/components/QuizList.jsx
import { useEffect, useState } from 'react';

function QuizList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/tests/')
      .then(response => response.json())
      .then(data => {
        setTests(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Errore nel fetch dei test:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Caricamento...</p>;

  return (
    <div>
      <h1>Quiz disponibili</h1>
      <ul>
        {tests.map(test => (
          <li key={test.id}>
            <strong>{test.name}</strong>: {test.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizList;
