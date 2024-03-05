var currentPreviewId = "";
var currentPreviewElement = null;

const previewTimeout = 1;
var lastTime = 0;

function createBasicFileModal(fileId) {
  var backdrop = document.createElement("div");
    backdrop.classList.add("backdrop");

    var filePreviewModal = document.createElement("div");
    filePreviewModal.classList.add("file-preview-modal");
    filePreviewModal.classList.add("center");

    var filePreviewModalTop = document.createElement("div");
    filePreviewModalTop.classList.add("file-preview-modal-top");

    var filePreviewModalName = document.createElement("span");
    filePreviewModalName.classList.add("file-preview-modal-name");
    filePreviewModalName.textContent = get_file_name(fileId);

    var fileButtonOptions = document.createElement("div");
   // fileButtonOptions.setAttribute("type", "file");
    //fileButtonOptions.setAttribute("file-id", id);
    fileButtonOptions.classList.add("file-button-options-2");
    fileButtonOptions.classList.add("center-vertically-relative");

    var fileButtonOptionsImg = document.createElement("img");
    //fileButtonOptionsImg.setAttribute("type", "file");
    //fileButtonOptionsImg.setAttribute("file-id", id);
    fileButtonOptionsImg.classList.add("file-button-options-img-2");
    fileButtonOptionsImg.classList.add("center-relative");
    fileButtonOptionsImg.src = "static/images/Options.png";

    fileButtonOptions.appendChild(fileButtonOptionsImg);

    filePreviewModalTop.appendChild(filePreviewModalName);
    filePreviewModalTop.appendChild(fileButtonOptions);

    filePreviewModal.appendChild(filePreviewModalTop);

    backdrop.appendChild(filePreviewModal);

    document.body.insertBefore(backdrop, document.body.firstChild);

    currentPreviewElement = backdrop;
    currentPreviewId = fileId;

    backdrop.addEventListener("click", event=>{
      var target = event.target;
      if (target == backdrop || target == filePreviewModal) {closePreview();}
    })

    fileButtonOptions.addEventListener("click", (e)=>{
      var t = {};
      t = offset(fileButtonOptions);
      //console.log(t);
      setTimeout(()=>{
        selectedTargetId = fileId;
        contextMenu.showContextMenu(t.left, t.top+40, ["open"]);
      }, 10);
  })

  return filePreviewModal
}

function showAVideo(videoId) {
  filePreviewModal = createBasicFileModal(videoId);

  var video = document.createElement("video");
  video.classList.add("file-preview-video");
  video.classList.add("center");
  video.controls = true;
  video.name = "media"

  var source = document.createElement("source");
  source.src = "drives/file?path="+get_file_path(videoId);

  video.appendChild(source);
  filePreviewModal.appendChild(video);
}

function showAPicture(pictureId) {
    /*
    <div class="backdrop">
      <div class="file-preview-modal center">
        <div class="file-preview-modal-top">
          <span class="file-preview-modal-name">FileName.png</span>

        </div>
        <div class="file-preview-img center" style="background-image: url(&quot;drives/file?path=Main/iPhone-APP.png&quot;);"></div>
      </div>
    </div>
    */
    filePreviewModal = createBasicFileModal(pictureId);

    var filePreviewImgDiv = document.createElement("div");
    filePreviewImgDiv.classList.add("file-preview-img");
    filePreviewImgDiv.classList.add("file-preview-img");
    filePreviewImgDiv.classList.add("center");
    filePreviewImgDiv.style.backgroundImage = "url('drives/file?path="+get_file_path(pictureId)+"')";

    var filePreviewImg = document.createElement("img");
    filePreviewImg.classList.add("file-preview-img-src");
    filePreviewImg.classList.add("center");
    filePreviewImg.src = "drives/file?path="+get_file_path(pictureId);
   // filePreviewImg.style = "background-img: url(&quot;drives/file?path="+get_file_path(pictureId)+"&quot;);";
    //console.log("background-image: url(&quot;drives/file?path="+get_file_path(pictureId)+"&quot;);");

    filePreviewImgDiv.appendChild(filePreviewImg);

    filePreviewModal.appendChild(filePreviewImgDiv);
}

function closePreview() {
  if (currentPreviewElement) {
    currentPreviewElement.remove();
  }
  if (currentPreviewId) {
    currentPreviewId = "";
  }
}

function previewById(fileId) {
  // Timeout so user cannot spam preview and get blocked
  if (Date.now() - lastTime > previewTimeout) {
    lastTime = Date.now();
    
    var fileName = get_file_path(fileId);
    var category = getCategory(fileName);
    //console.log(fileName, category);
    if (category && category == "Images") {
      currentTarget = null;
      selectedTargetId = fileId;
      showAPicture(fileId);
    } else if (category && category == "Videos") {
      showAVideo(fileId);
    } else {
      //console.log("Error previewing file");
    }
  }
}

function getExtension(name) {
  const split = name.split(".");
  return split[split.length - 1];
}

function getCategory(fileName) {
  var response, code = null;
  [response, code] = request(window.location.origin+"/files/getcategory", "GET", {
    "File-Name": fileName
  })
  return response;
}