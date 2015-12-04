/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Feb 2015     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function invFormUpdate(type) {
	
	var searchResults = nlapiSearchRecord('transaction','customsearch_sf_invoices_created', null, null);
	
	if (searchResults && searchResults != '') {
		for (var i=0;i<searchResults.length;i++) {
			var recId = searchResults[i].getId();
			nlapiSubmitField('invoice', recId, 'customform', '141');
		}
	}
}

function itemExtIdUpdate() {
	
	var name = nlapiGetFieldValue('itemid');
	var extId = nlapiGetFieldValue('externalid');
	Util.console.log(name, 'name');
	Util.console.log(extId, 'extId');
	
	nlapiSetFieldValue('externalid', name);
	
}

function updateTranDims() {
	
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_tran_dim_update', null, null);
	
	if (searchResults && searchResults != '') {
		var context = nlapiGetContext();
		
		var deploy = context.getDeploymentId();
		
		if (deploy && deploy == 'customdeploy1') {
			for (var i=0; i< searchResults.length; i++) {
				var usage = context.getRemainingUsage();
				Util.console.log(usage, 'Usage Remaining');
				if (usage && usage <= 1000) {
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
					if (status && status == 'QUEUED') {
						break;
					}
				}
				var recType = searchResults[i].getRecordType();
				var recId = searchResults[i].getId();
				
				Util.console.log(recId, 'recId');
				Util.console.log(recType, 'recType');
				var tranRec = nlapiLoadRecord(recType, recId);
				
				var lineCount = tranRec.getLineItemCount('item');
				
				for (var j=1; j<=lineCount; j++) {
					var item = tranRec.getLineItemValue('item', 'item', j);
					var itemType = tranRec.getLineItemValue('item', 'itemtype', j);
					Util.console.log(itemType, 'itemType');
					if (itemType == 'Subtotal') {
						continue;
					}
					
					var lookup = nlapiLookupField('serviceitem', item, ['class', 'department']);
					Util.console.log(lookup, 'lookup');
					var lob = lookup['class'];
					var dept = lookup['department'];
					
					//Util.console.log(lob, 'lob');
					//Util.console.log(dept, 'dept');
					
					tranRec.setLineItemValue('item', 'class', j, lob);
					tranRec.setLineItemValue('item', 'department', j, dept);
					
					//tranRec.commitLineItem('item');
					
					
				}
				tranRec.setFieldValue('custbody_dim_update', 'T');
				try {
					nlapiSubmitRecord(tranRec, true, true);
				} catch (e) {
					Util.console.log(e.message, 'Error Code');
				}
				
				
				
				
			}
		} else {
			for (var i=searchResults.length -1; i>0; i--) {
				var usage = context.getRemainingUsage();
				Util.console.log(usage, 'Usage Remaining');
				if (usage && usage <= 1000) {
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
					if (status && status == 'QUEUED') {
						break;
					}
				}
				var recType = searchResults[i].getRecordType();
				var recId = searchResults[i].getId();
				
				
				
				var tranRec = nlapiLoadRecord(recType, recId);
				
				var lineCount = tranRec.getLineItemCount('item');
				
				for (var j=1; j<=lineCount; j++) {
					var item = tranRec.getLineItemValue('item', 'item', j);
					
					var lookup = nlapiLookupField('serviceitem', item, ['class', 'department']);
					//Util.console.log(lookup, 'lookup');
					var lob = lookup['class'];
					var dept = lookup['department'];
					
					//Util.console.log(lob, 'lob');
					//Util.console.log(dept, 'dept');
					
					tranRec.setLineItemValue('item', 'class', j, lob);
					tranRec.setLineItemValue('item', 'department', j, dept);
					
					tranRec.commitLineItem('item');
					
					
				}
				tranRec.setFieldValue('custbody_dim_update', 'T');
				try {
					nlapiSubmitRecord(tranRec);
				} catch (e) {
					
				}
				
				
				
				
			}
		}

		
	}
	
}

