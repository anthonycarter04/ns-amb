/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       09 Sep 2014     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */

var types = {
   'Fulfillments': 'itemfulfillment',
   'Receipts': 'itemreceipt'		
};

var params = {};
var netSpend = '';
var tranType = '';
var netAmount = '';
var netSpend = '';
var headerId = '';

function execScript(type) {
	//Util.console.log('in script');
	var usage = nlapiGetContext().getRemainingUsage();
	Util.console.log( usage,'starting usage');
	var context = nlapiGetContext();
	
	var soIDParam = context.getSetting('SCRIPT', 'custscript_metrics_so_id');
	Util.console.log(soIDParam, 'soIDParam');
	
	if (soIDParam && soIDParam != '') {
		Util.console.log('in the param');
		var filters = [new nlobjSearchFilter('formulanumeric', null, 'greaterthan', soIDParam)];
		filters[0].setFormula('{custcol_amb_targeting.custrecord_amb_th_campaign.id}');
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_camp_update_net_rec_ful', filters, null);
	} else {
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_camp_update_net_rec_ful', null, null);
	}
	
	if (searchResults && searchResults != '') {
		
	} else {
		return;
	}
	
	
	Util.console.log(searchResults, 'searchResults');
	

	var params = putInObject(searchResults);
	Util.console.log(params[0]);
	var theKeys = Object.keys(params[0]);
	var soID = '';
	var soLine = '';
	Util.console.log(theKeys.length, 'keys length');
	
	
	try {
		for (var i = 0; i< theKeys.length; i++) {
			//soLine = params[0][theKeys[i]][0]['soline'];
			lineCount = params[0][theKeys[i]].length;
			
			
			
			
			if (lineCount && lineCount > 0) {
				soID = theKeys[i];
				Util.console.log(soID, 'soID');
				
				
				
				
				
				var soRec = nlapiLoadRecord('salesorder', soID);
				
				if (soRec && soRec != '') {
					for (var j = 0; j < lineCount; j++) {
						soLine = params[0][theKeys[i]][j]['soline'];
						targHead = soRec.getLineItemValue('item','custcol_amb_targeting', soLine);
						netAmount = soRec.getLineItemValue('item', 'amount', soLine);
						netSpend = soRec.getLineItemValue('item', 'custcol_amb_so_net_spend', soLine);
						//Util.console.log('soID = ' + soID + 'targHead = ' + targHead + ' netAmount = ' + netAmount + ' netSpend = ' + netSpend);
						
						if (targHead && targHead !='' && targHead > 0 ) {
							var targMetrics = perfSearch(targHead);
							Util.console.log(targMetrics, 'targMetrics');
							if (targMetrics && targMetrics != '') {
								
								//setMetrics(targMetrics, i);
								
								if (targMetrics['fulfillments'] && targMetrics['fulfillments'] != '') {
									soRec.setLineItemValue('item', 'custcol_net_fulfillment_amount', soLine, targMetrics['fulfillments']);
									soRec.setLineItemValue('item', 'custcol_net_amount_balance', soLine, netAmount - targMetrics['fulfillments']);
								}  else {
									soRec.setLineItemValue('item', 'custcol_net_fulfillment_amount', soLine, '0.00');
									soRec.setLineItemValue('item', 'custcol_net_amount_balance', soLine, netAmount);
								}
								
								if (targMetrics['receipts'] && targMetrics['receipts'] != '') {
									soRec.setLineItemValue('item', 'custcol_net_receipts_amount', soLine, targMetrics['receipts']);
									soRec.setLineItemValue('item', 'custcol_net_spend_balance', soLine, netSpend - targMetrics['receipts']);
									soRec.setLineItemValue('item', 'custcol_po_quantity_received', soLine, targMetrics['receiptquan']);
								} else {
									soRec.setLineItemValue('item', 'custcol_net_receipts_amount', soLine, '0.00');
									soRec.setLineItemValue('item', 'custcol_net_spend_balance', soLine, netSpend);
									soRec.setLineItemValue('item', 'custcol_po_quantity_received', soLine, '0');
								}
								
							} else {
								soRec.setLineItemValue('item', 'custcol_net_fulfillment_amount', soLine, '0.00');
								soRec.setLineItemValue('item', 'custcol_net_amount_balance', soLine, netAmount);
								soRec.setLineItemValue('item', 'custcol_net_receipts_amount', soLine, '0.00');
								soRec.setLineItemValue('item', 'custcol_net_spend_balance', soLine, netSpend);
								soRec.setLineItemValue('item', 'custcol_po_quantity_received', soLine, '0');
							}
							var currDateTime = getDateTimeStandard();
							nlapiSubmitField('customrecord_amb_targeting_header', targHead, 'custrecord_camp_metrics_date',currDateTime );
						}
						
						
					}
					
					
					
					
					nlapiSubmitRecord(soRec);
					
					var usage = context.getRemainingUsage();
					Util.console.log(usage, 'remaining usage in loop');
					if (usage && usage <=3000) {
						
						var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId(), {custscript_metrics_so_id: soID})
						if (status && status == 'QUEUED') {
							var end = 'T';
							break;
						}
					}
					
				}

				
			}
			

		}
	} catch (e) {
		var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId(), {custscript_metrics_so_id: soID})
		
	}

	
	if (end && end == 'T') {
		return;
	}
	
	usage = nlapiGetContext().getRemainingUsage();
	Util.console.log(usage,'ending usage');
	Util.console.log('ending ' + soID );
	var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId(), {custscript_metrics_so_id: soID});
	//Util.console.log(theResults);
	return;
	if (searchResults && searchResults[0] != '') {
		for (var k=0;k<searchResults.length; k++) {
			headerId = searchResults;
		}
	}
	var lineCount = nlapiGetLineItemCount('item');
	var targHead = '';
	//Util.console.log(lineCount);
	if (lineCount && lineCount > 0) {
		for (var i=1; i<=lineCount; i++) {
			targHead = nlapiGetLineItemValue('item','custcol_amb_targeting', i);
			netAmount = nlapiGetLineItemValue('item', 'amount', i);
			netSpend = nlapiGetLineItemValue('item', 'custcol_amb_so_net_spend', i);
			//Util.console.log('line number ' + i + ' net spend = ' + netSpend);
			
			//Util.console.log(targHead);
			if (targHead && targHead !='' && targHead > 0 ) {
				var targMetrics = perfSearch(targHead);
				Util.console.log(targMetrics, 'targMetrics');
				if (targMetrics && targMetrics != '') {
					Util.console.log('in if');
					//setMetrics(targMetrics, i);
					Util.console.log(targMetrics['fulfillments'], 'targ metrics fulfillments');
					if (targMetrics['fulfillments'] && targMetrics['fulfillments'] != '') {
						nlapiSetLineItemValue('item', 'custcol_net_fulfillment_amount', i, targMetrics['fulfillments']);
						nlapiSetLineItemValue('item', 'custcol_net_amount_balance', i, netAmount - targMetrics['fulfillments']);
					}  else {
						nlapiSetLineItemValue('item', 'custcol_net_fulfillment_amount', i, '0.00');
						nlapiSetLineItemValue('item', 'custcol_net_amount_balance', i, netAmount);
					}
					Util.console.log(targMetrics['receipts'], 'targMetrics Receipts');
					if (targMetrics['receipts'] && targMetrics['receipts'] != '') {
						nlapiSetLineItemValue('item', 'custcol_net_receipts_amount', i, targMetrics['receipts']);
						nlapiSetLineItemValue('item', 'custcol_net_spend_balance', i, netSpend - targMetrics['receipts']);
						nlapiSetLineItemValue('item', 'custcol_po_quantity_received', i, params['receiptquan']);
					} else {
						nlapiSetLineItemValue('item', 'custcol_net_receipts_amount', i, '0.00');
						nlapiSetLineItemValue('item', 'custcol_net_spend_balance', i, netSpend);
						nlapiSetLineItemValue('item', 'custcol_po_quantity_received', i, 0);
					}
					
				}
			}
			
			
		}
	}
	

}

