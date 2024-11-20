// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
  apiKey: "AIzaSyDu5Ib1h8vlxHZ4dkx3h8Xeu6n_PuCAxdg",
  authDomain: "gaspi-ec439.firebaseapp.com",
  projectId: "gaspi-ec439",
  storageBucket: "gaspi-ec439.firebasestorage.app",
  messagingSenderId: "826346049769",
  appId: "1:826346049769:web:744958c9313aa647192078",
  measurementId: "G-YP7F9Z4Y42"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Add your icon path in public folder
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});