console.log("signup.js >>> Loaded");

canSubmit = true;

function signupSubmit(username, _2fa) {
    // Stop from refreshing page
    //Event.preventDefault()
    event.preventDefault()
    if (canSubmit) {
        try {
            canSubmit = false
            response = "";
            code = 0;
        
            //console.log("signin.js >>> Submiting login form, username: " + _2fa.value);
        
            // Sending password to server
            [response, code] = request(window.location.origin+"/form_signup", "POST", {
                Username: username.value,
                Twofa: _2fa.value
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
                    location.replace("/")
                }
            }, 5);
        
            setTimeout(function() {
                canSubmit = true;
            }, 5);
        } catch(err) {
            textElement = document.getElementById("response");
            textElement.innerText = "Error connecting to server";
            textElement.style.color = "var(--red)";
        }
    }
    
    return false;
};