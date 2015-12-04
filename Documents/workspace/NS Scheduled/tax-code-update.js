/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Apr 2015     anthony.carter
 *
 */

var recType = 'purchaseorder';
var updatePOs = ['669712'];

function updateTax() {
	
	for (var i=0; i< updatePOs.length; i++) {
		
		var poId = updatePOs[i];
		
		if (poId && poId != '') {
			var poRec = nlapiLoadRecord(recType, poId);
			var vend = poRec.getFieldValue('entity');
			var vendLoad = nlapiLoadRecord('vendor', vend);
			var taxcode = vendLoad.getFieldValue('taxitem');
			
			
			if (taxcode && taxcode != '') {
				var lineCount = poRec.getLineItemCount('item');
				for (var j=1;j<=lineCount;j++) {
					poRec.setLineItemValue('item', 'taxcode', j, taxcode);
					
				}
				nlapiSubmitRecord(poRec);
			} else {
				Util.console.log('No tax code for: ' + poId);
			}
			
		}
		
	}
	
}