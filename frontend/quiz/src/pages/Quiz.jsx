import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Quiz() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/tests/`)
      .then(res => setTests(res.data))
      .catch(err => console.error("Errore caricamento:", err));
  }, []);

  return (
    <div>
      <h1>Quiz disponibili</h1>
      {tests.map(test => (
        <div key={test.id}>
          <h2>{test.name}</h2>
          <p>{test.description}</p>
          <ul>
            {test.questions.map(q => (
              <li key={q.id}>
                <h4>{q.text}</h4>
                <ul>
                  {q.answers.map(ans => (
                    <li key={ans.id}>{ans.text}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Quiz;
