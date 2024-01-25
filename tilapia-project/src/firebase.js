import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBOLu-T2h5MCmCbOWVmDaGfvIWWmAlrnTA",
    authDomain: "tilapias-c0fed.firebaseapp.com",
    projectId: "tilapias-c0fed",
    storageBucket: "tilapias-c0fed.appspot.com",
    messagingSenderId: "155805475928",
    appId: "1:155805475928:web:5c2ba254388612a96ed62d",
    measurementId: "G-WRTPGJ1G70"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)