/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Feb 2015     anthony.carter
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduled(type) {
	
	
	var deploy = nlapiGetContext().getDeploymentId();
	if (deploy && deploy == 'customdeploy1') {
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_update_fulfills_receips_1', null, null);
		if (searchResults && searchResults != '') {
			var context = nlapiGetContext();
			
			
			for (var i=0; i<searchResults.length; i++) {
				var remUsage = context.getRemainingUsage();
				
				if (remUsage <300) {
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
					
					if (status && status == 'QUEUED') {
						break;
					}
					
				}
				var recId = searchResults[i].getId();
				Util.console.log(recId, 'recId');
				var recType = searchResults[i].getRecordType();
				var recLoad = nlapiLoadRecord(recType, recId);
				nlapiSubmitRecord(recLoad);
			}
			
		}
	} else if (deploy && deploy == 'customdeploy2') {
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_update_fulfills_receips_2', null, null);
		if (searchResults && searchResults != '') {
			var context = nlapiGetContext();
			
			
			for (var i=0; i<searchResults.length; i++) {
				var remUsage = context.getRemainingUsage();
				
				if (remUsage <300) {
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
					
					if (status && status == 'QUEUED') {
						break;
					}
					
				}
				var recId = searchResults[i].getId();
				Util.console.log(recId, 'recId');
				var recType = searchResults[i].getRecordType();
				var recLoad = nlapiLoadRecord(recType, recId);
				nlapiSubmitRecord(recLoad);
			}
			
		}
	} else if (deploy && deploy == 'customdeploy3') {
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_update_fulfills_receips_3', null, null);
		if (searchResults && searchResults != '') {
			var context = nlapiGetContext();
			
			
			for (var i=0; i<searchResults.length; i++) {
				var remUsage = context.getRemainingUsage();
				
				if (remUsage <300) {
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
					
					if (status && status == 'QUEUED') {
						break;
					}
					
				}
				var recId = searchResults[i].getId();
				Util.console.log(recId, 'recId');
				var recType = searchResults[i].getRecordType();
				var recLoad = nlapiLoadRecord(recType, recId);
				nlapiSubmitRecord(recLoad);
			}
			
		}
	} else if (deploy && deploy == 'customdeploy4') {
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_update_fulfills_receips_4', null, null);
		if (searchResults && searchResults != '') {
			var context = nlapiGetContext();
			
			
			for (var i=0; i<searchResults.length; i++) {
				var remUsage = context.getRemainingUsage();
				
				if (remUsage <300) {
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
					
					if (status && status == 'QUEUED') {
						break;
					}
					
				}
				var recId = searchResults[i].getId();
				Util.console.log(recId, 'recId');
				var recType = searchResults[i].getRecordType();
				var recLoad = nlapiLoadRecord(recType, recId);
				nlapiSubmitRecord(recLoad);
			}
			
		}
	} else if (deploy && deploy == 'customdeploy5') {
		var searchResults = nlapiSearchRecord('transaction', 'customsearch_update_fulfills_receips_5', null, null);
		if (searchResults && searchResults != '') {
			var context = nlapiGetContext();
			
			
			for (var i=0; i<searchResults.length; i++) {
				var remUsage = context.getRemainingUsage();
				
				if (remUsage <300) {
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
					
					if (status && status == 'QUEUED') {
						break;
					}
					
				}
				var recId = searchResults[i].getId();
				Util.console.log(recId, 'recId');
				var recType = searchResults[i].getRecordType();
				var recLoad = nlapiLoadRecord(recType, recId);
				nlapiSubmitRecord(recLoad);
			}
			
		}
	}
	
	
}

function updateCamps (type) {
	var searchResults = nlapiSearchRecord('transaction', 'customsearch_dnd_intrep_camps', null, null);
	
	if (searchResults && searchResults != '') {
		var context = nlapiGetContext();
		for (var i=0; i< searchResults.length; i++) {
			var remUsage = context.getRemainingUsage();
			
			if (remUsage <300) {
				var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
				
				if (status && status == 'QUEUED') {
					break;
				}
				
			}
			var recId = searchResults[i].getValue('internalid', null, 'group');
			Util.console.log(recId, 'recId');
			
			var recLoad = nlapiLoadRecord('salesorder', recId);
			nlapiSubmitRecord(recLoad);
		}
		
	}
}

