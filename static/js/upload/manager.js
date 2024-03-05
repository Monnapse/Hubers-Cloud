function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function createFileProgressDiv(name) {
  var list = document.getElementById("file-uploads-list");
  var div = document.createElement("div");
  div.classList.add("file-upload-status");
  div.classList.add("center-horizontally-relative");
  list.appendChild(div);

  var fileImg = document.createElement("img");
  fileImg.classList.add("file-icon-uploading");
  fileImg.src = "static/images/Image.png";
  div.appendChild(fileImg);

  var fileName = document.createElement("span");
  fileName.classList.add("file-name-upload");
  fileName.innerHTML = name;
  div.appendChild(fileName)

  var progressDiv = document.createElement("div");
  progressDiv.classList.add("progress-bar");
  div.appendChild(progressDiv);
  return div,fileImg,fileName,progressDiv
}
