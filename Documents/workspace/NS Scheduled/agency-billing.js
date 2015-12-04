/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Oct 2015     carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function agencyBilling(type) {
	
	//Get deployment ID
	var deploy = nlapiGetContext().getDeploymentId();
	
	
	
	
	//Get results of Agency Billing search
	if (deploy == 'customdeploy1') {
		var searchResults = nlapiSearchRecord('customrecord_amb_campaign_monthly_billin', 'customsearch_agency_billing', null, null);
	} else {
		var searchResults = nlapiSearchRecord('customrecord_amb_campaign_monthly_billin', 'customsearch_publisher_billing', null, null);
	}
	
	//If there are search results
	if (searchResults && searchResults != '') {
		Util.console.log(searchResults.length, 'length');
		var context = nlapiGetContext();
		//For each search result
		for (var i=0; i<  searchResults.length; i++) {
			
			
			var usage = nlapiGetContext().getRemainingUsage();
			if (usage && usage < 3000) {
				var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
				if (status == 'QUEUED') {
					break;
				}
			
			}
			
			
			//Put the search line into a usable object
			var params = putInParams(searchResults[i]);
			params['deploy'] = deploy;
			//Put data through the validation rules
			params = validateData(params);
			params['bill']['enddate'] = getEndDate(params);
			
			Util.console.log(params, 'params');
			
			//If there is no IR Error and IR Complete is FALSE
			if (params['val']['irerr'] == '' && params['bill']['ircomplete'] == 'F' && fpf(params['bill']['vendspend']) > 0 && params['po']['vendor'] != '') {
				
				//Send to Create Item Receipt function
				var irID = createIR(params);
				
				if (irID == 'No') {
					Util.console.log('Unable to create IR');
					Util.console.log(params, 'params');
					params['bill']['irerror'] = params['bill']['irerror'] + '\n' + params['val']['irdet'];
					//nlapiSubmitField('customrecord_amb_campaign_mthly_bill_sub', params['bill']['subid'] , ['custrecord_camp_bill_sub_haserrors', 'custrecord_camp_bill_sub_procerror'], ['T', err]);
					
				} else {
					params['bill']['ircomplete'] = 'T';
					nlapiSubmitField('customrecord_amb_campaign_mthly_bill_sub', params['bill']['subid'] , ['custrecord_camp_bill_sub_receipt', 'custrecord_camp_bill_sub_ir_check'], [irID, 'T']);
					
				}
				
			} else {
				//nlapiSubmitField('customrecord_amb_campaign_mthly_bill_sub', params['bill']['subid'] , ['custrecord_camp_bill_sub_haserrors', 'custrecord_camp_bill_sub_procerror'], ['T', params['val']['irdet']]);
				//updateBillingRec(params);
			}
			
			
			//Create IF Record
			
			if (params['val']['iferr'] == '' && params['bill']['ifcomplete'] == 'F') {
				
				
				var ifID = createIF(params);
				
				if (ifID == 'No') {
					Util.console.log('Unable to create IR');
					params['val']['iferror'] = params['val']['iferror'] + '\n' + params['val']['ifdet'];
				} else {
					params['bill']['ifcomplete'] = 'T';
					nlapiSubmitField('customrecord_amb_campaign_mthly_bill_sub', params['bill']['subid'] , ['custrecord_camp_bill_sub_fulfillment', 'custrecord_camp_bill_sub_if_check'], [ifID, 'T']);
					
				}
				
				Util.console.log(ifID, 'ifID');
			}
			
			
			
			
			
			updateBillingRec(params);
			
			
			
		}
		
		
	}
	
}

function updateBillingRec(params) {
	
	var updFields = ['custrecord_camp_bill_sub_haserrors'
	                 , 'custrecord_camp_bill_sub_irerror'
	                 , 'custrecord_camp_bill_sub_overreceived'
	                 , 'custrecord_camp_bill_sub_overfulfilled'
	                 , 'custrecord_camp_bill_sub_vendoverspend'
	                 , 'custrecord_camp_bill_sub_ponotappr'
	                 , 'custrecord_camp_bill_sub_iferror'
	                 , 'custrecord_camp_bill_sub_processed'];
	
	//Util.console.log(fpf(params['bill']['vendspend']), 'vend spend');
	
	nlapiLogExecution('DEBUG', 'test', fpf(params['bill']['vendspend']));
	
	if (params['bill']['ircomplete'] == 'T' && params['bill']['ifcomplete'] == 'T') {
		var proc = 'T';
		
	} else if (params['bill']['ifcomplete'] == 'T' && (params['po']['vendor'] == '' || fpf(params['bill']['vendspend']) == 0)) {
		var proc = 'T';
	} else {
		var proc = 'F';
	}
	
	nlapiSubmitField('customrecord_amb_campaign_mthly_bill_sub', params['bill']['subid'],updFields,  [params['val']['haserrors'], params['bill']['irerr'], params['val']['vendoverreceive'], params['val']['custoverfulfill'], params['val']['vendoverspend'], params['val']['ponotappr'], params['val']['iferror'], proc  ]  );
	
	if (proc == 'T') {
		updateHeader(params);
	}
	
	
}