function updateInvoiceForm (type) {
	
	var searchResults = nlapiSearchRecord('invoice', 'customsearch_sf_invoices_created', null, null);
	var context = nlapiGetContext();
	for (var i=0; i<searchResults.length; i++) {
		var usage = context.getRemainingUsage();
		Util.console.log(usage, 'usage');
		if (usage && usage <500) {
			var status = nlapiScheduleScript(context.getScriptId(),context.getDeploymentId());
			if (status && status == 'QUEUED') {
				break;
			}
		}
		var invID = searchResults[i].getId();
		
		var invLoad = nlapiLoadRecord('invoice', invID);
		invLoad.setFieldValue('customform', '141');
		try {
			nlapiSubmitRecord(invLoad);
		} catch (e) {
			
		}
		
	}
}

invArr = ['991079', '991419', '993804', '990981', '990898', '991379', '990879', '993954', '996441', '996437', '993255', '1005487', '993814', '994113', '993922', '993818', '995612', '995156', '995391', '993197', '992955', '995489', '995069', '993391', '995494', '993509', '993718', '996039', '993597', '991405', '997683', '993926', '993593', '993812', '992881', '991381', '990883', '993589', '997490', '993519', '994212', '991497', '997187', '994951', '997109', '994027', '995569', '995448', '995783', '992847', '991179', '993995', '993503', '997085', '994614', '990979', '993312', '995434', '993908', '993541', '993912', '994087', '997289', '993328', '1009013', '995606', '994973', '993531', '993842', '993143', '996723', '995274', '993585', '993838', '994195', '993834', '994101', '994961', '993135', '995815', '993523', '993651', '993486', '993617', '995063', '995539', '993820', '993826', '995705', '995403', '995799', '993263', '993700', '994879', '993787', '993882', '993050', '993987', '991479', '995238', '993288', '993633', '993185', '995137', '993639', '993131', '992863', '995509', '994863', '993623', '992753', '994552', '993141', '992105', '991739', '992085', '992107', '991911', '991927', '991829', '992297', '991963', '993058', '991897', '992285', '991645', '995291', '992841', '990880', '992081', '991995', '991898', '991905', '991065', '991702', '991699', '991693', '995519', '993587', '994979', '992845', '993103', '991025', '992015', '991953', '991655', '991677', '992213', '991643', '991947', '992031', '991275', '991997', '991061', '992089', '992630', '991689', '991881', '993109', '993107', '992947', '992570', '991477', '991259', '991331', '991539', '991339', '991549', '991272', '993916', '995272', '993191', '991679', '991241', '992749', '994556', '995012', '995049', '991261', '991345', '996987', '991021', '991537', '992117', '993393', '992179', '991833', '992009', '992027', '991669', '991817', '991981', '993227', '991055', '991939', '991915', '991641', '991879', '991357', '992827', '992939', '991685', '991631', '992935', '992705', '992067', '993517', '992596', '992223', '991925', '992944', '993794', '993251', '994276', '992568', '992737', '992554', '994439', '992546', '992550', '992481', '992249', '995270', '993796', '993189', '994819', '992821', '992971', '994447', '993018', '992722', '993020', '992608', '993798', '991741', '994529', '993423', '995283', '995008', '992937', '995041', '993036', '993306', '993238', '992967', '993603', '994369', '994799', '992713', '992857', '992375', '992541', '992359', '993898', '993714', '992886', '992717', '993706', '992715', '994152', '992986', '992524', '992794', '992907', '993894', '992263', '992277', '994357', '992788', '994638', '992683', '992255', '991835', '1009010', '991743', '992892', '992522', '993062', '992069', '992530', '992283', '1010211', '991908', '993233', '992784', '992113', '993133', '991959', '991165', '991155', '991319', '991248', '991245', '993300', '992990', '994445', '991023', '990885', '991991', '991285', '992835', '992253', '994236', '995101', '990983', '991120', '991220', '992725', '994662', '992369', '992343', '992280', '995000', '992777', '992540', '992689', '1010212', '992961', '993712', '992977', '992928', '992865', '992123', '992361', '992992', '992373', '993383', '991747', '992071', '992095', '991031', '991545', '991116', '991733', '992231', '991441', '991525', '991519', '991393', '991131', '991010', '991161', '991015', '992503', '991861', '991451', '991187', '992251', '991181', '991123', '991403', '991439', '991305', '992509', '992594', '991033', '991215', '991017', '991369', '991019', '991211', '990987', '992051', '991847'];
