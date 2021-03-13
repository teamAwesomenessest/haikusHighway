import './App.css';
import { useState, useEffect } from 'react';
function App() {

  // initialize state to track line one syllable count, with a maximum set to 5 syllables
  const [line1Count, setLine1Count] = useState(5);
  //initialize state to make a dynamic api call based on userInput
  const [userInput, setUserInput] = useState('');

  //create a state to hold user`s word for line 1
  const [wordsLine1, setWordsLine1] = useState('');

  //a state to store the selection retrieved from api based on userInput
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
    
    let countSyllables = (sepWordModified) => {
    sepWordModified = sepWordModified.toLowerCase();
    if (sepWordModified.length <= 3) { return 1; }
    sepWordModified = sepWordModified.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    sepWordModified = sepWordModified.replace(/^y/, '');
    return sepWordModified.match(/[aeiouy]{1,2}/g).length;
  }

    // countSyllables(separateWord);
    console.log( countSyllables(separateWord));
    setLine1Count(prevState => prevState - countSyllables(separateWord) );
 
    

    // handleClick stores a value of the chosen word in wordsLine1 state so it can be displayed on the page later on
    // updating wordsLine1 state
    setWordsLine1(prevState => `${prevState} ${separateWord}`);

    // clearing suggestedSelection
    setSuggestedSelection([]);

    //second api using initial user input that was submitted that was used for the first api call
    fetch(`http://api.datamuse.com/words?lc=${userInput}&md=s&max=10`)
      .then(response => response.json())
      .then(jsonResponse => {
        const filteredSelection = jsonResponse.filter(filteredWord => {
            return filteredWord.numSyllables <= line1Count;
        })
        console.log(filteredSelection)
        console.log(line1Count)
        setSuggestedSelection(filteredSelection);
        console.log(suggestedSelection);
      })

    // clearing out the input
    setUserInput(separateWord);
  }

  console.log(wordsLine1);
  console.log(line1Count);
  return (
    <div className="App">
      <h1>Haikus Highway</h1>
      <form action="">
        <label htmlFor="userWord"></label>
        {/* make input invisible on click using css*/}
        <input type="text" id="userWord" value={userInput} onChange={handleChange} />
        {
          //runs twice: 
          //1. based on change of userInput 
          //2. runs based off the button click when the user selects their word from the selection and makes second api call
          suggestedSelection.map((separateWord) => {
            return (
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