function queueDivisions(queueNumber, count) {
	
}

function updateIntRepExchRate () {
	
	var searchResults = nlapiSearchRecord('customrecord_integration_reporting_det', 'customsearchintrepdet_exch_rate', null, null);
	var context = nlapiGetContext();
	if (searchResults && searchResults != '') {
		
		for (var i=0; i<searchResults.length; i++) {
			var usage = context.getRemainingUsage();
			Util.console.log(usage, 'Usage Remaining');
			if (usage && usage <= 1000) {
				var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
				if (status && status == 'QUEUED') {
					break;
				}
			}
			
			var recId = searchResults[i].getId();
			var recLoad = nlapiLoadRecord('customrecord_integration_reporting_det', recId);
			nlapiSubmitRecord(recLoad);
			
			
		}
		
	}
	
}

function triggerVBJournal() {
	
	var deploy = nlapiGetContext().getDeploymentId();
	
	if (deploy && deploy == 'customdeploy1') {
		var searchResults = nlapiSearchRecord('vendorbill', 'customsearch_vbs_to_update', null, null);
		if (searchResults && searchResults != '') {
			var context = nlapiGetContext();
			for (var i=0;i<searchResults.length;i++) {
				var usage = context.getRemainingUsage();
				if (usage && usage < 500) {
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
					if (status == 'QUEUED') {
						break;
					}
				}
				
				var recId = searchResults[i].getId();
				
				if (recId && recId != '') {
					var vbLoad = nlapiLoadRecord('vendorbill', recId);
					vbLoad.setFieldValue('custbody_script_update', 'T');
					nlapiSubmitRecord(vbLoad);
				}
				
				
			}
			
		}
	} else if (deploy && deploy == 'customdeploy2') {
		
	}
	
	
}

function testDelete() {
	var billRec = nlapiLoadRecord('journalentry', '534933' );
	billRec.setFieldValue('reversaldate', '05/20/2015');
	nlapiSubmitRecord(billRec);
	
}

function callMSRA(){
	var resp = nlapiRequestURL('https://mstr-msra.adconion.com/msreportadapter/7997010A11E4D9CE11E100802FB7A954?headerAttribute;application/json;page=1;groupBy=null;maxResultsPerPage=null;Time+Filter+Prompt=Specified+Date+Range;1=AMG;2=31121%3AADCOUNCIL_DEFAULT_FDI;Currency+Name=EUR;4=05%2F01%2F2015;5=05%2F31%2F2015');
	Util.console.log(resp);
}

function testMoments() {
	var tranDate = nlapiGetFieldValue('trandate');
	Util.console.log(tranDate, 'tranDate');
	var datePref = nlapiGetContext().getPreference('dateformat');
	Util.console.log(moment(tranDate, datePref).format('MM/DD/YYYY'));
}

function testLockedPeriod() {
	
	var trandate = nlapiGetFieldValue('trandate');
	var isLocked = getAcctPeriod(trandate);
	Util.console.log(isLocked, 'isLocked');
}
var arMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


