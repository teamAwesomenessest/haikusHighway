import './styles/App.scss';
import { FiCheck } from 'react-icons/fi'; //checkmark icon
import headerImg from '././assets/header.svg' //h1 sign
import backgroundImg from '././assets/road.svg' //road background
import instructionsImg from '././assets/instructions.svg' //road background

function App() {
  return (
    <>
    <div className="background wrapper">
        <img src={backgroundImg} className="backgroundImg" aria-hidden="true" />
        <header>
          <img src={ headerImg } className="headerImg" aria-hidden="true" />
          <h1 className="visuallyHidden">Haikus Highway</h1>
          <nav>
            <ul>
              <li aria-label="Instructions"><img src={instructionsImg} className="instructionsImg" aria-hidden="true" /></li>
            </ul>
          </nav>
        </header>

        <main>
          {/* input form */}
          <section className="wordInputSection">
            <form action="#" className="wordInputForm"><h2>Let's build a Haiku!</h2>
              <label htmlFor="wordInput">Enter a word for the first line:</label>
              <input type="text" name="wordInput" id="wordInput" placeholder="welcome"/>
            </form>
            <form action="#" className="wordSelectionForm">
              <h3>Choose one:</h3>
              <fieldset>
                <div className="wordButton">
                  <input type="radio" id="1" name="suggestedWord" value="hello" />
                  <label htmlFor="1"><FiCheck className="checkmark" aria-hidden="true"/>hello</label>
                </div>
                <div className="wordButton">
                  <input type="radio" id="2" name="suggestedWord" value="helloing" />
                  <label htmlFor="2"><FiCheck className="checkmark" aria-hidden="true" />helloing</label>
                </div>
                <div className="wordButton">
                  <input type="radio" id="3" name="suggestedWord" value="helloing2" />
                  <label htmlFor="3"><FiCheck className="checkmark" aria-hidden="true" />helloing</label>
                </div>
                <div className="wordButton">
                  <input type="radio" id="4" name="suggestedWord" value="helloing3" />
                  <label htmlFor="4"><FiCheck className="checkmark" aria-hidden="true" />helloing</label>
                </div>
                <div className="wordButton">
                  <input type="radio" id="5" name="suggestedWord" value="helloing4" />
                  <label htmlFor="5"><FiCheck className="checkmark" aria-hidden="true" />helloing</label>
                </div>
                <div className="wordButton">
                  <input type="radio" id="6" name="suggestedWord" value="helloing5" />
                  <label htmlFor="6"><FiCheck className="checkmark" aria-hidden="true" />helloing</label>
                </div>
                <div className="wordButton">
                  <input type="radio" id="7" name="suggestedWord" value="helloing6" />
                  <label htmlFor="7"><FiCheck className="checkmark" aria-hidden="true" />helloing</label>
                </div>
                <div className="wordButton">
                  <input type="radio" id="8" name="suggestedWord" value="helloing7" />
                  <label htmlFor="8"><FiCheck className="checkmark" aria-hidden="true" />helloing</label>
                </div>
                <div className="wordButton">
                  <input type="radio" id="9" name="suggestedWord" value="helloing8" />
                  <label htmlFor="9"><FiCheck className="checkmark" aria-hidden="true" />helloing</label>
                </div>
                <div className="wordButton">
                  <input type="radio" id="10" name="suggestedWord" value="helloing9" />
                  <label htmlFor="10"><FiCheck className="checkmark" aria-hidden="true" />helloing</label>
                </div>
              </fieldset>
            </form>
          </section>

          {/* constructed haiku */}
          <section className="progressSection">
            <h3>Your Haiku in Progress...</h3>
            <div>
              <p>Lorem ipsum dolor sit amet</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing</p>
              <p>Lorem ipsum dolor sit amet</p>
            </div>
          </section>
        </main>
      </div>

      <footer>
        <div className="wrapper">
          <p>Created at <a href="www.junocollege.com">Juno College</a></p>
          <p>Made by ....</p>
        </div>
      </footer>

    </>
  );
}

export default App;
