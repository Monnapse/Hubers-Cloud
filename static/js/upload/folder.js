//function getFile(fileEntry) {
//    var jsFileObject;
//    fileEntry.file(function (file){ 
//       jsFileObject = file 
//    });
//    return jsFileObject
//}

async function getFile(fileEntry) {
    try {
      return new Promise((resolve, reject) => fileEntry.file(resolve, reject));
    } catch (err) {
      console.log(err);
    }
}

async function traverseFileTree(item, path, fileCallback) {
    path = path || "";
    let size = 0;
    if (item.isFile) {
        // From inside an async method or JS module
        let file = await getFile(item); // Wait until we have the file
        if (fileCallback){fileCallback(file)}
        return file;
        //console.log(file);
    } else if (item.isDirectory) {
      // Get folder contents
      var dirReader = item.createReader();
      dirReader.readEntries(async function(entries) {
        for (var i=0; i<entries.length; i++) {
            s = await traverseFileTree(entries[i], path + item.name + "/");
            console.log(s.size);
            size += s.size;
        }
      });
    }
    return size;
}

function getFolderSize(item, sizeCallback) {
    //item.getMetadata((metadata) => {
    //    console.log(metadata.size);
    //});
    var path = "";
    let size = 0;
    var dirReader = item.createReader();
    //console.log(dirReader);
    dirReader.readEntries(async function(entries) {
      for (var i=0; i<entries.length; i++) {
            fileEntry = entries[i];
            if (fileEntry.isFile) {
                let file = await getFile(fileEntry); // Wait until we have the file
                console.log(file);
                size += file.size;
            }
            //s = await traverseFileTree(entries[i], path + item.name + "/");
            //console.log(s.size);
            //size += s.size;
      }
    });
    //console.log("Finnished");
    return size;
}

function uploadFolder(item) {
    size = getFolderSize(item);
    //console.log(size);
    //traverseFileTree(item);
}