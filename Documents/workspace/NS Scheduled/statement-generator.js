/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Dec 2015     carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function sGen(type) {
	
	//get customers from pre-defined search
	var cust = getCustomers();
	
	if (cust && cust != '') {
		
		//loop through all of the customers
		for (var i=0; i<10 /*cust.length*/; i++) {
			
			//get cust ID
			var custId = cust[i].getValue('internalid', 'customer' ,'group');
			if (custId && custId != '') {
				
				Util.console.log(custId, 'custId');
				
				//get customer's address information
				var custInfo = nlapiLookupField('customer', custId, ['billaddressee','billaddress1', 'billaddress2', 'billcity', 'billcountry', 'billstate', 'billzipcode', 'currency']);
				var curr = nlapiLookupField('customer', custId, 'currency', true);
				//apply cust ID as filter for search
				var filter = [new nlobjSearchFilter('internalid','customer', 'anyof', custId)];
				
				//get the invoice data for the customer
				var invs = getInvoices(filter);
				
				if (invs && invs != '') {
					
					//send to statement aggregation function
					var sInfo = prepStatement(invs);
					Util.console.log(sInfo, 'sInfo');
					
					//generate the statement
					var sSent = genStatement(sInfo, custInfo, curr);
				}
				
				
			}
			
			//check the usage and requeue if necessary
			var over = checkUsage('1000');
			if (over && over == 'Yes') {
				break;
			}
		}
		
	}
	
}

function checkNull(str) {
	Util.console.log(str, 'str');
	if (!str || str == null) {
		str = '';
	}
	
	return str;
}

