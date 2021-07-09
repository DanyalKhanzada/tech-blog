async function addBlog(event) {
    const title = document.querySelector('input[name="blog-title"]').value;
    const content = document.querySelector('#blog-text').value;

    const response = await fetch(`/api/posts`, {
         method: 'POST',
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
};

document.querySelector('#submit-post-button').addEventListener('click', addBlog);
