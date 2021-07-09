async function addComment (event) {
    event.preventDefault();

    const comment_text = document.querySelector('#comment-body').value;
    const post_id = document.location.href.split('/').pop();

    const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
            comment_text,
            post_id
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    }
    else {
        alert(response.statusText);
    };
};

document.querySelector('.comment-form').addEventListener('submit', addComment);