document.addEventListener("DOMContentLoaded", ()=>{
    console.log("DRIVES JAVASCRIPT LOADED!");

    // Drive info panel
    var response, code;
    [response, code] = request(window.location.origin+"/get_all_drives", "GET");
    console.log(response);
    if (response) {
        //var first = false;
        response.forEach(drive => {
            //if (first) {return}
            //first = true;
            var dip = DriveInfoPanel();
            dip.SetDriveSize(drive.size);
            drive.categories.forEach(category => {
                dip.addCategory(category.category, "cloud-info-color-"+category.category, category.size, category.files)
            });
            dip.addFreeSpaceCategory("Free Space", "drive-info-categor-color-default");
            dip.sortCategories(-1);
            dip.render();

            //document.getElementById("drive-card-progress").appendChild(dip.Panel);
            createDriveCard(drive.name, "USB C 1", dip.Panel);
        });
    }
})

/**
 * 
 * @param {String} name 
 * @param {String} port 
 * @param {DriveInfoPanel} dip 
 */
function createDriveCard(name, port, dip) {
    /*
    <div class="drive-card">
        <div class="drive-card-top">
            <h1 class="drive-card-title">My Drive 1</h1>
        </div>
        <span class="drive-card-port">USB C 1</span>
        <div id="drive-card-progress" class="drive-card-progress">

        </div>
    </div>
    */  

    var driveCard = document.createElement("div");
    driveCard.classList.add("drive-card");

    var driveCardTop = document.createElement("div");
    driveCardTop.classList.add("drive-card-top");
    driveCard.appendChild(driveCardTop);

    var title = document.createElement("h1");
    title.classList.add("drive-card-title");
    title.textContent = name;
    driveCardTop.appendChild(title);

    var drivePort = document.createElement("span");
    drivePort.classList.add("drive-card-port");
    drivePort.textContent = port;
    driveCard.appendChild(drivePort);

    var driveProgress = document.createElement("div");
    driveProgress.classList.add("drive-card-progress");
    driveProgress.appendChild(dip);
    driveCard.appendChild(driveProgress);

    document.getElementById("drives-grid").appendChild(driveCard);
}