function updateHeader(params) {
	
	if (params['bill']['id'] != '') {
		var billRec = nlapiLoadRecord('customrecord_amb_campaign_monthly_billin', params['bill']['id']);
		
		lineCount = billRec.getLineItemCount('recmachcustrecord_amb_campaign_mthly_bill_link');
		var comp = 'T';
		for (var i=1;i<=lineCount;i++) {
			
			proc = billRec.getLineItemValue('recmachcustrecord_amb_campaign_mthly_bill_link', 'custrecord_camp_bill_sub_processed', i);
			
			if (proc == 'F') {
				Util.console.log('in proc');
				comp = 'F'
				break;
			}
			
		}
		Util.console.log(comp, 'comp');
		if (comp == 'T') {
			billRec.setFieldValue('custrecord_amb_ns_approved_cmb', 'T');
			nlapiSubmitRecord(billRec);
		}
		
		
	}
	
}


function getEndDate(params) {
	
	var endDate = '';
	var perStart = params['bill']['perstart'];
	var perEnd = params['bill']['perend'];
	var lineEnd = params['po']['delivend'];
	
	if (lineEnd == '') {
		endDate = perEnd;
	} else if (new Date(lineEnd) >= new Date(perStart) && new Date(lineEnd) <= new Date(perEnd)) {
		endDate = lineEnd;
	} else {
		endDate = perEnd
	}
	
	return endDate;
	
	
}


function validateData(params) {
	
	params['val']['haserrors'] = 'F';
	params['bill']['irerror'] = 'F';
	params['val']['iferr'] = 'F';
	
	
	params['val']['vendoverreceive'] = 'F';
	params['val']['vendoverspend'] = 'F';
	params['val']['custoverfulfill'] = 'F';
	params['val']['ponotappr'] = 'F';
	params['val']['haserrors'] = 'F';
	
	//IR Checks
	var irerr = '';
	var irdet = '';
	//PO Approval Check
	
	if (params['bill']['ircomplete'] == 'F' && params['deploy'] == 'customdeploy1' && fpf(params['bill']['vendspend']) > 0 && params['po']['vendor'] != '' ) {
		
		if(params['po']['apprstatus']  != '2' && params['po']['ioaccept'] == 'T') {
			
			irdet += 'PO Not Approved';
			irerr = 'T';
			params['val']['ponotappr'] = 'T';
			params['val']['haserrors'] = 'T';
			
		} else {
			params['val']['ponotappr'] = 'F';
		}
			
		
		Util.console.log(fpf(params['po']['grossspend']), 'poGrossSpend');
		Util.console.log(fpf(params['bill']['vendspend']), 'vendspend');
		Util.console.log(round((fpf(params['po']['netreceipt']) / (1-fpf(params['po']['venddisc']) )),2), 'gross receipts');
		Util.console.log((fpf(params['bill']['vendspend']) + round((fpf(params['po']['netreceipt']) / (1-fpf(params['po']['venddisc']) )),2)), 'vendspend + gross receipt')
		
		// PO Amount : if current spend + net receipt amount (converted to gross) > po amount
		if( fpf(params['po']['grossspend']) < round((fpf(params['bill']['vendspend']) + round((fpf(params['po']['netreceipt']) / (1-fpf(params['po']['venddisc']) )),2)),2)) {
			Util.console.log('in po overspend');
			irdet += '/Vendor Overspend';
			irerr = 'T';
			params['val']['vendoverspend'] = 'T';
			params['val']['haserrors'] = 'T';
		} else {
			params['val']['vendoverspend'] = 'F';
		}

		// PO Quan
		
		if( fpf(params['po']['quan']) < (fpf(params['po']['quanreceived']) + (fpf(params['bill']['vendquan']) ))) {
			
			irdet += '/Vendor Overreceived';
			irerr = 'T';
			params['val']['vendoverreceive'] = 'T';
			params['val']['haserrors'] = 'T';
		} else {
			params['val']['vendoverreceive'] = 'F';
		}
		
	}
	
	

	params['val']['irdet'] = irdet;
	params['val']['irerr'] = irerr;
	
	
	var iferr = '';
	var ifdet = '';
	
	//IF Quan
	
	if (params['bill']['ifcomplete'] == 'F'  && params['deploy'] == 'customdeploy1') {
		if( fpf(params['so']['quan']) < (fpf(params['so']['quanfulfilled']) + (fpf(params['bill']['custquan']) ))) {
			
			ifdet += 'Customer Overfulfilled / ';
			iferr = 'T';
			params['val']['haserrors'] = 'T';
			
			params['val']['custoverfulfill'] = 'T';

		} else {
			params['val']['iferr'] = 'F';
			params['val']['custoverfulfill'] = 'F';
		}
	}
	
	
	
	params['val']['ifdet'] = ifdet;
	params['val']['iferr'] = iferr;
	
	
	return params;
	
	
}

