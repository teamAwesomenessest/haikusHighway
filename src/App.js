import { useState } from 'react';
import './styles/App.scss';

//component imports
import HaikuBuild from './HaikuBuild';
import HaikuCollection from './HaikuCollection';
import Instructions from './Instructions';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

//image imports
import headerImg from '././assets/headerSign.png' //h1 sign
import backgroundImg from '././assets/road.svg' //road background - desktop
import backgroundImgMobile from '././assets/roadMobile.svg' //road background - mobile
import footerImg from '././assets/footer.svg' //footer arrows

function App() {
    //dictates opening and closing of instructions modal
    const [openInstructions, setOpenInstructions] = useState(false);

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

                            {/* show build sign/link on collection page, show collection on home page */}
                            <li className="sign path">
                                <div>
                                    <Link to="/"><Route exact path="/collection">Build a Haiku</Route></Link>
                                    <Link to="/collection"><Route exact path="/">Haiku Collection</Route></Link>
                                    <span className="signPole"></span>
                                </div>
                            </li>

                            <Route exact path="/">
                                <li className="sign instructions">
                                    <div>
                                        <button aria-label="Click to see instructions" onClick={() => { setOpenInstructions(true) }}>Instructions</button>
                                        <span className="signPole"></span>
                                    </div>
                                </li>
                                { //instructions modal mounted on click of instructions button
                                    openInstructions
                                        ? <Instructions openInstructionsFn={setOpenInstructions} />
                                        : null
                                }
                            </Route>

                        </ul>
                    </nav>
                </header>

                <main>
                    <Route path="/" exact component={HaikuBuild} />
                    <Route path="/collection" exact component={HaikuCollection} />
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
