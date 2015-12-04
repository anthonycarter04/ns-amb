/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 Sep 2014     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function execScript(type) {
	logUsage('start');
	var poRec;
	var lineCount;
	var grossReceipts;
	var vendDisc;
	var grossSpend;
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_update_gross_spend', null,null );
	
	if (searchResults && searchResults[0] != '') {
		
		
		for (var i = 0; i < 280/* searchResults.length*/; i++) {
			poId = searchResults[i].getValue('internalid', null, 'group');
			//Util.console.log(poId);
			poRec = nlapiLoadRecord('purchaseorder', poId);
			lineCount = poRec.getLineItemCount('item');
			
			for (var k = 1; k<= lineCount; k++) {
				grossReceipts = poRec.getLineItemValue('item', 'custcol_amb_po_gross_rcpt_amt', k);
				vendDisc = poRec.getLineItemValue('item', 'custcol_amb_io_vendor_discount', k);
				grossSpend = poRec.getLineItemValue('item', 'custcol_amb_io_gross_spend', k);
				if (grossSpend == '') {
					grossSpend = 0;
				}
				
				if (grossReceipts == '') {
					grossReceipts = 0;
				}
			//	Util.console.log(grossReceipts, 'grossReceipts');
			//	Util.console.log(vendDisc, 'vendDisc');
				if (vendDisc == '') {
					vendDisc = 0;
				} else {
					vendDisc = parseFloat(vendDisc)/100;
				}
			//	Util.console.log(parseFloat(grossReceipts), 'parsed gross receipts');
				
				grossReceipts = (parseFloat(grossReceipts))/((1-parseFloat(vendDisc)));
				poRec.setLineItemValue('item', 'custcol_amb_po_gross_rcpt_amt', k, grossReceipts);
				poRec.setLineItemValue('item', 'custcol_amb_po_gross_spend_bal',k, grossSpend - grossReceipts);
				//Util.console.log(nlapiGetLineItemValue('item', 'custcol_amb_po_gross_rcpt_amt', k), 'gross receipts');
			}
			poRec.setFieldValue('custbody_script_update', 'T');
			nlapiSubmitRecord(poRec);
		}
		
		
	}
	logUsage('end');
		
}