function fpf(stValue) {
	var flValue = parseFloat(stValue);
	if (isNaN(flValue) || (Infinity == stValue)) {
		return 0.00;
	}
	return flValue;
}


function putInParams(res) {
	
	//Establish params object, divided by so/po/billing rec
	var params = {};
	params['so'] = {};
	params['po'] = {};
	params['bill'] = {};
	params['val'] = {};
	
	//set SO fields
	params['so']['id'] = res.getValue('custrecord_amb_campaign_cmb');
	params['so']['currency'] = res.getValue('currency',  'custrecord_amb_campaign_cmb');
	params['so']['quan'] = res.getValue('quantity',  'custrecord_amb_campaign_cmb');
	params['so']['ratemodel'] = res.getValue('custcol_rate_model',  'custrecord_amb_campaign_cmb');
	params['so']['rate'] = res.getValue('custcol_unit_price',  'custrecord_amb_campaign_cmb');
	
	if (params['so']['ratemodel'] == '1') {
		params['so']['rate'] = fpf(params['so']['rate'])/1000;
	}
	
	params['so']['grossamount'] = res.getValue('custcol_amb_so_cust_grs_amt',  'custrecord_amb_campaign_cmb');
	params['so']['mgmtfee'] = fpf(res.getValue('custcol_amb_mgmt_fee',  'custrecord_amb_campaign_cmb'))/100;
	
	params['so']['custdisc'] = fpf(res.getValue('custcol_amb_so_cust_discount',  'custrecord_amb_campaign_cmb'))/100;
	params['so']['wekeepmarg'] = res.getValue('custcol_amb_lower_cost_margin',  'custrecord_amb_campaign_cmb');
	params['so']['delivstart'] = res.getValue('custcol_delivery_start',  'custrecord_amb_campaign_cmb');
	
	params['so']['quanfulfilled'] = res.getValue('quantityshiprecv', 'custrecord_amb_campaign_cmb');
	params['so']['calcmgmtfee'] = res.getText('custbody_amb_calc_mgmt_fee', 'custrecord_amb_campaign_cmb');
	
	
	//Set PO Fields
	params['po']['id'] = res.getValue('custcol_amb_spec_order', 'custrecord_amb_campaign_cmb');
	params['po']['delivstart'] = res.getValue('custcol_delivery_start',  'custrecord_amb_campaign_cmb');
	params['po']['delivend'] = res.getValue('custcol_delivery_end',  'custrecord_amb_campaign_cmb');
	params['po']['vendor'] = res.getValue('custcol_amb_vendor',  'custrecord_amb_campaign_cmb');
	
	params['po']['currency'] = res.getValue('custcol_amb_mp_vendor_currency',  'custrecord_amb_campaign_cmb');
	params['po']['quan'] = res.getValue('custcol_amb_po_qty',  'custrecord_amb_campaign_cmb');
	params['po']['ratemodel'] = res.getValue('custcol_purchase_rate_model',  'custrecord_amb_campaign_cmb');
	params['po']['rate'] = res.getValue('custcol_purchase_unit_price',  'custrecord_amb_campaign_cmb');
	params['po']['grossspend'] = res.getValue('custcol_amb_io_gross_spend',  'custrecord_amb_campaign_cmb');
	params['po']['venddisc'] = res.getValue('custcol_amb_io_vendor_discount',  'custrecord_amb_campaign_cmb');
	
	params['po']['venddisc'] = fpf(params['po']['venddisc'])/100;
	
	params['po']['netspend'] = res.getValue('custcol_amb_so_net_spend',  'custrecord_amb_campaign_cmb');
	params['po']['porate'] = res.getValue('custcol_purchase_unit_price',  'custrecord_amb_campaign_cmb');
	params['po']['quanreceived'] = res.getValue('custcol_po_quantity_received', 'custrecord_amb_campaign_cmb');
	params['po']['apprstatus'] = res.getValue('custcol_po_approval_status', 'custrecord_amb_campaign_cmb');
	params['po']['ioaccept'] = res.getValue('custcol_amb_is_io_acceptance_req', 'custrecord_amb_campaign_cmb');
	params['po']['netreceipt'] = res.getValue('custcol_net_receipts_amount', 'custrecord_amb_campaign_cmb'); //shahar
	
	//Set Campaign Billing fields
	params['bill']['id'] = res.getId();
	params['bill']['subid'] = res.getValue('internalid', 'custrecord_amb_campaign_mthly_bill_link');
	params['bill']['period'] = res.getValue('custrecord_amb_period_cmb');
	params['bill']['dept'] = res.getValue('department', 'custrecord_amb_campaign_cmb');
	params['bill']['lob'] = res.getValue('class', 'custrecord_amb_campaign_cmb');
	params['bill']['geo'] = res.getValue('location', 'custrecord_amb_campaign_cmb');
	params['bill']['custquan'] = res.getValue('custrecord_amb_billing_customer_qty_cmb', 'custrecord_amb_campaign_mthly_bill_link');
	params['bill']['vendquan'] = res.getValue('custrecord_amb_billing_vendor_qty_cmb', 'custrecord_amb_campaign_mthly_bill_link');
	params['bill']['vendspend'] = res.getValue('custrecord_amb_billing_vendor_spend_cmb', 'custrecord_amb_campaign_mthly_bill_link');
	params['bill']['targ'] = res.getValue('custrecord_amb_targeting_cmb', 'custrecord_amb_campaign_mthly_bill_link');
	params['bill']['enddate'] = res.getText('enddate', 'custrecord_amb_period_cmb');
	params['bill']['ircomplete'] = res.getValue('custrecord_camp_bill_sub_ir_check', 'custrecord_amb_campaign_mthly_bill_link');
	params['bill']['ifcomplete'] = res.getValue('custrecord_camp_bill_sub_if_check', 'custrecord_amb_campaign_mthly_bill_link');
	params['bill']['irerror'] = res.getValue('custrecord_camp_bill_sub_irerror', 'custrecord_amb_campaign_mthly_bill_link');
	params['bill']['perstart'] = res.getValue('startdate', 'custrecord_amb_period_cmb');
	params['bill']['perend'] = res.getValue('enddate', 'custrecord_amb_period_cmb');
	params['bill']['custspend'] = res.getValue('custrecord_camp_bill_sub_billcustspend', 'custrecord_amb_campaign_mthly_bill_link');
	
	//Set Error Validation fields
	
	params['val']['vendoverreceive'] = res.getValue('custrecord_camp_bill_sub_overreceived', 'custrecord_amb_campaign_mthly_bill_link');
	params['val']['vendoverspend'] = res.getValue('custrecord_camp_bill_sub_vendoverspend', 'custrecord_amb_campaign_mthly_bill_link');
	params['val']['custoverfulfill'] = res.getValue('custrecord_camp_bill_sub_overfulfilled', 'custrecord_amb_campaign_mthly_bill_link');
	params['val']['ponotappr'] = res.getValue('custrecord_camp_bill_sub_ponotappr', 'custrecord_amb_campaign_mthly_bill_link');
	params['val']['haserrors'] = res.getValue('custrecord_camp_bill_sub_haserrors', 'custrecord_amb_campaign_mthly_bill_link');
	
	//params['so']['currency'] = res.getValue('currency', null, 'custrecord_amb_campaign_cmb');
	
	Util.console.log(params, 'initial params');
	
	return params;
	
}

