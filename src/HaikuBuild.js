import { useState, useEffect } from 'react';
import firebase from './firebase';

function HaikuBuild() {

    // initialize state to track syllable count
    const [syllableCount, setSyllableCount] = useState(5);

    //initialize state to make a dynamic api call based on userInput
    const [userInput, setUserInput] = useState('');

    //create a state to control error message
    const [isUserError, setIsUserError] = useState(false);

    //create a state to hold user's words
    const [wordLines, setWordLines] = useState(['', '', '']);

    //create a state to represent a current line the user is on
    const [currentLine, setCurrentLine] = useState(0);

    //a state to store the selection retrieved from api based on userInput
    const [suggestedSelection, setSuggestedSelection] = useState([]);

    //a state to store whether a haiku is completed
    const [haikuCompleted, setHaikuCompleted] = useState(false);

    //a state to store selected word
    const [selectedWord, setSelectedWord] = useState('');

    //returns the number of sylables
    let countSyllables = (string) => {
        string = string.toLowerCase();
        if (string.length <= 3) { return 1; }
        string = string.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        string = string.replace(/^y/, '');
        string = string.match(/[aeiouy]{1,2}/g);

        if (string != null) {
            return string.length;
        } else {
            return 0
        }
    }

    //returns the number of invalid characters
    let userInvalidChars = (string) => {
        const regExp = new RegExp("[^a-zA-Z'-]");
        const invalidCharMatch = string.match(regExp);
        if (invalidCharMatch != null) {
            return invalidCharMatch.length;
        } else {
            return 0
        }
    };

    //whenever user types a single letter it triggers the api call below and provides up to 10 suggestions
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
                .catch(() => {
                    alert('Oops, we\'re experiencing technical difficulties, please try again later.');
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
        const line = [...wordLines];
        line[currentLine] = `${line[currentLine]} ${separateWord}`;
        // updating wordLines state
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

    //use useEffect hook to get filtered selection when lineCount changes and limits number of syllables in remaining words
    useEffect(() => {
        //second api using initial user input that was submitted that was used for the first api call
        if (currentLine === 2 && syllableCount === 0) {
            setHaikuCompleted(true);
        } else {
            fetch(`https://api.datamuse.com/words?lc=${selectedWord}&md=s&max=10`)
                .then(response => response.json())
                .then(jsonResponse => {
                    const filteredSelection = jsonResponse.filter(filteredWord => {
                        return filteredWord.numSyllables <= syllableCount && userInvalidChars(filteredWord.word) === 0;
                    })
                    setSuggestedSelection(filteredSelection);
                })
                .catch(() => {
                    alert('Oops, we\'re experiencing technical difficulties, please try again later.');
                })
        }
    }, [syllableCount, currentLine, selectedWord])

    //handleResetClick resets all the states on the page to their initial value so a user can start writing haikus over and over again
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
    // it will later be displayed in the Haiku Collection component 
    const handleAddHaiku = (event) => {
        event.preventDefault();
        // we create a reference to our database
        const dbRef = firebase.database().ref();
        dbRef.push(wordLines)

        handleResetClick();
    }

    return (
        <>
            {/* input form */
                haikuCompleted
                    ? null
                    : <section className="wordInputSection">
                        <form action="#" className="wordInputForm"><h2>Let's build a Haiku!</h2>
                            <label htmlFor="wordInput">
                                {
                                    selectedWord
                                        ? `You have ${syllableCount} ${syllableCount > 1 ? "syllables" : "syllable"} remaining to complete your ${currentLine === 0 ? "first" : currentLine === 1 ? "second" : "third"} line. Choose from the suggested words below, or enter your own.`
                                        : `Enter a word for the ${currentLine === 0 ? "first" : currentLine === 1 ? "second" : "third"} line:`
                                }

                            </label>

                            {/* show error message if invalid characters entered */
                                isUserError ? <p className="errorMessage">Please enter a single word within the remaining syllable count without any punctuation or spaces.</p> : null
                            }

                            <input type="text" name="wordInput" id="wordInput" placeholder="welcome" value={userInput} onChange={handleChange} />
                            {
                                //Triggered: 
                                //1. based on change of userInput 
                                //2. based off the button click when the user selects their word from the selection and makes second api call
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
                    <div className={haikuCompleted ? "progressSection complete" : "progressSection"}>
                        <h3>Your Haiku in Progress...</h3>
                        <div>
                            {/* display user's selected words here */}
                            <p>{wordLines[0]}</p>
                            <p>{wordLines[1]}</p>
                            <p>{wordLines[2]}</p>
                        </div>
                        { //add buton to push to collection on haiku completion
                            haikuCompleted 
                            ? <button className="wordButton submit" onClick={event => handleAddHaiku(event)}>Add Haiku to Collection</button>
                            : null
                        }  
                    </div>
                    <div className="sign reset">
                        <div>
                            <button aria-label="Click to reset Haiku" onClick={handleResetClick}>Reset</button>
                            <span className="signPole"></span>
                        </div>
                    </div>
                </section>
                : null
            }
        </>
    )
}

export default HaikuBuild;
