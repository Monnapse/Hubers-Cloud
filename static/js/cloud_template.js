document.addEventListener("DOMContentLoaded", ()=>{
    console.log("CLOUD TEMPLATE JAVASCRIPT LOADED!");

    // Side Navigation Toggle button for smaller devices
    document.getElementById("side-nav-button").addEventListener("click", ()=>{
        document.getElementById("side-nav").style.display = "block";
    })
    document.getElementById("side-nav-button-inside").addEventListener("click", ()=>{
        document.getElementById("side-nav").style.display = "none";
    })

    // Drive info panel
    var response, code;
    [response, code] = request(window.location.origin+"/get_drive", "GET");
    if (response) {
        var dip = DriveInfoPanel();
        dip.SetDriveSize(response.size);
        response.categories.forEach(category => {
            dip.addCategory(category.category, "cloud-info-color-"+category.category, category.size, category.files)
        });
        dip.addFreeSpaceCategory("Free Space", "drive-info-categor-color-default");
        dip.sortCategories(-1);
        dip.render();
        dip.Panel.style.width = "85%";
        dip.Panel.style.top = "20px";
        document.getElementById("side-nav").insertBefore(dip.Panel, document.getElementById("upload-status-container"));
    }
})