/**
 * Pass in params and return the IF record ID
 * @param params
 * @returns Item Fulfillment ID
 * @returns integer
 */
function createIF(params) {
	
	try
	{
	
		

		var recIF = nlapiTransformRecord('salesorder', params['so']['id'], 'itemfulfillment', {recordmode: 'dynamic'});
		
		if (params['deploy'] == 'customdeploy2') {
			recIF.setFieldValue('customform', '157');
		}
		
		recIF.setFieldValue('trandate', params['bill']['enddate']);

		recIF.setFieldValue('shipstatus', 'C'); // Shipped
		
		//To account for campaigns with no related PO/i.e vendor
		if (params['po']['vendor'] == '') {
			
			params['so']['wekeepmarg'] = 'T';
		}
		
		if (params['so']['wekeepmarg'] == 'F') {
			
			var ifrate = getIFRate(params);
			Util.console.log(ifrate, 'ifrate if');
		} else {
			var ifrate = params['so']['rate'];
			var ifrate = getIFRateKeepExtraT(params);
			Util.console.log(ifrate, 'ifrate else');
		}
		
		
		//recIF.setFieldValue('exchangerate', forceParseFloat(flExchangeRate));

        recIF.setFieldValue('custbody_amb_created_from_campaign', params['so']['id']); // Asif 6/9 - Added to link fulfillments and receipts for margin report.

		//recIF.setFieldValue('custbody_amb_campaign_customer', Customer); // Asif 6/29 - Added to link fulfillments and receipts for margin report.

		var intCount = recIF.getLineItemCount('item');
		// create receipt item
		for (var line = 1; line<=intCount; line++)
		{
		
			var stLineHeaderId = recIF.getLineItemValue('item', 'custcol_amb_targeting', line);
			recIF.setLineItemValue('item', 'quantity', line, 0); // initialize
			
			if(params['bill']['targ'] == stLineHeaderId) {
				
				
				if (params['deploy'] == 'customdeploy1') {
					recIF.setLineItemValue('item', 'quantity', line, params['bill']['custquan']);				

					recIF.setLineItemValue('item', 'custcol_amb_receive_rate', line, ifrate);// ASIF 03/31 - UPDATE custcol_amb_receive_rate				
					var custAmt = fpf(ifrate) * fpf(params['bill']['custquan']);
					custAmt = round(custAmt, 6);

					recIF.setLineItemValue('item', 'custcol_amb_so_net_spend', line, custAmt); 
				} else if (params['deploy'] == 'customdeploy2') { //Publisher Billing
					recIF.setLineItemValue('item', 'quantity', line, '1');
					recIF.setLineItemValue('item', 'custcol_fulfillment_actual_quantity', line, params['bill']['custquan']);
					
					var custAmt = fpf(params['bill']['custspend']) * (1-params['so']['custdisc']);
					custAmt = round(custAmt, 2);
					recIF.setLineItemValue('item', 'custcol_amb_receive_rate', line, custAmt);
					recIF.setLineItemValue('item', 'custcol_amb_so_net_spend', line, custAmt); 
				}
				
				
				
			}
			
		}
	
		var ifID = nlapiSubmitRecord(recIF);
		return ifID;
		
	}
	catch(e)
	{
		Util.console.log(e.getDetails());
		params['val']['iferr'] = e.getDetails();
		return 'No';
	}
	
	
}

