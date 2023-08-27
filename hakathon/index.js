// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc, query, where, orderBy, updateDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
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
const storage = getStorage(app);

const storageRef = ref(storage, `images/${localStorage.getItem("uid") ? localStorage.getItem("uid") : "profile.jpeg"}`);
// Initialize FireStore Database and get a reference to the service
const db = getFirestore(app);

var avatar = document.getElementById("avatar")
var prof = document.getElementById("prof")
var currUser = document.getElementById("currUser")
var allBlogs = document.getElementById("allBlogs")
var allBlogBtn = document.getElementById("allBtn")
var allBlogContainer = document.getElementById("allBlogContainer")
var userBlogs = document.getElementById("userBlogs")
var userBlogContainer = document.getElementById("userBlogContainer")
var user = document.getElementById("user")
var backToAll = document.getElementById("backToAll")
var myBlogs = document.getElementById("myBlogs")
var myBlogBtn = document.getElementById("myBtn")
var myBlogContainer = document.getElementById("myBlogContainer")
var blogTitle = document.getElementById("blogTitle")
var TitleCount = document.getElementById("titleChCount")
var blogContent = document.getElementById("blogContent")
var ContentCount = document.getElementById("ContentChCount")
var publish = document.getElementById("publish")
var cancelBlog = document.getElementById("cancel")
var updateflag = [false, null]
var signNav = document.getElementById("goToAuth")
var signOutBtn = document.getElementById("signOut")


allBlogBtn.addEventListener("click", showAllBlogs)
backToAll.addEventListener("click", showAllBlogs)
myBlogBtn.addEventListener("click", showMyBlogs)
blogTitle.addEventListener("input", updateCount)
blogContent.addEventListener("input", updateCount)
publish.addEventListener("click", writeBlog)
cancelBlog.addEventListener("click", () => {
    blogContent.value = null
    blogTitle.value = null
    updateCount()
})
signNav.addEventListener("click", () => {
    window.location.href = "./auth.html"
})
signOutBtn.addEventListener("click", userSignOut);

(function pageNavigate() {
    let nav = localStorage.getItem("navFlag")
    if (nav === "my") {
        showMyBlogs()
    } else {
        showAllBlogs()
    }
    localStorage.setItem("navFlag", "all")
})()

onAuthStateChanged(auth, (user) => {
    if (user) {
        currUser.classList.remove("d-none")
        prof.classList.remove("d-none")
        signNav.classList.add("d-none")
        // User is signed in, see docs for a list of available properties
        var uid = user.uid;
        localStorage.setItem("uid", uid);
        (async () => {
            const q = query(collection(db, "users"), where("user_id", "==", uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                currUser.textContent = `${doc.data().first_name} ${doc.data().last_name}`
            });
            getDownloadURL(storageRef)
                .then((url) => {
                    avatar.setAttribute('src', url);
                })
                .catch((error) => {
                });
        })()
    } else {
        signNav.classList.remove("d-none")
        currUser.classList.add("d-none")
        prof.classList.add("d-none")
        // User is signed out
    }
});

function updateCount() {
    TitleCount.innerText = `${blogTitle.value.length}/50`
    ContentCount.innerText = `${blogContent.value.length}/3000`
}


async function showAllBlogs() {
    allBlogs.classList.remove("d-none")
    userBlogs.classList.add("d-none")
    myBlogs.classList.add("d-none")
    allBlogContainer.innerHTML = null
    const q = query(collection(db, "blogs"), orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let data = doc.data()
        let blog = `<div class="bg-body-tertiary border border-white rounded shadow-lg p-3 my-3">
							<div class="d-flex flex-column flex-lg-row mb-3">
								<div
									class="mx-2 profImg rounded overflow-hidden border border-4 border-light-subtle shadow">
									<img class="img-fluid profile_img" src="${data.profile_img}" alt="">
								</div>
								<div class="d-flex flex-column align-self-end ms-3">
									<div class="text-wrap text-break fs-3 fw-semibold ">${data.blogTitle}</div>
									<div class="text-body-secondary">${data.user_name}-${new Date(data.time).toLocaleString()}</div>
								</div>
							</div>
							<div class="text-wrap text-break my-2">${data.blogContent}</div>
                            <a name="${data.user_id}" class="link-primary text-decoration-none seeMore">See more from this user</a>
						</div>`
        allBlogContainer.innerHTML += blog
    });
    setTimeout(() => {
        let seeMore = document.getElementsByClassName("seeMore")
        Array.from(seeMore).forEach(element => {
            element.addEventListener("click", () => { showUserBlogs(element.name) })
        });
    }, 100);
}

