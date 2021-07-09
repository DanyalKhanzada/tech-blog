async function addPost (event) {
    event.preventDefault();

    const title = document.querySelector('#post-title').value;
    const text = document.querySelector('#post-text').value;
    
    const response = await fetch ('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
            title,
            text
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    }
    else {
        alert(response.statusText);
    };
};

document.querySelector('.new-post-form').addEventListener('submit', addPost);