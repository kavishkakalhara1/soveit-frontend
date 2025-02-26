// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfnnY6v8U5gx4yFTbYr9RmFwlFeDjxBhk",
  authDomain: "bairaha-app-bc496.firebaseapp.com",
  projectId: "bairaha-app-bc496",
  storageBucket: "bairaha-app-bc496.appspot.com",
  messagingSenderId: "826092670490",
  appId: "1:826092670490:web:0cd18418ca63d910db0ba3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);


// Function to request permission and get FCM token
export const requestFCMToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'BMcyq2GLQw_LxK9F-xp9tevhg6w2KQMaW18dT2EL9-NnDYquzOdGC-QmkO8GPhy4PaLuYzYjp0sqKAcyn37Ekoo',
    });

    if (currentToken) {
      console.log('FCM Device Token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
  }
};