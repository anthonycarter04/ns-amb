/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Apr 2015     anthony.carter
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

function addInvAdjBtn(type, form, request) {
	
	if (type && type == 'view') {
		var postPeriod = nlapiGetFieldValue('postingperiod');
		Util.console.log(postPeriod, 'postPeriod');
		
		var sfInt = nlapiGetFieldValue('custbody_sf_integration');
		Util.console.log(sfInt, 'sfInt');
		if (sfInt && sfInt == 'T') {
			var filters = [
			       	    new nlobjSearchFilter('internalid', null, 'anyof', postPeriod)
			       	];
			       	
			       	var columns = [
			       	    new nlobjSearchColumn('closed'),
			       	    new nlobjSearchColumn('internalid'),
			       	    new nlobjSearchColumn('alllocked')
			       	]
			       	var resultPeriod = nlapiSearchRecord('accountingperiod', null, filters, columns);
			       	
			       	if (resultPeriod && resultPeriod != '') {
			       		var stAcctPeriod = resultPeriod[0].getValue('internalid');
			       		var stClosed = resultPeriod[0].getValue('alllocked');
			       		Util.console.log(stClosed);
			       		
			       		if (stClosed && stClosed == 'F') {
			       			var btn = form.addButton('custpage_invadj', 'Adjust Invoice', 'adjustTheInvoice()');
			       			form.setScript('customscript_sf_inv_adjuster_cl');
			       		}
			       		
			       	}
		}
		
	}

}

function testingIt2() {
	
}

function adjustTheInvoice() {
	
	var recId = nlapiGetRecordId();
	
	
	var slURL = nlapiResolveURL('SUITELET', 'customscript_sf_inv_adjuster', 'customdeploy1');
	Util.console.log(slURL);
	//var slURL = '/app/site/hosting/scriptlet.nl?script=449&deploy=1';
	slURL += '&custpage_recid=' + recId;
	
 	
	 var intHeight = 650;
	 var intWidth = 900;
	
	//nlapiRequestURL(slURL);
	window.open(slURL, '_blank','width=' + intWidth + ',height=' + intHeight + ',scrollbars=1');
	//window.open(slURL);
}

