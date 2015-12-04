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
	
	var cust = getCustomers();
	
	if (cust && cust != '') {
		
		for (var i=0; i<1 /*cust.length*/; i++) {
			
			var custId = cust[i].getId();
			if (custId && custId != '') {
				
				Util.console.log(custId, 'custId');
				
				var filter = [new nlobjSearchFilter('internalid','customer', 'anyof', custId)];
				
				var invs = getInvoices(filter);
				
				if (invs && invs != '') {
					
					var sInfo = prepStatement(invs);
					Util.console.log(sInfo, 'sInfo');
					
					var sSent = genStatement(sInfo);
				}
				
				
			}
			
			
			var over = checkUsage('1000');
			if (over && over == 'Yes') {
				break;
			}
		}
		
	}
	
}

function genStatement(sInfo) {
	
	var pdf = nlapiCreateTemplateRenderer();
	var date = getTheDate();
	Util.console.log(date, 'date');
	var pdfstart = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd"><pdf><head><style> table { font-family: sans-serif; font-size: 9pt; margin-top: 10px; table-layout: fixed; width: 100%; } th { font-weight: bold; font-size: 8pt; vertical-align: middle; padding-right: 6px; padding-left: 6px; padding-bottom: 3px; padding-top: 5px; background-color: #cfdde7; color: #0c547b; } td { padding-right: 6px; padding-left: 6px; padding-bottom: 4px; padding-top: 4px; } b { font-weight: bold; color: #0c547b; } table.header td { padding: 0px; font-size: 10pt; } table.footer td { padding: 0px; font-size: 8pt; align: center; } table.itemtable th { padding-bottom: 10px; padding-top: 10px; } table.body td { padding-top: 2px; } table.total { page-break-inside: avoid; } tr.totalrow { background-color: #cfdde7; line-height: 200%; } td.totalboxtop { font-size: 12pt; background-color: #cfdde7; } td.addressheader { font-size: 8pt; padding-top: 6px; padding-bottom: 2px; } td.address { padding-top: 0px; } td.totalboxmid { font-size: 28pt; padding-top: 20px; background-color: #cfdde7; } td.totalboxbot { background-color: #cfdde7; font-weight: bold; } span.title { font-size: 28pt; } span.number { font-size: 16pt; } span.itemname { font-weight: bold; line-height: 150%; } hr { width: 100%; color: #d3d3d3; background-color: #d3d3d3; height: 1px; }</style></head><body>';
	var pdfbody = '<h1 align="right">Statement</h1>';
	//pdfbody += "<img src='https://system.sandbox.netsuite.com/core/media/media.nl?id=6741![CDATA[&c]]=3620644![CDATA[&h]]=4f6061f57d2b1c3e87e1'>";
	pdfbody += '<p align="right">Customer: '+ sInfo['cust'] + '</p>';
	pdfbody += '<p align="right">Date: ' + date + '</p>';
	pdfbody += '<p align="right">Amount Due: ' + accounting.formatNumber(sInfo['balance'],2) + '</p>';
	pdfbody += '<table class="itemtable"><thead><tr><th align="left" colspan="3">Invoice</th><th colspan="1">Date</th><th colspan="1">Amount Remaining</th><th align="left" colspan="1">Balance</th></tr></thead>';
	
	Util.console.log()
	for (var i=0;i<sInfo['inv'].length;i++) {
		
		pdfbody += '<tr>';
		pdfbody += '<td align="left" colspan="3">' + sInfo['inv'][i]['num'] + '</td>';
		pdfbody += '<td align="left" colspan="1">' + sInfo['inv'][i]['date'] + '</td>';
		pdfbody += '<td align="left" colspan="1">' + accounting.formatNumber(sInfo['inv'][i]['amtrem'],2) + '</td>';
		pdfbody += '<td align="left" colspan="1">' + accounting.formatNumber(sInfo['inv'][i]['bal'],2) + '</td>';
		
		pdfbody += '</tr>';
	}
	
	
	
	
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
		nlapiSendEmail('10083', '10083', 'Test Statement', 'Please click the link for your statement', null,null, null, file);
		//nlapiDeleteFile(fileId);
		
	} catch (e) {
		Util.console.log(e.name, 'error');
	}
	
	
	
}

function prepStatement(invs) {
	var invInfo = {};
	invInfo['cust'] = invs[0].getText('entity');
	invInfo['inv'] = [];
	
	var balance = 0;
	for (var i=0; i<invs.length; i++) {
		invInfo['inv'][i] = {};
		invInfo['inv'][i]['num'] = invs[i].getValue('tranid');
		invInfo['inv'][i]['date'] = invs[i].getValue('trandate');
		invInfo['inv'][i]['amtrem'] = invs[i].getValue('amountremaining');
		balance += parseFloat(invs[i].getValue('amountremaining'));
		invInfo['inv'][i]['bal'] = balance;
	}
	invInfo['balance'] = balance;
	return invInfo;
	
}

function getInvoices(filter) {
	
	Util.console.log(filter);
	
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_sgen_invoices', filter, null);
	
	if (searchResults && searchResults != '') {
		return searchResults;
	} else {
		return false;
	}
	
	
}

function getCustomers() {
	
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_sgen_customers', null, null);
	return searchResults;
	
}

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