function genStatement(sInfo, custInfo, curr) {
	
	//establish PDF
	var pdf = nlapiCreateTemplateRenderer();
	var date = getTheDate();
	
	//set address information for PDF
	var billAddrLine1 = checkNull(custInfo['billaddress1']) + ' ' + checkNull(custInfo['billaddress2']);
	var billAddrLine2 = checkNull(custInfo['billcity']) + ' ' + checkNull(custInfo['billstate']) + ' ' + checkNull(custInfo['billzipcode']);
	
	Util.console.log(date, 'date');
	//PDF document
	var pdfstart = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd"><pdf><head><style> table.itemtable{ font-family: sans-serif; font-size: 10pt; margin-top: 0px; table-layout: fixed; width: 100%; border-bottom: 1px solid black;} th { font-weight: bold; font-size: 11pt; vertical-align: middle; padding-right: 6px; padding-left: 6px; padding-bottom: 3px; padding-top: 5px; background-color: #860a0e; color: #FFFFFF;border:0; } td { padding-right: 6px; padding-left: 6px; padding-bottom: 4px; padding-top: 4px; } .itemtable td{border-left: 1px solid black} table.itemtable td:last-child{border-right:1px solid black;} b { font-weight: bold; color: #0c547b; } table.header td { padding: 0px; font-size: 10pt; } table.footer td { padding: 0px; font-size: 8pt; align: center; } table.itemtable th { padding-bottom: 10px; padding-top: 10px; } table.body td { padding-top: 2px; } table.total { page-break-inside: avoid; } tr.totalrow { background-color: #cfdde7; line-height: 200%; } td.totalboxtop { font-size: 12pt; background-color: #cfdde7; } td.addressheader { font-size: 8pt; padding-top: 6px; padding-bottom: 2px; } td.address { padding-top: 0px; } td.totalboxmid { font-size: 28pt; padding-top: 20px; background-color: #cfdde7; } td.totalboxbot { background-color: #cfdde7; font-weight: bold; } span.title { font-size: 28pt; } span.number { font-size: 16pt; } span.itemname { font-weight: bold; line-height: 150%; } hr { width: 100%; color: #d3d3d3; background-color: #d3d3d3; height: 1px; } .headtext{font-size: 14pt; padding-top:0px; font-family: Rockwell, Walbaum, Helvetica, sans-serif; line-height:80%;margin-bottom: 30px}</style></head><body>';
	
	//pdf body start
	
	var pdfbody = '<div align="left" style="width: 200px"><img src="https://system.sandbox.netsuite.com/core/media/media.nl?id=6741&amp;c=3620644&amp;h=4f6061f57d2b1c3e87e1"></img></div>';	
	pdfbody += '<table class="headtext" align="right" style="position:relative; right:10px; top:-60px">';
	pdfbody += '<tr><td><h1>Statement</h1></td></tr>';
	pdfbody += '<tr><td>Statement Date</td><td>' + date + '</td></tr>';
	pdfbody += '<tr><td>Amount Due</td><td>' + accounting.formatNumber(sInfo['balance'],2) + '</td></tr>';
	pdfbody += '<tr><td>Currency</td><td>' + curr + '</td></tr>';
	
	pdfbody += '</table>'
	pdfbody += '<table class="headtext" align="left">';
	pdfbody += '<tr><td><b>Bill To:</b></td></tr>';
	pdfbody += '<tr><td>' + checkNull(custInfo['billaddressee']) + '</td></tr>';
	pdfbody += '<tr><td>' + billAddrLine1 + '</td></tr>';
	pdfbody += '<tr><td>' + billAddrLine2 + '</td></tr>';
	pdfbody += '</table>';
	//pdfbody += '<p align="right" class="headtext">Customer: '+ sInfo['cust'] + '</p>';
	//pdfbody += '<p align="right" class="headtext">Statement Date:' + date + '</p>';
	//pdfbody += '<p align="right" class="headtext">Amount Due: ' + accounting.formatNumber(sInfo['balance'],2) + '</p>';
	pdfbody += '<table class="itemtable"><thead><tr><th align="left" colspan="3">Invoice</th><th colspan="1">Date</th><th colspan="2">Amount Remaining</th><th align="left" colspan="1">Balance</th></tr></thead>';
	
	//loop through invoice information and add to pdf body
	for (var i=0;i<sInfo['inv'].length;i++) {
		
		pdfbody += '<tr>';
		pdfbody += '<td align="left" colspan="3">' + sInfo['inv'][i]['num'] + '</td>';
		pdfbody += '<td align="left" colspan="1">' + sInfo['inv'][i]['date'] + '</td>';
		pdfbody += '<td align="left" colspan="2">' + accounting.formatNumber(sInfo['inv'][i]['amtrem'],2) + '</td>';
		pdfbody += '<td align="left" colspan="1">' + accounting.formatNumber(sInfo['inv'][i]['bal'],2) + '</td>';
		
		pdfbody += '</tr>';
	}
	//pdfbody += '<thead><tr><th align="left" colspan="1">Current</th><th colspan="1">1-30 Days</th><th colspan="1">31-60 Days</th><th align="left" colspan="1">61-90 Days</th><th align="left" colspan="1">Over 90 Days</th><th align="left" colspan="1">Amount Due</th></tr></thead>';
	pdfbody += '</table><table class="itemtable"><thead><tr><th align="left" colspan="1">Current</th><th colspan="1">1-30 Days</th><th colspan="1">31-60 Days</th><th align="left" colspan="1">61-90 Days</th><th align="left" colspan="1">Over 90 Days</th><th align="left" colspan="1">Amount Due</th></tr></thead>';
	
	//Break amounts into aging buckets
	pdfbody += '<tr>';
	pdfbody += '<td align="left" colspan="1">' + accounting.formatNumber(sInfo['buckets']['curr'],2) + '</td>';
	pdfbody += '<td align="left" colspan="1">' + accounting.formatNumber(sInfo['buckets']['30'],2) + '</td>';
	pdfbody += '<td align="left" colspan="1">' + accounting.formatNumber(sInfo['buckets']['60'],2) + '</td>';
	pdfbody += '<td align="left" colspan="1">' + accounting.formatNumber(sInfo['buckets']['90'],2) + '</td>';
	pdfbody += '<td align="left" colspan="1">' + accounting.formatNumber(sInfo['buckets']['long'],2) + '</td>';
	pdfbody += '<td align="left" colspan="1">' + accounting.formatNumber(sInfo['balance'],2) + '</td>';
	pdfbody += '</tr>';
		
	var pdfend = '</table></body></pdf>';
	
	var pdfFinal = pdfstart + pdfbody + pdfend;
	pdf.setTemplate(pdfFinal);
	var xml = pdf.renderToString();
	var file = nlapiXMLToPDF(xml);
	
	file.setName(sInfo['cust'] + '.pdf');
	file.setFolder('181981');
	
	file.setIsOnline(true);
	//var fileId = nlapiSubmitFile(file);
	//Util.console.log(fileId,'fileid');
	//file = nlapiLoadFile(fileId);
	
	
	
	
	try {
		//send the email to the customer
		nlapiSendEmail('10083', '10083', 'Test Statement', 'Please click the link for your statement', null,null, null, file);
		//nlapiDeleteFile(fileId);
		
	} catch (e) {
		//log error message
		Util.console.log(e.name, 'error');
	}
	
	
	
}

