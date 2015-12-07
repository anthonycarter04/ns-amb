/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Jan 2015     anthony.carter
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */

function execScript() {
	
	
	
}

function soAfterSubmit(type){
	
	var isChanged;
	var oldRec = nlapiGetOldRecord();
	var newRec = nlapiGetNewRecord();
	var oldVal = '';
	var newVal = '';
	var intRepId = '';
	var fieldCheck = [
	    'amount'
	];
	
	var context = nlapiGetContext();
	var scriptId = context.getScriptId();
	
	var roleId = nlapiGetRole();
	
	Util.console.log(scriptId, 'scriptId');
	if (scriptId && scriptId == 'customscript_intrep_camp_sc') {
		return;
	}
	Util.console.log('running');
	var changedFields = {};
	var campId = nlapiGetRecordId();
	var lineCount = nlapiGetLineItemCount('item');
	var sfInt = nlapiGetFieldValue('custbody_sf_integration');
	if (!sfInt || sfInt == 'F') {
		return;
	}
	
	
	if (lineCount && parseInt(lineCount) > 25) {
		nlapiScheduleScript('customscript_intrep_camp_sc', 'customdeploy1', {custscript_intrep_camp_id: campId});
		return true;
	}
	
	
	
//	Util.console.log(lineCount, 'lineCOunt');
	var context = nlapiGetContext();
	for (var i=1; i<=lineCount; i++) {
		var usage = context.getRemainingUsage();
		Util.console.log(usage, 'usage');
		if (usage && usage < 500) {
			break;
			
		}
		
		
		isChanged = 'F';
		intRepId = '';
		var sfLineId = nlapiGetLineItemValue('item', 'custcol_sf_tran_line_id', i);
		
		if (sfLineId && sfLineId != '') {
			
			
			for (var j=0;j<fieldCheck.length; j++) {
				if (oldRec && oldRec != '') {
					oldVal = oldRec.getLineItemValue('item', fieldCheck[j], i);
				} else {
					oldVal = '';
				}
				
				newVal = newRec.getLineItemValue('item', fieldCheck[j], i);
				//Util.console.log(oldVal, 'oldVal');
				//Util.console.log(newVal, 'newVal');
				if (oldVal != newVal) {
					changedFields[fieldCheck[j]] = newVal;
					var amount = newVal;
					isChanged = 'T';
				}
			}
			intRepId = newRec.getLineItemValue('item', 'custcol_integration_reporting', i);
			intRepUpdate = newRec.getLineItemValue('item', 'custcol_int_rep_updated', i);
			
			//if (isChanged == 'T' || isChanged == 'F') {
			if (intRepUpdate == 'F' || 'a' == 'a') {	
				var amount = newRec.getLineItemValue('item', 'amount', i);
				var ioItemName = newRec.getLineItemValue('item', 'custcol_sf_io_line_item_name', i);
				var rateModel = newRec.getLineItemValue('item', 'custcol_rate_model', i);
				var item = newRec.getLineItemValue('item', 'item', i);
				var ioLineNum = newRec.getLineItemValue('item', 'custcol_sf_line_number', i);
				var rateModelPrice = newRec.getLineItemValue('item', 'custcol_unit_price', i);
				var salesRep = newRec.getFieldValue('salesrep');
				var currency = newRec.getFieldValue('currency');
				var accountManager = newRec.getFieldValue('custbody_sf_account_manager');
				var pastBilled = newRec.getLineItemValue('item', 'custcol_sf_total_past_billed', i);
				if (!pastBilled || pastBilled == '') {
					pastBilled = 0;
				}
				
				var updateFields = ['custrecord_intrep_camp_amt'
				                    , 'custrecord_intrep_camp_link'
				                    , 'custrecord_intrep_io_item_name'
				                    , 'custrecord_intrep_rate_model'
				                    , 'custrecord_intrep_item'
				                    , 'custrecord_intrep_rate_model_price'
				                    , 'custrecord_intrep_sales_rep'
				                    , 'custrecord_intrep_account_manager'
				                    , 'custrecord_intrep_con_line_num'
				                    , 'custrecord_intrep_past_billed'
				                    , 'custrecord_intrep_currency'
				];
				var updateVals = [amount
				                  , campId
				                  , ioItemName
				                  , rateModel
				                  , item
				                  , rateModelPrice
				                  , salesRep
				                  , accountManager
				                  , ioLineNum
				                  , pastBilled
				                  , currency
				]
				
				if (!intRepId || intRepId == '') {
					intRepId = searchIntRepHead(sfLineId);
					
					if (!intRepId || intRepId == '') {
						//var amount = newRec.getLineItemValue('item', 'amount', i);
						var intRep = createHeader('CAMP', sfLineId, campId, changedFields,amount, ioItemName, rateModel, item, rateModelPrice, salesRep, accountManager, ioLineNum, pastBilled, currency);
						nlapiSetLineItemValue('item', 'custcol_integration_reporting', i, intRep);
						nlapiSetLineItemValue('item', 'custcol_int_rep_updated', i, 'T');
					} else {
						//var amount = newRec.getLineItemValue('item', 'amount', i);
						//Util.console.log(campId, 'campId');
						
						
						
						
						nlapiSubmitField('customrecord_integration_reporting', intRepId, updateFields, updateVals );
						nlapiSetLineItemValue('item', 'custcol_integration_reporting', i, intRepId);
						nlapiSetLineItemValue('item', 'custcol_int_rep_updated', i, 'T');
					}
				} else {
					//var amount = newRec.getLineItemValue('item', 'amount', i);
					//Util.console.log(campId, 'campId');
					nlapiSubmitField('customrecord_integration_reporting', intRepId, updateFields, updateVals );
					nlapiSetLineItemValue('item', 'custcol_integration_reporting', i, intRepId);
					nlapiSetLineItemValue('item', 'custcol_int_rep_updated', i, 'T');
				}
			}
			
			
			
			/*if (isChanged == 'T' || intRepId == '' || !intRepId) {
				
				if (intRepId && intRepId != '') {
					updateHeader(sfLineId, changedFields, amount);
				} else {
					var amount = newRec.getLineItemValue('item', 'amount', i);
					var intRep = createHeader('CAMP', sfLineId, campId, changedFields,amount);
					nlapiSetLineItemValue('item', 'custcol_integration_reporting', i, intRep);
				}
				
			}*/
		}
		
		
		
	}
	
}

