/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Dec 2014     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function startScript(type) {
	
	var lineUpdateFields = [
	     'custrecord_soupdate_new_item',
	     'custrecord_soupdate_solineid',
	     'custrecord_soupdate_soid',
	     'custrecord_soupdate_new_quan',
	     'custrecord_soupdate_new_ratemodel',
	     'custrecord_soupdate_new_rate',
	     'custrecord_soupdate_new_grs_amt',
	     'custrecord_soupdate_new_disc',
	     'custrecord_soupdate_new_deliv_start',
	     'custrecord_soupdate_new_deliv_end',
	     'custrecord_soupdate_new_netamt',
	     'custrecord_soupdate_new_tax_rate',
	     'custrecord_ext_so_line_item_name',
	     'custrecord_soupdate_add_discount',
	     'custrecord_soupdate_agency_fee',
	     'custrecord_soupdate_cust_discount',
	     'custrecord_soupdate_volume_discount',
	     'custrecord_soupdate_pub_discount',
	     'custrecord_soupdate_creative_discount',
	     'custrecord_soupdate_ad_fees',
	     'custrecord_soupdate_ad_ver_fees',
	     'custrecord_soupdate_data_fees',
	     'custrecord_soupdate_var_hand_fee',
	     'custrecord_soupdate_hand_fee'
	];
	
	
	var context = nlapiGetContext();
	var deploy = context.getDeploymentId();
	
	if (deploy && deploy == 'customdeploy1') {
		var searchResults = nlapiSearchRecord('customrecord_int_so_line_updates', 'customsearch_dnd_int_so_line_update_num1', null,null);
	} else if (deploy && deploy == 'customdeploy2') {
		var searchResults = nlapiSearchRecord('customrecord_int_so_line_updates', 'customsearch_dnd_int_so_line_update_num2', null,null);
	} else if (deploy && deploy == 'customdeploy3') {
		var searchResults = nlapiSearchRecord('customrecord_int_so_line_updates', 'customsearch_dnd_int_so_line_update_num3', null,null);
	}
	
	//var searchResults = nlapiSearchRecord('customrecord_int_so_line_updates', 'customsearch_dnd_int_so_line_updates', null,null);
	
	if (searchResults && searchResults[0] != '') {
		
		
		
		for ( var i = 0; i < searchResults.length; i++ ) {
			//Util.console.log('custom deploy 1');
			var usage = nlapiGetContext().getRemainingUsage();
			//Util.console.log('Usage Remaining = ' + usage);
			if (usage && usage < 300) {
				var scriptStatus = nlapiScheduleScript(context.getScriptId(),context.getDeploymentId());
				if (scriptStatus == 'QUEUED') {
					break;
				}
			}
			var params = {};
			params['lineupdate'] = {};
			params['solineid'] = searchResults[i].getId();
			
			for (var j=0; j<lineUpdateFields.length; j++) {
				params['lineupdate'][lineUpdateFields[j]] = searchResults[i].getValue(lineUpdateFields[j]);
			}
			//Util.console.log(params,'params');
			//return false;
			searchSORec(params, deploy);
		}
	}
}




function searchSORec(params, deploy) {
	//Util.console.log(params, 'params');
	params['soinfo'] = {};
	var soFilters = [
	     new nlobjSearchFilter('custcol_sf_tran_line_id',null,'is',params['lineupdate']['custrecord_soupdate_solineid'])
	];
	
	if (deploy && deploy == 'customdeploy1') {
		var soSearchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_int_so_line_item_check', soFilters, null);
	} else if (deploy && deploy == 'customdeploy2') { 
		Util.console.log('deploy2');
		var soSearchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_int_so_line_item_chec_2', soFilters, null);
	} else if (deploy && deploy == 'customdeploy3') {
		Util.console.log('deploy3');
		var soSearchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_int_so_line_item_chec_3', soFilters, null);
	}
	
	//Util.console.log(soSearchResults[0]);
	if (soSearchResults && soSearchResults[0].getValue('internalid') && soSearchResults[0].getValue('internalid') != '') {
		//Util.console.log('in the if');
		
		//Util.console.log(soSearchResults[0].getValue('internalid'), 'line number');
		
		var internalId = soSearchResults[0].getValue('internalid');
		params['soinfo']['internalid'] = internalId;
		//Update existing item
		updateLineItem(params);
		
	} else {
		//Add new item
		//Util.console.log('in the else');
		var filters = [
		    new nlobjSearchFilter('externalidstring', null, 'is', params['lineupdate']['custrecord_soupdate_soid'])
		];
		
		var columns = [
		    new nlobjSearchColumn('internalid')
		];
		
		var theSOSearchResults = nlapiSearchRecord('transaction', null, filters, columns);
		//Util.console.log(theSOSearchResults[0].getValue('internalid'));
		if (theSOSearchResults && theSOSearchResults[0].getValue('internalid') && theSOSearchResults[0].getValue('internalid') != '') {
			params['soinfo']['internalid'] = theSOSearchResults[0].getValue('internalid');
			var soID = addLineItem(params);
		} else {
			//Util.console.log('in cannot find sales order');
			setErrorMessage(params['solineid'], 'No Sales Order Found');
			return;
		}
		
	}
	
}

