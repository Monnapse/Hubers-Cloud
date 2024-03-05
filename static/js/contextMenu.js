//document.onclick = hideMenu; 
//document.oncontextmenu = showContextMenu

var currentTarget;
var selectedTargetId;
const contextMenu = ContextMenu();

document.addEventListener("DOMContentLoaded", (e)=>{
    console.log("Context Menu Loaded");

    //document.addEventListener("contextmenu", showContextMenu);
    //document.addEventListener("click", hideMenu);

    //document.getElementById("context-menu-open").addEventListener("click", openButtonClicked);
    //document.getElementById("context-menu-download").addEventListener("click", downlodButtonClicked);
    //document.getElementById("context-menu-rename").addEventListener("click", renameButtonClicked);
    //document.getElementById("context-menu-delete").addEventListener("click", deleteButtonClicked);

    contextMenu.newOption("open", "Open/Preview", openButtonClicked);
    contextMenu.newOption("download", "Download",downlodButtonClicked);
    contextMenu.newOption("rename", "Rename", renameButtonClicked);
    contextMenu.newOption("delete", "Delete", deleteButtonClicked);
    contextMenu.newOption("info", "File Information", infoButtonClicked);

    contextMenu.buildContextMenu(ContextMenuStyleTypes.Default);
    contextMenu.addShowChecksFunction(event=>{
        //console.log(event);
        if (event.target && event.target.getAttribute("type") == "file") {
            currentTarget = event.target;
            return true;
        } else {return false;}
        //return false;
    });

    contextMenu.addHideChecksFunction((event,isShowing)=>{
        //console.log(isShowing, event);
        return true;
    })

    contextMenu.startShowFunctionality();
    contextMenu.startHideFunctionality();
    //contextMenu.showContextMenu(0,0);
    //console.log("Now showing context menu");
})

//function hideMenu() { 
//        document.getElementById("context-menu").style.visibility = "hidden";
//} 

//function showContextMenu(event, left, top) {
//    event.preventDefault();
//    //console.log(event);
//    if (event.target && event.target.getAttribute("type") == "file") {
//        //console.log(event.target.getAttribute("type") == "file");
//        var contextMenu = document.getElementById("context-menu");
//        document.getElementById("context-menu").style.visibility = "visible";
//
//        if (left) {
//            contextMenu.style.left = left + 'px';
//        } else {
//            contextMenu.style.left = event.clientX + 'px';
//        }
//        console.log(top);
//        if (top) {
//            contextMenu.style.top = top + 'px';
//        } else {
//            contextMenu.style.top = event.clientY + 'px';
//        }
//
//        currentTarget = event.target
//    }
//}

function getTargetId() {
    if (currentTarget && currentTarget.getAttribute("file-id")) {
        return currentTarget.getAttribute("file-id");
    } else if (selectedTargetId) {
        return selectedTargetId;
    }
}
function getFilePath() {
    return get_file_path(getTargetId());
}
function getFileName() {
    return get_file_name(getTargetId());
}
function getFileName2() {
    var path = getFilePath();
    if (path) {
        return path.substring(path.lastIndexOf("/")+1, path.length);
    } else {
        return getFileName();
    }
}

function downloadFile(path, fileName) {
    fetch(window.location.origin+"/download", { 
        method: "GET", 
        headers: {
            "path": path
        } 
    })
      .then((res) => res.blob())
      .then((res) => {
        //console.log(res);
        const aElement = document.createElement("a");
        aElement.setAttribute("download", fileName);
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        aElement.click();
        URL.revokeObjectURL(href);
      });
  }

function openButtonClicked(event) {
    //console.log("Requesting preview!");

    previewById(getTargetId());
}
function downlodButtonClicked(event) {
    //console.log("Requesting a download!");
    var path = getFilePath();
    var name = getFileName2();
    if (path) {
        console.log(path);
        downloadFile(path, name);
        //response, code = null;
        //[response, code] = requestMedia(window.location.origin+"/download", "GET", {
        //    "path": path,
        //})
        //console.log(response);
        //if (response) {
        //    downloadFile(response, "test.png");
        //}
    }
}
function renameButtonClicked(event) {
    //console.log("Requesting to rename!");
}
function deleteButtonClicked(event) {
    //console.log("Requesting to delete! " + getFilePath() + " : " + currentTarget);
    var path = getFilePath();

    const deleteModal = new Modal(ModalTypes.TwoOptions);
    deleteModal.setMessage("Are you sure you want to delete file: <b>" + getFileName2() +"</b>");
    deleteModal.createOption("Yes", ModalButtonTypes.Positive, ()=>{
        [response, code] = requestMedia(window.location.origin+"/delete", "POST", {
            "path": path,
        })
        console.log(response);
    
        get_file_div(getTargetId()).remove()
    });
    deleteModal.createOption("No", ModalButtonTypes.Negative, ()=>{});
    deleteModal.create();
    deleteModal.show();
    //currentTarget.remove();
}
function infoButtonClicked(event) {
    //console.log("Requesting to get info");
}
