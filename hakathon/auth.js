// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

// SignUp
var userFName = document.getElementById("signUpFName")
var userLName = document.getElementById("signUpLName")
var signUpEmail = document.getElementById("signUpEmail")
var signUpPassword = document.getElementById("signUpPass")
var conPassword = document.getElementById("signUpConPass")
var signUpBtn = document.getElementById("signUpBtn")
// var signUpGmail = document.getElementById("signUpGmail")
// var signUpFb = document.getElementById("signUpFb")

// SignIn
var signInEmail = document.getElementById("signInEmail")
var signInPassword = document.getElementById("signInPass")
var signInBtn = document.getElementById("signInBtn")
// var forgotPass = document.getElementById("forgotPass")
// var signInGmail = document.getElementById("signInGmail")
// var signInFb = document.getElementById("signInFb")

// Navigator
var goToSignUp = document.getElementById("goToSignUp")
var goToSignIn = document.getElementById("goToSignIn")

// Misc
var hideBtns = document.querySelectorAll(".hide")
var loader = document.getElementById("loading")

// index page event listeners
signUpBtn.addEventListener("click", signUp)
signInBtn.addEventListener("click", signIn)
hideBtns.forEach((elemBtn) => { elemBtn.addEventListener("click", () => { showPass(elemBtn) }) })
goToSignIn.addEventListener("click", () => { signUpsignIn(goToSignIn) })
goToSignUp.addEventListener("click", () => { signUpsignIn(goToSignUp) })

// User state change 
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        const uid = user.uid;
        loader.classList.replace("d-none", "d-block")
        setTimeout(() => {
            loader.classList.replace("d-block", "d-none")
            window.location.href = "./index.html"
        }, 3000);
    } else {
        // User is signed out
    }
});

// Register new users
function signUp() {
    let passCheck = document.querySelector("#passCheck")
    passCheck.classList.replace("d-block", "d-none")

    let valid = false
    switch (valid) {
        case userFName.checkValidity():
            userFName.reportValidity()
            break
        case userLName.checkValidity():
            userLName.reportValidity()
            break
        case signUpEmail.checkValidity():
            signUpEmail.reportValidity()
            break
        case signUpPassword.checkValidity():
            signUpPassword.reportValidity()
            break
        case conPassword.checkValidity():
            conPassword.reportValidity()
            break
        default:
            valid = true
    }

    let email = signUpEmail.value, password = signUpPassword.value, conPass = conPassword.value, fName = userFName.value, lName = userLName.value;

    if (!valid) {
        return null
    } else if (password.length < 8) {
        passCheck.classList.replace("d-none", "d-block")
        passCheck.textContent = "Password should be min. 8 characters long"
    }
    else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z]).+$/)) {
        passCheck.classList.replace("d-none", "d-block")
        passCheck.textContent = "Password should have atleast 1 upper & lowercase letter"
    } else if (password === conPass) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                loader.classList.replace("d-none", "d-block")
                // Signed in 
                const user = userCredential.user;
                let uid = user.uid;

                (async function () {
                    try {
                        const docRef = await addDoc(collection(db, "users"), {
                            user_id: uid,
                            email,
                            password,
                            first_name: fName,
                            last_name: lName,
                            profile_img:"https://firebasestorage.googleapis.com/v0/b/first-project-59564.appspot.com/o/images%2Fprofile?alt=media&token=751048cd-0dcf-42d8-8c3d-be00626e26e3"
                        });
                        console.log("Document written with ID: ", docRef.id);
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                })()
            })
            .catch((error) => {
                passCheck.classList.replace("d-none", "d-block")
                passCheck.textContent = "This email is used by another account"
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("sign up error-->", errorMessage);

            });

    } else {
        passCheck.textContent = "Passwords do not match"
        passCheck.classList.replace("d-none", "d-block")
    }
}

// Allow login for existing users

function signIn() {
    let accCheck = document.querySelector("#accountCheck")
    accCheck.classList.replace("d-block", "d-none")

    let valid = false
    switch (valid) {
        case signInEmail.checkValidity():
            signInEmail.reportValidity()
            break
        case signInPassword.checkValidity():
            signInPassword.reportValidity()
            break
        default:
            valid = true
    }
    let email = signInEmail.value, password = signInPassword.value

    if (!valid) {
        return null
    }
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            loader.classList.replace("d-none", "d-block")
            // Signed in 
            const user = userCredential.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("sign in error-->", errorMessage);

            accCheck.classList.replace("d-none", "d-block")
        });
}

// Show and hide password toggler

function showPass(elem) {
    let pass = elem.parentNode.children
    for (const i of pass) {
        if (i.localName == "input") {
            if (i.type == "password") {
                i.type = "text"
                elem.innerHTML = '<i class="fa-solid fa-eye-slash"></i>'
            }
            else {
                i.type = "password"
                elem.innerHTML = '<i class="fa-solid fa-eye"></i>'
            }
        }
    }
}

// Sign up and Sign in page navigator

function signUpsignIn(elem) {
    let signUp = document.querySelector("#signUp")
    let signIn = document.querySelector("#signIn")
    if (elem.id == "goToSignUp") {
        signInEmail.value = null, signInPassword.value = null
        signIn.classList.replace("moveIn", "moveOut")
        setTimeout(() => {
            signUp.classList.replace("moveOut", "moveIn")
        }, 1000)
    } else {
        userFName.value = null, userLName.value = null, signUpEmail.value = null, signUpPassword.value = null, conPassword.value = null
        let passCheck = document.querySelector("#passCheck")
        passCheck.classList.replace("d-block", "d-none")
        signUp.classList.replace("moveIn", "moveOut")
        setTimeout(() => {
            signIn.classList.replace("moveOut", "moveIn")
        }, 1000);
    }
}