async function showUserBlogs(id) {
    userBlogs.classList.remove("d-none")
    allBlogs.classList.add("d-none")
    myBlogs.classList.add("d-none")
    userBlogContainer.innerHTML = null
    const q = query(collection(db, "blogs"), where("user_id", "==", id), orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let data = doc.data()
        user.innerText = data.user_name
        let blog = `<div id=${doc.id} class="bg-body-tertiary border border-white rounded shadow-lg p-3 my-3">
							<div class=d-flex flex-column flex-lg-row mb-3">
								<div
									class="mx-2 profImg rounded overflow-hidden border border-4 border-light-subtle shadow">
									<img class="img-fluid profile_img" src="${data.profile_img}" alt="">
								</div>
								<div class="d-flex flex-column align-self-end ms-3">
									<div class="text-wrap text-break fs-3 fw-semibold ">${data.blogTitle}</div>
									<div class="text-body-secondary">${data.user_name}-${new Date(data.time).toLocaleString()}</div>
								</div>
							</div>
							<div class="text-wrap text-break my-2">${data.blogContent}</div>

						</div>`
        userBlogContainer.innerHTML += blog
    });
}

async function showMyBlogs() {
    let userId = localStorage.getItem("uid")
    if (userId) {
        myBlogs.classList.remove("d-none")
        allBlogs.classList.add("d-none")
        userBlogs.classList.add("d-none")
        myBlogContainer.innerHTML = null
        const q = query(collection(db, "blogs"), where("user_id", "==", userId), orderBy("time", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let data = doc.data()
            let blog = `<div id=${doc.id} class="bg-body-tertiary border border-white rounded shadow-lg p-3 my-3">
							<div class="d-flex flex-column flex-lg-row mb-3">
								<div
									class="mx-2 profImg rounded overflow-hidden border border-4 border-light-subtle shadow">
									<img class="img-fluid profile_img" src="${data.profile_img}" alt="">
								</div>
								<div class="d-flex flex-column align-self-end ms-3">
									<div class="text-wrap text-break fs-3 fw-semibold ">${data.blogTitle}</div>
									<div class="text-body-secondary">${data.user_name}-${new Date(data.time).toLocaleString()}</div>
								</div>
							</div>
							<div class="text-wrap text-break my-2">${data.blogContent}</div>
                            <button id="${data.blogTitle}" class="btn btn-success editBlog">Edit</button>
						<button id="${data.blogTitle}" class="btn btn-danger deleteBlog">Delete</button>
						</div>`
            myBlogContainer.innerHTML += blog
        });
        setTimeout(() => {
            let edit = document.getElementsByClassName("editBlog")
            let deleteBlog = document.getElementsByClassName("deleteBlog")
            Array.from(deleteBlog).forEach(element => {
                element.addEventListener("click", () => { deleteBlogFunc(element) })
            });
            Array.from(edit).forEach(element => {
                element.addEventListener("click", () => { editBlog(element) })
            });
        }, 100);
    } else {
        window.location.href = "./auth.html"
    }
}

async function writeBlog() {
    let [title, content] = [blogTitle.value, blogContent.value]
    let valid = false
    switch (valid) {
        case blogTitle.checkValidity():
            blogTitle.reportValidity()
            break
        case blogContent.checkValidity():
            blogContent.reportValidity()
            break
        default:
            valid = true
    }
    if (!valid) {
        return null
    } else if (updateflag[0] == true && updateflag[1]) {
        await updateDoc(doc(db, "blogs", updateflag[1]), {
            blogTitle: title,
            blogContent: content
        });
        updateflag = [false, null]
    } else {
        (async function () {
            let userId = localStorage.getItem("uid");
            const q = query(collection(db, "users"), where("user_id", "==", userId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                getDownloadURL(storageRef)
                    .then((url) => {
                        (async function () {
                            let [fname, lname] = [doc.data().first_name, doc.data().last_name]
                            try {
                                const docRefBlog = await addDoc(collection(db, "blogs"), {
                                    user_id: userId,
                                    user_name: `${fname} ${lname}`,
                                    time: new Date().getTime(),
                                    blogTitle: title,
                                    blogContent: content,
                                    profile_img: url
                                });
                            } catch (e) {
                                console.error("Error adding document: ", e);
                            }
                        })()
                    })
                    .catch((error) => {
                    });
            });
        })()
    }
    blogTitle.value = null;
    blogContent.value = null;
    updateCount()
    setTimeout(() => {
        showMyBlogs()
    }, 1000);
}

async function editBlog(element) {
    let docId = element.parentNode.id;
    const docRefBlog = doc(db, "blogs", docId);
    const docSnap = await getDoc(docRefBlog);
    if (docSnap.exists()) {
        blogTitle.value = docSnap.data().blogTitle
        blogContent.value = docSnap.data().blogContent
        window.scrollTo(0, 0);
        updateCount()
        updateflag = [true, docId]
    } else {
        console.log("No such document!");
    }

}

async function deleteBlogFunc(element) {
    let docId = element.parentNode.id;
    let confm = confirm("Do you want to delete this Blog?")
    if (confm) {
        await deleteDoc(doc(db, "blogs", docId));
    }
    setTimeout(() => {
        showMyBlogs()
    }, 1000);
}

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