function updateLineItem(params) {
	//Util.console.log(params, 'so params');
	var soRec = nlapiLoadRecord('salesorder', params['soinfo']['internalid'],{
		recordmode: 'dynamic'
	});
	var lineCount = soRec.getLineItemCount('item');
	soRec.setFieldValue('custbody_intrep_updated', 'F');
	var extSOLineId;
	for (var i=1; i<=lineCount; i++) {
		extSOLineId = soRec.getLineItemValue('item', 'custcol_sf_tran_line_id', i);
		if (extSOLineId == params['lineupdate']['custrecord_soupdate_solineid'] ) {
			
			soRec.selectLineItem('item', i);
			var itemId = soRec.getCurrentLineItemValue('item', 'item');
			var newItem = params['lineupdate']['custrecord_soupdate_new_item'];
			
			//if (newItem && newItem != '' && parseInt(itemId) != parseInt(newItem) ) {
				//soRec.setCurrentLineItemValue('item', 'item', newItem);
			//}
			
			soRec.setCurrentLineItemValue('item', 'custcol_sf_io_line_item_name', params['lineupdate']['custrecord_ext_so_line_item_name']);
		     
			soRec.setCurrentLineItemValue('item', 'quantity', parseInt(params['lineupdate']['custrecord_soupdate_new_quan'],10));
			soRec.setCurrentLineItemValue('item', 'custcol_rate_model', params['lineupdate']['custrecord_soupdate_new_ratemodel']);
			soRec.setCurrentLineItemValue('item', 'custcol_unit_price', parseFloat(params['lineupdate']['custrecord_soupdate_new_rate']));
			if (!params['lineupdate']['custrecord_soupdate_new_grs_amt'] || params['lineupdate']['custrecord_soupdate_new_grs_amt'] == '') {
				params['lineupdate']['custrecord_soupdate_new_grs_amt'] = 0;
			}
			soRec.setCurrentLineItemValue('item', 'custcol_amb_so_cust_grs_amt', parseFloat(params['lineupdate']['custrecord_soupdate_new_grs_amt']));
			soRec.setCurrentLineItemValue('item', 'custcol_amb_so_cust_discount', parseFloat(params['lineupdate']['custrecord_soupdate_new_disc']));
			soRec.setCurrentLineItemValue('item', 'custcol_delivery_start', params['lineupdate']['custrecord_soupdate_new_deliv_start']);
			soRec.setCurrentLineItemValue('item', 'custcol_delivery_end', params['lineupdate']['custrecord_soupdate_new_deliv_end']);
			if (!params['lineupdate']['custrecord_soupdate_new_netamt'] || params['lineupdate']['custrecord_soupdate_new_netamt'] == '') {
				params['lineupdate']['custrecord_soupdate_new_netamt'] = 0;
			}
			soRec.setCurrentLineItemValue('item', 'amount', params['lineupdate']['custrecord_soupdate_new_netamt']);
			//soRec.setCurrentLineItemValue('item', 'taxrate1', params['lineupdate']['custrecord_soupdate_new_tax_rate']);
			
			
			//Add the discounts
			soRec.setCurrentLineItemValue('item', 'custcol_sf_additional_disc', params['lineupdate']['custrecord_soupdate_add_discount']);
			soRec.setCurrentLineItemValue('item', 'custcol_sf_agency_fee', params['lineupdate']['custrecord_soupdate_agency_fee']);
			soRec.setCurrentLineItemValue('item', 'custcol_sf_customer_discount', params['lineupdate']['custrecord_soupdate_cust_discount']);
			soRec.setCurrentLineItemValue('item', 'custcol_sf_volume_discount', params['lineupdate']['custrecord_soupdate_volume_discount']);
			soRec.setCurrentLineItemValue('item', 'custcol_sf_publisher_discount', params['lineupdate']['custrecord_soupdate_pub_discount']);
			soRec.setCurrentLineItemValue('item', 'custcol_sf_creative_serv_prod_costs', params['lineupdate']['custrecord_soupdate_creative_discount']);
			soRec.setCurrentLineItemValue('item', 'custcol_sf_ad_serving_fees', params['lineupdate']['custrecord_soupdate_ad_fees']);
			soRec.setCurrentLineItemValue('item', 'custcol_sf_ad_verification_fees', params['lineupdate']['custrecord_soupdate_ad_ver_fees']);
			soRec.setCurrentLineItemValue('item', 'custcol_sf_data_fees', params['lineupdate']['custrecord_soupdate_data_fees']);
			soRec.setCurrentLineItemValue('item', 'custcol_sf_variable_handling_fee', params['lineupdate']['custrecord_soupdate_var_hand_fee']);
			soRec.setCurrentLineItemValue('item', 'custcol_sf_handling_fee', params['lineupdate']['custrecord_soupdate_hand_fee']);
			soRec.setCurrentLineItemValue('item', 'custcol_sf_line_number', parseInt(params['lineupdate']['custrecord_soupdate_con_line_num'],10));
			soRec.setCurrentLineItemValue('item', 'custcol_int_rep_updated', 'F');
			
			
			soRec.commitLineItem('item');
			
			try {
				soRec.setFieldText('orderstatus', 'Pending Fulfillment');
				
				nlapiSubmitRecord(soRec);
				updateSOLineRec(params['solineid'], params['soinfo']['internalid']);
			} catch (e) {
				ERROR_MSG = e.toString();
				//FULFILL_ERR = 'Y';
				//PROCESS_FLG = 'ES';
				//setWIPStatus(TargetHDRId, VendorFulfilDate, stUpdateWIPSearch, ERROR_MSG, null, FULFILL_ERR, PROCESS_FLG, PROCESS_DATE, null, null);
				
				setErrorMessage(params['solineid'], ERROR_MSG, params['soinfo']['internalid']);
				//nlapiSubmitField('customrecord_amb_integration_wip', WIPInternalId, ['custrecord_amb_iwip_error_msg', 'custrecord_amb_iwip_fulfilment_error','custrecord_amb_int_wip_prcs_flag', 'custrecord_amb_iwip_date_processed'], 
					//	 [e.toString(), 'Y', 'ES',stDateToday]);
				//nlapiLogExecution('ERROR', 'Error Processing Target Header : '+TargetHDRId, e.toString());
			}
			
			break;
		} else {
			continue;
		}
	}
	
}

