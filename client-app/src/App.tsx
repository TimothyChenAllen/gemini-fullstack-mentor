import { useState } from 'react';

export default function App() {
  const [faveLanguage, setFaveLanguage] = useState('');

  return(
    <>
      <h1>Favorite Language: {faveLanguage}</h1>
      <input
        value = {faveLanguage}
        onChange = { e => setFaveLanguage(e.target.value) }
      />
    </>
  );
}
