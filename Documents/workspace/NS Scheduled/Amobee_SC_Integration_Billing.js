/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Dec 2014     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */

function queueTheDeploys () {
	
	for (var i=1; i<=5;i++) {
		nlapiScheduleScript('customscript_amobee_sc_int_billing', 'customdeploy' + i);
	}

}

function startScript(type) {
	var params;
	logUsage('starting');

	//Get Integration Billing Records
	var searchResults = nlapiSearchRecord('customrecord_integration_billing', 'customsearch_dnd_int_bill_script', null,null);
	
	if (searchResults && searchResults[0] != '') {
		var parsedResults = parseResults(searchResults);
		soIDs = [];
		for (key in parsedResults) {
			
			if (!inArray(key,soIDs)) {
				soIDs.push(key);
			}
		}

		var deploy = nlapiGetContext().getDeploymentId();
		var scriptParams = nlapiGetContext().getSetting('SCRIPT', 'custscript_thesos');

		//Loop through the Int Billing record
		if (soIDs && soIDs.length >200) {
			if (deploy && deploy == 'customdeploy1') {
				var SOsToProcess = [];
				if (!scriptParams || scriptParams == '') {
					var soID;
					var soIDsLength = soIDs.length;
					
					for (var i=0;i<parseInt(soIDsLength/5);i++) {

						soID = soIDs[i];
						if (!inArray(soID, SOsToProcess)) {
							SOsToProcess.push(soID);
						}
					}
					
				} else {
					SOsToProcess = JSON.parse(scriptParams);
				}
				
				processTheRecs(parsedResults,SOsToProcess);
			
			} else if (deploy && deploy == 'customdeploy2') {
				var SOsToProcess = [];
				if (!scriptParams || scriptParams == '') {
					var soID;
					var soIDsLength = soIDs.length;
					
					for (var i=soIDsLength - 1;i>= (soIDsLength - parseInt(soIDsLength/5));i--) {	

						soID = soIDs[i];
						if (!inArray(soID, SOsToProcess)) {
							SOsToProcess.push(soID);
						}
					}
					
				} else {
					SOsToProcess = JSON.parse(scriptParams);

				}
				
				
				processTheRecs(parsedResults,SOsToProcess);
			} else if (deploy && deploy == 'customdeploy3') {
				var SOsToProcess = [];
				if (!scriptParams || scriptParams == '') {
					var soID;
					var soIDsLength = soIDs.length;

					for (var i=(soIDsLength - parseInt(soIDsLength/5) - 1);i>= (parseInt(soIDsLength/5) *3);i--) {	
						
						
						soID = soIDs[i];
						if (!inArray(soID, SOsToProcess)) {
							SOsToProcess.push(soID);
						}
					}
				
				} else {
					SOsToProcess = JSON.parse(scriptParams);
					
				}
				
				processTheRecs(parsedResults,SOsToProcess);
			}  else if (deploy && deploy == 'customdeploy4') {
				var SOsToProcess = [];
				if (!scriptParams || scriptParams == '') {
					var soID;
					var soIDsLength = soIDs.length;
			
					for (var i=(parseInt(soIDsLength/5) *3)-1;i>= (parseInt(soIDsLength/5) *2);i--) {	
						
						
						soID = soIDs[i];
						if (!inArray(soID, SOsToProcess)) {
							SOsToProcess.push(soID);
						}
					}
				
				} else {
					SOsToProcess = JSON.parse(scriptParams);
				
					
				}
				
				processTheRecs(parsedResults,SOsToProcess);
			} else if (deploy && deploy == 'customdeploy5') {
				var SOsToProcess = [];
				if (!scriptParams || scriptParams == '') {
					var soID;
					var soIDsLength = soIDs.length;
					
					for (var i=(parseInt(soIDsLength/5) *2)-1;i>= parseInt(soIDsLength/5);i--) {	
						
						
						soID = soIDs[i];
						if (!inArray(soID, SOsToProcess)) {
							SOsToProcess.push(soID);
						}
					}
					
				} else {
					SOsToProcess = JSON.parse(scriptParams);
					
					
				}
				
				processTheRecs(parsedResults,SOsToProcess);
			}
		} else {
			if (deploy && deploy == 'customdeploy1') {
				var SOsToProcess = [];
				if (!scriptParams || scriptParams == '') {
					var soID;
					var theLength = soIDs.length;
					
					for (var i=0;i<theLength;i++) {
						
						
						
						soID = soIDs[i];
						if (!inArray(soID, SOsToProcess)) {
							SOsToProcess.push(soID);
						}
					}
					
				} else {
					SOsToProcess = JSON.parse(scriptParams);
					
					
				}

				processTheRecs(parsedResults,SOsToProcess);
			}
		}

	}
	
	logUsage('End');
}

function startScript2(type) {
	var params;
	logUsage('starting');
	
	
	//Get Integration Billing Records
	
	var context = nlapiGetContext();
	var deploy = context.getDeploymentId();
	
	if (deploy && deploy == 'customdeploy1') {
		var searchResults = nlapiSearchRecord('customrecord_integration_billing', 'customsearch_dnd_int_bill_script', null,null);
	} else if (deploy && deploy == 'customdeploy2') {
		var searchResults = nlapiSearchRecord('customrecord_integration_billing', 'customsearch_dnd_int_bill_script_num2', null,null);
	} else if (deploy && deploy == 'customdeploy3') {
		var searchResults = nlapiSearchRecord('customrecord_integration_billing', 'customsearch_dnd_int_bill_script_num3', null,null);
	} else if (deploy && deploy == 'customdeploy4') {
		var searchResults = nlapiSearchRecord('customrecord_integration_billing', 'customsearch_dnd_int_bill_script_num4', null,null);
	} else if (deploy && deploy == 'customdeploy5') {
		var searchResults = nlapiSearchRecord('customrecord_integration_billing', 'customsearch_dnd_int_bill_script_num5', null,null);
	}
	
	
	if (searchResults && searchResults[0] != '') {
		var parsedResults = parseResults(searchResults);
		soIDs = [];
		for (key in parsedResults) {
			
			if (!inArray(key,soIDs)) {
				soIDs.push(key);
			}
		}
	
		var scriptParams = nlapiGetContext().getSetting('SCRIPT', 'custscript_thesos');
		
		
		var SOsToProcess = [];
		if (!scriptParams || scriptParams == '') {
			var soID;
			var soIDsLength = soIDs.length;
			
			for (var i=0;i< parseInt(soIDsLength);i++) {
				
				
				
				soID = soIDs[i];
				if (!inArray(soID, SOsToProcess)) {
					SOsToProcess.push(soID);
				}
			}
			
		} else {
			SOsToProcess = JSON.parse(scriptParams);
		
			
		}
		
		processTheRecs(parsedResults,SOsToProcess);

	}
	
	logUsage('End');
}
	