function setErrorMessage(recId, errorMsg, soId) {
	//var lineUpdateRec = nlapiLoadRecord('customrecord_int_so_line_updates', recId);
	errorMsg = recId + ': ' + errorMsg;
	//lineUpdateRec.setFieldValue('custrecord_soupdate_error_code', errorMsg);
	//lineUpdateRec.setFieldValue('custrecord_soupdate_so_ref', soId);
	nlapiSubmitField('customrecord_int_so_line_updates', recId, ['custrecord_soupdate_error_code','custrecord_soupdate_so_ref' ], [errorMsg, soId]);
	
	
	/*try {
		nlapiSubmitRecord(lineUpdateRec);
	} catch (e) {
		
	}*/
}

function updateSOLineRec(recId, soId) {
	var lineUpdateRec = nlapiLoadRecord('customrecord_int_so_line_updates', recId);
	
	nlapiSubmitField('customrecord_int_so_line_updates', recId, ['custrecord_soupdate_processed','custrecord_soupdate_so_ref' ], ['T', soId]);
	//lineUpdateRec.setFieldValue('custrecord_soupdate_processed', 'T');
	//lineUpdateRec.setFieldValue('custrecord_soupdate_so_ref', soId);
	//try {
	//	nlapiSubmitRecord(lineUpdateRec);
	//} catch (e) {
	//	
//	}
	
}

