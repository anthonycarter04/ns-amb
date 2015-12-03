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
				
				
			}
			
			
			var over = checkUsage('1000');
			if (over && over == 'Yes') {
				break;
			}
		}
		
	}
	
}

function getInvoices(filter) {
	
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_sgen_invoices', null, null);
	
	
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
