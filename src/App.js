import './App.css';
import { useState } from 'react';
function App() {

  // initialize state to track line one syllable count, with a maximum set to 5 syllables
    const [line1Count, setLine1Count] = useState(5);
  //initialize state to make a dynamic api call based on userInput
    const [userInput, setUserInput] = useState('');

    //create a state to hold user`s word for line 1
    const [wordsLine1, setWordsLine1] = useState('');

    const [suggestedSelection, setSuggestedSelection] = useState([]);

    //whenever user types a single letter it triggers the api call below and provides 10 suggestions
    const handleChange = event => {
      //targets what the user types
      setUserInput(event.target.value);
        
        fetch(`http://api.datamuse.com/sug?s=${userInput}&max=10`)
        .then(response => response.json())
        .then(jsonResponse => {
          setSuggestedSelection(jsonResponse);
          console.log(suggestedSelection);
        })
    }

    // when a user click on a button (chooses a word), it calls a handleClick function
    // handleClick prevents default button behavior (refreshing)
    

    const handleClick = (event, separateWord) => {
        event.preventDefault();
        console.log(separateWord);

        // handleClick stores a value of the chosen word in wordsLine1 state so it can be displayed on the page later on
        // updating wordsLine1 state
        setWordsLine1(separateWord);

        // clearing suggestedSelection
        setSuggestedSelection([]);

        fetch(`http://api.datamuse.com/words?lc=${userInput}&md=s&max=10`)
            .then(response => response.json())
            .then(jsonResponse => {
                setSuggestedSelection(jsonResponse);
                console.log(suggestedSelection);
            })

        // clearing out the input
        setUserInput('');


    }

    console.log(wordsLine1);

  return (
    <div className="App">
      <h1>Haikus Highway</h1>
      <form action="">
          <label htmlFor="userWord"></label>
          <input type="text" id="userWord" value={userInput} onChange={handleChange}/>
          {
            suggestedSelection.map((separateWord)=>{
              return(
                  <button key={separateWord.score} onClick={(event) => handleClick(event, separateWord.word)}>{separateWord.word}</button>)
            })
          }
      </form>
      {/* display user`s selected words for line one here */}
      <p>{wordsLine1}</p>
    </div>
  );
}

export default App;
