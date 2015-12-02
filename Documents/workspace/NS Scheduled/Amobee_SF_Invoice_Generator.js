/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Jan 2015     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */

//Comment script starter
function scriptStarter() {
	Util.console.log('running');
	var exec = nlapiGetFieldValue('custrecord_ss_starter_execute');
	
	if (exec && exec == 'T') {
		var scriptId = nlapiGetFieldValue('custrecord_ss_starter_script');
		var deployId = nlapiGetFieldValue('custrecord_ss_starter_script_deploy');
		//var ssName = nlapiGetFieldValue('');
		
		if (scriptId != '' && deployId != '') {
			
			nlapiScheduleScript(scriptId, deployId);
			
		}
		
		nlapiSetFieldValue('custrecord_ss_starter_execute', 'F');
	}
	
}


//Comment queue the deploys
function queueTheDeploys(type) {
	
		
		for (var i=1; i<=5;i++) {
			nlapiScheduleScript('customscript_sf_inv_generator', 'customdeploy' + i);
		}
		
		
	
}

function round(number, power) {
	//Util.console.log(number, 'number');
	number = parseFloat(number);

	number = Math.round((number*(Math.pow(10,power))))/(Math.pow(10,power));

	return number;
	
}


function invGenerator(type) {
	logUsage('starting');
	
	var deploy = nlapiGetContext().getDeploymentId();
	
	if (deploy && deploy == 'customdeploy1') {
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_inv_creator_num1', null, null);
	} else if (deploy && deploy == 'customdeploy2') {
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_inv_creator_num2', null, null);
	} else if (deploy && deploy == 'customdeploy3') {
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_inv_creator_num3', null, null);
	} else if (deploy && (deploy == 'customdeploy4' || deploy == 'customdeploy6')) {
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_inv_creator_num4', null, null);
	} else if (deploy && deploy == 'customdeploy5') {
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_inv_creator_num5', null, null);
	}
	
	
	
	if (searchResults && searchResults != '') {
		
		var theLength = searchResults.length;
		for (var i=0; i< theLength; i++) {
			
			var disc = {};
			var sfLineId = searchResults[i].getValue('custcol_sf_tran_line_id', null, 'group');
			//var campId = searchResults[i].getValue('createdfrom', null, 'group');
			var campId = searchResults[i].getValue('internalid', 'createdfrom', 'group');
			Util.console.log(campId, 'log camp id');
			var trandate = searchResults[i].getValue('trandate', null, 'max');
			
			finalTranDate = '11/01/2015';
			
			var getacctPerInfoPeriod = AllLockedPeriod(finalTranDate);
			disc['additionaldisc'] = forceParseFloat(searchResults[i].getValue('custcol_sf_additional_disc', null, 'max'))/100;
			disc['agencyfee'] = forceParseFloat(searchResults[i].getValue('custcol_sf_agency_fee', null, 'max'))/100;
			disc['custdisc'] = forceParseFloat(searchResults[i].getValue('custcol_sf_customer_discount', null, 'max'))/100;
			disc['volumedisc'] = forceParseFloat(searchResults[i].getValue('custcol_sf_volume_discount', null, 'max'))/100;
			disc['pubdisc'] = forceParseFloat(searchResults[i].getValue('custcol_sf_publisher_discount', null, 'max'))/100;
			disc['creatserv'] = forceParseFloat(searchResults[i].getValue('custcol_sf_creative_serv_prod_costs', null, 'max'))/100;
			disc['adservfee'] = forceParseFloat(searchResults[i].getValue('custcol_sf_ad_serving_fees', null, 'max'))/100;
			disc['adverfee'] = forceParseFloat(searchResults[i].getValue('custcol_sf_ad_verification_fees', null, 'max'))/100;
			disc['datafee'] = forceParseFloat(searchResults[i].getValue('custcol_sf_data_fees', null, 'max'))/100;
			disc['varhandfee'] = forceParseFloat(searchResults[i].getValue('custcol_sf_variable_handling_fee', null, 'max'))/100;
			disc['handfee'] = forceParseFloat(searchResults[i].getValue('custcol_sf_handling_fee', null, 'max'))/100;
	
			
			
			if (campId && campId != '') {
				Util.console.log(campId, 'campId');
				var invId = getCreatedInv(campId, trandate);
				
				if (invId && invId != '') {
					//edit existing invoice
					Util.console.log('edit existing invoice');
					Util.console.log(invId, 'inv Id');
					var recInv = nlapiLoadRecord('invoice', invId, {recordmode:'dynamic'});
					var lineCount = recInv.getLineItemCount('item');
					var lineFound = false;
					for (var j=1; j<=lineCount; j++) {
						
						if (recInv.getLineItemValue('item', 'custcol_sf_tran_line_id', j) == searchResults[i].getValue('custcol_sf_tran_line_id', null, 'group')) {
							Util.console.log('found item');
							var grossItemRate = searchResults[i].getValue('custcol_amb_receive_rate', null, 'avg');
							grossItemRate = round(grossItemRate,6);
							//Util.console.log(grossItemRate, 'grossItemRate rounded');
							var lineFound = true;
							recInv.selectLineItem('item', j);
							var quan = recInv.getLineItemValue('item', 'quantity', j);
							var amount = recInv.getLineItemValue('item', 'amount', j);
							//Util.console.log(quan, 'quan');
							//Util.console.log(amount, 'amount');
							
							var newAmount = parseFloat(amount) + parseFloat(searchResults[i].getValue('custcol_amb_so_net_spend', null, 'sum'));
							var newQuan = parseFloat(quan) + parseFloat(searchResults[i].getValue('custcol_fulfillment_actual_quantity',null,'sum'));
							
							var rate = newAmount/newQuan;
							
							if (searchResults[i].getValue('custcol_rate_model', null, 'group') == 'CPM') {
								rate = rate*1000;
							}
							
							//Util.console.log(newQuan, 'new quan');
							//Util.console.log(newAmount, 'new amount');
							
							var ioLineItemName = searchResults[i].getValue('custcol_sf_io_line_item_name', null, 'group');
							//Util.console.log(ioLineItemName, 'ioLineItemName');
							if (ioLineItemName && ioLineItemName == '- None -') {
								ioLineItemName = '';
							}
							
							var receiveRate = searchResults[i].getValue('custcol_amb_receive_rate', null, 'avg');
							receiveRate = round(receiveRate,6);
							//Util.console.log(receiveRate, 'receive Rate Rounded');
							receiveRate = parseFloat(receiveRate).toFixed(8);
							//Util.console.log(newQuan, 'newQuan');
							//Util.console.log(receiveRate, 'receiveRate');
							//Util.console.log(grossItemRate, 'grossItemRate');
							//Util.console.log(rate, 'rate');
							recInv.setCurrentLineItemValue('item', 'quantity',  newQuan);
							recInv.setCurrentLineItemValue('item','custcol_amb_inv_ful_gross_rt', receiveRate) ;
							recInv.setCurrentLineItemValue('item', 'custcol_unit_price', grossItemRate );
							recInv.setCurrentLineItemValue('item', 'rate',rate);
							var grossAmount = discounter(newAmount, disc);
							recInv.setCurrentLineItemValue('item', 'custcol_amb_inv_ful_gross_amt', grossAmount);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_io_line_item_name', ioLineItemName);
							
							recInv.setCurrentLineItemValue('item', 'custcol_sf_additional_disc', disc['additionaldisc']);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_agency_fee', disc['agencyfee']);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_customer_discount', disc['custdisc']);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_volume_discount', disc['volumedisc']);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_publisher_discount', disc['pubdisc']);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_creative_serv_prod_costs', disc['creatserv']);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_ad_serving_fees', disc['adservfee']);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_ad_verification_fees', disc['adverfee']);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_data_fees', disc['datafee']);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_variable_handling_fee', disc['varhandfee']);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_handling_fee', disc['handfee']);
							
							recInv.setCurrentLineItemValue('item', 'amount',  newAmount);
							try {
								recInv.commitLineItem('item');
								var invId = nlapiSubmitRecord(recInv);
							} catch (e) {
								//set error on campaign
								
								nlapiSubmitField('salesorder', campId, 'custbody_sf_inv_error', e.message);
								continue;
							}
							
							
							
							
							
						}
					}
					
					if (lineFound == false) {
						
						var usage = nlapiGetContext().getRemainingUsage();
						//Util.console.log(usage, 'usage');
						
						var custId = recInv.getFieldValue('entity');
						var grossItemRate = searchResults[i].getValue('custcol_amb_receive_rate', null, 'avg');
						grossItemRate = round(grossItemRate,6);
						//Util.console.log(grossItemRate, 'grossItemRate');
						var rate = parseFloat(searchResults[i].getValue('custcol_amb_so_net_spend', null, 'sum'))/parseFloat(searchResults[i].getValue('custcol_fulfillment_actual_quantity',null,'sum'));
						rate = rate.toFixed(8);
						var geo = nlapiLookupField('customer', custId, 'custentity_amb_lead_location');
						recInv.selectNewLineItem('item');
						
						recInv.setCurrentLineItemValue('item', 'item', searchResults[i].getValue('item',null, 'group'));
						recInv.setCurrentLineItemValue('item', 'quantity', searchResults[i].getValue('custcol_fulfillment_actual_quantity',null,'sum'));
						
						var ioLineItemName = searchResults[i].getValue('custcol_sf_io_line_item_name', null, 'group');
						//Util.console.log(ioLineItemName, 'ioLineItemName');
						
						if (ioLineItemName && ioLineItemName == '- None -') {
							ioLineItemName = '';
						}
						
						//recInv.setCurrentLineItemValue('item', 'custcol_amb_targeting', searchResults[i].getValue('custcol_amb_targeting', null, 'group'));
						recInv.setCurrentLineItemValue('item', 'custcol_sf_tran_line_id', searchResults[i].getValue('custcol_sf_tran_line_id', null, 'group'));
						recInv.setCurrentLineItemValue('item', 'custcol_rate_model', searchResults[i].getValue('custcol_rate_model', null, 'group'));
						recInv.setCurrentLineItemValue('item', 'custcol_unit_price', grossItemRate );
						recInv.setCurrentLineItemValue('item', 'rate', rate);
						recInv.setCurrentLineItemValue('item', 'custcol_amb_inv_ful_gross_rt', grossItemRate );
						var newAmount = searchResults[i].getValue('custcol_amb_so_net_spend', null, 'sum');
						var grossAmount = discounter(newAmount, disc);
						recInv.setCurrentLineItemValue('item', 'custcol_amb_inv_ful_gross_amt', grossAmount);
						recInv.setCurrentLineItemValue('item', 'custcol_sf_io_line_item_name', ioLineItemName);
						recInv.setCurrentLineItemValue('item', 'location', geo);
						
						recInv.setCurrentLineItemValue('item', 'custcol_sf_additional_disc', disc['additionaldisc']);
						recInv.setCurrentLineItemValue('item', 'custcol_sf_agency_fee', disc['agencyfee']);
						recInv.setCurrentLineItemValue('item', 'custcol_sf_customer_discount', disc['custdisc']);
						recInv.setCurrentLineItemValue('item', 'custcol_sf_volume_discount', disc['volumedisc']);
						recInv.setCurrentLineItemValue('item', 'custcol_sf_publisher_discount', disc['pubdisc']);
						recInv.setCurrentLineItemValue('item', 'custcol_sf_creative_serv_prod_costs', disc['creatserv']);
						recInv.setCurrentLineItemValue('item', 'custcol_sf_ad_serving_fees', disc['adservfee']);
						recInv.setCurrentLineItemValue('item', 'custcol_sf_ad_verification_fees', disc['adverfee']);
						recInv.setCurrentLineItemValue('item', 'custcol_sf_data_fees', disc['datafee']);
						recInv.setCurrentLineItemValue('item', 'custcol_sf_variable_handling_fee', disc['varhandfee']);
						recInv.setCurrentLineItemValue('item', 'custcol_sf_handling_fee', disc['handfee']);
						
						recInv.setCurrentLineItemValue('item', 'amount',  newAmount);
						
						
						
						
						
						
						
						
						
						
						try {
							recInv.commitLineItem('item');
							var invId = nlapiSubmitRecord(recInv);
						} catch (e) {
							nlapiSubmitField('salesorder', campId, 'custbody_sf_inv_error', e.message);
							continue;
							//set error on campaign
						}
						
					}
					
					
				} else {
					Util.console.log('create new invoice');
					//create new invoice
					
					var recInv = nlapiTransformRecord('salesorder', campId, 'invoice' /*, {recordmode: 'dynamic'}*/);
					recInv.setFieldValue('customform', '145');
					var tranDate = searchResults[i].getValue('trandate', null, 'max');
					var now = new Date(tranDate);
					if (now.getMonth() == 11) {
					    var current = new Date(now.getFullYear() + 1, 0, 1);
					} else {
					    var current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
					}
					
					var finalTranDate = (current.getMonth() + 1) + '/' + current.getDate() + '/' + current.getFullYear();
					//Util.console.log(finalTranDate, 'finalTranDate');
					//finalTranDate = '04/01/2015';
					var invStart = getMonthDate('start', tranDate);
					var invEnd = getMonthDate('end', tranDate);
					Util.console.log(finalTranDate, 'finalTranDate');
					var getacctPerInfoPeriod = AllLockedPeriod(finalTranDate);
					Util.console.log(getacctPerInfoPeriod, 'getacctPerInfoPeriod');
					
					recInv.setFieldValue('custbody_amb_invoice_start', invStart);
					recInv.setFieldValue('custbody_amb_invoice_end', invEnd);
					recInv.setFieldValue('custbody_sf_auto_created', 'T');
					
					recInv.setFieldValue('postingperiod', getacctPerInfoPeriod);
					recInv.setFieldValue('trandate', finalTranDate);
					recInv.setFieldValue('postingperiod', getacctPerInfoPeriod);
					var lineCount = recInv.getLineItemCount('item');
					var lineArray = [];
					for (var j=lineCount; j>=1; j--) {
						
						recInv.selectLineItem('item', j);
						if (recInv.getLineItemValue('item', 'custcol_sf_tran_line_id', j) == searchResults[i].getValue('custcol_sf_tran_line_id', null, 'group')) {
							//Util.console.log('item found ' + j);
							var itemFound = 'T';
							var grossItemRate = searchResults[i].getValue('custcol_amb_receive_rate', null, 'avg');
							//Util.console.log(grossItemRate, 'grossItemRate before round');
							grossItemRate = round(grossItemRate,6);
							//Util.console.log(grossItemRate, 'grossItemRate rounded');
							var tranDate = searchResults[i].getValue('trandate', null, 'max');
							Util.console.log(recInv.getFieldValue('postingperiod'), 'get posting period');
							var rate = parseFloat(searchResults[i].getValue('custcol_amb_so_net_spend', null, 'sum'))/parseFloat(searchResults[i].getValue('custcol_fulfillment_actual_quantity',null,'sum'));
							rate = rate.toFixed(8);
							//Util.console.log(itemRate, 'item rate');
							//recInv.setCurrentLineItemValue('item', 'item', searchResults[i].getValue('item',null, 'group'));
							
							recInv.setCurrentLineItemValue('item', 'quantity', searchResults[i].getValue('custcol_fulfillment_actual_quantity',null,'sum'));
							
							var ioLineItemName = searchResults[i].getValue('custcol_sf_io_line_item_name', null, 'group');
							//Util.console.log(ioLineItemName, 'ioLineItemName');
							if (ioLineItemName && ioLineItemName == '- None -') {
								ioLineItemName = '';
							}
							
							var netAmount = searchResults[i].getValue('custcol_amb_so_net_spend', null, 'sum');
							//Util.console.log(netAmount, 'netAmount');
							var grossAmount = discounter(parseFloat(netAmount), disc);
							//Util.console.log(grossAmount,'grossAMount');
							//recInv.setCurrentLineItemValue('item', 'custcol_amb_targeting', searchResults[i].getValue('custcol_amb_targeting', null, 'group'));
							recInv.setCurrentLineItemValue('item', 'custcol_sf_tran_line_id', searchResults[i].getValue('custcol_sf_tran_line_id', null, 'group'));
							recInv.setCurrentLineItemValue('item', 'custcol_rate_model', searchResults[i].getValue('custcol_rate_model', null, 'group'));
							recInv.setCurrentLineItemValue('item', 'rate', rate);
							
							recInv.setCurrentLineItemValue('item', 'custcol_unit_price', grossItemRate );
							recInv.setCurrentLineItemValue('item', 'custcol_amb_inv_ful_gross_rt', grossItemRate );
							recInv.setCurrentLineItemValue('item', 'custcol_amb_inv_ful_gross_amt', grossAmount);
							recInv.setCurrentLineItemValue('item', 'custcol_sf_io_line_item_name', ioLineItemName);
							recInv.setCurrentLineItemValue('item', 'amount', searchResults[i].getValue('custcol_amb_so_net_spend', null, 'sum'));
							
							
							try {
								recInv.commitLineItem('item');
								
							} catch (e) {
								if (e.message != 'Script Execution Usage Limit Exceeded') {
									nlapiSubmitField('salesorder', campId, 'custbody_sf_inv_error', e.message);
								}
								continue;
								//set error on campaign
							}
							
							
							
							
							
						} else {
							
							
							
							lineArray.push(j);
						}
						
					}
					
					if (lineArray && lineArray[0] != '') {
						for (var n =0;n<lineArray.length;n++) {
							recInv.removeLineItem('item', lineArray[n]);
						}
					}
					
					
					
					/*var custId = recInv.getFieldValue('entity');
					var geo = nlapiLookupField('customer', custId, 'custentity_amb_lead_location');
					recInv.selectNewLineItem('item');
					recInv.setCurrentLineItemValue('item', 'item', searchResults[i].getValue('item',null, 'group'));
					recInv.setCurrentLineItemValue('item', 'quantity', searchResults[i].getValue('quantity',null,'sum'));
					recInv.setCurrentLineItemValue('item', 'amount', searchResults[i].getValue('custcol_amb_so_net_spend', null, 'sum'));
					recInv.setCurrentLineItemValue('item', 'custcol_amb_targeting', searchResults[i].getValue('custcol_amb_targeting', null, 'group'));
					recInv.setCurrentLineItemValue('item', 'custcol_sf_tran_line_id', searchResults[i].getValue('custcol_sf_tran_line_id', null, 'group'));
					recInv.setCurrentLineItemValue('item', 'location', geo);
					recInv.commitLineItem('item');*/
					
					/*if (itemFound == 'T') {
						recInv.selectLineItem('item', 1);
						recInv.setCurrentLineItemValue('item', 'quantity', searchResults[i].getValue('quantity',null,'sum'));
						recInv.setCurrentLineItemValue('item', 'amount', searchResults[i].getValue('custcol_amb_so_net_spend', null, 'sum'));
						recInv.setCurrentLineItemValue('item', 'custcol_amb_targeting', searchResults[i].getValue('custcol_amb_targeting', null, 'group'));
						recInv.setCurrentLineItemValue('item', 'custcol_sf_tran_line_id', searchResults[i].getValue('custcol_sf_tran_line_id', null, 'group'));
						recInv.commitLineItem('item');
					}*/
					
					try {
						recInv.setFieldValue('postingperiod', getacctPerInfoPeriod);
						var invId = nlapiSubmitRecord(recInv);
					} catch (e) {
						nlapiSubmitField('salesorder', campId, 'custbody_sf_inv_error', e.message);
						continue;
						//set error on campaign
					}
					
					
					
					
				}
				Util.console.log(invId, 'invId');
				//Update the Fulfillments
				if (invId && invId != '') {
					updateFulfillRecs(sfLineId, invId, trandate);
				}
				
			}
			
			
			var context = nlapiGetContext();
			var usage = context.getRemainingUsage();
			Util.console.log(usage, 'Remaining Usage =');
			if (usage && usage < 2000) {
				var scriptStatus = nlapiScheduleScript(context.getScriptId(),context.getDeploymentId());
				Util.console.log(scriptStatus, 'scriptStatus');
				if (scriptStatus == 'QUEUED') {
					break;
				}
			}
			
			
		}
		//Requeue for last check
		var scriptStatus = nlapiScheduleScript(context.getScriptId(),context.getDeploymentId());
		/*Util.console.log(scriptStatus, 'scriptStatus');
		if (scriptStatus == 'QUEUED') {
			break;
		}*/
	}  else {
		nlapiScheduleScript('customscript_amobee_sf_invoices_complete', 'customdeploy1');
	}
	logUsage('ending');
}

