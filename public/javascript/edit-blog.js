async function editPostHandler(){
    event.preventDefault();

    let id = event.target.value;

    const title = document.querySelector('input[name="blog-title"]').value;
    const content = document.querySelector('#blog-text').value;

    const response = await fetch(`/api/posts/${id}`, {
         method: 'PUT',
         body: JSON.stringify({
              title,
              content
         }),
         headers: {
              'Content-Type': 'application/json'
         }
    });

    if (response.ok) {
         document.location.replace('/dashboard');
    } else {
         alert(response.statusText);
    }
}

document.querySelector('#edit-post-button').addEventListener('click', editPostHandler);