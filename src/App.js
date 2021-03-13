import './App.css';
import { useState } from 'react';
function App() {

  // initialize state to track line one syllable count, with a maximum set to 5 syllables
    const [line1Count, setLine1Count] = useState(5);
  //initialize state to make a dynamic api call based on userInput
    const [wordsLine1, setWordsLine1] = useState('');

    const [suggestedSellection, setSuggestedSellection] = useState([]);

    //whenever user types a single letter it triggers the api call below and provides 10 suggestions
    const handleChange = event => {
      //targets what the user types
      setWordsLine1(event.target.value);
        
        fetch(`http://api.datamuse.com/sug?s=${wordsLine1}&max=10`)
        .then(response => response.json())
        .then(jsonResponse => {
          setSuggestedSellection(jsonResponse);
          console.log(suggestedSellection);
        }
          )
    }
    const handleClick = (sellectedWord) => {

    }

  return (
    <div className="App">
      <h1>Haikus Highway</h1>
      <form action="">
          <label htmlFor="userWord"></label>
          <input type="text" id="userWord" value={wordsLine1} onChange={handleChange}/>
          {
            suggestedSellection.map((seperateWord)=>{
              return(
            <button key={seperateWord.score} onClick={()=>handleClick(seperateWord.word)}>{seperateWord.word}</button>)
            })
          }
      </form>
    </div>
  );
}

export default App;
