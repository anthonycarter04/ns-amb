/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Nov 2015     carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function invoiceResave(type) {

	var searchResults = nlapiSearchRecord('transaction', 'customsearch_sf_invoices_created', null, null);
	
	if (searchResults && searchResults != '') {
		
		for (var i=0;i<searchResults.length;i++) {
		
			var recId = searchResults[i].getId();
			
			var recLoad = nlapiLoadRecord('invoice', recId);
			
			nlapiSubmitRecord(recLoad);
			
		}
		
	}
	
}
