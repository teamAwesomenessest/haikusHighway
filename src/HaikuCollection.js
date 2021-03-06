import firebase from './firebase';
import { useState, useEffect } from 'react';

function HaikuCollection() {
    // create a state to hold haiku collection retrieved from the database
    const [haikuCollection, setHaikuCollection] = useState([]);
    // create a variable that holds a reference to our database
    const dbRef = firebase.database().ref();

    useEffect(() => {
        // add an event listener that will fire every time there is a change in the database.
        dbRef.on('value', response => {
            // store database object in a variable
            const data = response.val();
            // create an array to store haiku that will be used to update haikuCollection state
            const collection = [];
            //data is an object, so we iterate over it using a for in loop to access each haiku name 
            for (let key in data) {
                // create an object where each haiku will be stored together with its database unique key and push the object to collection array
                collection.push({key, text: data[key]});
            }
            // update haikuCollection state
            setHaikuCollection(collection);
        })
        //close db connection on unmount
        return () => {
            dbRef.off();
        }
    }, [dbRef])

    // add a function that will remove haiku from database on user's click
    const handleRemoveHaiku = (event, haikuKey) => {
        event.preventDefault();

        // remove individual haiku based on a unique firebase key
        dbRef.child(haikuKey).remove();
    }

    return (
        <section className="collectionSection">
            <h2>Haiku Collection</h2>
            <ul>
            {   
                // mapping through haikuCollection that represents an array of individual haiku objects
                haikuCollection.map((individualHaiku) => {
                    return (
                        <li key={individualHaiku.key}>
                            <button className="close" aria-label="delete button" onClick={event => handleRemoveHaiku(event, individualHaiku.key)}>&times;</button>
                            {
                                // mapping through each individual haiku to get each line within that haiku (each value in a single array)
                                individualHaiku.text.map((line, index) => {
                                    return <p key={index}>{line}</p>
                                })
                            }
                        </li>
                    )
                })
            }
            </ul>
        </section>
    )
}

export default HaikuCollection;