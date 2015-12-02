/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Apr 2015     anthony.carter
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function vbApproval(request, response){
	
		
		if (request && request.getMethod() == 'GET') {
			var vbForm = nlapiCreateForm('Vendor Bills', false);
			
			vbForm.addSubmitButton('Submit');
			
			var roleId = nlapiGetRole();
			//Util.console.log(roleId);
			vbForm.setScript('customscript_vb_sl_vb_cl');
			
			//poForm.addTab('custpage_main_tab','Main Tab');
			
			
			
			vbForm.addFieldGroup('custpage_thefieldgroup', 'Filters');
			var subsidFilter = vbForm.addField('custpage_subsidiary', 'select', 'Subsidiary', 'subsidiary', 'custpage_thefieldgroup').setLayoutType('normal', 'startcol');
			var statusFilter = vbForm.addField('custpage_vb_appr_status', 'select', 'Approval Status', 'customlist_sf_invoice_appr_status', 'custpage_thefieldgroup');
			var vbList = vbForm.addSubList('custpage_vblist', 'list', 'Vendor Bill List');
			vbList.addMarkAllButtons();
			vbList.addRefreshButton();
			/*if (roleId && roleId == '3') {
				var vendToggle = poForm.addField('custpage_vendtoggle', 'select', 'Vendor');
				vendToggle.addSelectOption('', '-Select-', true);
				vendToggle.addSelectOption('', 'All');
				vendToggle.addSelectOption('1023', 'ELB');
				vendToggle.addSelectOption('642', 'GLB');
				
				var vendorSearch = request.getParameter('custpage_vendtoggle');
				if (vendorSearch && vendorSearch != '') {
					vendToggle.setDefaultValue(vendorSearch);
				}
			}*/
			
			
			var vbAppr = vbList.addField('custpage_approved', 'checkbox', 'Approve');
			var addButtons = vbList.addField('custpage_viewrec', 'text', 'View').setDisplayType('inline');
			var vbDate = vbList.addField('custpage_trandate', 'date', 'VB Date').setDisplayType('disabled');	
			var vbNum = vbList.addField('custpage_tranid', 'text', 'VB Number').setDisplayType('disabled');
			var vbSub = vbList.addField('custpage_subsid', 'text', 'Subsidiary').setDisplayType('disabled');
			var vbCurr = vbList.addField('custpage_curr', 'text', 'Currency').setDisplayType('disabled');
			var vbEntity = vbList.addField('custpage_entity', 'text', 'Vendor').setDisplayType('disabled');
			var vbVenName = vbList.addField('custpage_venname', 'text', 'Vendor (No Number)').setDisplayType('disabled');
			var vbStatus = vbList.addField('custpage_status', 'text', 'VB Status').setDisplayType('disabled');
			var vbAmount = vbList.addField('custpage_amount', 'text', 'VB Amount').setDisplayType('disabled');
			var fxAmount = vbList.addField('custpage_fxamount', 'text', 'FX Amount').setDisplayType('disabled');
			var vbMemo = vbList.addField('custpage_memo', 'textarea', 'Memo').setDisplayType('disabled');
			
			//var poAcceptDate = poList.addField('custpage_custbody_sl_accepted_date_time', 'date', 'Accepted Time');
			
			var lineChanged = vbList.addField('custpage_linechanged', 'checkbox', 'Line Changed').setDisplayType('hidden');
		//	var lineChanged2 = poList.addField('custpage_linechanged2', 'text', 'Line Changed').setDisplayType('entry');
			
			var vbInternalId = vbList.addField('custpage_internalid', 'text', 'InternalID').setDisplayType('hidden');
			
			var subsidParam = request.getParameter('custpage_subsidtoggle');
			
			var filters = [];
			
			if (subsidParam && subsidParam != '') {
				subsidFilter.setDefaultValue(subsidParam);
				filters.push(new nlobjSearchFilter('subsidiary', null, 'anyof',subsidParam));
				
			}
			var statusParam = request.getParameter('custpage_statustoggle');
			if (statusParam && statusParam != '') {
				statusFilter.setDefaultValue(statusParam);
				filters.push(new nlobjSearchFilter('custbody_inv_appr_status', null, 'anyof',statusParam));
			}
			if (filters && filters != '') {
				var searchResults = nlapiSearchRecord('transaction', 'customsearch_vb_sl_vb_pending_appr', filters, null  );
			} else {
				var searchResults = nlapiSearchRecord('transaction', 'customsearch_vb_sl_vb_pending_appr', null, null  );
			}
			
			if (searchResults && searchResults != '') {
				for (var i=0;i<searchResults.length;i++) {
					
					/*var vbAppr = vbList.addField('custpage_approved', 'checkbox', 'Approve');
					var vbDate = vbList.addField('custpage_trandate', 'date', 'VB Date').setDisplayType('disabled');	
					var vbNum = vbList.addField('custpage_tranid', 'text', 'VB Number').setDisplayType('disabled');
					var vbSub = vbList.addField('custpage_subsid', 'text', 'Subsidiary').setDisplayType('disabled');
					var vbEntity = vbList.addField('custpage_entity', 'text', 'Vendor').setDisplayType('disabled');
					var vbStatus = vbList.addField('custpage_status', 'text', 'VB Status').setDisplayType('disabled');
					var vbAmount = vbList.addField('custpage_amount', 'text', 'VB Amount').setDisplayType('disabled');
					var vbMemo = vbList.addField('custpage_memo', 'text', 'Memo').setDisplayType('disabled');*/
					var internalId = searchResults[i].getValue('internalid');
					vbList.setLineItemValue('custpage_viewrec', i+1, '<a href="/app/accounting/transactions/vendbill.nl?id=' + internalId +'">View Bill</a>');
					vbList.setLineItemValue('custpage_trandate', i+1, searchResults[i].getValue('trandate'));
					vbList.setLineItemValue('custpage_tranid', i+1, searchResults[i].getValue('tranid'));
					vbList.setLineItemValue('custpage_subsid', i+1, searchResults[i].getText('subsidiarynohierarchy'));
					vbList.setLineItemValue('custpage_entity', i+1, searchResults[i].getText('entity'));
					vbList.setLineItemValue('custpage_status', i+1, searchResults[i].getText('custbody_inv_appr_status'));
					vbList.setLineItemValue('custpage_venname', i+1, searchResults[i].getValue('companyname', 'vendor'));
					vbList.setLineItemValue('custpage_amount', i+1, searchResults[i].getValue('amount'));
					vbList.setLineItemValue('custpage_curr', i+1, searchResults[i].getText('currency'));
					vbList.setLineItemValue('custpage_fxamount', i+1, searchResults[i].getValue('fxamount'));
					vbList.setLineItemValue('custpage_memo', i+1, searchResults[i].getValue('memo'));
					vbList.setLineItemValue('custpage_internalid', i+1, searchResults[i].getValue('internalid'));
					
					
					
				}
			}
			
	
			
			
			
	
			
				
			
			
			
			response.writePage(vbForm);
		} else {
			
			try {
				var message = 'Your changes are being processed.  Please wait a moment for these changes to be made available.';
				var form = nlapiCreateForm('Thank You');
				form.addField('custpage_message', 'inlinehtml', '').setDefaultValue(message);
				//form.setScript('32');
				response.writePage(form);
				
				var vbListCount = request.getLineItemCount('custpage_vblist');
				//Util.console.log(vbListCount, 'vbListCount');
				var approvedBtn = '';
				
				for (var i=1; i<= vbListCount; i++) { 
					
					approvedBtn = request.getLineItemValue('custpage_vblist', 'custpage_approved', i);
					//Util.console.log(approvedBtn, 'approvedBtn');
					if (approvedBtn && approvedBtn == 'T') {
						
						var internalId = request.getLineItemValue('custpage_vblist','custpage_internalid', i);
						var currStatus = request.getLineItemValue('custpage_vblist', 'custpage_status', i);
						//Util.console.log(internalId, 'internalId');
						//Util.console.log(currStatus, 'currStatus');
						if (internalId && internalId != '') {
							//Util.console.log('in if');
							
							if (currStatus && (currStatus == 'Pending Finance Approval' ||  currStatus == 'Approved')) {
								//Util.console.log('in pending finance approval');
								nlapiTriggerWorkflow('vendorbill', internalId, 'customworkflow_vb_appr_workflow', 'workflowaction_vbappr_stdfinappr');
								nlapiTriggerWorkflow('vendorbill', internalId, 'customworkflow_vb_appr_workflow', 'workflowaction_vbappr_sffinappr');
							}
							
							if (currStatus && currStatus == 'Pending MB Approval') {
								nlapiTriggerWorkflow('vendorbill', internalId, 'customworkflow_vb_appr_workflow', 'workflowaction_vbappr_mbappr');
							}
							
							//nlapiSubmitField('purchaseorder', internalId, updateFields, updateVals);
							
						}
						
					}
					
				}
			} catch (e) {
				Util.console.log(e.message, 'Error Message');
				var message = 'Your changes are being processed.  Please wait a moment for these changes to be made available.';
				var form = nlapiCreateForm('Thank You');
				form.addField('custpage_message', 'inlinehtml', '').setDefaultValue(message);
				//form.setScript('32');
				response.writePage(form);
			}

			
		}
	
}

function vbApprClientFC (type, name, linenum) {
	if (name && (name == 'custpage_subsidiary' || name == 'custpage_vb_appr_status')) {
		
		var subsidId = nlapiGetFieldValue('custpage_subsidiary');
		var statusId = nlapiGetFieldValue('custpage_vb_appr_status');
		var stSuiteletURL = nlapiResolveURL('SUITELET', 
				'customscript_vb_appr_sl', 
				'customdeploy1');
	 
	//Pass the following fields as variables into the Suitelet
	stSuiteletURL += '&custpage_subsidtoggle=' + subsidId;
	stSuiteletURL += '&custpage_statustoggle=' + statusId;


	setWindowChanged(window,false);
	window.location.href = stSuiteletURL;
	}
}
