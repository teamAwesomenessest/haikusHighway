import { useState, useEffect } from 'react';
import './styles/App.scss';
import firebase from './firebase';

//component imports
import Instructions from './Instructions';
import HaikuCollection from './HaikuCollection';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//image imports
import headerImg from '././assets/header.svg' //h1 sign
import backgroundImg from '././assets/road.svg' //road background - desktop
import backgroundImgMobile from '././assets/roadMobile.svg' //road background - mobile
import footerImg from '././assets/footer.svg' //footer arrows

function App() {

  // initialize state to track line one syllable count, with a maximum set to 5 syllables
  const [syllableCount, setSyllableCount] = useState(5);

  //initialize state to make a dynamic api call based on userInput
  const [userInput, setUserInput] = useState('');

  // error message variable
  const [isUserError, setIsUserError] = useState(false);

  //create a state to hold user`s word for line 1
  const [wordLines, setWordLines] = useState(['', '', '']);

  //create a state to represent a current line a user selects words for
  const [currentLine, setCurrentLine] = useState(0);

  //a state to store the selection retrieved from api based on userInput
  const [suggestedSelection, setSuggestedSelection] = useState([]);

  const [haikuCompleted, setHaikuCompleted] = useState(false)

  const [selectedWord, setSelectedWord] = useState('');

  //dictates opening and closing of instructions modal
  const [openInstructions, setOpenInstructions] = useState(false);

    let countSyllables = (sepWordModified) => {
        sepWordModified = sepWordModified.toLowerCase();
        if (sepWordModified.length <= 3) { return 1; }
        sepWordModified = sepWordModified.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        sepWordModified = sepWordModified.replace(/^y/, '');
        sepWordModified = sepWordModified.match(/[aeiouy]{1,2}/g);

        if (sepWordModified != null) {
          return sepWordModified.length;
        } else {
          return 0
        }

        //return sepWordModified.match(/[aeiouy]{1,2}/g).length;
    }

    //validate alpha characters entered
    let userInvalidChars = (string) => {
        const regExp = new RegExp("[^a-zA-Z'-]");
        const invalidCharMatch = string.match(regExp);
        if (invalidCharMatch != null) {
            return invalidCharMatch.length;
        } else {
            return 0
        }
    };

  //whenever user types a single letter it triggers the api call below and provides 10 suggestions
  const handleChange = event => {
    //targets what the user types
    const textInput = event.target.value;
    setUserInput(textInput);
    setSuggestedSelection([]); //clear previous options

    userInvalidChars(textInput);
      
    //if invalid characters found or deletion resulting in empty input, show error, else perform API call
      if (userInvalidChars(textInput) > 0 || textInput === '' || countSyllables(textInput) > syllableCount) {
      setIsUserError(true);
      setSuggestedSelection([]); //ensures reset on backspace
    } else {
      setIsUserError(false);
      fetch(`https://api.datamuse.com/sug?s=${userInput}&max=10`)
      .then(response => response.json())
      .then(jsonResponse => {
          let wordFound = false;
          const filteredSelection = jsonResponse.filter(filteredWord => {
              if (filteredWord.word === textInput) {
                  wordFound = true;
              } 
              
              return countSyllables(filteredWord.word) <= syllableCount && userInvalidChars(filteredWord.word) === 0
          })

            if (!wordFound) {
                const userObject = {
                    word: textInput.toLowerCase()
                }
                filteredSelection.push(userObject);
            }
        setSuggestedSelection(filteredSelection);
      })
    }
  }

  // when a user click on a button (chooses a word), it calls a handleClick function
  // handleClick prevents default button behavior (refreshing)

  const handleClick = (event, separateWord) => {
    event.preventDefault();
    const count = syllableCount - countSyllables(separateWord);
    setSyllableCount(count);

    setSelectedWord(separateWord);

    // handleClick stores a value of the chosen word in wordLines state so it can be displayed on the page later on
    // updating wordLines state

    const line = [...wordLines]
    line[currentLine] = `${line[currentLine]} ${separateWord}`;
    setWordLines(line);
    
    if (count === 0 && currentLine < 2) {
        const updatedCurrentLine = currentLine + 1;
        setCurrentLine(prevState => prevState + 1);
        setSyllableCount(7);

        if (updatedCurrentLine === 2) {
            setSyllableCount(5);
        } 
    } 
    // clearing suggestedSelection
    setSuggestedSelection([]);

   
    setUserInput('');
  }

  //use useEffect hook to get filtered selection when line1Count changes and limits number of syllables in remaining words.
useEffect(() => {
        //second api using initial user input that was submitted that was used for the first api call

        if (currentLine === 2 && syllableCount === 0) {
            setHaikuCompleted(true);
        } else {
            fetch(`https://api.datamuse.com/words?lc=${selectedWord}&md=s&max=10`)
                .then(response => response.json())
                .then(jsonResponse => {
                    const filteredSelection = jsonResponse.filter(filteredWord => {
                        return filteredWord.numSyllables <= syllableCount && userInvalidChars(filteredWord.word) === 0
                    })
                    setSuggestedSelection(filteredSelection);
                })
            
        }

}, [syllableCount, currentLine, selectedWord])

    // handleResetClick resets all the states on the page to their initial value so a user can start writing haikus over again
    const handleResetClick = () => {
         setSyllableCount(5);
         setUserInput('');
         setIsUserError(false);
         setWordLines(['', '', '']);
         setCurrentLine(0);
         setHaikuCompleted(false);
         setSuggestedSelection([]);
         setSelectedWord('');
    }

    // handleAddHaiku pushes user created haiku to firebase database where it will be stored
    // it will later be displayed in Haiku Collection component 
    const handleAddHaiku = (event) => {
        event.preventDefault();
        // we create a reference to our database
        const dbRef = firebase.database().ref();
        dbRef.push(wordLines)

        handleResetClick();
    }

  return (
    <Router>
    <div className="background wrapper">
        <img src={backgroundImg} className="backgroundImg" alt="winding highway road background" aria-hidden="true" />
        <img src={backgroundImgMobile} className="backgroundImgMobile" alt="winding highway road background" aria-hidden="true" />
        <header>
          <img src={headerImg} className="headerImg" aria-hidden="true" alt="instructions sign which will show haiku building instructions on click" />
          <h1 className="visuallyHidden">Haikus Highway</h1>
          <nav>
            <ul>
              <li className="sign instructions">
                <div>
                  <button aria-label="Click to see instructions" onClick={() => { setOpenInstructions(true) }}>Instructions</button>
                  <span className="signPole"></span>
                </div>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          { //instructions modal mounted on click of instructions button
            openInstructions
              ? <Instructions openInstructionsFn={setOpenInstructions}/>
              : null
          }
          {/* input form */
              haikuCompleted
              ? <button onClick={event => handleAddHaiku(event)}>Add Haiku</button>
              : <section className="wordInputSection">
                    <form action="#" className="wordInputForm"><h2>Let's build a Haiku!</h2>
                        <label htmlFor="wordInput">
                        { selectedWord 
                        ? `You have ${syllableCount} ${syllableCount > 1 ? "syllables" : "syllable"} remaining to complete your ${currentLine === 0 ? "first" : currentLine === 1 ? "second" : "third"} line. Choose from the suggested words below, or enter your own.`
                          : `Enter a word for the ${currentLine === 0 ? "first" : currentLine === 1 ? "second" : "third"} line`
                        }
                        
                        </label>

                        {/* show error message if invalid characters entered */
                            isUserError ? <p className="errorMessage">Please enter a single word without any punctuation or spaces.</p> : null
                        }

                        <input type="text" name="wordInput" id="wordInput" placeholder="welcome" value={userInput} onChange={handleChange} />
                        {
                            //runs twice: 
                            //1. based on change of userInput 
                            //2. runs based off the button click when the user selects their word from the selection and makes second api call
                            suggestedSelection.map((separateWord, index) => {
                                return (
                                    <button className="wordButton" key={index} onClick={(event) => handleClick(event, separateWord.word)}>  {separateWord.word} </button>)
                            })
                        }
                    </form>
                </section>
              
          }
          {/* constructed haiku */}
          {wordLines[0] 
            ? <section>
                <div className="progressSection">
                  <h3>Your Haiku in Progress...</h3>
                  <div>
                  {/* display user`s selected words for line one here */}
                    <p>{wordLines[0]}</p>
                    <p>{wordLines[1]}</p>
                    <p>{wordLines[2]}</p>
                  </div>
                </div>
                {/* <img src={resetImg} className="resetImg" onClick={handleResetClick} aria-hidden="true" alt="reset sign which will reset the haiku in progress on click" /> */}
                <div className="sign reset">
                  <div>
                    <button aria-label="Click to reset Haiku" onClick={handleResetClick}>Reset</button>
                    <span className="signPole"></span>
                  </div>
                </div>
              </section>
            : null
          }
          <Route path="/collection" component={HaikuCollection}/>
        </main>
      </div>

      <footer>
        <div className="wrapper">
          <img src={footerImg} className="footerImgLeft" alt="arrows" aria-hidden="true" />
          <div>
            <p>Created at <span><a href="https://www.junocollege.com/" target="_blank" rel="noreferrer">Juno College</a></span></p>
            <p>Made by Rebecca MacDonald, Anton Montrezor, Sarah Pilato, Jaime Robbins</p>
          </div>
          <img src={footerImg} className="footerImgRight" alt="arrows" aria-hidden="true" />
        </div>
      </footer>

    </Router>
  )
}
export default App;