function getIFRate(params) {
	
	var grossIRRate = fpf(params['bill']['vendspend'])/fpf(params['bill']['vendquan']);
	var exchRate = 1;
	if (params['po']['currency'] != params['so']['currency']) {
		
		var exchRate = computeExchangeRate(params['po']['currency'],params['so']['currency'], params['bill']['enddate'] )
		Util.console.log(exchRate, 'exchRate');

	}
	if (params['so']['calcmgmtfee'] == 'Gross') {
		var ifrate = (grossIRRate * exchRate);
			
		ifrate = ifrate + (ifrate * fpf(params['so']['mgmtfee'])) - (ifrate * fpf(params['so']['custdisc']));
	} else {
		var ifrate = (grossIRRate * exchRate) - ((grossIRRate * exchRate) * fpf(params['so']['custdisc']));
		ifrate = ifrate + (ifrate * fpf(params['so']['mgmtfee']));
	}
	
	Util.console.log(ifrate, 'ifrate');
	return ifrate;
}




function getIFRateKeepExtraT(params) {
	
	var grossIRRate = fpf(params['so']['rate']);
	
	if (params['so']['calcmgmtfee'] == 'Gross') {
		var ifrate = grossIRRate;
		Util.console.log('in net');
		nlapiLogExecution('DEBUG', 'IFRATE * MGMT Fee', ifrate * fpf(params['so']['mgmtfee']) );
		nlapiLogExecution('DEBUG', 'IFRATE * disc', ifrate * fpf(params['so']['custdisc']));
		ifrate = ifrate + (ifrate * fpf(params['so']['mgmtfee'])) - (ifrate * fpf(params['so']['custdisc']));
	} else {
		var ifrate = (grossIRRate) - ((grossIRRate) * fpf(params['so']['custdisc']));
		ifrate = ifrate + (ifrate * fpf(params['so']['mgmtfee']));
	}
	
	return ifrate;
}





