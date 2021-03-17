// import firebase
import firebase from 'firebase';
// import realtime database
import 'firebase/database';

// configuration for our application
const firebaseConfig = {
    apiKey: "AIzaSyBZMq3UhdqH1AfW349n6G-BEBuAyJ2y0bI",
    authDomain: "haikushighway-d9f07.firebaseapp.com",
    projectId: "haikushighway-d9f07",
    storageBucket: "haikushighway-d9f07.appspot.com",
    messagingSenderId: "85927524442",
    appId: "1:85927524442:web:c4e984a0694501e0d74063"
};


// initialize firebase
firebase.initializeApp(firebaseConfig);

// export configured version of firebase
export default firebase;