function invAdjSL(request, response){
	//Util.console.log(request.getMethod());
	if (request && request.getMethod() == 'GET') {
		
		var itemForm = nlapiCreateForm('Invoice Adjuster', true);
		//var createdPO = request.getParameter('custpage_created_po');
		//var createdPOId = request.getParameter('custpage_created_po_id')
		
		var invId = request.getParameter('custpage_recid');
		Util.console.log(invId, 'invId');
		
		if (invId && invId != '') {
			var invRec = nlapiLoadRecord('invoice', invId);
			var tranId = invRec.getFieldValue('tranid');
			var entity = invRec.getFieldValue('entity');
			var soID = invRec.getFieldValue('createdfrom');
			var invDate = invRec.getFieldValue('trandate');
			
			
			if (!soID || soID == '') {
				soID = invRec.getFieldValue('custbody_amb_created_from_campaign');
			}
			Util.console.log(soID, 'SOID');
			
			itemForm.addField('custpage_tranid', 'text', 'Invoice Number').setDisplayType('inline').setLayoutType('startrow', 'startcol').setDefaultValue(tranId);
			itemForm.addField('custpage_entity', 'select', 'Customer', 'customer').setDisplayType('inline').setDefaultValue(entity);
			itemForm.addField('custpage_createdfrom', 'select', 'Sales Order', 'transaction').setDisplayType('hidden').setDefaultValue(soID);
			itemForm.addField('custpage_invrec', 'select', 'Invoice', 'transaction').setDisplayType('inline').setDefaultValue(invId);
			itemForm.addField('custpage_invdate', 'date', 'Invoice Date').setDisplayType('inline').setDefaultValue(invDate);
			itemForm.addSubmitButton('Adjust Values');
			var invItemList = itemForm.addSubList('custpage_itemlist', 'list', 'Invoice Item List');
			
			invItemList.addField('custpage_selectitem', 'radio', 'Select Line');
			invItemList.addField('custpage_item', 'select', 'Item', 'item').setDisplayType('inline');
			invItemList.addField('custpage_ioitemname', 'text', 'IO Item Name').setDisplayType('inline');
			invItemList.addField('custpage_sftranlineid', 'text', 'SF Tran Line Id').setDisplayType('hidden');
			invItemList.addField('custpage_quantity', 'float', 'Quantity').setDisplayType('inline');
			invItemList.addField('custpage_amount', 'currency', 'Net Spend').setDisplayType('inline');
			invItemList.addField('custpage_itemrate', 'float', 'Item Rate').setDisplayType('inline');
			invItemList.addField('custpage_ratemodel', 'select', 'Rate Model', 'customlist_rate_model').setDisplayType('inline');
			
			var lineCount = invRec.getLineItemCount('item');
			for (var i=1; i<=lineCount; i++) {
			
				var ioItemName = invRec.getLineItemValue('item', 'custcol_sf_io_line_item_name', i);
				Util.console.log(ioItemName, 'ioItemName step 1');
				var item = invRec.getLineItemValue('item', 'item', i);
				var quantity = invRec.getLineItemValue('item', 'quantity', i);
				var amount = invRec.getLineItemValue('item', 'amount', i);
				var sfTranLineId = invRec.getLineItemValue('item', 'custcol_sf_tran_line_id', i);
				var itemRate = invRec.getLineItemValue('item', 'custcol_amb_inv_ful_gross_rt', i);
				var rateModel = invRec.getLineItemValue('item', 'custcol_rate_model', i);
				
				invItemList.setLineItemValue('custpage_item', i, item);
				invItemList.setLineItemValue('custpage_ioitemname', i, ioItemName);
				invItemList.setLineItemValue('custpage_sftranlineid', i, sfTranLineId);
				invItemList.setLineItemValue('custpage_quantity', i, quantity);
				invItemList.setLineItemValue('custpage_amount', i, amount);
				invItemList.setLineItemValue('custpage_itemrate', i, itemRate);
				invItemList.setLineItemValue('custpage_ratemodel', i, rateModel);
				
			}
			
		
		}
		
		
		response.writePage(itemForm);
	} else if(request.getMethod() == 'POST') {
		
		if (!request.getParameter('custpage_s_adjquan')) {
			var secondForm = nlapiCreateForm('Invoice Adjuster', true);
			secondForm.setScript('customscript_sf_inv_adjuster_cl');
			secondForm.addSubmitButton('Process Adjustment');
			//secondForm.addButton('custpage', 'Calculate Values', 'calcAmountBtn()');
			secondForm.setScript('customscript_sf_inv_adjuster_cl');
			secondForm.addFieldGroup('custpage_invoiceinfo', 'Invoice Information');
			secondForm.addField('custpage_s_invnum', 'text', 'Invoice Number', null , 'custpage_invoiceinfo').setDisplayType('inline').setLayoutType('startrow', 'startcol').setDefaultValue(request.getParameter('custpage_tranid'));
			secondForm.addField('custpage_s_entity', 'select', 'Customer', 'customer', 'custpage_invoiceinfo').setDisplayType('inline').setDefaultValue(request.getParameter('custpage_entity'));
			secondForm.addField('custpage_s_createdfrom', 'select', 'Sales Order', 'transaction', 'custpage_invoiceinfo').setDisplayType('hidden').setDefaultValue(request.getParameter('custpage_createdfrom'));
			secondForm.addField('custpage_s_invrec', 'select', 'Invoice', 'transaction', 'custpage_invoiceinfo').setDisplayType('hidden').setDefaultValue(request.getParameter('custpage_invrec'));
			var rateModel = secondForm.addField('custpage_s_ratemodel', 'select', 'Rate Model', 'customlist_rate_model', 'custpage_invoiceinfo').setDisplayType('inline');
			var sfTranLineId2 = secondForm.addField('custpage_s_sftranlineid', 'text', 'SF Tran Line ID', null, 'custpage_invoiceinfo').setDisplayType('hidden');
			
			
			var ioItemName = secondForm.addField('custpage_s_ioitemname', 'text', 'IO Item Name', null, 'custpage_invoiceinfo').setDisplayType('inline');
			secondForm.addFieldGroup('custpage_adjgroup', 'Adjustments');
			var invDate = request.getParameter('custpage_invdate');
			var d = new Date(invDate);
			d.setDate(1);
			d.setHours(-1);
			var month = d.getMonth() + 1;
			var day = d.getDate();
			var year = d.getFullYear();
			var finalDate = month + '/' + day + '/' + year;
			
			
			var fulfillmentDate = secondForm.addField('custpage_s_fulfilldate', 'date', 'Fulfillment Date', null, 'custpage_adjgroup').setDisplayType('entry').setDisplaySize('35').setDefaultValue(finalDate);
			var currAmount = secondForm.addField('custpage_s_curramount', 'currency', 'Current Amount', null, 'custpage_adjgroup').setDisplayType('inline');
			var currQuan = secondForm.addField('custpage_s_currquan', 'float', 'Current Quantity', null, 'custpage_adjgroup').setDisplayType('inline');
			var adjAmt = secondForm.addField('custpage_s_adjamt', 'currency', 'Adjust Amount By', null, 'custpage_adjgroup').setDisplayType('entry').setLayoutType('startrow', 'startcol');
			adjAmt.setDisplaySize('8');
			var adjRate = secondForm.addField('custpage_s_adjrate', 'float', 'Adjustment Rate', null, 'custpage_adjgroup').setDisplayType('inline');
			var adjQuan = secondForm.addField('custpage_s_adjquan', 'float', 'Adjust Qty By', null, 'custpage_adjgroup').setDisplayType('inline');
			adjQuan.setDisplaySize('8');
			
			
			var finalAmt = secondForm.addField('custpage_s_finalamt', 'currency', 'Final Amount', null, 'custpage_adjgroup').setDisplayType('inline').setLayoutType('startrow', 'startcol');
			var finalQuan = secondForm.addField('custpage_s_finalquan', 'float', 'Final Quantity', null, 'custpage_adjgroup').setDisplayType('inline');
			
			var theLineCount = request.getLineItemCount('custpage_itemlist');
			
			for (var j=1; j<=theLineCount; j++) {
				var isChecked = request.getLineItemValue('custpage_itemlist', 'custpage_selectitem', j);
				if (isChecked == 'T') {
					ioItemName.setDefaultValue(request.getLineItemValue('custpage_itemlist', 'custpage_ioitemname', j));
					currQuan.setDefaultValue(request.getLineItemValue('custpage_itemlist', 'custpage_quantity', j));
					adjRate.setDefaultValue(request.getLineItemValue('custpage_itemlist', 'custpage_itemrate', j));
					currAmount.setDefaultValue(request.getLineItemValue('custpage_itemlist', 'custpage_amount', j));
					sfTranLineId2.setDefaultValue(request.getLineItemValue('custpage_itemlist', 'custpage_sftranlineid', j));
					rateModel.setDefaultValue(request.getLineItemValue('custpage_itemlist', 'custpage_ratemodel', j));
				}
			}
			
			
			response.writePage(secondForm);
		} else {
			var finalForm = nlapiCreateForm('', true);
			finalForm.addFieldGroup('custpage_adjstatus', 'Adjustment Status');
			var finalStatus = finalForm.addField('custpage_finalstatus', 'text', 'Status', null, 'custpage_adjstatus').setDisplayType('inline');
			var invId = request.getParameter('custpage_s_invrec');
			var campId = request.getParameter('custpage_s_createdfrom');
			var adjQuan = request.getParameter('custpage_s_adjquan');
			var adjAmt = request.getParameter('custpage_s_adjamt');
			var adjRate = request.getParameter('custpage_s_adjrate');
			var fulfillDate = request.getParameter('custpage_s_fulfilldate');
			var sfTranLineId = request.getParameter('custpage_s_sftranlineid');
			var ioItemName = request.getParameter('custpage_s_ioitemname');
			
			if (campId && campId != '' && invId && invId != '') {
				
				var fulfillId = createIF(campId, sfTranLineId, adjQuan, adjAmt, invId, adjRate, ioItemName, fulfillDate);
				
				if (fulfillId && fulfillId != '') {
					
					var invFinalId = updateInv(sfTranLineId, adjQuan, adjAmt, invId, ioItemName);
					
					finalStatus.setDefaultValue('Great Success!');
					
					finalForm.addFieldGroup('custpage_finaladjustments', 'Adjustment Transactions');
					
					finalForm.addField('custpage_finalinv', 'select', 'Invoice', 'transaction', 'custpage_finaladjustments').setDisplayType('inline').setDefaultValue(invFinalId);
					finalForm.addField('custpage_adjfulfill', 'select', 'Adjustment Fulfillment', 'transaction', 'custpage_finaladjustments').setDisplayType('inline').setDefaultValue(fulfillId);
				}
				
			}
			
			
			
			//Util.console.log(nlapiGetRecordId(), 'invoice ID in final');
			response.writePage(finalForm);
		}
		
		
	}
}

