/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Aug 2015     carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */

if (!AAC) { var AAC={};  }

function scheduled(type) {
	var url = AAC.Kat.hosts['prod'];
	
	var headers = {
			uid: 'katanaproduct@adconion.com',
			pwd: 'wer0ck!'
	}
	
	//var resp = nlapiRequestURL(url);
	var resp = nlapiRequestURL(url, '' , headers, 'GET');	

	Util.console.log(resp.getBody());
}

function callApi() {
	
}


AAC.Kat = {
	
	hosts: {
		//prod: 'https://katana.adconion.com/MicroStrategy/servlet/mstrWeb?Server=DB13.LAX.ADCONION.COM&Project=Katana+Campaign+Reporting&Port=34952&evt=4001&src=mstrWeb.4001&reportID=FA15BB4447D820A6F08F3CB60F09A3A1&visMode=0&reportViewMode=1'
		prod: 'https://mstr-msra.adconion.com/msreportadapter/?report=7997010A11E4D9CE11E100802FB7A954&network=AMG'
	}	
	
}

/*
import urllib2
import json

report = "7997010A11E4D9CE11E100802FB7A954"

# URL encoded parameters
network = "AMG"
io = "31121%3AADCOUNCIL_DEFAULT_FDI"
currency = "EUR"
start_date = "05%2F01%2F2015"
end_date = "05%2F31%2F2015"

query = "?headerAttribute;application/json;page=1;groupBy=null;maxResultsPerPage=null;Time+Filter+Prompt=Specified+Date+Range;1=%s;2=%s;Currency+Name=%s;4=%s;5=%s;" % (network, io, currency, start_date, end_date)

request = "https://mstr-msra.adconion.com/msreportadapter/%s%s" % (report, query)

r = urllib2.urlopen(request)

x = r.read()
print json.dumps(json.loads(x), indent=4)


*/