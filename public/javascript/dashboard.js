function addPostHandler(event) {
    event.preventDefault();

    document.location.replace('/add-blog');

};

function deletePostHandler(event) {
    event.preventDefault();

    let confirmDelete = confirm('Are you sure you want to delete this post?')
    let buttonId = document.querySelector('#delete-post-button').getAttribute('value');

    if(confirmDelete) {
         fetch(`/api/posts/${buttonId}`, {
              method: 'delete'    
         });

         document.location.reload();
    }
};


document.querySelector('#new-post-button').addEventListener('click', addPostHandler);

document.querySelector('#delete-post-button').addEventListener('click', deletePostHandler);