function processTheRecs(parsedResults,soIDs) {
	
	var theLength = soIDs.length;
	var scriptStatus = '';

	for (var i=0; i< theLength; i++) {
	
		for (key in parsedResults) {
			
			if (key == soIDs[i]) {
				
				for (var j=0; j< parsedResults[key].length; j++) {
					
					var context = nlapiGetContext();
					var usage = context.getRemainingUsage();
					
					if (usage && usage < 300) {
						
						var context = nlapiGetContext();
						var jsonSOIds = JSON.stringify(soIDs);
						
						var scriptStatus = nlapiScheduleScript(context.getScriptId(),context.getDeploymentId(), {custscript_thesos: jsonSOIds});
						if (scriptStatus == 'QUEUED') {
							break;
						}
						
						
					}
					var params= {};
					params['intbillupdate'] = {};
					params['intbillupdate']['itemreceipt'] = '';
					params['intbillupdate']['itemfulfillment'] = '';
					params['intbillupdate']['polinecomplete'] = '';
					params['intbillupdate']['ircomplete'] = '';
					params['intbillupdate']['ifcomplete'] = '';
					params['intbillupdate']['processed'] = '';
					params['ratemodelquan'] = {};
					intBillId = parsedResults[key][j];
					
					
					var intBillRec = nlapiLoadRecord('customrecord_integration_billing', intBillId);
					var intBillInfo = getIntBillInfo(intBillRec);

					if (intBillInfo && intBillInfo != false) {
					
							params['intbillinfo'] = intBillInfo;
							if (params['intbillinfo']['custrecord_int_bill_processed'] == 'T') {
								continue;
							}
							
					params['intbillupdate']['ircomplete'] = params['intbillinfo']['custrecord_int_bill_receipt_complete'];
					params['intbillupdate']['ifcomplete'] = params['intbillinfo']['custrecord_int_bill_fulfill_complete'];
					params['intbillupdate']['polinecomplete'] = params['intbillinfo']['custrecord_int_bill_po_line_complete'];
					params['intbillupdate']['itemreceipt'] = params['intbillinfo']['custrecord_int_bill_item_receipt'];
					params['intbillupdate']['itemfulfillment'] = params['intbillinfo']['custrecord_int_bill_item_fulfillment'];
					params['intbillupdate']['fulfillexchangerate'] = params['intbillinfo']['custrecord_fulfill_exchange_rate'];
							
						
							
						var acctPeriod = getAcctPeriod(params['intbillinfo']['custrecord_int_bill_date']);
							
						if (acctPeriod && acctPeriod != false) {
							params['acctper'] = acctPeriod;	
							
							
							var extSOLineId = intBillRec.getFieldValue('custrecord_int_ext_so_item_id');
						
							
							//If SO ID is found, call function get SO details
							if (extSOLineId && extSOLineId != '') {
								
								var soInfo = getSOInfo(extSOLineId);
																	
								if (soInfo && soInfo != false) {
									params['soinfo'] = soInfo;
									

									var rateModelStats = getRateModelStats(params['soinfo']['custcol_rate_model'],params);
									params['ratemodelquan']['soquan'] = rateModelStats['quan'];
									params['ratemodelquan']['sorateid'] = rateModelStats['rateId'];
									
									
									/***************
									 * Add code to get final numbers
									 ***************/
									var exchangeRates = getExchangeRates(params, 'SO');
									params['exchangerates'] = exchangeRates;
									params['intbillupdate']['fulfillexchangerate'] = params['exchangerates']['soexchangerate'];
									nlapiSubmitField('customrecord_integration_billing', intBillId, ['custrecord_int_bill_ns_so_ref', 'custrecord_fulfill_exchange_rate' ],[params['soinfo']['internalid'], params['intbillupdate']['fulfillexchangerate']]);
									var finalNumbers = getFinalNumbers(params, 'SO');
									params['finalnumbers'] = finalNumbers;
									nlapiSubmitField('customrecord_integration_billing', intBillId, 'custrecord_intbill_final_revenue', params['finalnumbers']['soamt']);
									
	
									if (params['intbillinfo']['custrecord_int_bill_fulfill_complete'] == 'F') {
										try {
											
											var createTheIF = createIF(params);
										} catch (e) {
											updateIntError(intBillId, e.toString());
										}
									} else {
										var createTheIF = true;
									}
									
									
									if (createTheIF && createTheIF != '') {
										
										if (createTheIF == 'quantity<0') {
									
											params['intbillupdate']['itemfulfillment'] = '';
										} else {
											params['intbillupdate']['itemfulfillment'] = createTheIF;
										}
										
										params['intbillupdate']['ifcomplete'] = 'T';
										params['intbillupdate']['processed'] = 'T';
										
										if (params['intbillinfo']['custrecord_int_bill_fulfill_complete'] == 'F') {
											updateIntBill(intBillId, params);
										}
										
										
										
									} else {
										updateIntError(intBillId, 'Could not create the item fulfillment');
									}
									
								} else {
									updateIntError(intBillId, 'Could not get SO Info');
								}
							} else {
								updateIntError(intBillId, 'No EXT SO Line IDID');
								
							}
									
									
							var extPOId = intBillRec.getFieldValue('custrecord_int_ext_po_id');
									
							//If PO ID, call function to get PO Details
							if (extPOId && extPOId != '') {
								
								//if (extPOId == '0') {
									//continue;
								//}
								
								var poInfo = getPOInfo(extPOId);
							
								if (poInfo && poInfo != false) {
									params['poinfo'] = poInfo;
									var exchangeRates = getExchangeRates(params, 'PO');
									params['exchangerates'] = exchangeRates;
									var finalNumbers = getFinalNumbers(params, 'PO');
									params['finalnumbers'] = finalNumbers;
									
									
									
										
										var rateModelQuan = getRateModelStats(params['intbillinfo']['custrecord_int_ext_po_price_type'],params);
										params['ratemodelquan']['poquan'] = rateModelQuan['quan'];
										params['ratemodelquan']['porateid'] = rateModelQuan['rateId'];
										
										if (params['intbillinfo']['custrecord_int_bill_po_line_complete'] == 'F') {
											try {
												var updateThePO = updatePOLines(params);
											} catch (e) {
												updateIntError(intBillId, e.toString());
											}
											
										} else {
											
											var updateThePO = true;
										}
										
										
										if (updateThePO && updateThePO == true) {
										
											params['intbillupdate']['polinecomplete'] = 'T';
											if (params['intbillinfo']['custrecord_int_bill_po_line_complete'] == 'F') {
												updateIntBill(intBillId,params);
											}
											
											if (params['intbillinfo']['custrecord_int_bill_receipt_complete'] == 'F') {
												
												try {
													var createTheIR = createIR(params);
												} catch (e) {
													updateIntError(intBillId, e.toString());
													
												}
												
											} else {
												var createTheIR = true;
											}
											
											
											if (createTheIR && createTheIR != '') {
												
												if (createTheIR == 'NO IR') {
													params['intbillupdate']['itemreceipt'] = '';
												} else {
													params['intbillupdate']['itemreceipt'] = createTheIR;
												}
												
												params['intbillupdate']['ircomplete'] = 'T';
												
												if (params['intbillinfo']['custrecord_int_bill_receipt_complete'] == 'F') {
													updateIntBill(intBillId, params);
												}
												continue;
												
											} else {
												updateIntError(intBillId, 'Could not create the item receipt');
											
											}
													
										} else {
											updateIntError(intBillId, 'Could not update the PO Lines');
											
										}
												
												
									} else {
										updateIntError(intBillId, 'Could not find PO Info');
									
									}
											
											
										
								} else {
									updateIntError(intBillId, 'No Ext PO Id');
								
								}
										
							} else {
								updateIntError(intBillId, 'Could not find account period info');
							
							}
									
						} else {
							updateIntError(intBillId, 'Could not get Int Bill Info');
						
						}
					} 
				} 
			}
			

	
			soIDs = soIDs.splice(1, theLength);
		
	
			if (soIDs.length > 0) {
				var context = nlapiGetContext();
				var jsonSOIds = JSON.stringify(soIDs);
				
				var scriptStatus = nlapiScheduleScript(context.getScriptId(),context.getDeploymentId(), {custscript_thesos: jsonSOIds});
				if (scriptStatus == 'QUEUED') {
					break;
				}
			} else {
				var context = nlapiGetContext();
				var scriptStatus = nlapiScheduleScript(context.getScriptId(),context.getDeploymentId(), {custscript_thesos: jsonSOIds});
				if (scriptStatus == 'QUEUED') {
					break;
				}
			}
			
			
		}
			
			

}


function parseResults(results) {
	
	results = JSON.stringify(results);
	results = JSON.parse(results);
	
	var parsedResults = {};
	var soID = '';
	var soIDs =[];
	var intBillId;
	for (var i=0; i< results.length; i++) {
		
		soID = results[i]['columns']['custrecord_int_ext_po_id'];
		intBillId = results[i]['id'];
		
		if (!parsedResults[soID]) {
			parsedResults[soID] = [];
		}
		
		if (!inArray(intBillId,parsedResults[soID])) {
			parsedResults[soID].push(intBillId);
		}
		
		
		
	}
	
	return parsedResults;
	
	
}

