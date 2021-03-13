import './App.css';
import { useState } from 'react';
function App() {

    const [line1Count, setLine1Count] = useState(5);
    const [wordsLine1, setWordsLine1] = useState('');

    const handleChange = event => {
        setWordsLine1(event.target.value);
        
        fetch(`http://api.datamuse.com/sug?s=${wordsLine1}&max=10`)
        .then(response => response.json())
        .then(jsonResponse => console.log(jsonResponse))
    }

  return (
    <div className="App">
      <h1>Haikus Highway</h1>
      <form action="">
          <label htmlFor="userWord"></label>
          <input type="text" id="userWord" onChange={handleChange}/>
      </form>
    </div>
  );
}

export default App;
