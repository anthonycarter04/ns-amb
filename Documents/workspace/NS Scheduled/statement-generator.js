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
			
			var custId = cust[i];
			if (custId && custId != '') {
				
				var filter = [new nlobjSearchFilter('entity',null, 'anyof', custId)];
				
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
	var pdfstart = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd"><pdfset><pdf><head></head><body>';
	var pdfbody = '<h1 align="right">Statement</h1>';
	pdfbody += '<p align="right">Customer: '+ sInfo['cust'] + '</p>';
	var pdfend = '</body></pdf></pdfset>';
	
	var pdfFinal = pdfstart + pdfbody + pdfend;
	pdf.setTemplate(pdfFinal);
	var xml = pdf.renderToString();
	var file = nlapiXMLToPDF(xml);
	
	nlapiSendEmail('10083', 'anthony.carter@amobee.com', 'Test Statement', 'Please see attached for file', '', '', '', file, '', '');
	
	
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
