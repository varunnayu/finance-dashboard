import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyC8VVjpSPUyS5nhCdoNrPnV1vZJ6cndIWc",
    authDomain: "finance-project-data-b87ae.firebaseapp.com",
    projectId: "finance-project-data-b87ae",
    storageBucket: "finance-project-data-b87ae.firebasestorage.app",
    messagingSenderId: "588204073453",
    appId: "1:588204073453:web:589535a32367d30a73c7e4"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);