function getAcctPeriod(intBillDate) {
	// This is a lookup of the Vendor fulfill date Accounting Period
	var acctPerInfo = {};
	var fulfillDate = new Date();
	fulfillDate = nlapiStringToDate(intBillDate);
	
	var FMonth = fulfillDate.getMonth();
	//var FYear = fulfillDate.getFullYear() // Asif 04/01 - Need last two digits only.
	var FYear = fulfillDate.getFullYear().toString().substr(2, 2);
	var stMonth = arMonth[FMonth];
	
	//nlapiLogExecution('DEBUG', logTitle, 'FMonth: '+FMonth+' | FYear: '+FYear +' | arMonth[FMonth]: '+stMonth);
	
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
	
	if (!resultPeriod) // this means no aacounting period setup or it is still closed
	{

	}
	Util.console.log(resultPeriod, 'resultsPeriod');
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


function updateReceiptWithBill() {
	
	Util.console.log(receiptsUpdate.length, 'receipts length');
	
	for (var i=0; i< receiptsUpdate.length; i++) {
		for (key in receiptsUpdate[i]) {
			var rec = key;
			var bill = receiptsUpdate[i][key];
			Util.console.log(rec, 'rec');
			var receiptRec = nlapiLoadRecord('itemreceipt', rec);
			var lineCount = receiptRec.getLineItemCount('item');
			for (var j=1; j<= lineCount; j++) {
				receiptRec.setLineItemValue('item', 'custcol_bill_id', j, bill);
			}
			nlapiSubmitRecord(receiptRec);
			
		}
	}
	
}

var receiptsUpdate = [ {'205585':'1751745'}, {'205198':'1789631'}, {'202082':'1818346'}, {'202078':'1818346'}, {'201676':'1818346'}, {'201672':'1818346'}, {'193897':'1816733'}, {'193849':'1790135'}, {'187006':'1816733'}, {'166171':'1790135'}, {'158802':'1816733'}, {'158798':'1770733'}, {'158766':'1790135'}, {'158724':'1790135'}, {'148894':'1818045'}, {'147662':'1818245'}, {'140071':'1790741'}, {'139985':'1790741'}, {'139729':'1790741'}, {'114804':'1789631'}, {'110088':'1789631'}, {'105093':'1789631'}, {'98639':'1817745'}, {'98635':'1817745'}, {'98631':'1817745'}, {'98627':'1817945'}, {'98623':'1817945'}, {'98619':'1817945'}, {'97319':'1766817'}, {'97207':'1766817'}, {'61291':'1817645'}, {'61287':'1817645'}, {'39888':'1755159'}, {'39777':'1817345'}];

var uncheckWeKeepMarginArr = ['53216',
                              '228318',
                              '390323',
                              '390324',
                              '583523',
                              '583524',
                              '635605',
                              '1234570',
                              '1303340',
                              '1905225',
                              '1694075'];

function uncheckWeKeepMargin() {
	for (var i=0; i<uncheckWeKeepMarginArr.length;i++) {
		var camp = nlapiLoadRecord('salesorder',uncheckWeKeepMarginArr[i] );
		var lineCount = camp.getLineItemCount('item');
		
		for (var j=1;j<=lineCount;j++) {
			camp.setLineItemValue('item','custcol_amb_lower_cost_margin', j,'F');
			
		}
		nlapiSubmitRecord(camp);
	}
}

function entBankCodeUpdate() {
	
	var searchResults = nlapiSearchRecord(null, 'customsearch_ent_bank_det_no_code', null,null);
	
	if (searchResults && searchResults != '') {
		
		for (var i=0; i< 1 /*searchResults.length*/;i++) {
			var rec = nlapiLoadRecord(searchResults[i].getRecordType(), searchResults[i].getId(), {recordmode: 'dynamic'});
			var bankNo = rec.getFieldValue('custrecord_2663_entity_bank_no');
			Util.console.log(bankNo, 'bankNo');
		//	rec.setFieldValue('custrecord_2663_entity_bank_no', '0');
			rec.setFieldValue('custrecord_2663_entity_bank_no', bankNo);
			nlapiSubmitRecord(rec, true);
		}
		
	}
	
}

function entBankCodeUpdateCL() {
	
			var bankNo = nlapiGetFieldValue('custrecord_2663_entity_bank_no');
			Util.console.log(bankNo, 'bankNo');
			nlapiSetFieldValue('custrecord_2663_entity_bank_no', bankNo);
			
			return true;
	
	
}

var receiptDM = ['32346', '43153', '88461', '88463', '88465', '88467', '88469', '88471', '88473', '88475', '88477', '88479', '88481', '88483', '88485', '205796', '29541', '31370', '31472', '41229', '41856', '57900', '88493', '88499', '1474240', '69219', '68367', '61260', '61303', '61307', '61379', '61387', '61776', '71914', '114401', '97137', '97211', '97255', '97830', '155534', '721429', '721431', '721433', '721435', '721437', '721439', '721441', '721443', '721445', '721447', '721449', '721451', '721453', '721455', '721457', '721459', '721461', '721463', '721465', '721467', '721469', '721471', '721473', '205559', '205563', '205567', '205571', '721475', '721477', '721479', '721481', '721483', '721485', '721487', '721489', '721491', '721493', '721495', '721497', '721499', '721501', '343089', '343091', '343093', '721503', '721505', '721507', '721509', '721511', '721513', '721515', '721517', '721519', '721521', '721523', '721525', '721527', '721541', '721543', '721545', '721547', '721549', '721551', '721553', '721555', '721557', '721559', '721561', '721563', '721565', '721567', '721569', '721571', '721573', '721575', '721577', '721579', '721581', '721583', '721585', '721587', '721589', '486247', '486249', '721591', '721593', '721595', '721597', '721599', '721641', '721643', '721645', '721647', '721649', '721651', '721653', '721655', '721657', '721659', '721661', '721663', '721665', '721667', '721669', '721671', '721673', '721675', '721677', '721679', '721681', '721683', '721685', '721687', '721689', '721691', '721693', '721695', '721697', '721699', '721701', '721703', '721705', '721707', '721709', '721711', '721713', '721715', '721717', '721719', '721721', '721723', '721725', '721727', '721729', '721731', '721733', '721735', '721737', '721739', '721742', '721745', '721748', '721750', '721752', '721754', '721756', '721758', '721760', '721762', '721764', '721766', '721768', '721770', '721772', '721774', '721776', '721778', '721780', '721782', '721784', '721786'];

function receiptDMUpdate() {
	
	for (var i=0;i< receiptDM.length; i++) {
		recLoad = nlapiLoadRecord('itemreceipt', receiptDM[i]);
		
		for (var j=1;j<=recLoad.getLineItemCount('item'); j++) {
			recLoad.setLineItemValue('item', 'custcol_bill_id', j, '1573304');
		}
		nlapiSubmitRecord(recLoad);
		
	}
	
}

var formUpdate = ['2182251', '2182250', '2182202', '2182242', '2182246', '2182204', '2182203', '2182225', '2182249', '2182199', '2182221', '2182196', '2182228', '2182222', '2182247', '2182187', '2182195', '2182180', '2182219', '2182231', '2182208', '2182189', '2182226', '2182201', '2182190', '2182179', '2182185', '2182213', '2182217', '2182198', '2182177', '2182214', '2182243', '2182193', '2182184', '2182218', '2182182', '2182210', '2182229', '2182434', '2182451', '2182200', '2182223', '2182389', '2182233', '2182466', '2182209', '2182423', '2182181', '2182464', '2182206', '2182227', '2182211', '2182215', '2182220', '2182235', '2182441', '2182230', '2182245', '2182468', '2182396', '2182197', '2182176', '2182207', '2182232', '2182457', '2182471', '2182433', '2182453', '2182236', '2182436', '2182240', '2182183', '2182194', '2182248', '2182446', '2182400', '2182191', '2182406', '2182420', '2182431', '2182241', '2182186', '2182237', '2182234', '2182386', '2182388', '2182188', '2182192', '2182469', '2182224', '2182238', '2182244', '2182428', '2182205', '2182283', '2182178', '2182284', '2182278', '2182216', '2182598', '2182286', '2182212', '2182287', '2182587', '2182594', '2182584', '2182281', '2182288', '2182606', '2182592', '2182282', '2182279', '2182585', '2182599', '2182481', '2182608', '2182602', '2182596', '2182611', '1843541', '2182603', '2182591', '2182589', '2182612', '722866', '1119533', '1579710', '1778134', '1776835', '2182597'];

function campaignFormUpdate() {
	for (var i=0;i< formUpdate.length; i++) {
		recLoad = nlapiLoadRecord('salesorder', formUpdate[i]);
		
		recLoad.setFieldValue('customform', '143');
		nlapiSubmitRecord(recLoad);
		
	}
}