function adjustTotals() {
	
	var params;
	logUsage('starting');
	//Get Integration Billing Records
	var searchResults = nlapiSearchRecord('customrecord_integration_billing', 'customsearch_dnd_intbill_adjustments', null,null);
	
	if (searchResults && searchResults[0] != '') {
		
		//Loop through the Int Billing record
		for (var i=0; i<searchResults.length; i++) {
			logUsage('Starting Record ' + (i+1) + ' of ' + searchResults.length);
			params= {};
			params['intbillupdate'] = {};
			params['intbillupdate']['itemreceipt'] = '';
			params['intbillupdate']['itemfulfillment'] = '';
			params['intbillupdate']['polinecomplete'] = '';
			params['intbillupdate']['ircomplete'] = '';
			params['intbillupdate']['ifcomplete'] = '';
			params['intbillupdate']['processed'] = '';
			params['ratemodelquan'] = {};
			intBillId = searchResults[i].getId();
			
			var intBillRec = nlapiLoadRecord('customrecord_integration_billing', intBillId);
			var intBillInfo = getIntBillInfo(intBillRec);
		
			if (intBillInfo && intBillInfo != false) {
			
				params['intbillinfo'] = intBillInfo;
			
		
			var extSOLineId = intBillRec.getFieldValue('custrecord_int_ext_so_item_id');
			
		
				//If SO ID is found, call function get SO details
				if (extSOLineId && extSOLineId != '') {
					
					var soInfo = getSOInfo(extSOLineId);
				
					if (soInfo && soInfo != false) {
						params['soinfo'] = soInfo;
						
						var acctPeriod = getAcctPeriod(params['intbillinfo']['custrecord_int_bill_date']);
						
						if (acctPeriod && acctPeriod != false) {
							params['acctper'] = acctPeriod;
							if (params['intbillinfo']['custrecord_int_bill_revenue'] && parseFloat(params['intbillinfo']['custrecord_int_bill_revenue']) > 0) {
								//create fulfillment record
								params['ratemodelquan'] = {};
								params['ratemodelquan']['soquan'] = '1';
								params['finalnumbers'] = {};
								params['finalnumbers']['soamt'] = params['intbillinfo']['custrecord_int_bill_revenue'];
								
								var createTheIF = createIF(params);
								
								if (createTheIF && createTheIF != '') {
									params['intbillupdate']['itemfulfillment'] = createTheIF;
									params['intbillupdate']['ifcomplete'] = 'T';
									params['intbillupdate']['processed'] = 'T';
									updateIntBill(intBillId,params);
								}
							} else if (params['intbillinfo']['custrecord_int_bill_revenue'] && parseFloat(params['intbillinfo']['custrecord_int_bill_revenue']) < 0) {
								
								params['ratemodelquan'] = {};
								params['ratemodelquan']['soquan'] = '1';
								params['finalnumbers'] = {};
								params['finalnumbers']['soamt'] = params['intbillinfo']['custrecord_int_bill_revenue'];
							
								var createTheCM = createCM(params);
								
								if (createTheCM && createTheCM != '') {
									params['intbillupdate']['processed'] = 'T';
									params['intbillupdate']['creditmemo'] = createTheCM;
									updateIntBill(intBillId,params);
								}
								
							} else if (params['intbillinfo']['custrecord_int_bill_cost'] && parseFloat(params['intbillinfo']['custrecord_int_bill_cost']) > 0) {
								//create item receipt
								
								var extPOId = intBillRec.getFieldValue('custrecord_int_ext_po_id');
								
								//If PO ID, call function to get PO Details
								if (extPOId && extPOId != '') {
									
									var poInfo = getPOInfo(extPOId);
									
									if (poInfo && poInfo != false) {
										params['poinfo'] = poInfo;
										var exchangeRates = getExchangeRates(params);
										params['exchangerates'] = exchangeRates;
										var finalNumbers = getFinalNumbers(params);
										params['finalnumbers'] = finalNumbers;
								
								var rateModelQuan = getRateModelStats(params['intbillinfo']['custrecord_int_ext_po_price_type'],params);
								params['ratemodelquan']['poquan'] = '1';
								params['ratemodelquan']['porateid'] = rateModelQuan['rateId'];
								
								if (params['intbillinfo']['custrecord_int_bill_po_line_complete'] == 'F') {
									
									try {
										var updateThePO = updatePOLines(params);
									} catch (e) {
										updateIntError(intBillId, e.toString());
									}
									
								} else {
									var updateThePO = true;
								}
								
								
								if (updateThePO && updateThePO == true) {
									
									params['intbillupdate']['polinecomplete'] = 'T';
									if (params['intbillinfo']['custrecord_int_bill_po_line_complete'] == 'F') {
										updateIntBill(intBillId,params);
									}
									
									if (params['intbillinfo']['custrecord_int_bill_receipt_complete'] == 'F') {
										
										try {
											var createTheIR = createIR(params);
										} catch (e) {
											updateIntError(intBillId, e.toString());
										}
										
									} else {
										var createTheIR = true;
									}
									
									
									if (createTheIR && createTheIR != '') {
										params['intbillupdate']['itemreceipt'] = createTheIR;
										params['intbillupdate']['ircomplete'] = 'T';
										
										if (params['intbillinfo']['custrecord_int_bill_receipt_complete'] == 'F') {
											updateIntBill(intBillId, params);
										}
									}
								}
									}
								}
								
							} else if (params['intbillinfo']['custrecord_int_bill_cost'] && parseFloat(params['intbillinfo']['custrecord_int_bill_cost']) < 0) {
								//create bill credit
								var extPOId = intBillRec.getFieldValue('custrecord_int_ext_po_id');
								
								//If PO ID, call function to get PO Details
								if (extPOId && extPOId != '') {
									
									var poInfo = getPOInfo(extPOId);
									
									if (poInfo && poInfo != false) {
										params['poinfo'] = poInfo;
										var exchangeRates = getExchangeRates(params);
										params['exchangerates'] = exchangeRates;
										var finalNumbers = getFinalNumbers(params);
										params['finalnumbers'] = finalNumbers;
										nlapiSubmitField('customrecord_integration_billing', intBillId, 'custrecord_intbill_final_revenue', params['finalnumbers']['soamt']);
								
										var rateModelQuan = getRateModelStats(params['intbillinfo']['custrecord_int_ext_po_price_type'],params);
										params['ratemodelquan']['poquan'] = '1';
										params['ratemodelquan']['porateid'] = rateModelQuan['rateId'];
										
										var createTheBC = createBillCredit(params);
										
										if (createTheBC && createTheBC != '') {
											params['intbillupdate']['processed'] = 'T';
											params['intbillupdate']['billcredit'] = createTheBC;
											updateIntBill(intBillId,params);
										}
								
									}
								}
							}
						}
						
					}
				}
			}
		}
	}
}


function updateIntError(intBillId, errorMsg) {
	errorMsg = intBillId + ': ' + errorMsg;
	
	var intBillRec = nlapiLoadRecord('customrecord_integration_billing', intBillId);
	var currErr = intBillRec.getFieldValue('custrecord_int_bill_error_code');
	if (!currErr || currErr == '') {
		intBillRec.setFieldValue('custrecord_int_bill_error_code',errorMsg);
	} else {
		intBillRec.setFieldValue('custrecord_int_bill_error_code',currErr + '//' + errorMsg);
	}
	
	try {
		nlapiSubmitRecord(intBillRec);
	} catch (e) {
		
	}
	
}

function getExchangeRates(params, recType) {
	var exchangeRates = {};
	
	exchRateDate = new Date(params['intbillinfo']['custrecord_int_bill_date']);
	newDate = new Date(exchRateDate.getFullYear(),exchRateDate.getMonth()-1,25);
	
	var theYear = newDate.getFullYear();
	var theMonth = parseInt(newDate.getMonth()) + 1;
	var theDay = 19;
	newDate = theMonth + '/' + theDay + '/' + theYear;
	newDate = '08/31/2015';
	Util.console.log(newDate, 'newDate');

	if (recType == 'SO') {
		var soExchangeRate = computeExchangeRate('1', params['soinfo']['currency'], newDate /*params['intbillinfo']['custrecord_int_bill_date']*/);
		exchangeRates['soexchangerate'] = soExchangeRate;
	} else if (recType == 'PO') {
		var poExchangeRate = computeExchangeRate('1', params['poinfo']['currency'], newDate /*params['intbillinfo']['custrecord_int_bill_date']*/);
		exchangeRates['poexchangerate'] = poExchangeRate;
	}
	

	
	return exchangeRates;
}

function getFinalNumbers(params, recType) {
	
	var finalNumbers = {};
	
	if (recType == 'SO') {
		//Set SO Numbers
	
			if (params['soinfo']['custcol_rate_model'] == 'CPM' || params['soinfo']['custcol_rate_model'] == 'CPR') {
				var fulfillmentAmount = parseFloat(params['intbillinfo']['custrecord_int_bill_revenue']).toFixed(3) * parseFloat(params['exchangerates']['soexchangerate']);
				//////Util.console.log(fulfillmentAmount,'cpm fulfillment amount');
			} else if (params['soinfo']['custcol_rate_model'] == 'CPC' || params['soinfo']['custcol_rate_model'] == 'CPA') {
				var fulfillmentAmount = parseFloat(params['intbillinfo']['custrecord_intbill_extso_item_rate']) * params['ratemodelquan']['soquan'];
			}

			if (params['soinfo']['custcol_rate_model'] == 'CPM' || params['soinfo']['custcol_rate_model'] == 'CPR') {
				fulfillmentAmount = discounter(params, fulfillmentAmount);
			}
		
		
		finalNumbers['soamt'] = fulfillmentAmount;
	} else if (recType == 'PO') {
		var poExchangeRate = params['exchangerates']['poexchangerate'];
		finalNumbers['poamt'] = parseFloat(params['intbillinfo']['custrecord_int_bill_cost']) * parseFloat(poExchangeRate);
	}
	
	return finalNumbers;
	
}

