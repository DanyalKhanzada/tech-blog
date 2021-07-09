async function loginFormHandler(event) {
    event.preventDefault();
  
    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (username && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          username,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('RESPONSE', response);
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      } 
  }
};


function registerRedirect(){
 document.location.replace('/register');
}

document.querySelector('#login-submit-button').addEventListener('click', loginFormHandler);

document.querySelector('#register-btn').addEventListener('click', registerRedirect);