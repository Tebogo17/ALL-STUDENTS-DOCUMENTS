const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
let isLoggedIn = false;
let currentUser = null;
let fileToDelete = null; // Store the file to delete when right-clicked

// Load users from localStorage
const users = JSON.parse(localStorage.getItem('users')) || [];

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const loginButton = document.querySelector('#loginForm button[type="submit"]');

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        isLoggedIn = true;
        currentUser = user;
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'block';
        document.getElementById('loginMessage').textContent = "Login successful!";
        document.getElementById('loginMessage').classList.remove('error-message');
        document.getElementById('loginMessage').classList.add('success-message');
        document.getElementById('logoutButton').style.display = 'block'; 
        loginButton.classList.remove('error-button'); 
        showUploadedFiles();
    } else {
        document.getElementById('loginMessage').textContent = "Invalid username or password.";
        document.getElementById('loginMessage').classList.add('error-message'); 
        loginButton.classList.add('error-button'); 
    }
});

document.getElementById('registerButton').addEventListener('click', function() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
});

document.getElementById('backButton').addEventListener('click', function() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (users.find(user => user.username === username)) {
        document.getElementById('registerMessage').textContent = "Username is already taken.";
        document.getElementById('registerMessage').classList.add('error-message');
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('registerMessage').textContent = "Registration successful! You can now log in.";
    document.getElementById('registerMessage').classList.remove('error-message');
    document.getElementById('registerMessage').classList.add('success-message');
    alert("Registration successful! Redirecting to login.");
    
    document.getElementById('registerForm').reset();
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
});

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (!isLoggedIn) {
        alert("Please log in to upload files.");
        return;
    }

    const fileInput = document.getElementById('fileInput');
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileUrl = URL.createObjectURL(file);

        uploadedFiles.push({ name: file.name, url: fileUrl });
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
        
        fileInput.value = '';
        showUploadedFiles();
    }
});

function showUploadedFiles() {
    const fileList = document.getElementById('fileList');
    const uploadedFilesDiv = document.getElementById('uploadedFiles');
    
    fileList.innerHTML = '';

    uploadedFiles.forEach((file, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = file.url;
        link.textContent = file.name;
        link.target = "_blank";

        listItem.appendChild(link);
        fileList.appendChild(listItem);

        // Add right-click event for deletion
        listItem.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            fileToDelete = index; // Store the index of the file to delete
            showDeleteMenu(event.pageX, event.pageY);
        });
    });

    uploadedFilesDiv.style.display = 'block';
}

// Show context menu for deletion
function showDeleteMenu(x, y) {
    const deleteMenu = document.getElementById('deleteMenu');
    deleteMenu.style.left = `${x}px`;
    deleteMenu.style.top = `${y}px`;
    deleteMenu.style.display = 'block';
}

// Hide the delete menu when clicking outside
document.addEventListener('click', function(event) {
    const deleteMenu = document.getElementById('deleteMenu');
    if (!deleteMenu.contains(event.target)) {
        deleteMenu.style.display = 'none';
    }
});

// Delete file function
document.getElementById('deleteFile').addEventListener('click', function() {
    if (fileToDelete !== null) {
        uploadedFiles.splice(fileToDelete, 1);
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
        showUploadedFiles(); // Refresh the list
        fileToDelete = null; // Reset after deletion
        document.getElementById('deleteMenu').style.display = 'none';
    }
});

// Logout functionality
document.getElementById('logoutButton').addEventListener('click', function() {
    isLoggedIn = false;
    currentUser = null;
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none'; 
    document.getElementById('loginMessage').textContent = "Logged out successfully.";
    document.getElementById('loginMessage').classList.remove('error-message'); 
    document.getElementById('logoutButton').style.display = 'none'; 
});
