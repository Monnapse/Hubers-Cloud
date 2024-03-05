/*
    Made by Monnapse
*/

var cssAdded = false;
var addCssStyling;
if (!addCssStyling) {addCssStyling = style => document.head.appendChild(document.createElement("style")).innerHTML=style;}

const ContextMenuStyleTypes = {
    Default: {
        name: "default",
        css_styling: `
        /* CONTEXT MENU */
        .context-menu {
            position: fixed;
            visibility: hidden;
            z-index: 99999999;
            width: 200px;
            height: min-content;
            background-color: var(--dark-smoke);
            padding-top: 10px;
            padding-bottom: 10px;
            border-radius: 5px;
        }
        .context-menu button {
            width: 100%;
            height: 26px;
            text-align: left;
            vertical-align: middle;
            font-size: 14px;
            background-color: transparent;
            border: none;
            stroke: none;
            font-weight: 100;
        }
        .context-menu button:hover {
            background-color: var(--smoke-2);
        }
    `
    }
}

function ContextMenu() {
    /*
        Make a context menu
    */

    var self = {};
    var options = [];
    var currentStyleName = "";
    var currentStyleCss = "";
    var element = null;
    var showChecksFunction = null;
    var hideChecksFunction = null;
    
    /**
    * Create a new option inside the context menu.
    * @param {string} name Name for the option.
    * @param {string} text The text displayed for the option.
    * @param {function(event)} callback Callback function for when the option is selected/clicked.
    */
    self.newOption = function (name, text, callback) {
        options.push({
            name: name,
            text: text,
            callback: callback
        });
    }

    /**
    * This builds the context menu into elements.
    * @param {ContextMenuStyleTypes} style The style of the context menu (you can get premade styles from **ContextMenuStyleTypes** list).
    */
    self.buildContextMenu = function (style) {
        currentStyleName = style.name;
        currentStyleCss = style.css_styling;
        if (style.name=="default") {
            /*
                <div id="context-menu" class="context-menu">
                  <button id="context-menu-open">Open/Preview</button>
                  <button id="context-menu-download">Download</button>
                  <button id="context-menu-rename">Rename</button>
                  <button id="context-menu-delete">Delete</button>
                  <button id="context-menu-info">File Information</button>
                </div>
            */
            var contextMenuDiv = document.createElement("div");
            contextMenuDiv.classList.add("context-menu");
            contextMenuDiv.id = "context-menu";

            var index = 0;
            options.forEach(option => {
                var optionButton = document.createElement("button");
                optionButton.textContent = option.text;
                optionButton.addEventListener("click", option.callback);
                //options[index] = option;
                option["element"] = optionButton;
                contextMenuDiv.appendChild(optionButton);
                index++;
            });

            element = contextMenuDiv;
        }
    }

    /**
    * Displays the current context menu.
    * @param {number} left the left position of the context menu.
    * @param {number} top the top position of the context menu.
    * @param {[]} optionsBlacklist hides the options in this list.
    */
    self.showContextMenu = function (left, top, optionsBlacklist) {
        if (element) {
            if (!cssAdded) {addCssStyling(currentStyleCss);}

            options.forEach(option => {
                if (option["element"] && optionsBlacklist && optionsBlacklist.includes(option["name"])) {
                    option["element"].style.display = "none";
                } else if (option["element"]) {
                    option["element"].style.display = "block";
                }
            });

            document.body.insertBefore(element, document.body.firstChild);
            element.style.visibility = "visible";

            console.log(window.innerWidth,left+element.offsetWidth);
            console.log(window.innerHeight,top+element.offsetHeight);

            // LEFT
            if (left+element.offsetWidth > window.innerWidth) {
                element.style.left = window.innerWidth-element.offsetWidth + 'px';
            } else {
                element.style.left = left + 'px';
            }
            // TOP
            if (top+element.offsetHeight > window.innerHeight) {
                element.style.top = window.innerHeight-element.offsetHeight + 'px';
            } else {
                element.style.top = top + 'px';
            }
            //element.style.left = Math.min(left, window.innerWidth) + 'px';
            //element.style.top = Math.min(top, window.innerHeight) + 'px';
        }
    }

    /**
    * Hides the context menu.
    */
    self.hideContextMenu = function () {
        if (element) {
            element.style.visibility = "hidden";
        }
    }

    /**
    * Add a function for when user requests context menu to check anything before displaying context menu.
    * Returning true = show context menu,
    * Returning false = not showing context menu,
    * Returning null = regular context menu.
    * @param {function(event)} event The function to do the checks.
    */
    self.addShowChecksFunction = function(event) {showChecksFunction = event;}

    /**
    * Add a function for when user requests context menu to check anything before displaying context menu.
    * Returning true = hide context menu,
    * Returning anything else = nothing changes,
    * @param {function(event, isShowing)} event The function to do the checks.
    */
    self.addHideChecksFunction = function(event) {hideChecksFunction = event;}
    
    /**
    * This should be used if you want to show context menu and do the show checks function at same time.
    * @param {Event} event the event that sets this off.
    * @param {number?} leftOverwrite sets the left position of the context menu. Defaults to the clientX.
    * @param {number?} topOverwrite sets the top position of the context menu. Defaults to the clientY.
    */
    self.doShowChecksFunction = function(event, leftOverwrite, topOverwrite) {
        var check = true;
        if (showChecksFunction) {
            check = showChecksFunction(event);
        }
        
        if (check) {
            event.preventDefault();
            self.showContextMenu(leftOverwrite || event.clientX, topOverwrite || event.clientY);
        } else if (check == false) {
            event.preventDefault();
        }
    }

    /**
    * Adds a contextmenu event listener for when the user requests context menu.
    */
    self.startShowFunctionality = function() {
        /*
            FUNCTIONALITY TASKS

            DEFAULT
        */
        document.addEventListener("contextmenu", event=>{
            self.doShowChecksFunction(event);
        });
    }

    /**
    * This should be used if you want to hide context menu and do the hide checks function at same time.
    * @param {Event} event the event that sets this off.
    */
    self.doHideChecksFunction = function(event) {
        var check = true;
        if (hideChecksFunction) {
            var isShowing = false;
            if (element.style.visibility == "visible"){isShowing=true;}
            check = hideChecksFunction(event, isShowing);
        }
        
        if (check) {
            this.hideContextMenu();
        }
    }

    /**
    * Adds a click event listener for when the user is hiding context menu.
    */
    self.startHideFunctionality = function() {
        /*
            FUNCTIONALITY TASKS

            DEFAULT
        */
        document.addEventListener("click", event=>{
            self.doHideChecksFunction(event);
        });
    }

    return self
}

//const contextMenu = ContextMenu()
//contextMenu.newOption("open", "Open/Preview", e=>{console.log(e);});
//contextMenu.newOption("download", "Download", e=>{console.log(e);});
//contextMenu.newOption("rename", "Rename", e=>{console.log(e);});
//contextMenu.newOption("delete", "Delete", e=>{console.log(e);});
//contextMenu.newOption("info", "File Information", e=>{console.log(e);});
//contextMenu.buildContextMenu(ContextMenuStyleTypes.Default);
//contextMenu.addChecksFunction((event)=>{
//    console.log(event);
//    return false;
//});
//contextMenu.setFunctionality();
//contextMenu.showContextMenu(0,0);
//contextMenu.addChecksFunction