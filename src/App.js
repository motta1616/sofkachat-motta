import React, {useEffect, useRef, useState}  from "react"; // hook de react
import './App.css';

import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth'; // useAuthState = es el estado
import {useCollectionData} from 'react-firebase-hooks/firestore';

// para la inicializaion de la app
firebase.initializeApp({
  apiKey: "AIzaSyAjSmXTsJwbdM2dWiFJCKqFfBXWkwSn6DM",
  authDomain: "sofkachat-motta.firebaseapp.com",
  projectId: "sofkachat-motta",
  storageBucket: "sofkachat-motta.appspot.com",
  messagingSenderId: "661924347522",
  appId: "1:661924347522:web:16296cc65f8d5d328dfe9b"
})

const auth = firebase.auth();  // el objeto para la identificacion de firebase
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth) // va obtener el usuario identificado 
  return (
    // si user es vacio 
    <div className="App">
      <header>
        <h1>sofka chat</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoon /> : <SignIn />}
      </section>
    </div>
  );
}

function ChatRoon() {
  return <p>Chat</p>
}

function SignIn() { // para cuando no esta autenticado poder autenticar y abrir sesion
  const signInwithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider(); // Es el provedor que vamos a usar 
    auth.signInWithPopup(provider);
  }
  return <button onClick = {signInwithGoogle}>Sign in with google</button>
}

function SignOut() { // para cerrar la sesion 
  return auth.currentUser && (
    <button onClick = {() => {
      auth.signOut();
    }}>Sign out</button>
  );
}

export default App;
