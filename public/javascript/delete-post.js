async function deletePost(event) {
    event.preventDefault();

    const id = document.location.href.split('/').pop();

    console.log(id);

    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
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

document.querySelector('.delete-post-btn').addEventListener('click', deletePost);