function addLineItem(params) {
	
	
	
	//Util.console.log(params, 'so params');
	var soRec = nlapiLoadRecord('salesorder', params['soinfo']['internalid'],{recordmode: 'dynamic'	});
	soRec.setFieldValue('custbody_intrep_updated', 'F');
	var lineCount = soRec.getLineItemCount('item');
	
	for (var i=1;i<=lineCount; i++) {
		var itemId = soRec.getLineItemValue('item', 'item', i);
		if (itemId && itemId == '683') {
			soRec.removeLineItem('item', i);
		}
	}
	
	
	soRec.selectNewLineItem('item');
	soRec.setCurrentLineItemValue('item', 'item', params['lineupdate']['custrecord_soupdate_new_item']);
	
	soRec.setCurrentLineItemValue('item', 'quantity', parseInt(params['lineupdate']['custrecord_soupdate_new_quan'],10));
	soRec.setCurrentLineItemValue('item', 'custcol_rate_model', params['lineupdate']['custrecord_soupdate_new_ratemodel']);
	soRec.setCurrentLineItemValue('item', 'custcol_unit_price', parseFloat(params['lineupdate']['custrecord_soupdate_new_rate']));
	soRec.setCurrentLineItemValue('item', 'custcol_amb_so_cust_grs_amt', parseFloat(params['lineupdate']['custrecord_soupdate_new_grs_amt']));
	soRec.setCurrentLineItemValue('item', 'custcol_amb_so_cust_discount', parseFloat(params['lineupdate']['custrecord_soupdate_new_disc']));
	soRec.setCurrentLineItemValue('item', 'custcol_delivery_start', params['lineupdate']['custrecord_soupdate_new_deliv_start']);
	soRec.setCurrentLineItemValue('item', 'custcol_delivery_end', params['lineupdate']['custrecord_soupdate_new_deliv_end']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_io_line_item_name', params['lineupdate']['custrecord_ext_so_line_item_name']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_tran_line_id', params['lineupdate']['custrecord_soupdate_solineid']);
	//soRec.setCurrentLineItemValue('item', 'taxrate1', params['lineupdate']['custrecord_soupdate_new_tax_rate']);
	
	soRec.setCurrentLineItemValue('item', 'amount', params['lineupdate']['custrecord_soupdate_new_netamt']);
	
	//Add the discounts
	soRec.setCurrentLineItemValue('item', 'custcol_sf_additional_disc', params['lineupdate']['custrecord_soupdate_add_discount']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_agency_fee', params['lineupdate']['custrecord_soupdate_agency_fee']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_customer_discount', params['lineupdate']['custrecord_soupdate_cust_discount']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_volume_discount', params['lineupdate']['custrecord_soupdate_volume_discount']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_publisher_discount', params['lineupdate']['custrecord_soupdate_pub_discount']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_creative_serv_prod_costs', params['lineupdate']['custrecord_soupdate_creative_discount']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_ad_serving_fees', params['lineupdate']['custrecord_soupdate_ad_fees']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_ad_verification_fees', params['lineupdate']['custrecord_soupdate_ad_ver_fees']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_data_fees', params['lineupdate']['custrecord_soupdate_data_fees']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_variable_handling_fee', params['lineupdate']['custrecord_soupdate_var_hand_fee']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_handling_fee', params['lineupdate']['custrecord_soupdate_hand_fee']);
	soRec.setCurrentLineItemValue('item', 'custcol_sf_line_number', parseInt(params['lineupdate']['custrecord_soupdate_con_line_num'],10));
	soRec.setCurrentLineItemValue('item', 'custcol_int_rep_updated', 'F');
	
	
	/*if (!params['lineupdate']['custrecord_soupdate_new_disc'] || params['lineupdate']['custrecord_soupdate_new_disc'] == '') {
		params['lineupdate']['custrecord_soupdate_new_disc'] = 0;
	}
	Util.console.log(params['lineupdate']['custrecord_soupdate_new_disc'], 'discount');
	//amount = parseFloat(params['lineupdate']['custrecord_soupdate_new_disc']) * (1-parseFloat(params['lineupdate']['custrecord_soupdate_new_disc']));
	soRec.setCurrentLineItemValue('item', 'amount', amount);*/
	//soRec.setCurrentLineItemValue('item', 'rate', '0.00');
	try {
		soRec.commitLineItem('item');
		soRec.setFieldText('orderstatus', 'Pending Fulfillment');
		var soId = nlapiSubmitRecord(soRec);
		updateSOLineRec(params['solineid'], params['soinfo']['internalid']);
	} catch (e) {
		ERROR_MSG = e.toString();
		//FULFILL_ERR = 'Y';
		//PROCESS_FLG = 'ES';
		//setWIPStatus(TargetHDRId, VendorFulfilDate, stUpdateWIPSearch, ERROR_MSG, null, FULFILL_ERR, PROCESS_FLG, PROCESS_DATE, null, null);
		
		setErrorMessage(params['solineid'], ERROR_MSG, params['soinfo']['internalid']);
	}
	
	return soId;
	
}



