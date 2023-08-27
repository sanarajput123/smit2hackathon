// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc, query, where, orderBy, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyBHvuCxNIZ525B2fPIgTE23Z9A51YMZtlw",
    authDomain: "first-project-59564.firebaseapp.com",
    databaseURL: "https://first-project-59564-default-rtdb.firebaseio.com",
    projectId: "first-project-59564",
    storageBucket: "first-project-59564.appspot.com",
    messagingSenderId: "947027265089",
    appId: "1:947027265089:web:ab51a4f823f6ff2ade28c0",
    measurementId: "G-G536LP4MYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
// Initialize FireStore Database and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app);
const storageRef = ref(storage, `images/${localStorage.getItem("uid") ? localStorage.getItem("uid") : "profile"}`);
// const storageRef = ref(storage, `images/profile`);


// User state change 
onAuthStateChanged(auth, (user) => {
    if (user) {
        currUser.classList.remove("d-none")
        signNav.classList.add("d-none")
        // User is signed in, see docs for a list of available properties
        var uid = user.uid;
        localStorage.setItem("uid", uid);
        (async () => {
            const q = query(collection(db, "users"), where("user_id", "==", uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                currUser.textContent = `${doc.data().first_name} ${doc.data().last_name}`
                accFname.value = doc.data().first_name
                accLname.value = doc.data().last_name
                getDownloadURL(storageRef)
                    .then((url) => {
                        avatar.setAttribute('src', url);
                        ava.setAttribute('src', url);
                    })
                    .catch((error) => {
                    });
            });
        })()
    } else {
        signNav.classList.remove("d-none")
        currUser.classList.add("d-none")
        // User is signed out
    }
});

var myBtn = document.getElementById("myBtn")
var currUser = document.getElementById("currUser")
var user = document.getElementById("user")
var signNav = document.getElementById("goToAuth")
var signOutBtn = document.getElementById("signOut")
var accFname = document.getElementById("fName")
var accLname = document.getElementById("lName")
var pass = document.getElementById("pass")
var avatar = document.getElementById("avatar")
var ava = document.getElementById("ava")
var imgIn = document.getElementById("imgIn")
imgIn.addEventListener("input", () => {
    const newFile = imgIn.files[0];
    const metadata = {
        contentType: newFile.type
    };
    uploadBytes(storageRef, newFile, metadata).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            (async () => {
                const q = query(collection(db, "users"), where("user_id", "==", localStorage.getItem("uid")));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((docu) => {
                    (async () => {
                        const userRef = doc(db, "users", docu.id);
                        await updateDoc(userRef, {
                            profile_img: downloadURL
                        });
                    })();
                });
            })();
            (async () => {
                const q = query(collection(db, "blogs"), where("user_id", "==", localStorage.getItem("uid")));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((docu) => {
                    (async () => {
                        const blogRef = doc(db, "blogs", docu.id);
                        await updateDoc(blogRef, {
                            profile_img: downloadURL
                        });
                    })();
                });
            })();
            setTimeout(() => {
                window.location.reload()
            }, 5000);
        });
    });
});


myBtn.addEventListener("click", () => { localStorage.setItem("navFlag", "my") })
signNav.addEventListener("click", () => { window.location.href = "./auth.html" })
signOutBtn.addEventListener("click", userSignOut)

// User sign out func
function userSignOut() {
    signOut(auth).then(() => {
        localStorage.removeItem("uid")
        window.location.href = "./index.html"
        // Sign-out successful.
    }).catch((error) => {
        console.log("logout error-->", error.message);
        // An error happened.
    });
}