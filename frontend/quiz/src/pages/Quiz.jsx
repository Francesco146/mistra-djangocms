import { useEffect, useState } from 'react';
import { fetchTest, submitTestExecution } from '../api';

function Quiz({ testId }) {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [age, setAge] = useState('');
  const [sex, setSex] = useState(''); // sarà l'ID del sex scelto
  const [sexOptions, setSexOptions] = useState([]);

  useEffect(() => {
    fetchTest(testId).then(setTest);
    fetch('/api/sex/') // Assicurati che esista questo endpoint
      .then((res) => res.json())
      .then(setSexOptions);
  }, [testId]);

  function handleAnswerChange(questionId, answerId) {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  }

  function handleSubmit() {
    const score = Object.values(answers).length; // logica semplificata

    const payload = {
      test: test.id,
      age: Number(age),
      sex: sex || null,
      score: score,
      duration: 2,
      IP: '127.0.0.1',
    };

    submitTestExecution(payload)
      .then(() => alert('Test inviato con successo!'))
      .catch((err) => console.error(err));
  }

  if (!test) return <div>Caricamento test...</div>;

  return (
    <div>
      <h1>{test.name}</h1>
      <p>{test.description}</p>

      <div>
        <label>Età:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
        <label>Sesso:
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="">Seleziona</option>
            {sexOptions.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>

      {test.questions.map((q) => (
        <div key={q.id}>
          <h3>{q.text}</h3>
          {q.answers.map((a) => (
            <label key={a.id}>
              <input
                type="radio"
                name={`question-${q.id}`}
                value={a.id}
                checked={answers[q.id] === a.id}
                onChange={() => handleAnswerChange(q.id, a.id)}
              />
              {a.text}
            </label>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>Invia test</button>
    </div>
  );
}