function soScheduled(type){
	
	var context = nlapiGetContext();
	
	
	
	var campId = nlapiGetContext().getSetting('script', 'custscript_intrep_camp_id');
	Util.console.log(campId, 'invId');

	
	if (campId && campId != '') {
		
		var campRec = nlapiLoadRecord('salesorder', campId);
		var intRepId = '';
		var fieldCheck = [
		    'amount'
		];
		
		var changedFields = {};
		//var campId = nlapiGetRecordId();
		var lineCount = campRec.getLineItemCount('item');
		var sfInt = campRec.getFieldValue('custbody_sf_integration');
		if (!sfInt || sfInt == 'F') {
			return;
		}
		
		
		var oldRec = nlapiGetOldRecord();
		var newRec = nlapiGetNewRecord();
		
//		Util.console.log(lineCount, 'lineCOunt');
		var context = nlapiGetContext();
		for (var i=1; i<=lineCount; i++) {
			var usage = context.getRemainingUsage();
			Util.console.log(usage, 'usage');
			if (usage && usage < 500) {
				break;
				
			}
			
			
			isChanged = 'F';
			intRepId = '';
			var sfLineId = campRec.getLineItemValue('item', 'custcol_sf_tran_line_id', i);
			
			if (sfLineId && sfLineId != '') {
				
				
				/*for (var j=0;j<fieldCheck.length; j++) {
					if (oldRec && oldRec != '') {
						oldVal = oldRec.getLineItemValue('item', fieldCheck[j], i);
					} else {
						oldVal = '';
					}
					
					newVal = newRec.getLineItemValue('item', fieldCheck[j], i);
					//Util.console.log(oldVal, 'oldVal');
					//Util.console.log(newVal, 'newVal');
					if (oldVal != newVal) {
						changedFields[fieldCheck[j]] = newVal;
						var amount = newVal;
						isChanged = 'T';
					}
				}*/
				intRepId = campRec.getLineItemValue('item', 'custcol_integration_reporting', i);
				intRepUpdate = campRec.getLineItemValue('item', 'custcol_int_rep_updated', i);
				
				//if (isChanged == 'T' || isChanged == 'F') {
				if (intRepUpdate == 'F' || 'a' == 'a') {	
					var amount = campRec.getLineItemValue('item', 'amount', i);
					var ioItemName = campRec.getLineItemValue('item', 'custcol_sf_io_line_item_name', i);
					var rateModel = campRec.getLineItemValue('item', 'custcol_rate_model', i);
					var item = campRec.getLineItemValue('item', 'item', i);
					var ioLineNum = campRec.getLineItemValue('item', 'custcol_sf_line_number', i);
					var rateModelPrice = campRec.getLineItemValue('item', 'custcol_unit_price', i);
					var salesRep = campRec.getFieldValue('salesrep');
					var currency = campRec.getFieldValue('currency');
					var accountManager = campRec.getFieldValue('custbody_sf_account_manager');
					var pastBilled = campRec.getLineItemValue('item', 'custcol_sf_total_past_billed', i);
					if (!pastBilled || pastBilled == '') {
						pastBilled = 0;
					}
					
					var updateFields = ['custrecord_intrep_camp_amt'
					                    , 'custrecord_intrep_camp_link'
					                    , 'custrecord_intrep_io_item_name'
					                    , 'custrecord_intrep_rate_model'
					                    , 'custrecord_intrep_item'
					                    , 'custrecord_intrep_rate_model_price'
					                    , 'custrecord_intrep_sales_rep'
					                    , 'custrecord_intrep_account_manager'
					                    , 'custrecord_intrep_con_line_num'
					                    , 'custrecord_intrep_past_billed'
					                    , 'custrecord_intrep_currency'
					];
					var updateVals = [amount
					                  , campId
					                  , ioItemName
					                  , rateModel
					                  , item
					                  , rateModelPrice
					                  , salesRep
					                  , accountManager
					                  , ioLineNum
					                  , pastBilled
					                  , currency
					]
					
					if (!intRepId || intRepId == '') {
						intRepId = searchIntRepHead(sfLineId);
						
						if (!intRepId || intRepId == '') {
							//var amount = newRec.getLineItemValue('item', 'amount', i);
							var intRep = createHeader('CAMP', sfLineId, campId, changedFields,amount, ioItemName, rateModel, item, rateModelPrice, salesRep, accountManager, ioLineNum, pastBilled, currency);
							nlapiSetLineItemValue('item', 'custcol_integration_reporting', i, intRep);
							nlapiSetLineItemValue('item', 'custcol_int_rep_updated', i, 'T');
						} else {
							//var amount = newRec.getLineItemValue('item', 'amount', i);
							//Util.console.log(campId, 'campId');
							
							
							
							
							nlapiSubmitField('customrecord_integration_reporting', intRepId, updateFields, updateVals );
							//nlapiSetLineItemValue('item', 'custcol_integration_reporting', i, intRepId);
							//nlapiSetLineItemValue('item', 'custcol_int_rep_updated', i, 'T');
						}
					} else {
						//var amount = newRec.getLineItemValue('item', 'amount', i);
						//Util.console.log(campId, 'campId');
						nlapiSubmitField('customrecord_integration_reporting', intRepId, updateFields, updateVals );
						//nlapiSetLineItemValue('item', 'custcol_integration_reporting', i, intRepId);
						//nlapiSetLineItemValue('item', 'custcol_int_rep_updated', i, 'T');
					}
				}
				
				
				
				/*if (isChanged == 'T' || intRepId == '' || !intRepId) {
					
					if (intRepId && intRepId != '') {
						updateHeader(sfLineId, changedFields, amount);
					} else {
						var amount = newRec.getLineItemValue('item', 'amount', i);
						var intRep = createHeader('CAMP', sfLineId, campId, changedFields,amount);
						nlapiSetLineItemValue('item', 'custcol_integration_reporting', i, intRep);
					}
					
				}*/
			}
			
			
			
		}
	}

	
	
}

