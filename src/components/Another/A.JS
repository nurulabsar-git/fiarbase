import React, { useState } from 'react';
import './App.css'
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSingIn : false,
    name : '',
    email : '',
    photo: ''
  })
  
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSingIn = () =>{
      // console.log("object");
      firebase.auth().signInWithPopup(provider)
      .then(result => {
        const {displayName, photoURL, email} = result.user;
        const singInUser = {
          isSingIn: true, 
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(singInUser);
        // console.log(displayName, email, photoURL);
      })

      .catch(error => {
        console.log(error);
        console.log(error.message);
      })
  }

  const handleSingOut = () => {
    // console.log('sign out');
    firebase.auth().signOut()
    .then(result => {
     const signOutUser = {
       isSingIn: false,
       
       name: '',
       email: '',
       password: '',
       photo: "" ,
       error: '',
       success: false
    }
    setUser(signOutUser);
    })
    .catch(error => {
      //handle error
    })
  }

   

   const handleBlur = (hello) =>{
        // console.log(hello.target.value, hello.target.name);
        let isFormValid = true;
        if(hello.target.name === 'email'){
        //  const isEmailValid = /\S+@\S+\.\S+/.test(hello.target.value);
         isFormValid = /\S+@\S+\.\S+/.test(hello.target.value);
        //  console.log(isEmailValid);
        }
        if(hello.target.name ==="password"){
          const isPasswordValid = hello.target.value.length > 8;
          const passwordHasNumber = /\d{1}/.test(hello.target.value);
           isFormValid = isPasswordValid && passwordHasNumber;
          // console.log(isPasswordValid && passwordHasNumber);
        }

        if(isFormValid){
          const newUserInfo = {...user};
          newUserInfo[hello.target.name] = hello.target.value;
          setUser(newUserInfo);

        }
      }

      const handleSubmit = (hello) => {
        // console.log(user.email, user.password)
        if(newUser && user.email && user.password){
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
          .then((result) => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
            // console.log(result)
            updateUserName(user.name);
          
          })
        .catch((error) => {
          //handle error
          const newUserInfo = {... user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          
          
          
        });
    
  }
        if(!newUser && user.email && user.password) {
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((result) => {
          const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        console.log('sign in user info', result.user);
        })
        .catch((error) => {
          const newUserInfo = {... user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          
        });
      }


   hello.preventDefault();
  }

  const updateUserName = name =>{

   const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then( function () {
      console.log('user info updated successfully');
    })
    .catch(function(error) {
      console.log(error);
    });

  }
  return (
    <div className="App">
      { user.isSingIn?<button onClick={handleSingOut}>Sign out</button> : 
      <button onClick={handleSingIn}>Sign in</button>
        
      }
      {
        user.isSingIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
    <h1>Our Own Authentication</h1>
    <input onChange={() => setNewUser(!newUser)} type="checkbox" name="newUser" id=""/>
    <label htmlFor="newUser">New User Sign up</label>
    <form onSubmit={handleSubmit}>
    {newUser && <input  onBlur={handleBlur} name= "name" type="text" placeholder="your name"/>
   } <br/>
    <input onBlur={handleBlur} type="text" name="email" placeholder="Your email address" required/> <br/>
    <input onBlur={handleBlur} type="password" name="password" placeholder="your password" required/> <br/>
    <input type="submit" value={newUser ? 'Sign up' : 'Sign in'}/>
    </form>

     <p style={{color: 'red'}}>{user.error}</p>
   {/* <p style={{color: 'green'}}>{user.success}</p> */}

    {
      user.success && <p style={{color: 'green'}}>User {newUser ? 'created' : 'Logged in'} successfully</p>
    }
    </div>
  );
}

export default App;