function putInObject(searchResults) {
	var params = [];
	
	var res = {};
	var keys = {};
	var data = {};
	
	
	if (searchResults && searchResults[0] != '') {
		for (var k=0;k<searchResults.length; k++) {
			 
			
			soID = searchResults[k].getValue('formulacurrency', null, 'max');
			soID = parseInt(soID);
			res.soLine = searchResults[k].getValue('formulanumeric', null, 'group');
			res.th = searchResults[k].getValue('custcol_amb_targeting', null, 'group');
			res.amount = searchResults[k].getValue('custcol_amb_so_net_spend', null, 'sum');
			res.type = searchResults[k].getValue('type', null, 'group');
			
			
			data[soID] = data[soID] || [];
			data[soID].push({
				'soline': res.soLine,
				'th': res.th
			});
			//Util.console.log(data);
			

			
			
			
			params.push(data);
		}
		
		return params;

		//Util.console.log(Object.keys(params[0]));
	}
	//Util.console.log(params);
}

function perfSearch(targHead) {
	
	var filters = [
		new nlobjSearchFilter( 'custcol_amb_targeting', null, 'anyof', targHead )
	];

	var searchResults = nlapiSearchRecord('transaction', 'customsearch_amobee_net_ful_rec_amounts', filters, null);
	
	if (searchResults && searchResults[0] != '') {
		params.fulfillments = '';
		params.receipts = '';
		params.receiptquan = '';
		for (var j=0; j<searchResults.length; j++) {
			//Util.console.log(params,'params');
			tranType = searchResults[j].getValue('type', null, 'group');
			
			//params.receipts = '0.00';
			//Util.console.log(tranType);
			if (tranType && tranType == 'ItemRcpt') {
				//Util.console.log('in receipts');
				//Util.console.log(searchResults[j].getValue('custcol_amb_so_net_spend', null, 'sum'));
				params.receipts = searchResults[j].getValue('custcol_amb_so_net_spend', null, 'sum');
				params.receiptquan = searchResults[j].getValue('quantity', null, 'sum');
				
			} 
			
			
			//params.fulfillments = '0.00';
			if (tranType && tranType == 'ItemShip') {
				//Util.console.log('in shipments');
			//	Util.console.log(searchResults[j].getValue('custcol_amb_so_net_spend', null, 'sum'));
				params.fulfillments = searchResults[j].getValue('custcol_amb_so_net_spend', null, 'sum');
			}
		//	Util.console.log(params, 'params');
			//Util.console.log(tranType);
			
		} 
		
	}	else {
		params.fulfillments = '';
		params.receipts = '';
	}
	
	return params;
	
}