function beforeRecSubmit() {
	
}

function getExchangeRate(soId,billDate) {
	
	var curr = getCampCurr(soId);
	if (curr && curr != '') {
		var exchRate = computeExchangeRate('1', curr, billDate);
		if (exchRate && exchRate != '') {
			return exchRate;
		}
	}
	
}

function getCampCurr(sfID) {
	
	var filters = new nlobjSearchFilter('externalidstring', null, 'is', sfID);
	var columns = new nlobjSearchColumn('currency');
	var searchResults = nlapiSearchRecord('transaction', null, filters, columns);
	
	if (searchResults && searchResults != '') {
		var curr = searchResults[0].getValue('currency');
		//Util.console.log(curr, 'currency');
		return curr;
	} else {
		return '';
	}
	
}

function computeExchangeRate( stCurrency1, stCurrency2, stDateToday)
{
	//Util.console.log(stCurrency1 + ' ' + stCurrency2);
	var flExcRate = nlapiExchangeRate('1', stCurrency2, stDateToday);
	//var flConvEstUnitCost = forceParseFloat(flEstUnitCost)*forceParseFloat(flExcRate);	
	
	//return flConvEstUnitCost;
	return flExcRate;

}

function createHeader(type, sfLineId, campId, changedField, amount, ioItemName, rateModel, item, rateModelPrice, salesRep, accountManager, ioLineNum, pastBilled, currency ) {
	
	var intRepRec = nlapiCreateRecord('customrecord_integration_reporting');
	intRepRec.setFieldValue('custrecord_intrep_camp_link', campId);
	intRepRec.setFieldValue('custrecord_intrep_sf_tran_line_id', sfLineId);
	intRepRec.setFieldValue('custrecord_intrep_camp_amt', amount);
	intRepRec.setFieldValue('custrecord_intrep_io_item_name', ioItemName);
	intRepRec.setFieldValue('custrecord_intrep_item', item);
	intRepRec.setFieldValue('custrecord_intrep_rate_model', rateModel);
	intRepRec.setFieldValue('custrecord_intrep_sales_rep', salesRep);
	intRepRec.setFieldValue('custrecord_intrep_account_manager', accountManager);
	intRepRec.setFieldValue('custrecord_intrep_con_line_num', ioLineNum );
	intRepRec.setFieldValue('custrecord_intrep_past_billed', pastBilled);
	intRepRec.setFieldValue('custrecord_intrep_currency', currency);
	if (rateModelPrice && rateModelPrice != '') {
		intRepRec.setFieldValue('custrecord_intrep_rate_model_price', rateModelPrice);
	}
	try {
		var intRepId = nlapiSubmitRecord(intRepRec);
		return intRepId;
	} catch (e) {
		return '';
	}
	
	
	
}

