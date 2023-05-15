function onLoad(executionContext)
{
    CRMCommon.FormContextGlobal = executionContext.getFormContext();

}

function postalCodeOnChange(executionContext)
{
    CRMCommon.FormContextGlobal = executionContext.getFormContext();
    if(CRMCommon.GetValue("oxi_postalcodeid") == null)
    {
        CRMCommon.SetValue("oxi_locality", null);
    }

    else{

        var postalCode = CRMCommon.GetValue("oxi_postalcodeid")[0].id;

        var fetchXML = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>"+
        "<entity name='oxi_locality'>"+
         "<attribute name='oxi_name' />"+
          "<attribute name='createdon' />"+
           "<attribute name='oxi_provinceid' />"+
           "<attribute name='oxi_postalcodeid' />"+
           "<attribute name='oxi_localityid' />"+
          "<order attribute='oxi_name' descending='false' />"+
           "<filter type='and'>"+
             "<condition attribute='oxi_postalcodeid' operator='eq' uitype='oxi_postalcode' value='"+postalCode+"' />"+
           "</filter>"+
           "<link-entity name='oxi_province' from='oxi_provinceid' to='oxi_provinceid' visible='false' link-type='outer' alias='a_9b36408ffe87eb11a812000d3ab4a527'>"+
             "<attribute name='oxi_code' />"+
           "</link-entity>"+
        "</entity>"+
       "</fetch>";

       Xrm.WebApi.retrieveMultipleRecords("oxi_locality", "?fetchXml=" + fetchXML).then(
        function success(result) {
          if (result.entities.length > 0) {
            var locality = result.entities[0];
            CRMCommon.SetValue("oxi_locality", [{ id: locality.oxi_localityid, name: locality.oxi_name, entityType: "oxi_locality" }]);
          }
    });
}
}

// Comprueba si es un DNI correcto.
function validateDNI(dni) {
    if (dni == null)
        return false;
    
    var dniPattern = /^(\d{8})([A-Z])$/;

    if(!dniPattern.test(dni)){
        return false;
    }

    else
    return true;
   
}

function checkFiscalId(executionContext) {
        CRMCommon.FormContextGlobal = executionContext.getFormContext();
        var fiscalId = CRMCommon.GetValue("oxi_identificationdocumentnumber");
        var idType = CRMCommon.GetValue("oxi_identificationdocumenttype");

        var isValid = false;

        if (fiscalId != null) {
            if (idType == 279320000) {           
                isValid = validateDNI(fiscalId);        
        }
        
        if (!isValid) {
            var message = "invalid identifier";
            CRMCommon.FormContextGlobal.getControl("oxi_identificationdocumentnumber").setNotification(message, "NOT_VALID_FISCALID_FIELD");
            CRMCommon.FormContextGlobal.ui.setFormNotification(message, "ERROR", "NOT_VALID_FISCALID_FORM");
        } else {
            CRMCommon.FormContextGlobal.ui.clearFormNotification("NOT_VALID_FISCALID_FORM");
            CRMCommon.FormContextGlobal.getControl("oxi_identificationdocumentnumber").clearNotification("NOT_VALID_FISCALID_FIELD");
        }
        }
}

function onSave(executionContext){

    checkFiscalId(executionContext);
}
