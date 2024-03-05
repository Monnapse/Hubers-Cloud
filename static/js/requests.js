/**
 * @returns {Array}
 */
function request(url, method, headers) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(method, url, false);

    if (headers) {
        for (const [key, value] of Object.entries(headers)) {
            xmlHttp.setRequestHeader(key,value);
        }
    }
    
    xmlHttp.send(null);
    json = JSON.parse(xmlHttp.response)
    return [json["response"], xmlHttp.status];
}

/**
 * @returns {Array}
 */
function requestMedia(url, method, headers) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(method, url, false);

    if (headers) {
        for (const [key, value] of Object.entries(headers)) {
            xmlHttp.setRequestHeader(key,value);
        }
    }
    
    xmlHttp.send(null);
    return [xmlHttp.response, xmlHttp.status];
}