/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Jan 2015     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function sfPastBilled(type) {

	var searchResults = nlapiSearchRecord('customrecord_sf_past_billed_amount', 'customsearch_sf_past_billed_update', null, null );
	
	if (searchResults && searchResults != '') {
		
		var deploy = nlapiGetContext().getDeploymentId();
		var context = nlapiGetContext();
		if (deploy && deploy == 'customdeploy1') {
			for (var i=0; i<  searchResults.length; i++) {
				//Util.console.log(searchResults[i]);
				var usage = context.getRemainingUsage();
				if (usage && usage < 1000) {
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
					if (status && status == 'QUEUED') {
						break;
					}
				}
				
				
				var sfLineId = searchResults[i].getValue('custrecord_sf_line_item_id');
				
				if (sfLineId && sfLineId != '') {
					
					//Util.console.log(sfLineId);
					var filters = [
					    new nlobjSearchFilter('custcol_sf_tran_line_id', null, 'startswith', sfLineId)
					];
					
					var columns = [
					    new nlobjSearchColumn('internalid'),
					    new nlobjSearchColumn('line')
					];
					
					var soResults = nlapiSearchRecord('salesorder', null, filters, columns);
					
					if (soResults && soResults != '') {
						var soId = soResults[0].getValue('internalid');
						
						if (soId && soId != '') {
							Util.console.log(soId, 'soId');
							var soRec = nlapiLoadRecord('salesorder', soId);
							
							var lineCount = soRec.getLineItemCount('item');
							
							for (var j=2; j<=lineCount; j++) {
								
								var soSfLineId = soRec.getLineItemValue('item', 'custcol_sf_tran_line_id', j);
							//	Util.console.log(soSfLineId, 'soSfLineId');
								//Util.console.log(soSfLineId.substring(0,15), 'soSFLineId');
								//Util.console.log(sfLineId, 'sfLineId');
								if (soSfLineId.substring(0,15) == sfLineId) {
									soRec.setLineItemValue('item', 'custcol_sf_total_past_billed', j, searchResults[i].getValue('custrecord_total_past_billed') );
									soRec.setLineItemValue('item', 'custcol_int_rep_updated', j, 'F');
									try {
										nlapiSubmitRecord(soRec);
									} catch(e) {
										nlapiSubmitField('customrecord_sf_past_billed_amount', searchResults[i].getId(), 'custrecord_sf_past_billed_error', e.message);
										
									}
									nlapiSubmitField('customrecord_sf_past_billed_amount', searchResults[i].getId(), 'custrecord_past_billed_processed', 'T');
									var recFound = 'T';
									break;
								} else {
									var recFound = 'F';
									
								}
								
							}
							if (recFound == 'F') {
								nlapiSubmitField('customrecord_sf_past_billed_amount', searchResults[i].getId(), 'custrecord_sf_past_billed_error', 'No Line Match');
								
							}
						
						}
					} else {
						nlapiSubmitField('customrecord_sf_past_billed_amount', searchResults[i].getId(), 'custrecord_sf_past_billed_error', 'No Line Item Found');
						
					}
					
					
				}
				
			}
		} else if (deploy && deploy == 'customdeploy2') {
			for (var i=searchResults.length-1; i> 0; i--) {
				//Util.console.log(searchResults[i]);
				var usage = context.getRemainingUsage();
				if (usage && usage < 1000) {
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
					if (status && status == 'QUEUED') {
						break;
					}
				}
				var sfLineId = searchResults[i].getValue('custrecord_sf_line_item_id');
				
				if (sfLineId && sfLineId != '') {
					
					//Util.console.log(sfLineId);
					var filters = [
					    new nlobjSearchFilter('custcol_sf_tran_line_id', null, 'startswith', sfLineId)
					];
					
					var columns = [
					    new nlobjSearchColumn('internalid'),
					    new nlobjSearchColumn('line')
					];
					
					var soResults = nlapiSearchRecord('salesorder', null, filters, columns);
					
					if (soResults && soResults != '') {
						var soId = soResults[0].getValue('internalid');
						if (soId && soId != '') {
							Util.console.log(soId, 'soId');
							var soRec = nlapiLoadRecord('salesorder', soId);
							
							var lineCount = soRec.getLineItemCount('item');
							
							for (var j=2; j<=lineCount; j++) {
								
								var soSfLineId = soRec.getLineItemValue('item', 'custcol_sf_tran_line_id', j);
								//Util.console.log(soSfLineId.substring(0,15));
								if (soSfLineId.substring(0,15) == sfLineId) {
									soRec.setLineItemValue('item', 'custcol_sf_total_past_billed', j, searchResults[i].getValue('custrecord_total_past_billed') );
									soRec.setLineItemValue('item', 'custcol_int_rep_updated', j, 'F');
									try {
										nlapiSubmitRecord(soRec);
									} catch(e) {
										nlapiSubmitField('customrecord_sf_past_billed_amount', searchResults[i].getId(), 'custrecord_sf_past_billed_error', e.message);
										
									}
									
									nlapiSubmitField('customrecord_sf_past_billed_amount', searchResults[i].getId(), 'custrecord_past_billed_processed', 'T');
									var recFound = 'T';
									break;
								} else {
									var recFound = 'F';
									
								}
								
							}
							if (recFound == 'F') {
								nlapiSubmitField('customrecord_sf_past_billed_amount', searchResults[i].getId(), 'custrecord_sf_past_billed_error', 'No Line Match');
								
							}
						
						}
					} else {
						nlapiSubmitField('customrecord_sf_past_billed_amount', searchResults[i].getId(), 'custrecord_sf_past_billed_error', 'No Line Item Found');
						
					}
					
					
				}
				
			}
		}
		
		
		
	}
	
}
