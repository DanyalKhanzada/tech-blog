async function editPost(event) {
    event.preventDefault();
    
    const title = document.querySelector('#post-title').value;
    const text = document.querySelector('#post-text').value;
    const id = document.location.href.split('/').pop();

    console.log(title, text, id);

    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
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

document.querySelector('.edit-post-form').addEventListener('submit', editPost);