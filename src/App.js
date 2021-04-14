import React, {useEffect, useRef, useState}  from "react"; // hook de react
import './App.css';

import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth'; // useAuthState = Es un hook es el estado
import {useCollectionData} from 'react-firebase-hooks/firestore'; // Es un hook

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

function ChatRoon() { // para el chat 
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limitToLast(30); // los mensajes se van a ordenar por fecha y mostrara 30 mensajes
  const [messages] = useCollectionData(query, {idField: 'id'}); // creamos un estado para guardar los mensajes de useCollectionData
  const dummy = useRef();

  const [formValue, setFormValue] = useState('')// boton para crear, estos estados son para el campo del mensaje

  useEffect(() => { // permite un efecto de desplazamiento para cundo llegue un mensaje se baje 
    dummy.current.scrollIntoView({behavior: 'smooth'})
  })

  // la funcion para el envio de mensajes 
  const sendMessage = async (e) => {
    e.preventDefault();
    const {uid, photoURL, displayName} = auth.currentUser;

    // await = son para metodos asincronos y entregue el mensaje de inmediato
    await messageRef.add({
      text: formValue, // formValue = es el valor del estado
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), // entrega la fecha del servidor. serverTimestamp = es un estado de fecha numerico
      uid,
      displayName,
      photoURL
    });
    setFormValue('');
  }; // Es una acccion asincrona que tendra una promesa donde e es un evento que no hara submit

  // lo de adentro del main es para evitar los mensajes nulos
  return (
    <main>
      <div>
      {messages && 
        messages.map(msn => <ChatMessage key = {msn.id} message = {msn} />)}
      </div>
      <div>
        <form onSubmit = {sendMessage}>
          <input value = {formValue} onChange = {(e) => {
            setFormValue(e.target.value) // me permite sacar el estado como tal
            }}
            placeholder = "Escribir mensaje"
          />
          <button type = "submit" disabled = {!formValue}>Send</button>
        </form>
      </div>
      <span ref = {dummy}></span>
  </main>
  );
}

//message = va entregar un text
function ChatMessage({message}) {
  const {text, uid, photoURL, displayName} = message;
  const messageOrderClass = uid === auth.currentUser.uid ?'send' : 'received';// permite saber si esta mandado o recibido
   
  return ( 
  <div children = {"message " + messageOrderClass}>
    <img src = {photoURL} alt = {"Avatar"}/>
    <small>{displayName}</small>
    <p>{text}</p>
  </div>)
}

export function SignIn() { // para cuando no esta autenticado poder autenticar y abrir sesion export = se exporta para acciones de test 
  const signInwithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider(); // Es el provedor que vamos a usar 
    auth.signInWithPopup(provider);
  }
  return (
    <div>
      <p>Bienvenido a sofka</p>
      <button onClick = {signInwithGoogle}>Sign in with google</button>
  </div>)
}

function SignOut() { // para cerrar la sesion 
  return auth.currentUser && (
    <button onClick = {() => {
      auth.signOut();
    }}>Sign out</button>
  );
}

export default App;