//force parseFloat function
function fpf(stValue) {
	var flValue = parseFloat(stValue);
	if (isNaN(flValue) || (Infinity == stValue)) {
		return 0.00;
	}
	return flValue;
}

function prepStatement(invs) {
	//establish invoice info object
	var invInfo = {};
	invInfo['cust'] = invs[0].getText('entity');
	invInfo['inv'] = [];
	
	var balance = 0;
	
	//add open invoice data/balance to obj
	for (var i=0; i<invs.length; i++) {
		invInfo['inv'][i] = {};
		invInfo['inv'][i]['num'] = invs[i].getValue('tranid');
		invInfo['inv'][i]['date'] = invs[i].getValue('trandate');
		invInfo['inv'][i]['duedate'] = invs[i].getValue('duedate');
		invInfo['inv'][i]['amtrem'] = invs[i].getValue('fxamountremaining');
		balance += parseFloat(invs[i].getValue('fxamountremaining'));
		invInfo['inv'][i]['bal'] = balance;
	}
	invInfo['balance'] = balance;
	
	//establish aging buckets
	invInfo['buckets'] = {};
	invInfo['buckets']['curr'] = 0;
	invInfo['buckets']['30'] = 0;
	invInfo['buckets']['60'] = 0;
	invInfo['buckets']['90'] = 0;
	invInfo['buckets']['long'] = 0;
	var currDate = new Date();
	
	//loop through the invoice data and break amounts into buckets
	for (var j=0;j<invInfo['inv'].length;j++) {
		
		var tranDate = new Date(invInfo['inv'][j]['duedate']);
		var days = (currDate - tranDate)/(24*60*60*1000);
		
		if (days && days<=0) {
			invInfo['buckets']['curr'] += fpf(invInfo['inv'][j]['amtrem']);
		} else if (days && days > 0 && days <= 30) {
			invInfo['buckets']['30'] += fpf(invInfo['inv'][j]['amtrem']);
		} else if (days && days > 30 && days <= 60) {
			invInfo['buckets']['60'] += fpf(invInfo['inv'][j]['amtrem']);
		} else if (days && days > 60 && days <= 90) {
			invInfo['buckets']['90'] += fpf(invInfo['inv'][j]['amtrem']);
		} else if (days && days > 90) {
			invInfo['buckets']['long'] += fpf(invInfo['inv'][j]['amtrem']);
		}
		
		
	}
	
	return invInfo;
	
}

function getInvoices(filter) {
	
	//Search for the open invoices by filtered customer, passed in
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_sgen_invoices', filter, null);
	
	if (searchResults && searchResults != '') {
		return searchResults;
	} else {
		return false;
	}
	
	
}

function getCustomers() {
	
	//get the customers from the search
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_sgen_customers', null, null);
	return searchResults;
	
}

//check usage function
function checkUsage(units) {
	var context = nlapiGetContext();
	var remUsage = context.getRemainingUsage();
	
	if (remUsage && remUsage < units) {
		nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
		return 'Yes';
	} else {
		return 'No';
	}
	
}
