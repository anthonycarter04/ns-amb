/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Aug 2014     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function execScript(type) {
	var baseUrl = 'http://adv.moolahmedia.com/advReportingApi.php';
	var lEmail = 'test@test.com';
	var lPass = 'test12345';
	var fromDate = '01/01/2014';
	var toDate = '12/31/2014';
	var cParam = 'US,CA';
	var testUrl = 'http://adv.moolahmedia.com/advReportingApi.php?email=' + lEmail + '&password=' + lPass + '&from=' + fromDate + '&to=' + toDate + '&c=' + cParam
	//testUrl = encodeURI(testUrl);
	
	var headers = {"User-Agent-x": "SuiteScript","Content-Type":"application/json"};
    /*xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", testUrl, false );
    xmlHttp.send(  );
    //Util.console.log(theData);*/
	
	//var data = nlapiRequestURL(testUrl, postdata, headers, callback, httpMethod);
	//var data = nlapiRequestURL(baseUrl, null,{email : lEmail, password : lPass, from: fromDate, to: toDate, c: cParam} );
	/*var data = nlapiRequestURL('http://www.google.com', null, headers);
    Util.console.log(data);
    Util.console.log(data.getURL);*/
	//var slURL = nlapiResolveURL('SUITELET', 'customscript_box_refresh_tokens', 'customdeploy_box_refresh_tokens');
	//nlapiRequestURL(slURL);
	//var slURL = nlapiResolveURL('SUITELET', 'customscript_amobee_sl_box_api', 'customdeploy_amobee_sl_box_api');
	//nlapiRequestURL(slURL);
	var slURL = nlapiResolveURL('SUITELET', 'customscript_vendor_api_suitelet', 'customdeploy1');
	
	nlapiRequestURL(slURL);
    //nlapiRequestURL(url, postdata, headers, callback, httpMethod)
    
	
	/*var theData = $.get("http://adv.moolahmedia.com/advReportingApi.php",{email : lEmail, password : lPass, from: fromDate, to: toDate, c: cParam})
		  .done( function(data) {
		       Util.console.log(data);
		    }
	);*/
	//Util.console.log(theData);
	/*var theData = $.get(testUrl);
	Util.console.log(theData);*/
  //  Util.console.log(xmlHttp.responseText);
	
	/*xmlHttp.onreadystatechange=function()
	  {
		Util.console.log('checking');
	  if (xmlHttp.readyState==4 && xmlhttp.status==200)
	    {
		  xmlHttp.open( "GET", testUrl, false );
		   xmlHttp.send( null );
	    }
	  };*/
}

function loadXMLDoc()
{
var xmlhttp = new XMLHttpRequest();



xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
	  	Util.console.log('test');
	  	$.get( encodeURIComponent("https://adv.moolahmedia.com/advReportingApi.php"), function( data ) {
  			Util.console.log(data);
	  	}, "json" );
    }
}
xmlhttp.open("GET","demo_get.asp",true);
xmlhttp.send();
}

