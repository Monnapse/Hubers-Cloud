console.log("login.js >>> Loaded");

canSubmit = true;

function loginSubmit(password) {
    // Stop from refreshing page
    //Event.preventDefault()
    event.preventDefault()
    if (canSubmit) {
        canSubmit = false
    
        console.log("login.js >>> Submiting login form, Password: " + password.value);
    
        // Sending password to server
        [response, code] = request(window.location.origin+"/form_login", "POST", {
            Password: password.value
        });

        //response = loginForm[0]
        //code = loginForm[1]

        textElement = document.getElementById("response");
        textElement.innerText = response;
        if (code == 200) {
            textElement.style.color = "var(--green)";
        } else {
            textElement.style.color = "var(--red)";
        }
        
        setTimeout(function() {
            if (code == 200) {
                location.replace("signin")
            }
        }, 5);
    
        setTimeout(function() {
            canSubmit = true;
        }, 5);
    }
    
    return false;
};