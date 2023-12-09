import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAukR5RA5OL3mMFMJm7GvNmdWkbeNW6TZc",
  authDomain: "blog-55101.firebaseapp.com",
  projectId: "blog-55101",
  storageBucket: "blog-55101.appspot.com",
  messagingSenderId: "384775838250",
  appId: "1:384775838250:web:bf0c75a0ede37518154153"
};

const app = initializeApp(firebaseConfig);


const provider = new GoogleAuthProvider();
const auth = getAuth();
export const authWithGoogle = async()=>{
    let user = null;
    await signInWithPopup(auth , provider).then((result)=>{
        user = result.user
    }).catch((error)=>{
        console.log(error);
    })

    return user;
}