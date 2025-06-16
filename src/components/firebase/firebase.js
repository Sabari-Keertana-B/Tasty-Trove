import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAfl5YikeTt-Vn31rHsm90DzM5eIceTuQY",
    authDomain: "tasty-trove-b70d4.firebaseapp.com",
    projectId: "tasty-trove-b70d4",
    storageBucket: "tasty-trove-b70d4.firebasestorage.app",
    messagingSenderId: "179057905602",
    appId: "1:179057905602:web:54be331f2b07286dd2d05b",
    measurementId: "G-53ZJD44RC3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