function discounter(params, fulfillmentAmount) {
	
	params['discounts'] = {};
	var creativeFee = params['soinfo']['custcol_sf_creative_serv_prod_costs'];
	var adServFee = params['soinfo']['custcol_sf_ad_serving_fees'];
	var adVeriFee = params['soinfo']['custcol_sf_ad_verification_fees'];
	var dataFee = params['soinfo']['custcol_sf_data_fees'];
	var varHandFee = params['soinfo']['custcol_sf_variable_handling_fee'];
	var handFee = params['soinfo']['custcol_sf_handling_fee'];
	
	 params['discounts']['creativefee']   = forceParseFloat(creativeFee)/100;
	 params['discounts']['adservfee'] = forceParseFloat(adServFee)/100;
	 params['discounts']['adverifee'] = forceParseFloat(adVeriFee)/100;
	 params['discounts']['datafee'] = forceParseFloat(dataFee)/100;
	 params['discounts']['varhandfee'] = forceParseFloat(varHandFee)/100;
	 params['discounts']['handfee'] = forceParseFloat(handFee)/100;
	 
	 

	fulfillmentAmount = fulfillmentAmount/(1-params['discounts']['creativefee']);
	fulfillmentAmount = fulfillmentAmount/(1-params['discounts']['adservfee']);
	fulfillmentAmount = fulfillmentAmount/(1-params['discounts']['adverifee']);
	fulfillmentAmount = fulfillmentAmount/(1-params['discounts']['datafee']);
	fulfillmentAmount = fulfillmentAmount/(1-params['discounts']['varhandfee']);
	fulfillmentAmount = fulfillmentAmount/(1-params['discounts']['handfee']);
	
	return fulfillmentAmount;
}

function forceParseFloat(stValue) 
{
	return (isNaN(parseFloat(stValue)) ? 0 : parseFloat(stValue));
}

function getIntBillInfo(intBillRec) {
	
	var intBillFields = [
	    'internalid',
	    'custrecord_int_bill_date',
	    'custrecord_int_ext_so_id',
	    'custrecord_int_ext_so_item_id',
	    'custrecord_int_ext_po_id',
	    'custrecord_int_ext_po_price_type',
	    'custrecord_int_bill_impressions',
	    'custrecord_int_bill_clicks',
	    'custrecord_int_bill_actions',
	    'custrecord_int_bill_revenue',
	    'custrecord_int_bill_cost',
	    'custrecord_int_bill_po_line_complete',
	    'custrecord_int_bill_receipt_complete',
	    'custrecord_int_bill_fulfill_complete',
	    'custrecord_int_bill_processed',
	    'custrecord_intbill_extso_item_rate',
	    'custrecord_int_bill_item_receipt',
	    'custrecord_int_bill_item_fulfillment',
	    'custrecord_fulfill_exchange_rate',
	    'custrecord_intbill_adjustment'
	];
	
	intBillResults = {};
	
	for (var i=0; i<intBillFields.length; i++) {
		intBillResults[intBillFields[i]] = intBillRec.getFieldValue(intBillFields[i]);
	}
	return intBillResults;
	
}

function getSOInfo(extSOLineId) {
	
	var soFields = [
	    'internalid',
	    'entity',
	    'item',
	    'location',
	    'class',
	    'department',
	    'custcol_rate_model',
	    'custcol_unit_price',
	    'quantity',
	    'quantityshiprecv',
	    'custcol_amb_so_cust_grs_amt',
	    'custcol_amb_targeting',
	    'currency',
	    'custcol_sf_total_past_billed',
	    'fxamount',
	    'custcol_sf_additional_disc',
	    'custcol_sf_agency_fee',
	    'custcol_sf_customer_discount',
	    'custcol_sf_volume_discount',
	    'custcol_sf_publisher_discount',
	    'custcol_sf_creative_serv_prod_costs',
	    'custcol_sf_ad_serving_fees',
	    'custcol_sf_ad_verification_fees',
	    'custcol_sf_data_fees',
	    'custcol_sf_variable_handling_fee',
	    'custcol_sf_handling_fee'
	    
	];
	
	/*************
	 * add field in soFields for fulfilled quantity
	 *************/
	var deploy = nlapiGetContext().getDeploymentId();
	var soResults = {};
	
	var filters = [
	       new nlobjSearchFilter('custcol_sf_tran_line_id', null, 'is', extSOLineId)
	   ];
	
	if (deploy && deploy == 'customdeploy1') {
		var soSearchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_int_bill_so_info', filters,null);
	} else if (deploy && deploy == 'customdeploy2') {
		var soSearchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_int_bill_so_info_2', filters,null);
	} else if (deploy && deploy == 'customdeploy3') {
		var soSearchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_int_bill_so_info_3', filters,null);
	} else if (deploy && deploy == 'customdeploy4') {
		var soSearchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_int_bill_so_info_4', filters,null);
	} else if (deploy && deploy == 'customdeploy5') {
		var soSearchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_int_bill_so_info_5', filters,null);
	}
	
	
	if (soSearchResults && soSearchResults[0] != '') {
		
		for (var i=0; i<soFields.length; i++) {
			if (soFields[i] == 'custcol_rate_model') {
				soResults[soFields[i]] = soSearchResults[0].getText(soFields[i]);
			} else {
				soResults[soFields[i]] = soSearchResults[0].getValue(soFields[i]);
			}
			
			soResults['custentity_sf_prev_accr'] = soSearchResults[0].getValue('custentity_sf_prev_accr', 'customer');
			
		}
		return soResults;
	} else {
		return false;
	}
	
}

function getPOInfo (extPOId, queue) {
	
	if (!queue || queue == '') {
		queue = '1';
	}
	
	var poFields = [
	      'internalid',
	      'trandate',
	      'tranid',
	      'entity',
	      'currency',
	      'location',
	      'class',
	      'department',
	      'type'
	];
	
	var poResults = {};
	
	var filters = [
	    	       new nlobjSearchFilter('custbody_sfi_ext_ref', null, 'is', extPOId) 
	 ];
	
	var columns = [
	               new nlobjSearchColumn('internalid'),
	               new nlobjSearchColumn('trandate'),
	               new nlobjSearchColumn('tranid'),
	               new nlobjSearchColumn('entity'),
	               new nlobjSearchColumn('currency'),
	               new nlobjSearchColumn('location'),
	               new nlobjSearchColumn('class'),
	               new nlobjSearchColumn('department'),
	               new nlobjSearchColumn('type')
	]
	
	
	var deploy = nlapiGetContext().getDeploymentId();
	
	if (queue && queue == '1') {
		var poSearchResults = nlapiSearchRecord('purchaseorder', 'customsearch_dnd_int_bill_po22_2', filters,columns);
	} else if (queue && queue == 'a') {
		var poSearchResults = nlapiSearchRecord('purchaseorder', 'customsearch_dnd_int_bill_po22_2_2', filters,columns);
	} else {
		var poSearchResults = nlapiSearchRecord('purchaseorder', 'customsearch_dnd_int_bill_po22_2', filters,columns);
	}
	
	
	

	
	if (poSearchResults && poSearchResults[0] != '') {
		
		for (var i=0; i<poFields.length; i++) {
			poResults[poFields[i]] = poSearchResults[0].getValue(poFields[i]);
		}
		poResults['custentity_sf_prev_accr'] = poSearchResults[0].getValue('custentity_sf_prev_accr', 'vendor');
	
		return poResults;
	} else {
		return false;
	}
}

