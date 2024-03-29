/**
 * upload.
 *
 * @param {File} file
 */
function upload(files) {
    //console.log(files.FileList);
    //console.log(Array.from(files));
    for (file in Array.from(files)) {
      //console.log(files[file]);
      uploadFile(files[file]);
    }
}
  
function uploadFile(file) {
    //alert(file.name+" | "+file.size+" | "+file.type);
    if (file == undefined) {return;}
    uploadingAmount+=1;
    var title = document.getElementById("upload-status-files-title");
    title.innerText = "Uploading " + uploadingAmount + " files";

    console.log(console);
    var formdata = new FormData();
    formdata.append("file1", file);
    var ajax = new XMLHttpRequest();

    //ajax.upload.addEventListener("progress", progressHandler, false);
  
    /*
  
    COMPLETE
    <div class="file-upload-status center-horizontally-relative">
      <img class="file-icon-uploading" src="static/images/Image.png">
      <span class="file-name-upload">picture.png</span>
      <img class="progress-bar" src="static/images/Check.png"></img>
    </div>
  
    IN PROGRESS
    <div class="file-upload-status center-horizontally-relative">
      <img class="file-icon-uploading" src="static/images/Image.png">
      <span class="file-name-upload">picture.png</span>
      <div class="progress-bar"></div>
    </div>
  
    */
    var div,fileImg,fileName,progressDiv = createFileProgressDiv(file.name);
  
    ajax.upload.addEventListener("progress", function(event) { progressHandler(event, progressDiv) }, false)

    r = "";
    c = 0;
    url=null;
    [response, code] = request(window.location.origin+"/files/getcategory", "GET", {
        "File-Name": file.name
    })

    var reader  = new FileReader();
    reader.onload = function(e)  {
        var id = addNewFile(file.name, file.path);
        //id, name, size, isDirectory, category, fileUrl
        createFile(id, file.name, bytesToSize(file.size), false, response, e.target.result);
        console.log(e.target);
    }
    reader.readAsDataURL(file);

    //if (response == "Image" || response == "Video") {
    //  var reader  = new FileReader();
    //  url = window.URL.createObjectURL(file)
    //}
    //console.log(file);
    ajax.addEventListener("load", function(event) { completeHandler(event, progressDiv, response, file.name, file.size) }, false);
    //ajax.addEventListener("error", errorHandler, false);
    //ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", "upload"); // http://www.developphp.com/video/JavaScript/File-Upload-Progress-Bar-Meter-Tutorial-Ajax-PHP

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var path = urlParams.get('path');
    if (path) {ajax.setRequestHeader("FilePath", path.toString());}
    
    //console.log(formdata);
    ajax.send(formdata);
    // ajax.abort(); // ABORTS
  }