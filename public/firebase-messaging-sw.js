// Import Firebase scripts required for messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

// Initialize Firebase inside the service worker
const firebaseConfig = {
  apiKey: "AIzaSyAfnnY6v8U5gx4yFTbYr9RmFwlFeDjxBhk",
  authDomain: "bairaha-app-bc496.firebaseapp.com",
  projectId: "bairaha-app-bc496",
  storageBucket: "bairaha-app-bc496.appspot.com",
  messagingSenderId: "826092670490",
  appId: "1:826092670490:web:0cd18418ca63d910db0ba3",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const { title, body, image } = payload.notification;
  self.registration.showNotification(title, {
    body: body,
    icon: image,
  });
});