function updateHeader(sfLineId, changedFields, amount) {
	
	var filters = [
	     new nlobjSearchFilter('custrecord_intrep_sf_tran_line_id', null, 'is', sfLineId)
	];
	
	var searchResults = nlapiSearchRecord('customrecord_integration_reporting', null, filters, null);
	
	if (searchResults && searchResults != '') {
		var recId = searchResults[0].getId();
		
		nlapiSubmitField('customrecord_integration_reporting', recId, 'custrecord_intrep_camp_amt', amount);
	}
	
}

function intBillAfterSubmit() {
	var sfLineId = nlapiGetFieldValue('custrecord_int_ext_so_item_id');
	var soId = nlapiGetFieldValue('custrecord_int_ext_so_id');
	if (sfLineId && sfLineId != '') {
		
		
		
		
		var billDate = nlapiGetFieldValue('custrecord_int_bill_date');
		
		var exchangeRate = nlapiGetFieldValue('custrecord_fulfill_exchange_rate');
		if (!exchangeRate || exchangeRate == '') {
			exchangeRate = getExchangeRate(soId, billDate);
			if (exchangeRate && exchangeRate != '') {
				nlapiSubmitField('customrecord_integration_billing', nlapiGetRecordId(),'custrecord_fulfill_exchange_rate', exchangeRate);
			} else {
				return false;
			}
			
		}
		
		//Util.console.log(exchangeRate, 'exchangeRate');
		
		var startDate = getMonthDate('start',billDate);
		var endDate = getMonthDate('end', billDate);
		var period = getPeriod(billDate);
		//Util.console.log(period, 'period');
		var params = getIntBillTotals(sfLineId, startDate, endDate);
		//Util.console.log(params, 'params');
		if (params && params != '') {
			var revenue = params['revenue'];
			var finalRevenue = params['finalrevenue'];
		} else {
			var revenue = 0;
			var finalRevenue = 0;
		}
		//var intBillFinalRev = getIntBillFinalTotals(sfLineId, startDate, endDate);
		//Util.console.log(revenue, 'revenue');
		
		revenue = parseFloat(exchangeRate) * parseFloat(revenue);
		//Util.console.log(revenue, 'revenue');
		
		//Util.console.log(finalRevenue, 'finalRevenue');
		//Util.console.log(period, 'period');
		
		var intRepHeadId = nlapiGetFieldValue('custrecord_intbill_int_rep_header');
		if (!intRepHeadId || intRepHeadId == '') {
			//Util.console.log('in first if');
			intRepHeadId = searchIntRepHead(sfLineId);
			//Util.console.log(intRepHeadId, 'in if intRepHeadId');
			
			if (!intRepHeadId || intRepHeadId == '') {
			//	Util.console.log('in second if');
				intRepHeadId = createHeader('', sfLineId, '', '', '', '', '', '', '', '','','','', '');
				//Util.console.log(intRepHeadId, 'in second if intRepHeadId');
			}
		}
		
		var intRepDetId = nlapiGetFieldValue('custrecord_intbill_int_rep_det');
		
		if (!intRepDetId || intRepDetId == '') {
			intRepDetId = searchIntRepDet(sfLineId, period);
			//Util.console.log(intRepDetId, 'intRepDetId');
		}
		
		
	
		
		if (intRepDetId && intRepDetId != '') {
			var recId = updateIntRepDet('intbill',intRepDetId, revenue, intRepHeadId, finalRevenue);
			//Util.console.log(recId, 'recId');
			if (recId && recId == 'yes') {
			//	Util.console.log('in the first if');
				nlapiSubmitField('customrecord_integration_billing',nlapiGetRecordId(), ['custrecord_int_rep_updated', 'custrecord_intbill_int_rep_det', 'custrecord_intbill_int_rep_header'], ['T',intRepDetId, intRepHeadId ] );
			}
		} else {
			var recId = createIntRepDet('intbill', revenue, period, sfLineId, intRepHeadId, '', finalRevenue);
			if (recId && recId != '') {
				nlapiSubmitField('customrecord_integration_billing',nlapiGetRecordId(), ['custrecord_int_rep_updated', 'custrecord_intbill_int_rep_det', 'custrecord_intbill_int_rep_header'], ['T', recId, intRepHeadId] );
			}
		}
		
	}
}

