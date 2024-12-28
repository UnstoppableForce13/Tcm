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
        users.push({ username, passwordHash: hashPassword(password), avatar: 'default-avatar.png', following: [] });
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
const profileImage = document.getElementById('profileImage');
const followUnfollowButton = document.getElementById('followUnfollowButton');

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

    // Load posts and user profile
    loadPosts();
    loadProfile(username);
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
        if (post.type === 'text') {
            postContentElement.textContent = post.content;
        } else if (post.type === 'image') {
            const img = document.createElement('img');
            img.src = post.content;
            img.alt = 'Image Post';
            img.style.maxWidth = '100%';
            img.style.borderRadius = '10px';
            postContentElement.appendChild(img);
        } else if (post.type === 'video') {
            const video = document.createElement('video');
            video.src = post.content;
            video.controls = true;
            video.style.maxWidth = '100%';
            video.style.borderRadius = '10px';
            postContentElement.appendChild(video);
        }

        const postUsernameElement = document.createElement('div');
        postUsernameElement.classList.add('username');
        postUsernameElement.textContent = `Posted by: ${post.username}`;

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = `Posted on: ${new Date(post.timestamp).toLocaleString()}`;

        const likeButton = document.createElement('button');
        likeButton.classList.add('like-button');
        likeButton.textContent = 'Like';

        const likeCount = document.createElement('div');
        likeCount.classList.add('like-count');
        likeCount.textContent = `Likes: ${post.likes || 0}`;

        const commentButton = document.createElement('button');
        commentButton.classList.add('comment-button');
        commentButton.textContent = 'Comment';

        postElement.appendChild(postUsernameElement);
        postElement.appendChild(postContentElement);
        postElement.appendChild(timestamp);
        postElement.appendChild(likeButton);
        postElement.appendChild(likeCount);
        postElement.appendChild(commentButton);

        document.getElementById('feed').prepend(postElement);
    });
}

// Load user profile
function loadProfile(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(user => user.username === username);
    if (currentUser) {
        profileImage.src = currentUser.avatar;
        followUnfollowButton.textContent = currentUser.following.includes(username) ? 'Unfollow' : 'Follow';
    }
}

// Handle follow/unfollow
followUnfollowButton.addEventListener('click', () => {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === currentUser);

    if (user) {
        const isFollowing = user.following.includes(currentUser);
        if (isFollowing) {
            user.following = user.following.filter(f => f !== currentUser);
            followUnfollowButton.textContent = 'Follow';
        } else {
            user.following.push(currentUser);
            followUnfollowButton.textContent = 'Unfollow';
        }
        localStorage.setItem('users', JSON.stringify(users));
    }
});

// Handle post creation
const postContentInput = document.getElementById('postContent');
const createPostButton = document.getElementById('createPostButton');
const contentTypeSelector = document.getElementById('contentTypeSelector');
const imageFileInput = document.getElementById('imageFile');
const videoURLInput = document.getElementById('videoURL');

contentTypeSelector.addEventListener('change', () => {
    const contentType = contentTypeSelector.value;

    // Hide or show input fields based on the content type
    if (contentType === 'text') {
        postContentInput.style.display = 'block';
        imageFileInput.style.display = 'none';
        videoURLInput.style.display = 'none';
    } else if (contentType === 'image') {
        postContentInput.style.display = 'none';
        imageFileInput.style.display = 'block';
        videoURLInput.style.display = 'none';
    } else if (contentType === 'video') {
        postContentInput.style.display = 'none';
        imageFileInput.style.display = 'none';
        videoURLInput.style.display = 'block';
    }
});

createPostButton.addEventListener('click', () => {
    const contentType = contentTypeSelector.value;
    const content = contentType === 'text' ? postContentInput.value : contentType === 'image' ? imageFileInput.files[0] : videoURLInput.value;

    if (content) {
        const newPost = {
            username: currentUserSpan.textContent,
            content,
            type: contentType,
            timestamp: new Date().toISOString(),
            likes: 0
        };

        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
});
