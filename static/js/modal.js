/*
    Modal Made By Monnapse
    Made for Hubers Cloud
*/

// SETTINGS
const modalColor = "#2D2D2D";

const ModalTypes = {
    SingleOption: "1Option",
    TwoOptions: "2Options",
}
const ModalButtonTypes = {
    Positive: {name:"Positive",color:"#DFB35D",hoverColor:"#DEBA74"},
    Negative: {name:"Negative",color:"#7B4848",hoverColor:"#A06868"},
}

function centerElement(element) {
    element.style.left = "50%";
    element.style.top = "50%";
    element.style.transform = "translate(-50%, -50%)";
}

class Modal {
    constructor(type) {
        this.type = type;
        this.message = null;
        this.options = [];
        this.modal = null;
    }
    setMessage(message) {
        this.message = message;
    }
    createOption(text, buttonType, callback) {
        this.options.push({
            text: text,
            type: buttonType,
            callback: callback
        });
    }
    create() {
       console.log("Type: "+this.type+", Message: "+this.message+", Options: "+this.options);
       /*
        <div>
          <p>
            The Modal Message goes here at the top above all the other elements below!!!
          </p>
          <div>
            <div>Yes</div>
            <div>No</div>
          </div>
        </div>
       */

        var backdropDiv = document.createElement("div");
        backdropDiv.classList.add("center");
        backdropDiv.style.zIndex = 999999;
        backdropDiv.style.position = "fixed";
        centerElement(backdropDiv);
        backdropDiv.style.width = "100%";
        backdropDiv.style.height = "100%";
        backdropDiv.style.backgroundColor = "rgba(0,0,0,0.35)";
        
        var mainDiv = document.createElement("div");
        mainDiv.classList.add("center");
        mainDiv.style.width = "fit-content";
        mainDiv.style.maxWidth = "650px";
        mainDiv.style.height = "fit-content";
        mainDiv.style.position = "absolute";
        centerElement(mainDiv)
        mainDiv.style.backgroundColor = modalColor;
        mainDiv.style.padding = "25px";
        mainDiv.style.borderRadius = "15px";
        
        var message = document.createElement("p");
        message.innerHTML = this.message;
        message.style.paddingBottom = "20px";
        message.style.fontWeight = "100"

        var options = document.createElement("div");
        options.style.width = "100%";
        options.style.height = "50px";
        options.style.display = "flex";
        options.style.columnGap = "20px";

        this.options.forEach(option => {
            var optionDiv = document.createElement("div");
            optionDiv.style.backgroundColor = option.type.color;
            optionDiv.style.width = 100/this.options.length+"%";
            optionDiv.style.height = "50px";
            optionDiv.style.position = "relative";
            optionDiv.style.borderRadius = "15px";
            optionDiv.style.textAlign = "center";
            optionDiv.style.cursor = "pointer";
            optionDiv.style.transition = "0.2s";
            optionDiv.addEventListener("mouseenter", (event)=>{optionDiv.style.backgroundColor = option.hoverColor;});
            optionDiv.addEventListener("mouseleave", (event)=>{optionDiv.style.backgroundColor = option.color;});
            optionDiv.addEventListener("click", (event)=>{
                backdropDiv.remove();

                if (option.callback) {option.callback();}
            });

            var optionSpan = document.createElement("span");
            optionSpan.textContent = option.text;
            optionSpan.classList.add("center");
            optionSpan.style.position = "absolute";
            centerElement(optionSpan);
            
            backdropDiv.style.width = "100%";
            backdropDiv.style.height = "100%";

            optionDiv.appendChild(optionSpan);
            options.appendChild(optionDiv);
        });

        mainDiv.appendChild(message);
        mainDiv.appendChild(options);
        backdropDiv.appendChild(mainDiv);
        this.modal = backdropDiv;
    }
    show() {
        document.body.insertBefore(this.modal, document.body.firstChild);
    }
}

//const modal = new Modal(ModalTypes.TwoOptions);
//modal.setMessage("The Modal Message goes here at the top above all the other elements below!!!");
//modal.createOption("Yes", ModalButtonTypes.Positive, ()=>{
//    console.log("Selected Yes");
//    setTimeout(()=>{
//        modal.create();
//        modal.show();
//    }, 2000)
//});
//modal.createOption("No", ModalButtonTypes.Negative, ()=>{
//    console.log("Selected No");
//});
//modal.create();
//modal.show();