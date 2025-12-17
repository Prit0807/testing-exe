// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh9xWfsjFbJt1aPQdXceXRAP4hRqP3c7M",
  authDomain: "my-app-testing-ca56f.firebaseapp.com",
  projectId: "my-app-testing-ca56f",
  storageBucket: "my-app-testing-ca56f.firebasestorage.app",
  messagingSenderId: "752222480020",
  appId: "1:752222480020:web:12cfbd2b051a0a4a3df681",
  measurementId: "G-MYW7P2KFY4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

getToken(messaging, {
    vapidKey: "BBn9UpvUM37mZgK_krbH1mu8_FDqpsQyRsiIQCRSKaircrL9CBOc8odtEZdUFykijljsUHNQGPd4tAR7gcjsikA"
  })
    .then((currentToken) => {
      console.log("FCM Token:", currentToken);
    })
    .catch((err) => {
      console.error("Error getting token:", err);
    });