function searchIntRepHead(sfLineId) {
	var filters = [
	    new nlobjSearchFilter('custrecord_intrep_sf_tran_line_id', null, 'is', sfLineId)               
	];
	
	var searchResults = nlapiSearchRecord('customrecord_integration_reporting', null, filters, null);
	
	if (searchResults && searchResults != '') {
		var intRepHeadId = searchResults[0].getId();
		return intRepHeadId;
	} else {
		return '';
	}
}

function updateIntRepDet(type,intRepDetId,amount, intRepHeadId, finalRevenue) {
	if (type == 'intbill') {
		nlapiSubmitField('customrecord_integration_reporting_det', intRepDetId, ['custrecord_intrepdet_intbill_amt','custrecord_intrepdet_intrep', 'custrecord_intbill_final_rev' ], [amount, intRepHeadId, finalRevenue] );
	}
	return 'yes';
}

function createIntRepDet(type, amount, period, sfLineId, intRepHeadId, invId, finalRevenue, pastBilled, invApprStatus) {
	
	var intRepDet = nlapiCreateRecord('customrecord_integration_reporting_det');
	intRepDet.setFieldValue('custrecord_intrepdet_sf_line_id', sfLineId);
	intRepDet.setFieldText('custrecord_intrepdet_month', period);
	intRepDet.setFieldValue('custrecord_intrepdet_intrep', intRepHeadId);
	var extId = sfLineId + '-' + period;
	intRepDet.setFieldValue('externalid', extId);
	if (type == 'intbill') {
		intRepDet.setFieldValue('custrecord_intrepdet_intbill_amt', amount);
		intRepDet.setFieldValue('custrecord_intbill_final_rev', finalRevenue);
	} else if (type == 'inv') {
		intRepDet.setFieldValue('custrecordintbilldet_inv_amt', amount);
		intRepDet.setFieldValue('custrecord_intrepdet_invoice', invId);
		intRepDet.setFieldValue('custrecord_intrepdet_past_billed', pastBilled);
		intRepDet.setFieldValue('custrecord_intrepdet_inv_status', invApprStatus);
	}
	var recId = nlapiSubmitRecord(intRepDet);
	//Util.console.log(recId, 'int rep det ID');
	return recId;
}

