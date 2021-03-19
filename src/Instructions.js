function Instructions(props) {

    return (
        <section className="modal">
            <div className="modalContent">
                <div>
                    <button className="close" aria-label="close button" onClick={() => { props.openInstructionsFn(false) }}>&times;</button>
                    <h2>What is a Haiku?</h2>
                    <p>A Haiku is a type of short poem that originated in Japan. The poem consists of three lines in a specific pattern - the first line contains 5 syllables, the second line contains 7 syllables and the third and final line is 5 syllables. </p>
                    <h2>An Example Haiku:</h2>
                    <p>“The Old Pond” by Matsuo Bashō</p>
                    <p className="haikuExample">An old silent pond</p>
                    <p className="haikuExample">A frog jumps into the pond—</p>
                    <p className="haikuExample">Splash! Silence again.</p>
                    <h2>How to Write a Haiku:</h2>
                    <ol>
                        <li>Begin by entering the first word of your first line in the text field provided. As you type, some suggested words will appear below; click on your chosen word.</li>
                        <li>Once you have selected a word, you will be provided with a list of words that commonly follow the word you selected. You can either choose from one of these words, or enter a different word in the text field to generate a new list of word suggestions as you type. As you select words, you will notice your remaining syllable count for the line you are completing is displayed. You will only be provided with word suggestions that contain the remaining syllable count. You will be notified if the word you type includes more syllables than what is remaining or if you've entered an invalid character, such as a space or punctuation.</li>
                        <li>Once you have reached the required syllable count for the first line, you will be prompted to write the second line.</li>
                        <li>Repeat the above steps until you have completed all 3 lines.</li>
                        <li>If at any point you would like to start over, click the "Reset" button that will appear beside your Haiku in progress.</li>
                    </ol>
                </div>
            </div>
        </section>
    )
}

export default Instructions;

