/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Nov 2014     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function soPOStatusUpdate(type) {
	
	Util.console.log('running');
	
	var searchResults = nlapiSearchRecord(null, 'customsearch_update_so_po_status', null, null);
	
	
	if (searchResults && searchResults[0] != '') {
		
		for (var i=0; i< searchResults.length; i++) {
			Util.console.log(JSON.stringify(searchResults[i]));
			
			
			//Util.console.log(sfyResults['columns']['internalid']['internalid']);
			var poID = searchResults[i].getValue('internalid', 'custcol_amb_spec_order', 'group');
			
			Util.console.log(poID, 'PO ID');
			
			if (poID && poID != '') {
				
				nlapiSubmitField('purchaseorder', poID, 'custbody_script_update', 'T');
	
			}
		}
		
	}
	
	
	
	
}
