import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "./App.css";
import { Router } from "@reach/router";
import Chat from "./Chat.js";
import ChatList from "./ChatList.js";

function createProfileIfNotFound(user) {
  firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get()
    .then(snap => {
      if (snap || snap.empty) {
        firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .set({
            displayName: user.displayName
          });
      }
    });
}

const App = () => {
  const [user, setUser] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  firebase.auth().onAuthStateChanged(authUser => {
    setUser(authUser);
    createProfileIfNotFound(authUser);
    setIsLoaded(true);
  });

  function signIn(e) {
    e.preventDefault();
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  if (!isLoaded) {
    return <div>loading page...</div>;
  }

  if (!user) {
    return (
      <div>
        <button onClick={signIn}>sign in with Google</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header-container">
        <div>
          user: {user.displayName}, {user.email}
        </div>
        <button onClick={() => firebase.auth().signOut()}>sign out</button>
      </div>
      <div className="content-container">
        <Router>
          <ChatList path="/" user={user} />
          <Chat path="/chat/:chatId" user={user} />
        </Router>
      </div>
    </div>
  );
};

export default App;