function updateInv(sfTranLineId, adjQuan, adjAmt, invId, sfLineName) {
	
	if (invId && invId != '') {
		var invRec = nlapiLoadRecord('invoice', invId);
		
		var lineCount = invRec.getLineItemCount('item');
		
		for (var i=1; i<=lineCount; i++) {
			
			//var invSfLineId = invRec.getLineItemValue('item', 'custcol_sf_tran_line_id', i);
			var invSfLineName = invRec.getLineItemValue('item', 'custcol_sf_io_line_item_name', i);
			//if (invSfLineId == sfTranLineId) {
			if (sfLineName == invSfLineName) {	
				var invQuan = invRec.getLineItemValue('item', 'quantity', i);
				var invAmt = invRec.getLineItemValue('item', 'amount', i);
				
				var finalQuan = parseFloat(invQuan) + parseFloat(adjQuan);
				var finalAmt = parseFloat(invAmt) + parseFloat(adjAmt);
				
				invRec.setLineItemValue('item', 'quantity',i, finalQuan);
				invRec.setLineItemValue('item', 'amount',i, finalAmt);
				
				//discounter logic
				var  addDisc = invRec.getLineItemValue('item', 'custcol_sf_additional_disc', i);
				var  agencyFee = invRec.getLineItemValue('item', 'custcol_sf_agency_fee', i);
				var  custDisc = invRec.getLineItemValue('item', 'custcol_sf_customer_discount', i);
				var  volDisc = invRec.getLineItemValue('item', 'custcol_sf_volume_discount', i);
				var  pubDisc = invRec.getLineItemValue('item', 'custcol_sf_publisher_discount', i);
				
				 addDisc  = forceParseFloat(addDisc)/100;
				 agencyFee = forceParseFloat(agencyFee)/100;
				 custDisc = forceParseFloat(custDisc)/100;
				 volDisc = forceParseFloat(volDisc)/100;
				 pubDisc = forceParseFloat(pubDisc)/100;
				 
				 
				 
				 
				 //////Util.console.log(fulfillmentAmount, 'fulfillmentAmount before discounter');
				
				var grossAmt = finalAmt/(1-addDisc);
				grossAmt = grossAmt/(1-agencyFee);
				grossAmt = grossAmt/(1-custDisc);
				grossAmt = grossAmt/(1-volDisc);
				grossAmt = grossAmt/(1-pubDisc);
				
				
				invRec.setLineItemValue('item', 'custcol_amb_inv_ful_gross_amt', i, grossAmt);
				
				
				var invIdFinal = nlapiSubmitRecord(invRec);
				return invIdFinal;
				
				break;
			}
			
		}

	}
	
}

