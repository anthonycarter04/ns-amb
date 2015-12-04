/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Aug 2014     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function execSearch(type) {
	//var searchResults = nlapiSearchRecord('transaction', 'customsearch_set_total_forecast', null, null);
	var searchResults = nlapiSearchRecord('opportunity', 'customsearch_opp_set_total_fcast', null, null);
	
	
	if (searchResults && searchResults[0] != '') {
		var tranId = '';
		var rec = '';
		var tranType = '';
		var filter = '';
		var totalPct = '';
		var fields = ['custbody_total_fcast_pct','custbody_total_fcast_amt' ];
		
		for (var i=0; i< searchResults.length; i++) { 
			tranId = searchResults[i].getValue('internalid', null, 'group');
			tranType = 'Opportunity'//searchResults[i].getValue('type');
			Util.console.log(tranType);
			filter = tranMap[tranType]['filter'];
			tranType = tranMap[tranType]['trantype'];
		
		if (filter && filter != '' && tranType && tranType != '') {
			
			var thefilters = [
                  new nlobjSearchFilter( filter, null, 'anyof', tranId )
			];
			
			var thecolumns = [
			     
			      new nlobjSearchColumn('custrecord_amb_forecast_percent', null, 'sum'),
			      new nlobjSearchColumn('custrecord_amb_forecast_amount', null, 'sum')
            ];

			var fcastResults = nlapiSearchRecord('customrecord_inv_billing_schedule_foreca', null, thefilters, thecolumns );
			
			if (fcastResults && fcastResults[0] != '') {
				totalPct = fcastResults[0].getValue('custrecord_amb_forecast_percent',null,'sum');
				totalAmt = fcastResults[0].getValue('custrecord_amb_forecast_amount', null, 'sum');
				
				Util.console.log(totalPct);
				if (totalPct && totalPct != '') {
					nlapiSubmitField(tranType, tranId, fields, [totalPct, totalAmt], false);
				}
			}
			
		}
		}
		
		
		//rec = nlapiLoadRecord('estimate', tranId);
		//var lineCount = rec.getLineItemCount('customrecord_inv_billing_schedule_foreca');
		

		
		
		//Util.console.log(lineCount);
	}
}

var tranMap = {
		'Estimate': {
			'filter' : 'custrecord_amb_forecast_mp',
			'trantype' : 'estimate'
		},
		
		'SalesOrd': {
			'filter': 'custrecord_amb_forecast_camp',
			'trantype': 'salesorder'
		},
		
		'Opportunity': {
			'filter': 'custrecord_amb_forecast_opp',
			'trantype': 'opportunity'
		}
};

