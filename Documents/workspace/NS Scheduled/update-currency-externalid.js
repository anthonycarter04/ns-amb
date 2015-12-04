/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Dec 2014     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function updateCurrencies(type) {
	
	
	var searchResults = nlapiSearchRecord('currency', null, null, null);

	if (searchResults && searchResults[0] != '') {
		for (var i=0; i<searchResults.length; i++) {
			var currencyId = searchResults[i].getId();
			var currencyRec = nlapiLoadRecord('currency', currencyId);
			var currencyName = currencyRec.getFieldValue('name');
			Util.console.log(currencyName);
			currencyRec.setFieldValue('externalid', currencyName);
			nlapiSubmitRecord(currencyRec);
		}
		
	}

}
