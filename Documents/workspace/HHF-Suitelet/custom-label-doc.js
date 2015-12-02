/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       09 Apr 2015     anthony.carter
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function addButton(type, form, request){
	
	var tranId = nlapiGetFieldValue('custbody5');
	var tranDate = nlapiGetFieldValue('trandate');
	var entity = nlapiGetFieldValue('entity');
	

	
	var btn = form.addButton('custpage_labeldoc', 'Print Label', 'printTheLabel()');
	form.setScript('customscript_custom_labe_doc_cl');
	
	
}

function printTheLabel(tranId) {
	
	var recId = nlapiGetRecordId();
	
	var recLoad = nlapiLoadRecord('workorder', recId);
	var tranId = recLoad.getFieldValue('custbody5');
	var tranDate = recLoad.getFieldValue('trandate');
	var entity = recLoad.getFieldValue('entity');
	if (entity && entity != '') {
		var custName = nlapiLookupField('customer', entity, 'entityid');
	} else {
		var custName = '-None-';
	}
	
	
	

	
	var slURL = '/app/site/hosting/scriptlet.nl?script=11&deploy=1';
	slURL += '&custpage_tranid=' + tranId;
	slURL += '&custpage_trandate=' + tranDate;
	slURL += '&custpage_entity=' + custName;
 	
	var intHeight = '600px';
	var intWidth = '900';
	
	//nlapiRequestURL(slURL);
	window.open(slURL, '_blank','width=' + intWidth + ',height=' + intHeight + ',scrollbars=1');
	//window.open(slURL);
}

function pageInitCL() {
	
}

function theSL(request) {
	var poForm = nlapiCreateForm('', true);
	
	
	var tranId = request.getParameter('custpage_tranid');
	var tranDate = request.getParameter('custpage_trandate');
	var entity = request.getParameter('custpage_entity');
	Util.console.log(tranId);
	Util.console.log(tranDate);
	Util.console.log(entity);
	
	poForm.setScript('customscript_custom_label_sl_client');
	poForm.addField('custpage_something', 'text', '').setDisplayType('inline').setLayoutType('startrow', 'startcol').setDefaultValue(tranId);
	poForm.addField('custpage_entity', 'text', '').setDisplayType('inline').setDefaultValue(entity);
	poForm.addField('custpage_date', 'text', '').setDisplayType('inline').setDefaultValue(tranDate);
	
	response.writePage(poForm);
	
	
}

function theSLCLLoad() {
	
	
	
	jQuery(document).ready(function() {
		jQuery('table .table_fields').first().css('display', 'none');
		jQuery('table .table_fields').css('height', '1.5in').css('width', '2.4in').css('align', 'left').css('padding','0').css('max-height', '1.70in').css('padding-top', '20px');
		jQuery('table .table_fields td').css('text-align', 'center').css('font-family', 'arial');
		jQuery('.uir-page-title').css('display', 'none');
		jQuery('body').css('align', 'center');
		jQuery('.input').css('font-weight', 'bold');
		jQuery('.input').attr('style', 'font-size: 26pt !important');
		jQuery('body').css('margin', '0');
		jQuery('#custpage_entity_val').attr('style', 'font-size: 16pt !important');
		//jQuery('.uir-field-wrapper').attr('css','font-size: 5vmin');
		//jQuery('@page').attr('css','margin: 0');
	});
	
	var theUser = nlapiGetUser();
	
	//if (theUser == '37266') {
		
		
		if(parseInt(jQuery('table .table_fields tr:nth-child(2)').height()) > 56) {
			jQuery('#custpage_entity_val').attr('style', 'font-size: 12pt !important');
		}
		
		if(parseInt(jQuery('table .table_fields tr:nth-child(1)').height()) > 50) {
			jQuery('#custpage_something_val').attr('style', 'font-size: 18pt !important');
		}
		
	//}
	
	
	window.print();
}