function createIF(campId, sfTranLineId, adjQuan, adjAmt,invId, adjRate, sfLineName, fulfillDate) {
	
	var recIF = nlapiTransformRecord('salesorder', campId, 'itemfulfillment');
	recIF.setFieldValue('customform', '109');
	
	var context = nlapiGetContext();
	
	
	if (fulfillDate && fulfillDate != '') {
		recIF.setFieldValue('trandate', fulfillDate);
	} else {
		recIF.setFieldValue('trandate', '08/31/2015');
	}
	
	
	/*****
	 * Need to have code to dynamically set the date based on last day of prior month
	 */
		
	recIF.setFieldValue('shipstatus', 'C'); // Shipped

	

    recIF.setFieldValue('custbody_amb_created_from_campaign', campId); 
    var campCust = recIF.getFieldValue('entity');
	recIF.setFieldValue('custbody_amb_campaign_customer', campCust); 
	recIF.setFieldValue('custbody_invoice_id', invId);
	
	var lineCount = recIF.getLineItemCount('item');
	//create fulfillment record
	for (var i = 1; i<=lineCount; i++)
	{

		//var stLineHeaderId = recIF.getLineItemValue('item', 'custcol_amb_targeting', i);
		var extSOLineId = recIF.getLineItemValue('item', 'custcol_sf_tran_line_id', i);
		var extSOLineName = recIF.getLineItemValue('item', 'custcol_sf_io_line_item_name', i);
		Util.console.log(extSOLineName, 'extSoLineName');
		Util.console.log(sfLineName, 'sfLineName');
		recIF.setLineItemValue('item', 'quantity', i, 0); 
		////////Util.console.log(extSOLineId);
		////////Util.console.log(params['intbillinfo']['custrecord_int_ext_so_item_id']);
		//if(extSOLineId == sfTranLineId) {
		if (extSOLineName == sfLineName) {
				recIF.setLineItemValue('item', 'quantity', i, 1);
				recIF.setLineItemValue('item', 'custcol_fulfillment_actual_quantity', i, adjQuan);
				/*if (params['soinfo']['custcol_rate_model'] == 'CPR') {
					params['finalnumbers']['soamt'] = parseFloat(params['intbillinfo']['custrecord_int_bill_revenue']);
				}*/
				
				recIF.setLineItemValue('item', 'custcol_amb_so_net_spend', i, adjAmt);
				
				
				
				//if (params['soinfo']['custcol_rate_model'] == 'CPM') {
				//	ambRate = parseFloat(ambRate)/1000;
			//	}
				recIF.setLineItemValue('item', 'custcol_amb_receive_rate', i, adjRate);
				//recIF.setLineItemValue('item', 'custcol_amb_receive_rate', line, forceParseFloat(BillableRate));// ASIF 03/31 - UPDATE custcol_amb_receive_rate				
				//var flNetSpend = BillableRate*Fulfillments;

				//recIF.setLineItemValue('item', 'custcol_amb_so_net_spend', line, flNetSpend); 
						
		} else {
			recIF.removeLineItem('item', i);
		}
		
	}

	var createdIF = nlapiSubmitRecord(recIF);
	Util.console.log(createdIF, 'createdIF');
	return createdIF;
}


