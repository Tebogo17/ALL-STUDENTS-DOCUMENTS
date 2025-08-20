document.addEventListener("DOMContentLoaded", function () {
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");
    const uploadSection = document.getElementById("uploadSection");
    const fileList = document.getElementById("fileList");
    const registerButton = document.getElementById("registerButton");
    const backButton = document.getElementById("backButton");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const uploadForm = document.getElementById("uploadForm");
    const logoutButton = document.getElementById("logoutButton");
    const showFilesButton = document.getElementById("showFilesButton");
    const resumeDetails = document.getElementById("resumeDetails");
    const viewResumeButton = document.getElementById("viewResumeButton");
    const backToMenuButton = document.getElementById("backToMenuButton");

    let uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || []; // Load existing files from localStorage

    // Load uploaded files on page load
    updateFileList();

    // Toggle between login and register forms
    registerButton.addEventListener("click", function () {
        loginSection.style.display = "none";
        registerSection.style.display = "block";
    });

    backButton.addEventListener("click", function () {
        registerSection.style.display = "none";
        loginSection.style.display = "block";
    });

    // Handle login form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser && storedUser.username === username && storedUser.password === password) {
            loginSection.style.display = "none";
            uploadSection.style.display = "block";
            logoutButton.style.display = "block";
        } else {
            alert("Invalid username or password");
        }
    });

    // Handle registration form submission
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("registerUsername").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        const newUser = { username, email, password };
        localStorage.setItem("user", JSON.stringify(newUser));

        alert("Registration successful! You can now log in.");
        registerForm.reset();
        registerSection.style.display = "none";
        loginSection.style.display = "block";
    });

    // Handle file upload
    uploadForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        if (file) {
            const blobUrl = URL.createObjectURL(file); // Create a blob URL for the file
            uploadedFiles.push({ name: file.name, url: blobUrl });
            localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles)); // Save to localStorage
            updateFileList();
            fileInput.value = ''; // Reset file input
        }
    });

    // Show uploaded files
    showFilesButton.addEventListener("click", function () {
        document.getElementById("uploadedFiles").style.display = 'block';
    });

    // Function to update the displayed file list
    function updateFileList() {
        fileList.innerHTML = '';
        uploadedFiles.forEach((file, index) => {
            const li = document.createElement("li");
            li.textContent = file.name;

            // Create download link
            const downloadLink = document.createElement("a");
            downloadLink.href = file.url;
            downloadLink.download = file.name; // Set the file name for download
            downloadLink.textContent = "Download";
            downloadLink.style.marginRight = '10px'; // Space between link and button

            // Create delete button for each file
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.marginLeft = '10px'; // Space between download link and delete button
            deleteButton.addEventListener("click", function () {
                deleteFile(index);
            });

            li.appendChild(downloadLink);
            li.appendChild(deleteButton);
            fileList.appendChild(li);
        });
    }

    // Function to delete a file
    function deleteFile(index) {
        // Revoke the Blob URL before removing it
        URL.revokeObjectURL(uploadedFiles[index].url);
        uploadedFiles.splice(index, 1); // Remove the file from the array
        localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles)); // Update localStorage
        updateFileList(); // Update the displayed list
    }

    // Logout functionality
    logoutButton.addEventListener("click", function () {
        loginSection.style.display = "block";
        uploadSection.style.display = "none";
        logoutButton.style.display = "none";
    });

    // View resume button functionality
    viewResumeButton.addEventListener("click", function () {
        resumeDetails.style.display = resumeDetails.style.display === "none" ? "block" : "none";
    });

    // Back to menu functionality from resume section
    backToMenuButton.addEventListener("click", function () {
        resumeDetails.style.display = "none";
        uploadSection.style.display = "block"; // Show the upload section again
    });
});

