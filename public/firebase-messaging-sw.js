/* global importScripts, firebase */
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

// 🔁 paste YOUR Firebase config here (same as in src/firebase.js)
firebase.initializeApp({
    apiKey: "AIzaSyDh9xWfsjFbJt1aPQdXceXRAP4hRqP3c7M",
    authDomain: "my-app-testing-ca56f.firebaseapp.com",
    projectId: "my-app-testing-ca56f",
    messagingSenderId: "752222480020",
    appId: "1:752222480020:web:12cfbd2b051a0a4a3df681",
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Background messages (when tab is closed or in background)
messaging.onBackgroundMessage((payload) => {
  // Customize notification
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || "New message", {
    body: body || "",
    icon: icon || "/icon-192.png",
  });
});