function invAdjCLFC(type, name) {
	if (name && name == 'custpage_s_adjamt' ) {
		
		
		var rateModel = nlapiGetFieldText('custpage_s_ratemodel');
		var currQuan = nlapiGetFieldValue('custpage_s_currquan');
		var adjQuan = nlapiGetFieldValue('custpage_s_adjquan');
		
		
		var adjRate = nlapiGetFieldValue('custpage_s_adjrate');
		var currAmount = nlapiGetFieldValue('custpage_s_curramount');
		var adjAmount = nlapiGetFieldValue('custpage_s_adjamt');
		if (rateModel && rateModel == 'CPR') {
			
			
			if (adjQuan == '') {
				adjQuan = 0;
			} else {
				adjQuan = parseFloat(adjQuan);
			}
			
			if (adjAmount == '') {
				adjAmount = 0;
			} else {
				adjAmount = parseFloat(adjAmount);
			}
			var finalQuan = parseFloat(currQuan) + adjQuan;
			var finalAmount = parseFloat(currAmount) + adjAmount;
			
			nlapiSetFieldValue('custpage_s_adjquan', adjQuan);
			nlapiSetFieldValue('custpage_s_finalquan', finalQuan);
			nlapiSetFieldValue('custpage_s_finalamt', finalAmount);
		} else {
			
			if (!adjQuan || adjQuan == '') {
				
				
				adjQuan = parseFloat(adjAmount)/parseFloat(adjRate);
				adjQuan = adjQuan.toFixed(8);
				nlapiSetFieldValue('custpage_s_adjquan', adjQuan);
				
				var finalQuan = parseFloat(currQuan) + parseFloat(adjQuan);
				var finalAmount = parseFloat(currAmount) + parseFloat(adjAmount);
				if (finalQuan < 0) {
					finalQuan = 0;
				}
				nlapiSetFieldValue('custpage_s_finalquan', finalQuan);
				nlapiSetFieldValue('custpage_s_finalamt', finalAmount);
				
			} else if (!adjAmount || adjAmount == '') {
				
				adjAmount = parseFloat(adjQuan) * parseFloat(adjRate);
				adjAmount = adjAmount.toFixed(8);
				nlapiSetFieldValue('custpage_s_adjamt', adjAmount);
				
				var finalQuan = parseFloat(currQuan) + parseFloat(adjQuan);
				var finalAmount = parseFloat(currAmount) + parseFloat(adjAmount);
				if (finalQuan < 0) {
					finalQuan = 0;
				}
				nlapiSetFieldValue('custpage_s_finalquan', finalQuan);
				nlapiSetFieldValue('custpage_s_finalamt', finalAmount);
				
			} else if (adjAmount != '' && adjQuan != '' && name == 'custpage_s_adjamt') {
				
				adjQuan = parseFloat(adjAmount)/parseFloat(adjRate);
				adjQuan = adjQuan.toFixed(8);
				nlapiSetFieldValue('custpage_s_adjquan', adjQuan);
				
				var finalQuan = parseFloat(currQuan) + parseFloat(adjQuan);
				var finalAmount = parseFloat(currAmount) + parseFloat(adjAmount);
				if (finalQuan < 0) {
					finalQuan = 0;
				}
				nlapiSetFieldValue('custpage_s_finalquan', finalQuan);
				nlapiSetFieldValue('custpage_s_finalamt', finalAmount);
				
			} /*else if (adjAmount != '' && adjQuan != '' && name == 'custpage_s_adjquan') {
				adjAmount = parseFloat(adjQuan) * parseFloat(adjRate);
				adjAmount = adjAmount.toFixed(8);
				nlapiSetFieldValue('custpage_s_adjamt', adjAmount);
				
				var finalQuan = parseFloat(currQuan) + parseFloat(adjQuan);
				var finalAmount = parseFloat(currAmount) + parseFloat(adjAmount);
				
				nlapiSetFieldValue('custpage_s_finalquan', finalQuan);
				nlapiSetFieldValue('custpage_s_finalamt', finalAmount);
			}*/
			
			
			
			
		}
		
		
		
		
	}
}

