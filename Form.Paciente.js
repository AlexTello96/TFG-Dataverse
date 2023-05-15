function onLoad(executionContext)
{
    CRMCommon.FormContextGlobal = executionContext.getFormContext();

}

function postalCodeOnChange()
{
    if(CRMCommon.GetValue("oxi_postalcodeid")[0].id == null)
    {
        CRMCommon.SetValue("oxi_locality", null);
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