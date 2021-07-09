async function signupFormHandler(event){
    event.preventDefault();

    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    console.log('values received');

    if (username && password && email) {
         console.log('if check passed');
         const response = await fetch('/api/users', {
              method: 'post',
              body: JSON.stringify({
                   username,
                   email,
                   password
              }),
              headers: { 'Content-Type': 'application/json' }
         });
         //check response status
         if (response.ok) {
           console.log('Success');
           document.location.replace('dashboard');   
         } else {
              alert(response.statusText);
         }
         
    }

};

document.querySelector('#register-submit-button').addEventListener('click', signupFormHandler);