function startScriptUE() {
	
	var lineUpdateFields = [
	     'custrecord_soupdate_new_item',
	     'custrecord_soupdate_solineid',
	     'custrecord_soupdate_soid',
	     'custrecord_soupdate_new_quan',
	     'custrecord_soupdate_new_ratemodel',
	     'custrecord_soupdate_new_rate',
	     'custrecord_soupdate_new_grs_amt',
	     'custrecord_soupdate_new_disc',
	     'custrecord_soupdate_new_deliv_start',
	     'custrecord_soupdate_new_deliv_end',
	     'custrecord_soupdate_new_netamt',
	     'custrecord_soupdate_new_tax_rate',
	     'custrecord_ext_so_line_item_name',
	     'custrecord_soupdate_add_discount',
	     'custrecord_soupdate_agency_fee',
	     'custrecord_soupdate_cust_discount',
	     'custrecord_soupdate_volume_discount',
	     'custrecord_soupdate_pub_discount',
	     'custrecord_soupdate_creative_discount',
	     'custrecord_soupdate_ad_fees',
	     'custrecord_soupdate_ad_ver_fees',
	     'custrecord_soupdate_data_fees',
	     'custrecord_soupdate_var_hand_fee',
	     'custrecord_soupdate_hand_fee',
	     'custrecord_soline_queue',
	     'custrecord_soupdate_con_line_num'
	];
	
	Util.console.log('running');
	var context = nlapiGetContext();
	var deploy = context.getDeploymentId();
	
	/*if (deploy && deploy == 'customdeploy1') {
		var searchResults = nlapiSearchRecord('customrecord_int_so_line_updates', 'customsearch_dnd_int_so_line_update_num1', null,null);
	} else if (deploy && deploy == 'customdeploy2') {
		var searchResults = nlapiSearchRecord('customrecord_int_so_line_updates', 'customsearch_dnd_int_so_line_update_num2', null,null);
	} else if (deploy && deploy == 'customdeploy3') {
		var searchResults = nlapiSearchRecord('customrecord_int_so_line_updates', 'customsearch_dnd_int_so_line_update_num3', null,null);
	}*/
	
	//var searchResults = nlapiSearchRecord('customrecord_int_so_line_updates', 'customsearch_dnd_int_so_line_updates', null,null);
	
	var params = {};
	params['lineupdate'] = {};
	params['solineid'] = nlapiGetRecordId();
			
	for (var j=0; j<lineUpdateFields.length; j++) {
		params['lineupdate'][lineUpdateFields[j]] = nlapiGetFieldValue(lineUpdateFields[j]);
	}
	Util.console.log(params,'params');
			//return false;
	params['lineupdate']['custrecord_soline_queue'] = 'customdeploy' + params['lineupdate']['custrecord_soline_queue'];
	Util.console.log(params['lineupdate']['custrecord_soline_queue'], 'QUEUE');
	searchSORec(params, params['lineupdate']['custrecord_soline_queue']);
	
	

}


