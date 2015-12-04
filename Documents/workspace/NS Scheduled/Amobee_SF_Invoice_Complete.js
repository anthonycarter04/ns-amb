/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Sep 2015     carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function invoiceComplete(type) {

	var searchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_inv_creator_master', null, null);
	if (searchResults && searchResults != '') {
		
	} else {
		var rec = nlapiLoadRecord('customrecord_scheduled_script_starter', 1);
		rec.setFieldValue('custrecord_ss_starter_status',2 );
		nlapiSubmitRecord(rec);
	}
	
	
	
}

function checkInvoices() {
	
	Util.console.log('has results');
	
}
