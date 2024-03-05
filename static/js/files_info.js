function get_category_img(category) {
    if (category == "Images" || category == "Videos") {
        return "static/images/Image.png";
    } else if (category == "Documents") {
        return "static/images/Document.png";
    } else if (category == "Others") {
        return "static/images/Unkown.png";
    }
}