function searchIntRepDet(sfLineId, period) {
	var filters = [];
	Util.console.log(period, 'period');
	period = periodIds[period];
	var filters = [
	      new nlobjSearchFilter('custrecord_intrepdet_month', null , 'anyof', period),
          new nlobjSearchFilter('custrecord_intrepdet_sf_line_id', null, 'is', sfLineId)
          
	];

	
	var searchResults = nlapiSearchRecord('customrecord_integration_reporting_det', null, filters, null);
	
	if (searchResults && searchResults != '') {
		Util.console.log(searchResults[0], 'searchResults 0');
		var recId = searchResults[0].getId();
		return recId;
	} else {
		return '';
	}
	
}

var periodIds = {
		'Nov-14': '29',
		'Dec-14': '30',
		'Jan-15': '32',
		'Feb-15': '33',
		'Mar-15': '34',
	    'Apr-15': '75',
	    'May-15': '76',
	    'Jun-15': '77',
	    'Jul-15': '79',
	    'Aug-15': '80',
	    'Sep-15': '81',
	    'Oct-15': '83',
	    'Nov-15': '84',
	    'Dec-15': '85',
	    'Jan-16': '87',
		'Feb-16': '88',
		'Mar-16': '89',
	    'Apr-16': '92',
	    'May-16': '93',
	    'Jun-16': '94',
	    'Jul-16': '96',
	    'Aug-16': '97',
	    'Sep-16': '98',
	    'Oct-16': '100',
	    'Nov-16': '101',
	    'Dec-16': '102',
}

/*function getIntBillTotals(sfLineId, startDate, endDate) {
	
	var filters = [
	     new nlobjSearchFilter('custrecord_int_ext_so_item_id', null, 'is', sfLineId),
	     new nlobjSearchFilter('custrecord_int_bill_date', null, 'within', startDate, endDate)
	];
	
	var searchResults = nlapiSearchRecord('customrecord_integration_billing', 'customsearch_dnd_intrep_intbill', filters, null);
	
	if (searchResults && searchResults != '') {
		
		var revenue = searchResults[0].getValue('custrecord_int_bill_revenue', null, 'sum');
		return revenue;
		
	}
	
}*/

function getIntBillTotals(sfLineId, startDate, endDate) {
	Util.console.log(startDate, 'startDate');
	Util.console.log(endDate, 'endDate');
	var filters = [
	     new nlobjSearchFilter('custrecord_int_ext_so_item_id', null, 'is', sfLineId),
	     new nlobjSearchFilter('custrecord_int_bill_date', null, 'within', startDate, endDate)
	];
	
	var searchResults = nlapiSearchRecord('customrecord_integration_billing', 'customsearch_dnd_intrep_intbill', filters, null);
	
	if (searchResults && searchResults != '') {
		
		var revenue = searchResults[0].getValue('custrecord_int_bill_revenue', null, 'sum');
		var finalRevenue = searchResults[0].getValue('custrecord_intbill_final_revenue', null, 'sum');
		var params = {};
		params['revenue'] = revenue;
		params['finalrevenue'] = finalRevenue;
		
		return params;
		
	}
	
}


function getMonthDate(type,billDate) {
	var datePref = nlapiGetContext().getPreference('dateformat');
	billDate = moment(billDate, datePref).format('MM/DD/YYYY');
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
	
	Util.console.log(retDate, 'retDate before moments');
	retDate = moment(retDate, 'MM/DD/YYYY').format(datePref);
	Util.console.log(retDate, 'retDate');
	return retDate;
	
}

function getPeriod(billDate) {
	var datePref = nlapiGetContext().getPreference('dateformat');
	billDate = moment(billDate, datePref).format('MM/DD/YYYY');
	
	var newDate = new Date(billDate);
	
	var year = newDate.getFullYear();
	
	year = year.toString();
	year = year.substring(year.length-2, year.length);
	month = periods[newDate.getMonth()];
	var period = month + '-' + year;
	return period;
}

var periods = [
'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function updateIntBillReporting() {
	
	var searchResults = nlapiSearchRecord('customrecord_integration_billing', 'customsearch_update_int_rep_int_bill', null, null);
	
	if (searchResults && searchResults != '') {
		var context = nlapiGetContext();
		for (var i=0; i< searchResults.length; i++) {
			
			var usage = context.getRemainingUsage();
			if (i && i == 998) {
				var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
				if (status && status == 'QUEUED') {
					break;
				}
			}
			
			var intBillId = searchResults[i].getId();
			//Util.console.log(intBillId);
			var intBillRec = nlapiLoadRecord('customrecord_integration_billing', intBillId);
			intBillRec.setFieldValue('custrecord_int_rep_updated', 'T');
			
			nlapiSubmitRecord(intBillRec);
			
		}
		
		
	}
	
}

