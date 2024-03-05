var uploadedAmount = 0
var uploadingAmount = 0

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      upload(inputElement.files);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  //dropZoneElement.addEventListener("drop", (e) => {
  //  e.preventDefault();
//
  //  if (e.dataTransfer.files.length) {
  //    console.log(e.target.files);
  //    inputElement.files = e.dataTransfer.files;
  //    upload(e.dataTransfer.files);
  //  }
//
  //  dropZoneElement.classList.remove("drop-zone--over");
  //});
  

  dropZoneElement.addEventListener("drop", function(event) {
    event.preventDefault();
    dropZoneElement.classList.remove("drop-zone--over");
    
    var items = event.dataTransfer.items;
    for (var i=0; i<items.length; i++) {
      // webkitGetAsEntry is where the magic happens
      var item = items[i].webkitGetAsEntry();
      //if (item.isDirectory) {
      //  uploadFolder(item)
      //} else 
      if (item.isFile) {
        uploadFile(item)
      }
    }
  }, false);
});


function progressHandler(event, progress, id) {
  // During the upload progress
  var percent = (event.loaded / event.total) * 100;
  //console.log(percent, id)
  progress.style.background = "radial-gradient(closest-side, var(--charcoal) 85%, transparent 85% 100%), conic-gradient(var(--gold) " + percent + "%, var(--charcoal-2) 0)"
}

function bytesToSize(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"];
  for (let i = 0; i < units.length; i++) {
      if (Math.abs(bytes) < 1024.0) {
          return `${bytes.toFixed(1)} ${units[i]}`;
      }
      bytes /= 1024.0;
  }
  return `${bytes.toFixed(1)} B`;
}

function completeHandler(event, progress, category, name, size) {
  //console.log(event.target);
  // Succesfully uploaded
  uploadedAmount+=1;
  uploadingAmount-=1;

  if (uploadingAmount <= 0) {
    uploadingAmount = 0
    var title = document.getElementById("upload-status-files-title");
    title.innerText = "Succesfully uploaded " + uploadedAmount + " files";
  }

  var parent = progress.parentNode;
  var fileImg = document.createElement("img");
  fileImg.classList.add("progress-bar");

  if (event.target.status == 200) {
    fileImg.src = "static/images/Check.png";

    //console.log(event.name, event, event.size);

    //if (fileurl) {
    //  var reader  = new FileReader();
    //  createFile(name, bytesToSize(size), false, category, fileurl)
    //} else {
      // name, size, isDirectory, category, fileUrl, file
    
    //createFile(name, bytesToSize(size), false, category, null, event.target.result)
    //}
    
    //console.log(file);
  } else {
    fileImg.src = "static/images/Error.png";
  }
  parent.replaceChild(fileImg, progress);
}

function errorHandler(event, progress, id) {
  _("status").innerHTML = "Upload Failed";
}

function abortHandler(event, progress, id) {
  _("status").innerHTML = "Upload Aborted";
}