function calcAmountBtn() {
	var rateModel = nlapiGetFieldText('custpage_s_ratemodel');
	var currQuan = nlapiGetFieldValue('custpage_s_currquan');
	var adjQuan = nlapiGetFieldValue('custpage_s_adjquan');
	
	
	var adjRate = nlapiGetFieldValue('custpage_s_adjrate');
	var currAmount = nlapiGetFieldValue('custpage_s_curramount');
	var adjAmount = nlapiGetFieldValue('custpage_s_adjamt');
	if (rateModel && rateModel == 'CPR') {
		
		
		if (adjQuan == '') {
			adjQuan = 0;
		} else {
			adjQuan = parseFloat(adjQuan);
		}
		
		if (adjAmount == '') {
			adjAmount = 0;
		} else {
			adjAmount = parseFloat(adjAmount);
		}
		var finalQuan = parseFloat(currQuan) + adjQuan;
		var finalAmount = parseFloat(currAmount) + adjAmount;
		if (finalQuan < 0) {
			finalQuan = 0;
		}
		nlapiSetFieldValue('custpage_s_finalquan', finalQuan);
		nlapiSetFieldValue('custpage_s_finalamt', finalAmount);
	} else {
		
		if (!adjQuan || adjQuan == '') {
			
			
			adjQuan = parseFloat(adjAmount)/parseFloat(adjRate);
			adjQuan = adjQuan.toFixed(8);
			nlapiSetFieldValue('custpage_s_adjquan', adjQuan);
			
			var finalQuan = parseFloat(currQuan) + parseFloat(adjQuan);
			var finalAmount = parseFloat(currAmount) + parseFloat(adjAmount);
			
			if (finalQuan < 0) {
				finalQuan = 0;
			}
			nlapiSetFieldValue('custpage_s_finalquan', finalQuan);
			nlapiSetFieldValue('custpage_s_finalamt', finalAmount);
			
		} else if (!adjAmount || adjAmount == '') {
			
			adjAmount = parseFloat(adjQuan) * parseFloat(adjRate);
			adjAmount = adjAmount.toFixed(8);
			nlapiSetFieldValue('custpage_s_adjamt', adjAmount);
			
			var finalQuan = parseFloat(currQuan) + parseFloat(adjQuan);
			var finalAmount = parseFloat(currAmount) + parseFloat(adjAmount);
			if (finalQuan < 0) {
				finalQuan = 0;
			}
			
			nlapiSetFieldValue('custpage_s_finalquan', finalQuan);
			nlapiSetFieldValue('custpage_s_finalamt', finalAmount);
			
		}
	}
}

function saveFinal() {
	var finalAmount = nlapiGetFieldValue('custpage_s_finalamt');
	if (finalAmount && finalAmount != '') {
		
		if (finalAmount<0) {
			alert('Final amount must be positive.  Please edit and save again.');
			return false;
		}
		var finalQuan = nlapiGetFieldValue('custpage_s_finalquan');
		if (finalQuan< 0) {
			alert('Final quantity must be positive.  Please edit and save again.');
			return false;
		}
		
		return true;
		
		
		
	}
	return true;
	
}