function invAfterSubmit() {
	
	
	
	var context = nlapiGetContext();
	var scriptId = context.getScriptId();
	
	var roleId = nlapiGetRole();
	
	//if (roleId && roleId == '3') {
		Util.console.log(scriptId, 'scriptId');
		if (scriptId && scriptId == 'customscript_intrep_inv_inv_sc') {
			return;
		}
		Util.console.log('after script exit');
		var isChanged;
		var oldRec = nlapiGetOldRecord();
		var newRec = nlapiGetNewRecord();
		var oldVal = '';
		var newVal = '';
		var intRepId = '';
		var fieldCheck = [
		    'amount'
		];
		var changedFields = {};
		var invId = nlapiGetRecordId();
		var lineCount = nlapiGetLineItemCount('item');
		Util.console.log(lineCount, 'lineCount');
		var sfInt = nlapiGetFieldValue('custbody_sf_integration');
		if (!sfInt || sfInt == '') {
			return;
		}
		if (lineCount && parseInt(lineCount) > 25) {
			nlapiScheduleScript('customscript_intrep_inv_inv_sc', 'customdeploy1', {custscript_intrep_inv_id: invId});
			return false;
		}
		
		
		for (var i=1; i<=lineCount; i++) {
			isChanged = 'F';
			intRepId = '';
			var sfLineId = nlapiGetLineItemValue('item', 'custcol_sf_tran_line_id', i);
			
			if (sfLineId && sfLineId != '') {
				
				
				for (var j=0;j<fieldCheck.length; j++) {
					if (oldRec && oldRec != '') {
						oldVal = oldRec.getLineItemValue('item', fieldCheck[j], i);
					} else {
						oldVal = '';
					}
					
					newVal = newRec.getLineItemValue('item', fieldCheck[j], i);
					Util.console.log(oldVal, 'oldVal');
					Util.console.log(newVal, 'newVal');
					amount = newVal;
					if (oldVal != newVal) {
						changedFields[fieldCheck[j]] = newVal;
						var amount = newVal;
						isChanged = 'T';
					}
				}
				
				
				
				
				if (isChanged == 'T' || isChanged == 'F' ) {
					
					var period = getPeriod(newRec.getFieldValue('custbody_amb_invoice_end'));
					var startDate = getMonthDate('start', newRec.getFieldValue('custbody_amb_invoice_end'));
					Util.console.log(startDate, 'startDate');
					var invApprStatus = newRec.getFieldValue('custbody_inv_appr_status');
					if (!invApprStatus || invApprStatus == '') {
						invApprStatus = '1';
					}
					intRepHeadId = searchIntRepHead(sfLineId);
					Util.console.log(intRepHeadId, 'in if intRepHeadId');
					
					var pastBilled = getPastBilled(sfLineId, startDate);
					Util.console.log(pastBilled,'pastbilledamount');
					
					if (intRepHeadId && intRepHeadId != '') {
						
						intRepDetId = newRec.getLineItemValue('item', 'custcol_inv_intrepdet', i);
						
						if (!intRepDetId || intRepDetId == '') {
							intRepDetId = searchIntRepDet(sfLineId, period);
						}
							
						if (!intRepDetId || intRepDetId == '') {
							amount = newRec.getLineItemValue('item', 'amount', i);
							Util.console.log(amount, 'amount');
							
							intRepDetId = createIntRepDet('inv', amount, period, sfLineId, intRepHeadId, invId,'', pastBilled, invApprStatus);
							//nlapiSetLineItemValue('item', 'custcol_inv_intrepdet', i, intRepDetId);	
						} else {
							nlapiSubmitField('customrecord_integration_reporting_det',intRepDetId, ['custrecord_intrepdet_invoice', 'custrecordintbilldet_inv_amt', 'custrecord_intrepdet_past_billed', 'custrecord_intrepdet_inv_status'], [invId, amount, pastBilled, invApprStatus] );
							//nlapiSetLineItemValue('item', 'custcol_inv_intrepdet', i, intRepDetId);	
						}
							
						
					}
					
					
					
				}
				
				
				
				

			}
			
			
			
		}
	//}
	
	
}