//compute exchange rate
function computeExchangeRate(stCurrency1, stCurrency2, stDateToday)
{
	var flExcRate = nlapiExchangeRate(stCurrency1, stCurrency2, stDateToday);
	
	//var flConvEstUnitCost = fpf(flEstUnitCost)*fpf(flExcRate);	
	
	return flExcRate;
}


/**
 * Pass in params and return the IR record ID
 * @param params
 * @returns Item Receipt ID
 * @returns integer
 */
function createIR(params) {
	
	try {
		
		var recIR = nlapiTransformRecord('purchaseorder', params['po']['id'], 'itemreceipt', {
			recordmode: 'dynamic'
		});
		Util.console.log('past transform');
		
		if (params['deploy'] == 'customdeploy2') {
			recIR.setFieldValue('customform', '156');
		}
		//recIR.setFieldValue('customform', '158');
		
		recIR.setFieldValue('trandate', params['bill']['enddate']);
		
		//recIR.setFieldValue('postingperiod', getacctPerInfoPeriod);
		
		//recIR.setFieldValue('exchangerate', forceParseFloat(flExchangeRate));
		
		var intCount = recIR.getLineItemCount('item');
		// create receipt item
		for (var line = 1; line <= intCount; line++) {
			//var stLineItem = recIR.getLineItemValue('item', 'item', line);
			var lineTarg  = recIR.getLineItemValue('item', 'custcol_amb_targeting', line);
			recIR.setLineItemValue('item', 'quantity', line, 0); // initialize to 0
			//if (SOItem == stLineItem) {
			if (lineTarg == params['bill']['targ']) {
				// create receipt item	
				if (params['deploy'] == 'customdeploy1') {
					var vendSpend = fpf(params['bill']['vendspend']) * (1-fpf(params['po']['venddisc']));
					var vendQuan = fpf(params['bill']['vendquan']);
					var vendRate = vendSpend/vendQuan;
					vendRate = round(vendRate, 6);
					//nlapiLogExecution('DEBUG', logTitle, 'flReceiptAmount: ' + flReceiptAmount);
					recIR.setLineItemValue('item', 'quantity', line, params['bill']['vendquan']);
					recIR.setLineItemValue('item', 'custcol_amb_receive_rate', line, vendRate); // ASIF 03/31 - UPDATE custcol_amb_receive_rate		
					recIR.setLineItemValue('item', 'custcol_amb_so_net_spend', line, vendSpend);
				} else if (params['deploy'] == 'customdeploy2') {
					var vendSpend = fpf(params['bill']['vendspend']) * (1-fpf(params['po']['venddisc']));
					var vendQuan = fpf(params['bill']['vendquan']);
					vendSpend = round(vendSpend,2);
					//nlapiLogExecution('DEBUG', logTitle, 'flReceiptAmount: ' + flReceiptAmount);
					recIR.setLineItemValue('item', 'custcol_fulfillment_actual_quantity', line, params['bill']['vendquan']);
					
					recIR.setLineItemValue('item', 'quantity', line, '1');
					recIR.setLineItemValue('item', 'custcol_amb_receive_rate', line, vendSpend); // ASIF 03/31 - UPDATE custcol_amb_receive_rate		
					recIR.setLineItemValue('item', 'custcol_amb_so_net_spend', line, vendSpend);
				}
				
			}
			
		}
		
		var irID = nlapiSubmitRecord(recIR);
		
		
		return irID;
		
	} 
	catch (e) {
		// update WIP with error
		params['bill']['irerr'] += 'Error processing receipt: ' + e.toString();
		
		return 'No';
	}
	
	
}

function round(number, power) {
	//Util.console.log(number, 'number');
	number = parseFloat(number);

	number = Math.round((number*(Math.pow(10,power))))/(Math.pow(10,power));

	return number;
	
}

function getExchRate(params) {
	
}
