const nextKey = "key"
const filesAmount = 20

var response = "";
var code = 0;



const delay = 10; // 0.01 seconds

var time = 0;

const clickDelay = 500; // 0.5 seconds

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var path = urlParams.get('path');

console.log(path)

var filesPaths = {};
var filesNames = {};
var filesDivs = {};

var filesSelected = []; // Array that lists all files that user has selected

var lastSelectedIndex = null;

function create_directoy_button(name, path) {
    /*
    <img class="arrow-img" src="/static/images/Arrow.png">
    <a class="title" href="cloud">Main</a>
    */

    var directoryList = document.getElementById("directory")

    var arrowImg = document.createElement("img");
    arrowImg.classList.add("arrow-img");
    arrowImg.src = "/static/images/Arrow.png"
    directoryList.appendChild(arrowImg)

    var directoryButton = document.createElement("a");
    directoryButton.classList.add("title");
    directoryButton.innerText = name;
    directoryButton.href = "cloud?path="+path
    directoryList.appendChild(directoryButton)
}

if (path) {
    var pathSplit = path.split("/");
    var currentPath = ""

    for (i = 0; i < pathSplit.length; i++) {
        var name = pathSplit[i]
        if (i==0) {currentPath = name;}
        else {currentPath = currentPath + "/" + name;}
        create_directoy_button(name, currentPath);
    }
}

function get_files_selected(){ return filesSelected; }

function get_files(path) {
    [response, code] = request(window.location.origin+"/grab_files", "GET", {
        "Path": path,
        "Next-Key": nextKey,
        "Files-Amount": filesAmount
    })
    //response = loginForm[0]
    //code = loginForm[1
    for (i in response) {
        file = response[i];
        //console.log(file);
        time += delay;
        if (file.path) {
            //fileResponse = "";
            //fileCode = 0;
            //[response, code] = requestMedia(window.location.origin+"/drives/file?path="+file.path, "GET")
            //console.log(response)
            var id = addNewFile(file.name, file.path);
            //filesPaths[id] = file.path;
            //filesNames[id] = file.name;

            if (file.is_file) {
                filePath = "drives/previewfile?path="+file.path;
                setTimeout(file__, time, file, filePath, id);
            } else {
                setTimeout(file__, time, file, file.path, id);
            }
            
            //createFile(file.name, file.size, file.is_dir, file.category, filePath);
        //} else {
        //    //setTimeout(funtion(){
        //    //    e = createFile(file.name, file.size, file.is_dir, file.category)
        //    //}, time);
        //    createFile(file.name, file.size, file.is_dir, file.category, file.path);
        }
    }
}

function addNewFile(name, path) {
    var id = makeid(7);
    filesPaths[id] = path;
    filesNames[id] = name;
    return id;
}

function get_file_path(id) {
    return filesPaths[id];
}
function get_file_name(id) {
    return filesNames[id];
}
function get_file_div(id) {
    return filesDivs[id];
}

function file__ (file, url, id) {
    createFile(id, file.name, file.size, file.is_dir, file.category, url);
}

get_files(path)

function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}
Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === val) {
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  }
function getChildElementIndex(node) {
    return Array.prototype.indexOf.call(node.parentNode.children, node);
}
function getIndexOf(key, Array) {
    var i=0;
    Array.forEach(element => {
        //console.log(element, key, element==key, i);
        if (element==key){return i;}
        i++;
    });
    return i;
}
function selectFile(id) {
    if (!filesSelected.includes(id)) {
        filesSelected.push(id); // Add id to the selected array
    }
    var btn = get_file_div(id);
    if (btn) {btn.classList.add("file-button-selected");}
}
function unselectFile(id) {
    var fileButton = get_file_div(id);
    fileButton.classList.remove("file-button-selected");
    //var index = getIndexOf(id, filesSelected)
    //console.log("Deleting: " + index)
    //delete filesSelected[index];
    filesSelected.removeByValue(id);
}
function unselectAllFiles() {
    // regular for loop is better than forEach for loop
    const length = filesSelected.length;
    for (i=0;i<length;i++) {
        unselectFile(filesSelected[0]);
        //console.log("Unselecting: "+filesSelected[0], filesSelected.length, i);
    }
    //filesSelected.forEach(fileId => {
    //    console.log("Unselecting: "+fileId);
    //    unselectFile(fileId);
    //});
}
function isLeftClick(evt) {
    evt = evt || window.event;
    if ("buttons" in evt) {
        return evt.buttons == 1;
    }
    var button = evt.which || evt.button;
    return button == 1;
}