function invScheduled() {
	
	var invId = nlapiGetContext().getSetting('script', 'custscript_intrep_inv_id');
	Util.console.log(invId, 'invId');
	if (invId && invId != '') {
		
		var invLoad = nlapiLoadRecord('invoice', invId);
		var lineCount = invLoad.getLineItemCount('item'); 
		Util.console.log(lineCount, 'lineCount');
		for (var i=1; i<=lineCount; i++) {
			var isChanged = 'F';
			var intRepId = '';
			var sfLineId = invLoad.getLineItemValue('item', 'custcol_sf_tran_line_id', i);
			
			if (sfLineId && sfLineId != '') {
							
				if (isChanged == 'T' || isChanged == 'F' ) {
					var period = getPeriod(invLoad.getFieldValue('custbody_amb_invoice_end'));
					var startDate = getMonthDate('start', invLoad.getFieldValue('custbody_amb_invoice_end'));
					var invApprStatus = invLoad.getFieldValue('custbody_inv_appr_status');
					if (!invApprStatus || invApprStatus == '') {
						invApprStatus = '1';
					}
					var intRepHeadId = searchIntRepHead(sfLineId);
					Util.console.log(intRepHeadId, 'in if intRepHeadId');
					
					var pastBilled = getPastBilled(sfLineId, startDate);
					
					if (intRepHeadId && intRepHeadId != '') {
						
						var intRepDetId = invLoad.getLineItemValue('item', 'custcol_inv_intrepdet', i);
						
						if (!intRepDetId || intRepDetId == '') {
							intRepDetId = searchIntRepDet(sfLineId, period);
						}
							
						if (!intRepDetId || intRepDetId == '') {
							Util.console.log(i, 'line');
							amount = invLoad.getLineItemValue('item', 'amount', i);
							Util.console.log(amount, 'amount');
							intRepDetId = createIntRepDet('inv', amount, period, sfLineId, intRepHeadId,'', invId, pastBilled, invApprStatus);
							//invLoad.setLineItemValue('item', 'custcol_inv_intrepdet', i, intRepDetId);	
						} else {
							Util.console.log(i, 'line');
							amount = invLoad.getLineItemValue('item', 'amount', i);
							nlapiSubmitField('customrecord_integration_reporting_det',intRepDetId, ['custrecord_intrepdet_invoice', 'custrecordintbilldet_inv_amt', 'custrecord_intrepdet_past_billed', 'custrecord_intrepdet_inv_status'], [invId, amount, pastBilled, invApprStatus] );
							//invLoad.setLineItemValue('item', 'custcol_inv_intrepdet', i, intRepDetId);	
						}
					

					}

				}
			}
			
		}
		//nlapiSubmitRecord(invLoad);
		//return true;
	}
	
	
}

function invUpdate() {
	
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_int_rep_det_invupdate', null, null);
	
	if (searchResults && searchResults != '') {
		
		for (var i=0; i<searchResults.length; i++) {
			var invId = searchResults[i].getId();
			var invRec = nlapiLoadRecord('invoice', invId);
			invRec.setFieldValue('custbody_intrepdet_inv_updated', 'T');
			nlapiSubmitRecord(invRec);
		}
	}
	
	
}

function getPastBilled(sfLineId, startDate) {
	
	var filters = [
	    new nlobjSearchFilter('trandate', null, 'before', startDate),
	    new nlobjSearchFilter('custcol_sf_tran_line_id', null, 'is', sfLineId)
	];
	
	
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_all_fulfill_sf_tranline', filters, null);
	
	if (searchResults && searchResults != '') {
		return searchResults[0].getValue('custcol_amb_so_net_spend', null, 'sum');
	} else {
		return 0;
	}
	
}

function invoiceUpdate() {
	
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_sf_invoices_created', null, null);
	
	if (searchResults && searchResults != '') {
		var context = nlapiGetContext();
		for (var i=0; i<searchResults.length; i++) {
			
			var usage = context.getRemainingUsage();
			if (usage && usage < 1000) {
				var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
				if (status && status == 'QUEUED') {
					break;
				}
			}
			
			var invId = searchResults[i].getId();
			Util.console.log('searchresult ' + i + ' invID=' + invId);
			var invRec = nlapiLoadRecord('invoice', invId);
			invRec.setFieldValue('custbody_script_update_field', 'T');
			nlapiSubmitRecord(invRec);
		}
		
	}
	
}