function updatePOLines (params) {
	
	
	var time1 = new Date();
	var poRec = nlapiLoadRecord('purchaseorder', params['poinfo']['internalid']);
	var time2 = new Date();
	
	var poLineCount = poRec.getLineItemCount('item');

	var itemId;
	var hasItem = 'F';
	var extSOLineId = params['intbillinfo']['custrecord_int_ext_so_item_id'];

	var time1 = new Date();
	
	for (var i=1; i<=poLineCount; i++) {

			itemId = poRec.getLineItemValue('item', 'item', i);
			var poExtSOLineId = poRec.getLineItemValue('item', 'custcol_sf_tran_line_id', i);
			
			if ((parseInt(itemId,10) == parseInt(params['soinfo']['item'],10)) && (poExtSOLineId && poExtSOLineId == extSOLineId) ) {
			
				hasItem = 'T';
				var lineQuan = poRec.getLineItemValue('item', 'quantity', i);
				var lineGrossAmt = poRec.getLineItemValue('item', 'custcol_amb_io_gross_spend', i);
				var lineNetAmt = poRec.getLineItemValue('item', 'amount', i);

				if ((params['ratemodelquan']['poquan'] == '0' || params['ratemodelquan']['poquan'] == '' || params['ratemodelquan']['poquan'] == null || params['ratemodelquan']['poquan'] == 0 || !params['ratemodelquan']['poquan'])) {
					params['ratemodelquan']['poquan'] = '1';
				}
				
				var rateModelQuan = params['ratemodelquan']['poquan'];
				if (rateModelQuan && parseFloat(rateModelQuan) < 1) {
					rateModelQuan = 1000;
				}

				lineQuan = parseFloat(lineQuan) + parseFloat(rateModelQuan);

				lineGrossAmt = parseFloat(lineGrossAmt) + parseFloat(params['intbillinfo']['custrecord_int_bill_cost']);
				lineNetAmt = parseFloat(lineNetAmt) + parseFloat(params['intbillinfo']['custrecord_int_bill_cost']);
				
				lineGrossAmt = parseFloat(lineGrossAmt * parseFloat(params['exchangerates']['poexchangerate'])).toFixed(8);
				lineNetAmt = parseFloat(lineNetAmt * parseFloat(params['exchangerates']['poexchangerate'])).toFixed(8);
				
				var itemRate = lineNetAmt/lineQuan;
				itemRate = round(itemRate,8);

				poRec.setLineItemValue('item', 'rate', i, itemRate);
				poRec.setLineItemValue('item', 'quantity', i, lineQuan);
				
				poRec.setLineItemValue('item', 'custcol_amb_io_gross_spend', i, lineGrossAmt );
				
				poRec.setLineItemValue('item', 'amount', i, lineNetAmt);
				
				poRec.commitLineItem('item');
				
				
				var time1 = new Date();
				nlapiSubmitRecord(poRec, false,true);
				var time2 = new Date();

				return true;
			} else {
				continue;
			}
		
	}
	
	var time2 = new Date();

	
	if (hasItem == 'F') {

		if (params['ratemodelquan']['poquan'] && (params['ratemodelquan']['poquan'] == '0' || params['ratemodelquan']['poquan'] == '' || params['ratemodelquan']['poquan'] == null )) {
			params['ratemodelquan']['poquan'] = '1';
		}
		
		var theQuan = parseFloat(params['ratemodelquan']['poquan']);
		var grossSpend = parseFloat(params['intbillinfo']['custrecord_int_bill_cost']) * parseFloat(params['exchangerates']['poexchangerate']);
		var netSpend = parseFloat(params['intbillinfo']['custrecord_int_bill_cost']) * parseFloat(params['exchangerates']['poexchangerate']);
		
		var itemRate = netSpend/theQuan;
		itemRate = round(itemRate,8);

		poRec.selectNewLineItem('item');

		poRec.setCurrentLineItemValue('item', 'item', params['soinfo']['item']);
		poRec.setCurrentLineItemValue('item', 'quantity', parseFloat(params['ratemodelquan']['poquan']));
		poRec.setCurrentLineItemValue('item', 'custcol_amb_io_gross_spend', grossSpend);
		poRec.setCurrentLineItemValue('item', 'amount', netSpend);
		poRec.setCurrentLineItemValue('item', 'rate', itemRate);
		poRec.setCurrentLineItemValue('item', 'class', params['soinfo']['class']);
		poRec.setCurrentLineItemValue('item', 'department', params['soinfo']['department']);
		poRec.setCurrentLineItemValue('item', 'location', params['soinfo']['location']);
		poRec.setCurrentLineItemValue('item', 'custcol_sf_tran_line_id', params['intbillinfo']['custrecord_int_ext_so_item_id']);
		poRec.setCurrentLineItemValue('item', 'custcol_amb_targeting', params['soinfo']['custcol_amb_targeting']);

		poRec.commitLineItem('item');

		var time1 = new Date();
		nlapiSubmitRecord(poRec, false,true);
		var time2 = new Date();
		
		return true;
	}

	return false;
	
}

function round(number, power) {

	number = parseFloat(number);
	number = Math.round((number*(Math.pow(10,power))))/(Math.pow(10,power));

	return number;
	
}

function computeExchangeRate( stCurrency1, stCurrency2, stDateToday)
{

	var flExcRate = nlapiExchangeRate('1', stCurrency2, stDateToday);

	return flExcRate;

}



function getRateModelStats(rateModel,params, type) {
	
	var rateModelQuan = {};
	
	var rateModelObj = {
			'CPM': {
				'rateId': '1',
				'intbillfield': 'custrecord_int_bill_impressions'
			},
			'CPC': {
				'rateId': '3',
				'intbillfield': 'custrecord_int_bill_clicks'
			},
			'CPA': {
				'rateId': '4',
				'intbillfield': 'custrecord_int_bill_actions'
			},
			'CPI': {
				'rateId': '7',
				'intbillfield': 'custrecord_int_bill_impressions'
			},
			'CPR': {
				'rateId': '17',
				'intbillfield': 'custrecord_int_bill_impressions'
			}
		
	};
	
	if (rateModel && rateModel == 'CPR' ) {
		
		rateModelQuan['quan'] = params['intbillinfo'][rateModelObj[rateModel]['intbillfield']];
		if (rateModelQuan['quan'] == '0') {
			rateModelQuan['quan'] = 1;
		}
		rateModelQuan['rateId'] = '17';
	} else if (rateModel && rateModel == 'CPM') {
		var soItemRate = params['intbillinfo']['custrecord_intbill_extso_item_rate'];
		if (soItemRate == '0') {
			rateModelQuan['quan'] = '0';
		} else {
			rateModelQuan['quan'] = (parseFloat(params['intbillinfo']['custrecord_int_bill_revenue'])/parseFloat(params['intbillinfo']['custrecord_intbill_extso_item_rate'])) * 1000;
		}
		
		if (type == 'PO') {
			rateModelQuan['quan']= params['intbillinfo']['custrecord_int_bill_impressions']; 
		}
		
		rateModelQuan['rateId'] = '1';
	} else {
		rateModelQuan['quan'] = params['intbillinfo'][rateModelObj[rateModel]['intbillfield']];
		rateModelQuan['rateId'] = rateModelObj[rateModel]['rateId'];
	}

	return rateModelQuan;
	
	
	
}

function createBillCredit(params) {
	var recBC = nlapiCreateRecord('vendorcredit');

	recBC.setFieldValue('trandate', params['intbillinfo']['custrecord_int_bill_date']);
	
	if (params['acctper']['acctPerClosed'] == 'F') {
		recBC.setFieldValue('postingperiod', params['acctper']['acctPer']);
	}
	
	recBC.setFieldValue('entity', params['poinfo']['entity']);
	recBC.setFieldValue('location', params['poinfo']['location']);
	recBC.setFieldValue('department', params['poinfo']['department']);
	recBC.setFieldValue('class', params['poinfo']['class']);

	recBC.setFieldValue('currency', params['poinfo']['currency']);
	recBC.setFieldValue('tranid', params['poinfo']['tranid']);
	recBC.setFieldValue('custbody_amb_created_from_campaign', params['poinfo']['internalid']);

	recBC.selectNewLineItem('item');
	recBC.setCurrentLineItemValue('item', 'item', params['soinfo']['item']);
	recBC.setCurrentLineItemValue('item', 'quantity', '1');
	recBC.setCurrentLineItemValue('item', 'location', params['poinfo']['location']);
	recBC.setCurrentLineItemValue('item', 'custcol_amb_targeting', params['soinfo']['custcol_amb_targeting']);
	recBC.setCurrentLineItemValue('item', 'custcol_sf_tran_line_id', params['intbillinfo']['custrecord_int_ext_so_item_id']);

	var receiptAmount = params['finalnumbers']['poamt'].toFixed(2);
	receiptAmount = receiptAmount.replace('-', '');
	recBC.setCurrentLineItemValue('item', 'amount',receiptAmount);
	recBC.commitLineItem('item');
	var recID = nlapiSubmitRecord(recBC);
	return recID;
}

function createCM(params) {

	var recCM = nlapiCreateRecord('creditmemo');

	recCM.setFieldValue('trandate', params['intbillinfo']['custrecord_int_bill_date']);
	
	if (params['acctper']['acctPerClosed'] == 'F') {
		recCM.setFieldValue('postingperiod', params['acctper']['acctPer']);
	}
	
	recCM.setFieldValue('entity', params['soinfo']['entity']);
	recCM.setFieldValue('location', params['soinfo']['location']);
	recCM.setFieldValue('department', params['soinfo']['department']);
	recCM.setFieldValue('class', params['soinfo']['class']);
	recCM.setFieldValue('custbody_amb_invoice_description', '4');
	recCM.setFieldValue('currency', params['soinfo']['currency']);
	
	recCM.setFieldValue('custbody_amb_created_from_campaign', params['soinfo']['internalid']); 

	recCM.setFieldValue('custbody_amb_campaign_customer', params['soinfo']['entity']); 
	recCM.setFieldValue('custbody_amb_invoice_start', params['intbillinfo']['custrecord_int_bill_date']);
	recCM.setFieldValue('custbody_amb_invoice_end', params['intbillinfo']['custrecord_int_bill_date']);
	recCM.selectNewLineItem('item');
	recCM.setCurrentLineItemValue('item', 'item', params['soinfo']['item']);
	recCM.setCurrentLineItemValue('item', 'quantity', '1');
	recCM.setCurrentLineItemValue('item', 'location', params['soinfo']['location']);
	recCM.setCurrentLineItemValue('item', 'custcol_amb_targeting', params['soinfo']['custcol_amb_targeting']);
	recCM.setCurrentLineItemValue('item', 'custcol_sf_tran_line_id', params['intbillinfo']['custrecord_int_ext_so_item_id']);
	var theAmount = params['intbillinfo']['custrecord_int_bill_revenue'];
	theAmount = theAmount.replace('-', '');
	recCM.setCurrentLineItemValue('item', 'amount',theAmount);
	recCM.commitLineItem('item');
	var recID = nlapiSubmitRecord(recCM);
	return recID;
	
}


