// idk if i need this but ill save it anyways lol

function httpGet(theUrl){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
	}

function newGif(){
	return JSON.parse(httpGet("https://api.giphy.com/v1/gifs/random?api_key=9f6Ic6dYSZ54RAMIdCDrY64L2WbpqbFo&tag=cute-anime")).data.images.original.url;
	}