function discounter(amount, disc) {
	Util.console.log(amount, 'discounter amount');
	Util.console.log(disc, 'disc obj');
	
	
	amount = amount/(1-disc['additionaldisc']);
	amount = amount/(1-disc['agencyfee']);
	amount = amount/(1-disc['custdisc']);
	amount = amount/(1-disc['volumedisc']);
	amount = amount/(1-disc['pubdisc']);
	
	return amount;
	
}

function forceParseFloat(stValue) 
{
	return (isNaN(parseFloat(stValue)) ? 0 : parseFloat(stValue));
}

function updateFulfillRecs(sfLineId, invId, trandate) {
	
	var startDate = getMonthDate('start', trandate);
	var endDate = getMonthDate('end', trandate);
	
	var filters = [
	    new nlobjSearchFilter('custcol_sf_tran_line_id',null, 'is', sfLineId),
	    new nlobjSearchFilter('trandate', null, 'within', startDate, endDate)
	];
	
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_inv_creator_upd_fulfill', filters, null);
	
	if (searchResults && searchResults != '') {
		var fulfillId;
		
		for (var i=0; i<searchResults.length;i++){
			fulfillId = searchResults[i].getId();
			nlapiSubmitField('itemfulfillment', fulfillId, 'custbody_invoice_id', invId);
		} 
	}
	
	/*var fulfillRec = nlapiLoadRecord('itemfulfillment', fulfillId);
	var fulfillLines = fulfillRec.getLineItemCount('item');
	for (var n=1; n<fulfillLines;n++) {
		fulfillRec.setLineItemValue('item','custcol_invoice_id',n, invId );
	}
	
	nlapiSubmitRecord(fulfillRec);*/
}