function createIF(params) {

	var soBalance = checkSOBalance(params);
	if (params['soinfo']['custentity_sf_prev_accr'] == 'T') {
		Util.console.log('in prev accr');
		return 'quantity<0';
	}
	Util.console.log(soBalance, 'IF SO Balance');
	if (!params['intbillinfo']['custrecord_intbill_adjustment'] || params['intbillinfo']['custrecord_intbill_adjustment'] == '') {
		params['intbillinfo']['custrecord_intbill_adjustment'] = 'F';
	}
	if (soBalance && soBalance['exceedsbalance'] == 'T') {

	Util.console.log(soBalance, 'in true soBalance');

		nlapiSetFieldValue('custrecord_intbill_so_balance', soBalance);
		
		
		if (soBalance['quantity'] && ( (params['intbillinfo']['custrecord_intbill_adjustment'] == 'F' && parseFloat(soBalance['quantity']) <= 0 )|| soBalance['quantity'] == '0' || soBalance['quantity'] == 0  )) {

			return 'quantity<0';
		}
	
	}

	if (params['ratemodelquan']['soquan'] && ((params['intbillinfo']['custrecord_intbill_adjustment'] == 'F' && parseFloat(params['ratemodelquan']['soquan'])) < 0 || params['ratemodelquan']['soquan'] == '0')) {
		return 'quantity<0';
	}

	Util.console.log(params['finalnumbers']['soamt'], 'final numbers so amt');
	
	if (params['finalnumbers']['soamt'] == '0' || (params['intbillinfo']['custrecord_intbill_adjustment'] == 'F' && parseFloat(params['finalnumbers']['soamt']) <=0) ) {
		return 'quantity<0';
	}
	
	

	var recIF = nlapiTransformRecord('salesorder', params['soinfo']['internalid'], 'itemfulfillment');
	recIF.setFieldValue('customform', '146');
	recIF.setFieldValue('trandate', params['intbillinfo']['custrecord_int_bill_date']);
	
	if (params['acctper']['acctPerClosed'] == 'F') {
		recIF.setFieldValue('postingperiod', params['acctper']['acctPer']);
	}
	recIF.setFieldValue('postingperiod', '85');
	
	recIF.setFieldValue('shipstatus', 'C'); // Shipped

    recIF.setFieldValue('custbody_amb_created_from_campaign', params['soinfo']['internalid']); 

	recIF.setFieldValue('custbody_amb_campaign_customer', params['soinfo']['entity']); 
	
	var lineCount = recIF.getLineItemCount('item');
	//create fulfillment record
	for (var i = 1; i<=lineCount; i++)
	{

		var stLineHeaderId = recIF.getLineItemValue('item', 'custcol_amb_targeting', i);
		var extSOLineId = recIF.getLineItemValue('item', 'custcol_sf_tran_line_id', i);
		recIF.setLineItemValue('item', 'quantity', i, 0); 

		if(extSOLineId == params['intbillinfo']['custrecord_int_ext_so_item_id']) {

			if (soBalance && soBalance['exceedsbalance'] == 'T') {

				if ( params['intbillinfo']['custrecord_intbill_adjustment'] == 'F' && soBalance['quantity'] && parseFloat(soBalance['quantity']) <= 0) {
					return 'quantity<0';
				}
				
				
				
				recIF.setLineItemValue('item', 'custcol_fulfillment_actual_quantity', i, soBalance['quantity'] );
				recIF.setLineItemValue('item', 'quantity', i, .1);
				var ambRate = soBalance['ambrate'];

				if (params['soinfo']['custcol_rate_model'] == 'CPM') {
					ambRate = parseFloat(params['soinfo']['custcol_unit_price'])/1000;
				}

				if (!ambRate || ambRate == '') {
					ambRate = soBalance['amount'];
				}
		
				recIF.setLineItemValue('item', 'custcol_amb_so_net_spend', i, soBalance['amount']);
				recIF.setLineItemValue('item', 'custcol_amb_receive_rate', i, ambRate);
			} else {
			
				if (params['ratemodelquan']['soquan'] && params['intbillinfo']['custrecord_intbill_adjustment'] == 'F' && parseFloat(params['ratemodelquan']['soquan']) < 0) {
					return 'quantity<0';
				}
				
				if (params['soinfo']['custcol_rate_model'] == 'CPM') {
					var ambRate = parseFloat(params['soinfo']['custcol_unit_price'])/1000;
					params['ratemodelquan']['soquan'] = params['finalnumbers']['soamt']/parseFloat(params['soinfo']['custcol_unit_price']) * 1000;
					
				} else {
					var ambRate = parseFloat(params['soinfo']['custcol_unit_price']);
				}
			
				recIF.setLineItemValue('item', 'quantity', i, 1);
				recIF.setLineItemValue('item', 'custcol_fulfillment_actual_quantity', i, params['ratemodelquan']['soquan']);
				
				
				recIF.setLineItemValue('item', 'custcol_amb_so_net_spend', i, params['finalnumbers']['soamt']);

				recIF.setLineItemValue('item', 'custcol_amb_receive_rate', i, ambRate);

			}

			//Add Discounts
			recIF.setLineItemValue('item', 'custcol_sf_additional_disc', i, params['soinfo']['custcol_sf_additional_disc']);
			recIF.setLineItemValue('item', 'custcol_sf_agency_fee', i, params['soinfo']['custcol_sf_agency_fee']);
			recIF.setLineItemValue('item', 'custcol_sf_customer_discount', i, params['soinfo']['custcol_sf_customer_discount']);
			recIF.setLineItemValue('item', 'custcol_sf_volume_discount', i, params['soinfo']['custcol_sf_volume_discount']);
			recIF.setLineItemValue('item', 'custcol_sf_publisher_discount', i, params['soinfo']['custcol_sf_publisher_discount']);
			recIF.setLineItemValue('item', 'custcol_sf_creative_serv_prod_costs', i, params['soinfo']['custcol_sf_creative_serv_prod_costs']);
			recIF.setLineItemValue('item', 'custcol_sf_ad_serving_fees', i, params['soinfo']['custcol_sf_ad_serving_fees']);
			recIF.setLineItemValue('item', 'custcol_sf_ad_verification_fees', i, params['soinfo']['custcol_sf_ad_verification_fees']);
			recIF.setLineItemValue('item', 'custcol_sf_data_fees', i, params['soinfo']['custcol_sf_data_fees']);
			recIF.setLineItemValue('item', 'custcol_sf_variable_handling_fee', i, params['soinfo']['custcol_sf_variable_handling_fee']);
			recIF.setLineItemValue('item', 'custcol_sf_handling_fee', i, params['soinfo']['custcol_sf_handling_fee']);
			
			
			
		} else {
			recIF.removeLineItem('item', i);
		}
		
	}

	var createdIF = nlapiSubmitRecord(recIF);
	Util.console.log(createdIF, 'createdIF');
	return createdIF;
}

