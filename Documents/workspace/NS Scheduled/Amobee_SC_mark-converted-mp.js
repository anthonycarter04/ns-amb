/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       12 Aug 2014     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function execSearch(type) {

	var searchResults = nlapiSearchRecord('opportunity', 'customsearch_mark_as_convert_mp', null, null);
	
	if (searchResults && searchResults[0] != '') {
		var params = {};
		for (var i=0; i< searchResults.length; i++) {

			var recId = searchResults[i].getValue('internalid');
			Util.console.log(recId);
			var status = searchResults[i].getText('entitystatus');
			var mpNum = searchResults[i].getValue('tranid','estimate');
			params['recid'] = recId;
			params['status'] = status;
			params['mpnum'] = mpNum;

			if (recId && recId != '') {
				var oppRec = nlapiLoadRecord('opportunity', recId);
				params['opprec'] = oppRec;
				setConversionField(params);
			/*	
			 * Excluding this per conversations with Shahar - Updated 8/12/2014
				if (params['status'] && params['status'] != '' && params['mpnum'] && params['mpnum'] != '') {
					hasMPRec(params); 
				}
			*/
				
				nlapiSubmitRecord(params['opprec']);
			}			
		}
		
	} else {
		Util.console.log('No Search Results');
	}
	
}

function setConversionField(params) {
	

	if (params['opprec'] && params['opprec'] != '') {

		params['opprec'].setFieldValue('custbody_converted_to_mp', 'T');
		return;
	} else {
		Util.console.log('Could not load opportunity record');
	}
}

function hasMPRec(params) {
	
	params['opprec'].setFieldText('entitystatus', 'Contracts/Media Plan Out');

}