function getCreatedInv(campId, trandate) {
	
	var startDate = getMonthDate('start', trandate);
	var endDate = getMonthDate('end', trandate);
	
	Util.console.log(startDate, 'startDate');
	Util.console.log(endDate, 'endDate');
	
	
	var filters = [
	    new nlobjSearchFilter('createdfrom', null, 'anyof', campId),
	   // new nlobjSearchFilter('custbody_amb_invoice_end', null, 'within', startDate, endDate)
	    new nlobjSearchFilter('custbody_amb_invoice_end', null, 'on', endDate)
	];
	
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_inv_creator_invoices', filters, null);
	
	if (searchResults && searchResults != '') {
		var invId = searchResults[0].getId();
		return invId;
	} else {
		return '';
	}
	
}

function getMonthDate(type,billDate) {
	
	var newDate = new Date(billDate);
	var month = newDate.getMonth() +1;
	var year = newDate.getFullYear();
	if (type == 'start') {
		var day = '01';
	} else if (type == 'end') {
		var day = new Date(year, month, 0);
		day = day.getDate();
	}
	
	var retDate = month.toString() + '/' +  day.toString() + '/' + year.toString();
	return retDate;
	
}

function AllLockedPeriod(stInvDate) {
	
	var trandate = stInvDate; 
	
	// Get Date
	var arMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	// This is a lookup of the Vendor fulfill date Accounting Period
	
	var fulfillDate = nlapiStringToDate(trandate);
	
	var FMonth 	= fulfillDate.getMonth();
	var FYear 	= fulfillDate.getFullYear().toString().substr(2, 2);
	var stMonth = arMonth[FMonth];
	
	nlapiLogExecution('DEBUG', 'test1', 'FMonth: '+FMonth+' | FYear: '+FYear +' | arMonth[FMonth]: '+stMonth);
	Util.console.log(stMonth,FYear);
	var acctPerInfo = getAcctPeriod(stMonth,FYear);
	//Util.console.log(acctPerInfo, 'acctPerInfo');
	
	//if ALL Locked, then default to current period. (This is Netsuite default functionality, so essentially do not set the accounting period if ALL locked
	if(acctPerInfo['allLocked'] == 'T')
		{
		nlapiLogExecution('DEBUG', 'acctPerInfo["allLocked"]',acctPerInfo['allLocked']);
		  // Perform a search to get first locked period
			var postingPeriodsLocked = nlapiSearchRecord('accountingperiod', 'customsearch_accounting_periods_all_lock');		
			if(postingPeriodsLocked)
			{
				var getacctPerInfoPeriod = postingPeriodsLocked[0].getValue('internalid', null, 'min');
				nlapiLogExecution('DEBUG', 'getacctPerInfoPeriod',getacctPerInfoPeriod);
			}
		
		}
	else
		{
			// Set the period return from acctPerInfo
		   var getacctPerInfoPeriod = acctPerInfo['acctPer'];
		   nlapiLogExecution('DEBUG', 'getacctPerInfoPeriod-else',getacctPerInfoPeriod);
		}
	
	return getacctPerInfoPeriod;

}
function getAcctPeriod(stMonth,FYear) {

	var acctPerInfo = new Array();
	
	var aFilter = new Array();
	aFilter.push(new nlobjSearchFilter('periodname', null, 'contains', stMonth));
	aFilter.push(new nlobjSearchFilter('periodname', null, 'contains', FYear));
	
	var aColumn = new Array();
	aColumn.push(new nlobjSearchColumn('internalid'));
	aColumn.push(new nlobjSearchColumn('closed'));
	aColumn.push(new nlobjSearchColumn('arlocked'));
	aColumn.push(new nlobjSearchColumn('aplocked'));
	aColumn.push(new nlobjSearchColumn('alllocked'));
	
	
	var resultPeriod = nlapiSearchRecord('accountingperiod', null, aFilter, aColumn);
	
	if (!resultPeriod) // this means no accounting period setup or it is still closed
	{
		//alert('The transaction date you specified is not within the date range of your accounting period.')	
	}
	
	var stAcctPeriod = resultPeriod[0].getValue('internalid');
	
	var stClosed = resultPeriod[0].getValue('closed');
	var stDateToday = nlapiDateToString(new Date());
	var arLocked = resultPeriod[0].getValue('arlocked');
	var apLocked = resultPeriod[0].getValue('aplocked');
	var allLocked = resultPeriod[0].getValue('alllocked');
	
	acctPerInfo['acctPer'] = stAcctPeriod;
	acctPerInfo['acctPerClosed'] = stClosed;
	acctPerInfo['arLocked'] = arLocked;
	acctPerInfo['apLocked'] = apLocked;
	acctPerInfo['allLocked'] = allLocked;
	
	return acctPerInfo;
	
	
}
//End of functions ===============================//