function checkSOBalance(params) {

	soBalance = {};
	
	var intBillQuan = params['ratemodelquan']['soquan'];
	var soQuan = params['soinfo']['quantity'];
	var soFulfilled = params['soinfo']['quantityshiprecv'];
	
	if (!soFulfilled || soFulfilled == '') {
		soFulfilled = 0;
	}
	
	//If integration billing quantity + soFulfilled > so line quantity, set fulfilled quantity to difference of SOQuantity and fulfilled
	
	var filters = [
	  new nlobjSearchFilter('custcol_sf_tran_line_id', null, 'is', params['intbillinfo']['custrecord_int_ext_so_item_id'])        
	];
	
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_all_fulfill_sf_tranline', filters, null);
	var currFulfillAmount = 0;
	if (searchResults && searchResults[0] != '') {
		currFulfillAmount = searchResults[0].getValue('custcol_amb_so_net_spend', null, 'sum');
		currFulfilledQuan = searchResults[0].getValue('quantity', null, 'sum');
	} 
	
	var sfTotalBilled = params['soinfo']['custcol_sf_total_past_billed'];
	if (!sfTotalBilled || sfTotalBilled == '') {
		sfTotalBilled = 0;
	}
	
	currFulfillAmount = parseFloat(currFulfillAmount) + parseFloat(sfTotalBilled);

	var intBillAmount = parseFloat(params['finalnumbers']['soamt']);

	var soLineAmount = parseFloat(params['soinfo']['fxamount']);

	if ((currFulfillAmount + intBillAmount) > soLineAmount) {

		soBalance['exceedsbalance'] = 'T';
		
		var ambRate = params['intbillinfo']['custrecord_intbill_extso_item_rate'];  

		soBalance['amount'] = soLineAmount - currFulfillAmount;
		soBalance['amount'] = soBalance['amount'].toString();
		if (params['soinfo']['custcol_rate_model'] == 'CPM') {
			soBalance['ambrate'] = parseFloat(ambRate).toFixed(8);
			soBalance['ambrate'] = soBalance['ambrate']/1000;
		} else {
			soBalance['ambrate'] = parseFloat(ambRate).toFixed(8);
		}
		
		soBalance['quantity'] = parseFloat(soBalance['amount']/parseFloat(soBalance['ambrate']));
		
		if (params['soinfo']['custcol_rate_model'] == 'CPR') {
			soBalance['quantity'] = parseFloat(params['ratemodelquan']['soquan']);
		} 
		soBalance['quantity'] = soBalance['quantity'].toString();
		
		
		
		if ( soBalance['quantity'] > (parseFloat(soQuan) - parseFloat(soFulfilled))) {
		
			soBalance['quantity'] = parseFloat(soQuan) - parseFloat(soFulfilled);
			soBalance['quantity'] = soBalance['quantity'].toString();
			
			soBalance['ambrate'] = soBalance['amount']/soBalance['quantity'];

			if (params['soinfo']['custcol_rate_model'] == 'CPR') {
				soBalance['ambrate'] = parseFloat(params['ratemodelquan']['soquan']);
			} else if (params['soinfo']['custcol_rate_model'] == 'CPM') {
				soBalance['ambrate'] = parseFloat(soBalance['ambrate'])/1000;
			}
			
			soBalance['ambrate'] = parseFloat(soBalance['ambrate']).toFixed(8);
			
		} 
		}	
		else if (parseFloat(1) + parseFloat(soFulfilled) > parseFloat(soQuan)) {
	
		soBalance['exceedsbalance'] = 'T';

		var fulfillQuan = parseFloat(soQuan) - parseFloat(soFulfilled); 
		
		soBalance['amount'] = parseFloat(parseFloat(params['finalnumbers']['soamt'])); 
		soBalance['amount'] = soBalance['amount'].toString();
		soBalance['quantity'] = fulfillQuan.toString();
		
		soBalance['ambrate'] = soBalance['amount']/soBalance['quantity'];

	}
	
	return soBalance;
	
}

function createIR(params) {

	if (params['poinfo']['custentity_sf_prev_accr'] == 'T') {
		Util.console.log('in prev accr');
		return 'NO IR';
	}
	
	if (params['intbillinfo']['custrecord_int_bill_cost'] && params['intbillinfo']['custrecord_int_bill_cost'] == '0' ) {
		Util.console.log('NO IR');
		return 'NO IR';
	}
	
	

	var recIR = nlapiTransformRecord('purchaseorder', params['poinfo']['internalid'], 'itemreceipt');
	recIR.setFieldValue('customform', '147');
	recIR.setFieldValue('trandate', params['intbillinfo']['custrecord_int_bill_date']);
	recIR.setFieldValue('location', params['soinfo']['location']);
	
	if (params['acctper']['acctPerClosed'] == 'F') { // vendor fulfill date period is OPEN
		
		recIR.setFieldValue('postingperiod', params['acctper']['acctPer']); 
	}
	recIR.setFieldValue('postingperiod', '85');

	var lineCount = recIR.getLineItemCount('item');
	// create receipt item
	for (var i = 1; i <= lineCount; i++) {

		var extSOLineId = recIR.getLineItemValue('item', 'custcol_sf_tran_line_id', i);
		recIR.setLineItemValue('item', 'quantity', i, 0); // initialize to 0
		
		
		if (extSOLineId == params['intbillinfo']['custrecord_int_ext_so_item_id']) {
		
			if ((params['ratemodelquan']['poquan'] == '0' || params['ratemodelquan']['poquan'] == 0)) {
				params['ratemodelquan']['poquan'] = '1';
			}
			
			var rateModelQuan = params['ratemodelquan']['poquan'];
		
			var receiptAmount = params['finalnumbers']['poamt'].toFixed(2);
			
			recIR.setLineItemValue('item', 'quantity', i, 1);
			recIR.setLineItemValue('item', 'custcol_fulfillment_actual_quantity', i, parseFloat(rateModelQuan));
			
			recIR.setLineItemValue('item', 'custcol_purchase_rate_model', i, params['ratemodelquan']['porateid']);
			recIR.setLineItemValue('item', 'location', i, params['soinfo']['location']);
		
			recIR.setLineItemValue('item', 'custcol_amb_receive_rate', i, parseFloat(receiptAmount)/parseFloat(rateModelQuan));
		
			recIR.setLineItemValue('item', 'custcol_amb_so_net_spend', i, parseFloat(receiptAmount));
			
		} else {
			
			recIR.removeLineItem('item', i);
		}
		
	}
	
	var createdIR = nlapiSubmitRecord(recIR);
	
	return createdIR;
}

function updateIntBill(intBillId, params) {
	var intBillRec = nlapiLoadRecord('customrecord_integration_billing', intBillId);
	if (params['poinfo'] && params['poinfo'] != '') {
		intBillRec.setFieldValue('custrecord_int_bill_ns_po_ref',params['poinfo']['internalid']);
	}
	
	intBillRec.setFieldValue('custrecord_int_bill_ns_so_ref',params['soinfo']['internalid']);
	
	if (params['intbillupdate']['itemreceipt'] != true) {
		intBillRec.setFieldValue('custrecord_int_bill_item_receipt', params['intbillupdate']['itemreceipt']);
	}
	intBillRec.setFieldValue('custrecord_int_bill_po_line_complete', params['intbillupdate']['polinecomplete']);
	if (params['intbillupdate']['itemfulfillment'] != true) {
		intBillRec.setFieldValue('custrecord_int_bill_item_fulfillment', params['intbillupdate']['itemfulfillment']);

	}
	
	if (params['intbillupdate']['creditmemo'] && params['intbillupdate']['creditmemo'] != '') {
		intBillRec.setFieldValue('custrecord_intbill_credit_memo', params['intbillupdate']['creditmemo']);
	}
	
	if (params['intbillupdate']['billcredit'] && params['intbillupdate']['billcredit'] != '') {
		intBillRec.setFieldValue('custrecord_intbill_bill_credit', params['intbillupdate']['billcredit']);
	}
	
	intBillRec.setFieldValue('custrecord_int_bill_receipt_complete', params['intbillupdate']['ircomplete']);
	intBillRec.setFieldValue('custrecord_int_bill_fulfill_complete', params['intbillupdate']['ifcomplete']);
	intBillRec.setFieldValue('custrecord_int_bill_processed', params['intbillupdate']['processed']);
	
	try {
		nlapiSubmitRecord(intBillRec);
	} catch (e){
		
	}
	
		
}

function getAcctPeriod(intBillDate) {
	// This is a lookup of the Vendor fulfill date Accounting Period
	var acctPerInfo = {};
	var fulfillDate = new Date();
	fulfillDate = nlapiStringToDate(intBillDate);
	
	var FMonth = fulfillDate.getMonth();
	
	var FYear = fulfillDate.getFullYear().toString().substr(2, 2);
	var stMonth = arMonth[FMonth];
	
	var aFilter = new Array();
	aFilter.push(new nlobjSearchFilter('periodname', null, 'contains', stMonth));
	aFilter.push(new nlobjSearchFilter('periodname', null, 'contains', FYear));
	
	var aColumn = new Array();
	aColumn.push(new nlobjSearchColumn('internalid'));
	aColumn.push(new nlobjSearchColumn('closed'));
	
	var resultPeriod = nlapiSearchRecord('accountingperiod', null, aFilter, aColumn);
	
	if (!resultPeriod) // this means no aacounting period setup or it is still closed
	{

	}
	
	var stAcctPeriod = resultPeriod[0].getValue('internalid');
	
	var stClosed = resultPeriod[0].getValue('closed');
	var stDateToday = nlapiDateToString(new Date());
	
	acctPerInfo['acctPer'] = stAcctPeriod;
	acctPerInfo['acctPerClosed'] = stClosed;
	
	return acctPerInfo;
	
	
}


var arMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