function createFile(id, name, size, isDirectory, category, fileUrl) {
    /*

    <div class="file-button">
        <img src="static/images/Example.png" class="file-button-img">
        <div class="file-button-bottom center-horizontally-relative">
            <div class="file-button-options center-vertically-relative">
                <img src="static/images/Options.png" class="file-button-options-img center-relative">
            </div>
            <span class="file-button-name center-vertically-relative">file name goes here</span>
            <span class="file-button-size center-vertically-relative">99.9 GB</span>
        </div>
    </div>

    <div class="file-button">
        <img class="file-button-img" src="static/images/Image.png">
        <div class="file-name-upload center-horizontally-relative">
            <div class="file-button-options center-vertically-relative">
                <img class="file-button-options-img center-relative" src="static/images/Options.png">
            </div>
            <span class="file-button-name center-vertically-relative">desktop</span>
            <span class="file-button-size center-vertically-relative">46.0 </span>
        </div>
    </div>

    */
    var grid = document.getElementById("file-grid");

    var fileButton = document.createElement("div");
    fileButton.setAttribute("type", "file");
    fileButton.setAttribute("file-id", id);
    fileButton.classList.add("file-button");
    fileButton.id = "file-button";

    filesDivs[id] = fileButton;
  
    //console.log(window.location.host+"/cloud"+"?path="+fileUrl);

    var virtualSelected = false;
    var visualSelected = false;
    var canClick = false;

    fileButton.onmousedown = function (event) {
        if (!isLeftClick(event)) {return;}

        if (!virtualSelected && !canClick) {
            console.log(event);

            var index = getChildElementIndex(fileButton);

            //if (event.ctrlKey) {
            //    filesSelected.push(id); // Add id to the selected array
            if (event.shiftKey) {
                //console.log(getChildElementIndex(fileButton));
                if (lastSelectedIndex != null) {
                    var indexsInBetween = Math.abs(index - lastSelectedIndex);
                    var normal = (index - lastSelectedIndex>0) ? 1:-1;
                    if (normal>0){indexsInBetween-1;}
                    //indexsInBetween = Math.abs(indexsInBetween);
                    //console.log(normal);
                    var fileKeys = Object.keys(filesDivs);
                    for (i=1;i<=indexsInBetween;i++) {
                        var newIndex = lastSelectedIndex+(i*normal);
                        var btnId = fileKeys[newIndex];
                        var btn = filesDivs[btnId];
                        //console.log(newIndex);
                        if (btn) {
                            selectFile(btnId);
                        }
                    }
                }
            } else if (!event.ctrlKey) {
                unselectAllFiles();
            }

            //console.log(event.ctrlKey, id, filesSelected)
            if (event.ctrlKey && filesSelected.includes(id)) {
                unselectFile(id);
            } else if (!filesSelected.includes(id)) {
                selectFile(id);
            }

            //console.log(filesSelected);

           // console.log("LastIndex"+lastSelectedIndex,"CurrentIndex"+index, event);
            lastSelectedIndex = index;
            
            virtualSelected = true;
            canClick = true;
            setTimeout(function() {
                canClick = false;
                virtualSelected = false;
            }, clickDelay)
        } else if (virtualSelected && canClick) {
            //console.log("DOUBLE CLICKED");

            if (isDirectory && fileUrl) {
                //console.log(window.location.protocol)
                window.location.replace(window.location.protocol+"//"+window.location.host+window.location.pathname+"?path="+fileUrl);
            } else if (id) {
                previewById(id);
            }
        }

        //console.log("User moused down");
        //console.log(fileUrl);

        return true; // Not needed, as long as you don't return false
    };
    
    if (category == "Images" || category == "Videos") {
        var fileButtonImg = document.createElement("div");
        fileButtonImg.setAttribute("type", "file");
        fileButtonImg.setAttribute("file-id", id);
        fileButtonImg.classList.add("file-button-img");
        //console.log(file);
        //if (file) {
        //    fileButtonImg.style.backgroundImage = file;
        //} else {
        fileButtonImg.style.backgroundImage = "url('"+fileUrl+"')";
        //}
        
        fileButton.appendChild(fileButtonImg);
    } else {
        var fileButtonImg = document.createElement("img");
        fileButtonImg.setAttribute("type", "file");
        fileButtonImg.setAttribute("file-id", id);
        fileButtonImg.classList.add("file-button-icon");

        if (isDirectory) {
            fileButtonImg.src = "/static/images/Folder.png";
        } else {
            r="";
            c=0;
            [r, c] = request(window.location.origin+"/files/geticon", "GET", {
                "Category": category,
            })
            if (c==200){
                fileButtonImg.src = "/static/images/"+r;
            } else {
                fileButtonImg.src = "/static/images/Unkown.png)";
            }

            //if (category == "Documents") {
            //    fileButtonImg.src = "static/images/Image.png";
            //}
        }

        fileButton.appendChild(fileButtonImg);
    }
    
    
  
    var fileButtonBottom = document.createElement("div");
    fileButtonBottom.setAttribute("type", "file");
    fileButtonBottom.setAttribute("file-id", id);
    fileButtonBottom.classList.add("file-button-bottom");
    fileButtonBottom.classList.add("center-horizontally-relative");
    fileButton.appendChild(fileButtonBottom)

    var fileButtonOptions = document.createElement("div");
    fileButtonOptions.setAttribute("type", "file");
    fileButtonOptions.setAttribute("file-id", id);
    fileButtonOptions.classList.add("file-button-options");
    fileButtonOptions.classList.add("center-vertically-relative");
    fileButtonBottom.appendChild(fileButtonOptions)

    fileButtonOptions.addEventListener("click", (e)=>{
        var t = {};
        t = offset(fileButtonOptions);
        //console.log(t);
        setTimeout(()=>{
            contextMenu.doShowChecksFunction(e, t.left, t.top+20);
        }, 10);
    })
    //fileButtonOptions.addEventListener("click", showContextMenu)

    var fileButtonOptionsImg = document.createElement("img");
    fileButtonOptionsImg.setAttribute("type", "file");
    fileButtonOptionsImg.setAttribute("file-id", id);
    fileButtonOptionsImg.classList.add("file-button-options-img");
    fileButtonOptionsImg.classList.add("center-relative");
    fileButtonOptionsImg.src = "static/images/Options.png";
    fileButtonOptions.appendChild(fileButtonOptionsImg);

    var fileButtonName = document.createElement("span");
    fileButtonName.setAttribute("type", "file");
    fileButtonName.setAttribute("file-id", id);
    fileButtonName.classList.add("file-button-name");
    fileButtonName.classList.add("center-vertically-relative");
    fileButtonName.innerText = name;
    fileButtonBottom.appendChild(fileButtonName)

    var fileButtonSize = document.createElement("span");
    fileButtonSize.setAttribute("type", "file");
    fileButtonSize.setAttribute("file-id", id);
    fileButtonSize.classList.add("file-button-size");
    fileButtonSize.classList.add("center-vertically-relative");
    fileButtonSize.innerText = size;
    fileButtonBottom.appendChild(fileButtonSize)

    grid.appendChild(fileButton);
    //fileButton.classList.add("load")
    //fileButton.style.opacity = null;
  }
  