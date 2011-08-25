// ==UserScript==
// @match http://www.munzee.com/*
// @name         aMunzee
// @namespace    com.carlosefonseca.munzee
// @author       Carlos Fonseca
// @description  Turns the Munzee pages amazing
// @version		 0.1.2
// ==/UserScript==


// attaches the script to the body of the page allowing it to use the jQuery it already has
function addJQuery(callback) {
	var style = document.createElement("style");
	style.textContent = "#mapCanvas { width: 100% !important; } #map { position:absolute !important; height:100% !important; width:100% !important; left: 0 !important; top: 0 !important; z-index: 1000;}";
	document.body.appendChild(style);

    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
}


// the guts of this userscript
function main() {
	$("#logged-in-message").html($("#logged-in-message").html().replace(/back, (.+)\. | </,'<a href="http://www.munzee.com/m/$1" title="Your public profile page">$1</a> '))

	var map = $("#mapCanvas", "#body-box-content .content-box:first").detach();
	if (map.length == 0) return;
	var fulltxt = $("#body-box-content .content-box:first").text();
	$("#body-box-content .content-box:first").css("padding","20px").html($("<div id='details'></div>")).append(map);
	initialize();

	var obj = new Object();

	// Retrieves the notes
	notesSTR = "Notes: ";
	notesStart = fulltxt.indexOf(notesSTR);
	notesEnd = fulltxt.search(/\s*Deployed At:/);
	obj["Notes"] = fulltxt.slice(notesStart+notesSTR.length, notesEnd);
	obj["Notes"] = $.trim(obj["Notes"]).replace(/\n/g,"<br/>\n");

	txt = fulltxt.slice(0,notesStart)+fulltxt.slice(notesEnd);

	// split the rest of the text-data
	var patt=/\s*([^:]+): (.*)\s*/g;
	while (match = patt.exec(txt)) {
		obj[match[1]] = match[2];
	}

	// Title
	html = '<p id="mname" style="line-height:2em"><span style="font-size: 200%;font-weight:bold;margin-right:10px;color: #333;">'+obj['Friendly Name']+'</span> by '+obj['Creator']+'</p>';

	// Location
	if (obj["Deployed"]=="YES") {
		html += '<p style="color:#555;line-height:1.6em"><span>'+obj["DDD MM.MMM"]+'</span> &nbsp;•&nbsp; <span>'+obj["Decimal"]+'</span> <span style="margin-left:30px">'+obj['Location']+'</span></p>';
	}

	// Deploy & Dates
	if (obj["Deployed At"]!="") {
	  html += '<p style="color:#555;line-height:1.6em"><span id="mdate" style="width: 270px;display: inline-block;">Placed: '+obj['Deployed At']+'</span>		<span id="mfirst" style="margin-right:30px">First to Capture: <span style="font-weight:bold">'+obj['First To Capture']+'</span></span><br/>'+
		'<span style="width: 270px;display: inline-block;">Last Capture: '+obj["Last Captured At"]+'</span> <span style="margin-right:30px">Captured <span style="font-weight:bold">'+obj["Number of Captures"]+'</span> times</span></p>';
	}

	if (obj["Deployed"]=="NO") {
	  html += '<p style="color:#944;line-height:1.6em;font-weight:bold;">Not deployed</p>';
	}

	// Notes
	html += '<p style="line-height:1.4em;color:#222;margin:20px 0px;padding:10px 10px;background-color:#E7F0CE">'+obj["Notes"]+'</p>';

	$("#details").html(html);
}




// add the main function to the body of the page, and run it.
addJQuery(main);