function addPOLineUE2 () {
	
	//Get the current execution context of the script (i.e user interface, scheduled script, etc)
	var context = nlapiGetContext().getExecutionContext();
	
	//If the context is scheduled, break execution
	if (context == 'scheduled') {
		return;
	}
	
	//If the record has already been processed, break execution
	if (nlapiGetFieldValue('custrecord_int_bill_processed') == 'T') {
		return;
	}
	
	//If PO ID, call function to get PO Details
	var extPOId = nlapiGetFieldValue('custrecord_int_ext_po_id');
	
	if (extPOId && extPOId != '') {
		
		
		if (nlapiGetFieldValue('custrecord_int_bill_po_line_complete') == 'F' || nlapiGetFieldValue('custrecord_int_bill_receipt_complete') == 'F' || nlapiGetFieldValue('custrecord_int_bill_fulfill_complete') == 'F') {
			
			//If the PO = 0 (i.e the delivery was not run through a PO), then set PO/Receipt = T
			if (extPOId == '0') {
				nlapiSetFieldValue('custrecord_int_bill_po_line_complete', 'T');
				nlapiSetFieldValue('custrecord_int_bill_receipt_complete', 'T');
			}

			//If SO ID is found, call function get SO details
			var extSOLineId = nlapiGetFieldValue('custrecord_int_ext_so_item_id');

			if (extSOLineId && extSOLineId != '') {
				
				var soInfo = getSOInfo(extSOLineId);
								
				if (soInfo && soInfo != false) {
					var params = {};
					params['soinfo'] = soInfo;
					
					//Establish object for Integration Billing record values
					params['intbillinfo'] = {};
					params['intbillinfo']['custrecord_int_bill_date'] = nlapiGetFieldValue('custrecord_int_bill_date');
					params['intbillinfo']['custrecord_int_bill_cost'] = nlapiGetFieldValue('custrecord_int_bill_cost');
					params['intbillinfo']['custrecord_int_ext_po_price_type'] = nlapiGetFieldValue('custrecord_int_ext_po_price_type');
					params['intbillinfo']['custrecord_int_ext_so_item_id'] = nlapiGetFieldValue('custrecord_int_ext_so_item_id');
					params['intbillinfo']['custrecord_intbill_extso_item_rate'] = nlapiGetFieldValue('custrecord_intbill_extso_item_rate');
					params['intbillinfo']['custrecord_int_bill_revenue'] = nlapiGetFieldValue('custrecord_int_bill_revenue');
					params['intbillinfo']['custrecord_int_bill_impressions'] = nlapiGetFieldValue('custrecord_int_bill_impressions');
					params['intbillinfo']['custrecord_int_bill_clicks'] = nlapiGetFieldValue('custrecord_int_bill_clicks');
					params['intbillinfo']['custrecord_int_bill_actions'] = nlapiGetFieldValue('custrecord_int_bill_actions');
					params['intbillinfo']['custrecord_intbill_adjustment'] = nlapiGetFieldValue('custrecord_intbill_adjustment');
					params['intbillinfo']['custrecord_int_bill_receipt_complete'] = nlapiGetFieldValue('custrecord_int_bill_receipt_complete');
					params['intbillinfo']['custrecord_int_bill_po_line_complete'] = nlapiGetFieldValue('custrecord_int_bill_po_line_complete');
					params['intbillinfo']['custrecord_int_bill_fulfill_complete'] = nlapiGetFieldValue('custrecord_int_bill_fulfill_complete');
					params['intbillinfo']['custrecord_int_bill_queue'] = nlapiGetFieldValue('custrecord_int_bill_queue');
					
					//If the queue is empty, set to 1
					if (!params['intbillinfo']['custrecord_int_bill_queue'] || params['intbillinfo']['custrecord_int_bill_queue'] == '') {
						params['intbillinfo']['custrecord_int_bill_queue'] = '1';
					}
					
					var time1 = new Date();
					//Get the PO Info
					var poInfo = getPOInfo(extPOId, params['intbillinfo']['custrecord_int_bill_queue']);
					var time2 = new Date();
					
					//Get info regarding the accounting period, based on the integration billing date
					var acctPeriod = getAcctPeriod(params['intbillinfo']['custrecord_int_bill_date']);
					params['acctper'] = acctPeriod;	
					
					//If either the PO Complete = F or Receipt Complete = F, perform tasks to add/update line to PO and create Item Receipt
					if (nlapiGetFieldValue('custrecord_int_bill_po_line_complete') == 'F' || nlapiGetFieldValue('custrecord_int_bill_receipt_complete') == 'F') {
						
						if (poInfo && poInfo != false) {
							
							params['poinfo'] = poInfo;
							
							//Get the PO Exchange rate
							var exchangeRates = getExchangeRates(params, 'PO');
							params['exchangerates'] = exchangeRates;
							
							//Get final PO numbers, using exchange rate and values from integration billing record
							var finalNumbers = getFinalNumbers(params, 'PO');
							params['finalnumbers'] = finalNumbers;

								//Get the quantity, based on the PO rate model
								params['ratemodelquan'] = {};
								var rateModelQuan = getRateModelStats(params['intbillinfo']['custrecord_int_ext_po_price_type'],params, 'PO');
								params['ratemodelquan']['poquan'] = rateModelQuan['quan'];
							
								params['ratemodelquan']['porateid'] = rateModelQuan['rateId'];
								
								//If the PO Line has not been updated, then update the PO line
								if (nlapiGetFieldValue('custrecord_int_bill_po_line_complete') == 'F') {
									try {
										var time1 = new Date();
										var updateThePO = updatePOLines(params);
										var time2 = new Date();
										
									} catch (e) {
										Util.console.log(e.message, 'error message');
									
									}
								} else {
									var updateThePO = true;
								}
								
									
								
								
							
								if (updateThePO && updateThePO == true) {
									
									nlapiSetFieldValue('custrecord_int_bill_po_line_complete', 'T');
									nlapiSetFieldValue('custrecord_int_bill_ns_po_ref', params['poinfo']['internalid']);
									
									//If the Receipt has not been processed, create the Item Receipt
									if (params['intbillinfo']['custrecord_int_bill_receipt_complete'] == 'F') {
									
										try {
											var time1 = new Date();
											var createTheIR = createIR(params);
											var time2 = new Date();
											
										} catch (e) {
										
										}
										
									} else {
										var createTheIR = true;
									}
									
									//Set the Item Receipt field on Integration Billing to the created receipt
									if (createTheIR && createTheIR != '') {
										
										if (createTheIR == 'NO IR') {
											
										} else {
											
											nlapiSetFieldValue('custrecord_int_bill_item_receipt', createTheIR);
										}
										
										
										
										if (params['intbillinfo']['custrecord_int_bill_receipt_complete'] == 'F') {
											
											nlapiSetFieldValue('custrecord_int_bill_receipt_complete', 'T');
											if (nlapiGetFieldValue('custrecord_int_bill_fulfill_complete') == 'T') {
												nlapiSetFieldValue('custrecord_int_bill_processed', 'T');
											}
										}
									}
									
									
									
								}
						}
					}
					
					//If the fulfillment has not been created, create the fulfillment
					if (nlapiGetFieldValue('custrecord_int_bill_fulfill_complete') == 'F') {
						//DO Fulfillment Tasks
						params['ratemodelquan'] = {};
						
						//Get the quantity, based on the rate model of the campaign line
						var rateModelStats = getRateModelStats(params['soinfo']['custcol_rate_model'],params);
						params['ratemodelquan']['soquan'] = rateModelStats['quan'];
						params['ratemodelquan']['sorateid'] = rateModelStats['rateId'];
						
						//get the exchange rate for the SO
						var exchangeRates = getExchangeRates(params, 'SO');
						params['exchangerates'] = exchangeRates;
					    var soExchRate = params['exchangerates']['soexchangerate'];
					    
						nlapiSetFieldValue('custrecord_int_bill_ns_so_ref', params['soinfo']['internalid']);
						nlapiSetFieldValue('custrecord_fulfill_exchange_rate', soExchRate);
						
						//Get the final numbers, based on the rate model stats and the SO exchange rate
						var finalNumbers = getFinalNumbers(params, 'SO');
						params['finalnumbers'] = finalNumbers;
						nlapiSetFieldValue('custrecord_intbill_final_revenue', params['finalnumbers']['soamt']);

						//If the fulfillment has not been created, create the fulfillment
						if (params['intbillinfo']['custrecord_int_bill_fulfill_complete'] == 'F') {
							try {
								var createTheIF = createIF(params);
								Util.console.log(createTheIF, 'createTheIF');
							} catch (e) {
								
							}
						} else {
							var createTheIF = true;
						}
						
						//Store the value of the created item fulfillment on the Integration Billing record
						if (createTheIF && createTheIF != '') {
							
							if (createTheIF == 'quantity<0') {

								var IFRec = '';
							} else {
								var IFRec = createTheIF;
							}
							nlapiSetFieldValue('custrecord_int_bill_item_fulfillment', IFRec);
							nlapiSetFieldValue('custrecord_int_bill_fulfill_complete', 'T');
							nlapiSetFieldValue('custrecord_int_bill_processed', 'T');

						}
					}
					
					
					
					
					
					
					
					
				}
			
			}
		} else {
			return true;
		}
		
			
	} else {
		nlapiSetFieldValue('custrecord_int_bill_po_line_complete', 'T');
		nlapiSetFieldValue('custrecord_int_bill_receipt_complete', 'T');
		return true;
	}

}

