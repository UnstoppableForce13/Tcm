// Simple password hashing function (for demo purposes only)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        hash = (hash << 5) - hash + password.charCodeAt(i);
    }
    return hash.toString();
}

// Handle the sign-up process
const signupUsernameInput = document.getElementById('signupUsername');
const signupPasswordInput = document.getElementById('signupPassword');
const signupButton = document.getElementById('signupButton');
const signupSection = document.getElementById('signupSection');
const signinSection = document.getElementById('signinSection');
const toSignInLink = document.getElementById('toSignIn');

signupButton.addEventListener('click', () => {
    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value.trim();

    if (username && password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if user already exists
        if (users.some(user => user.username === username)) {
            alert('User already exists!');
            return;
        }

        // Store the user with hashed password
        users.push({ username, passwordHash: hashPassword(password) });
        localStorage.setItem('users', JSON.stringify(users));
        alert('User created successfully!');
        switchToSignIn();
    } else {
        alert('Please provide both a username and password.');
    }
});

// Switch to the sign-in form
toSignInLink.addEventListener('click', () => {
    signupSection.style.display = 'none';
    signinSection.style.display = 'block';
});

// Handle the sign-in process
const signinUsernameInput = document.getElementById('signinUsername');
const signinPasswordInput = document.getElementById('signinPassword');
const signinButton = document.getElementById('signinButton');
const feedSection = document.getElementById('feedSection');
const currentUserSpan = document.getElementById('currentUser');
const logoutButton = document.getElementById('logoutButton');

signinButton.addEventListener('click', () => {
    const username = signinUsernameInput.value.trim();
    const password = signinPasswordInput.value.trim();

    if (username && password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if user exists and password is correct
        const user = users.find(user => user.username === username && user.passwordHash === hashPassword(password));
        if (user) {
            alert('Login successful!');
            localStorage.setItem('currentUser', username); // Save logged-in user to localStorage
            switchToFeed(username);
        } else {
            alert('Invalid username or password.');
        }
    } else {
        alert('Please provide both a username and password.');
    }
});

// Switch to the feed section (user is logged in)
function switchToFeed(username) {
    signinSection.style.display = 'none';
    feedSection.style.display = 'block';
    currentUserSpan.textContent = username;

    // Load posts (simulated)
    loadPosts();
}

// Handle logout
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    feedSection.style.display = 'none';
    signinSection.style.display = 'block';
});

// Load posts for the user (simulated)
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const postContentElement = document.createElement('div');
        postContentElement.classList.add('content');
        postContentElement.textContent = post.content;

        const postUsernameElement = document.createElement('div');
        postUsernameElement.classList.add('username');
        postUsernameElement.textContent = `Posted by: ${post.username}`;

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = `Posted on: ${new Date(post.timestamp).toLocaleString()}`;

        postElement.appendChild(postUsernameElement);
        postElement.appendChild(postContentElement);
        postElement.appendChild(timestamp);

        document.getElementById('feed').prepend(postElement);
    });
}

// Handle post creation
const postContentInput = document.getElementById('postContent');
const createPostButton = document.getElementById('createPostButton');

createPostButton.addEventListener('click', () => {
    const content = postContentInput.value.trim();
    const currentUser = localStorage.getItem('currentUser');

    if (content && currentUser) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push({ content, username: currentUser, timestamp: Date.now() });
        localStorage.setItem('posts', JSON.stringify(posts));

        loadPosts(); // Refresh the feed with new post
        postContentInput.value = ''; // Clear the input field
    } else {
        alert('Please log in and write something.');
    }
});

// Automatically load the feed if the user is logged in
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
    switchToFeed(currentUser);
}
