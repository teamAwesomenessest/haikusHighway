import firebase from './firebase';
import { useState, useEffect } from 'react';

const HaikuCollection = () => {
    // create a state to hold haiku collection retrieved from the database
    const [haikuCollection, setHaikuCollection] = useState([]);

    useEffect(() => {
        // create a variable that holds a reference to our database
        const dbRef = firebase.database().ref();
        // add an event listener to that variable that will fire every time there is a change in the database.
        dbRef.on('value', response => {
            // store database object in a variable
            const data = response.val();
            // create an array to store haiku that will be used to update haikuCollection state
            const collection = [];
            //data is an object, so we iterate through it using a for in loop to access each haiku name 
            for (let haiku in data) {
                collection.push(data[haiku]);
            }
            // update haikuCollection state
            setHaikuCollection(collection);
        })
    }, [])

    console.log(haikuCollection)

    return (
        <section>
            <h2>Haiku Collection</h2>
            {
                haikuCollection.map((haiku, index) => {
                    return <p key={index}>{haiku}</p>
                })
            }
        </section>
    )
}

export default HaikuCollection;