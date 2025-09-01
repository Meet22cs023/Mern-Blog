import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getEvn } from "./getEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: getEvn('VITE_FIREBASE_API'),
    authDomain: "blog-dbc77.firebaseapp.com",
    projectId: "blog-dbc77",
    storageBucket: "blog-dbc77.firebasestorage.app",
    messagingSenderId: "45239609625",
    appId: "1:45239609625:web:72f9fee93ce8e1be2f7d88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }