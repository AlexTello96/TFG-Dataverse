function caseOnLoad(executionContext) {
    CRMCommon.FormContextGlobal = executionContext.getFormContext();
    checkSendStatus();

    setTimeout(() => { addAddresses(executionContext); }, 2000);

    if (CRMCommon.GetValue("oxi_send")) {
        CRMCommon.DisableField("oxi_send");
    }

    CRMCommon.HideOptionSetValue("header_statuscode", 279320001);

}


function activityTypeOnChange(executionContext) {
    CRMCommon.FormContextGlobal = executionContext.getFormContext();
    checkSendStatus();
}

function sendOnchange() {
    var sendstatus = CRMCommon.GetValue("oxi_send");
    var subjectString = "Are you sure you want to send this task to the technician?";
    var confirmString = "Send task to technician";


    if (sendstatus) {
        CRMCommon.ConfirmDialog(subjectString, confirmString, null, confirmSend, cancelSend);
    }

}

function checkSendStatus() {
    var sendstatus = CRMCommon.GetValue("oxi_send");
    var status = CRMCommon.GetValue("statuscode");

    if (CRMCommon.GetValue("subjectid") != null) {
        var activity = CRMCommon.GetValue("subjectid")[0].name;

        if ((!sendstatus && status == 1) && (activity == "Delivery" || activity == "Maintenance")) {

            CRMCommon.SetNotification("Task pending send to technician", "WARNING", "NotifyTecnician");  
        }

        else {            
            CRMCommon.ClearNotification("NotifyTecnician");            
        }
    }   
}

function confirmSend() {
    CRMCommon.SaveEntityForm();
    CRMCommon.DisableField("oxi_send");
    checkSendStatus();
    CRMCommon.SetValue("statuscode", 2); //sent technician
}

function cancelSend() {
    CRMCommon.SetValue("oxi_send", false);
    CRMCommon.EnableField("oxi_send");
}

function onSave(executionContext) {
    CRMCommon.FormContextGlobal = executionContext.getFormContext();

    if (CRMCommon.GetValue("oxi_send")) {
        CRMCommon.DisableField("oxi_send");        
    }
    checkSendStatus();
}

function isUrgentOnChange(executionContext) {
    CRMCommon.FormContextGlobal = executionContext.getFormContext();

    if (CRMCommon.GetValue("oxi_isurgent")) {
        CRMCommon.SetValue("oxi_dayattendance", true);
        assistDayOnChange(executionContext);
    }
    else {
        CRMCommon.SetValue("oxi_dayattendance", false);
        assistDayOnChange(executionContext);
    }
}

const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
];

function assistDayOnChange(executionContext) {
    CRMCommon.FormContextGlobal = executionContext.getFormContext();

    if (CRMCommon.GetValue("oxi_dayattendance")) {

        CRMCommon.SetValue("oxi_taskexecutiondate", new Date());
        CRMCommon.DisableField("oxi_taskexecutiondate");
        observacionesOnload(executionContext);

    }

    else {
        CRMCommon.EnableField("oxi_taskexecutiondate");
    }

}

function entryDateTimeOnChange(executionContext) {
    observacionesOnload(executionContext);
}

function observacionesOnload(executionContext) {
    CRMCommon.FormContextGlobal = executionContext.getFormContext();

    if (CRMCommon.GetValue("oxi_taskexecutiondate") != null) {
        var numDia = new Date(CRMCommon.GetValue("oxi_taskexecutiondate")).getDay();
        var nomDia = days[numDia];

        switch (nomDia) {

            case 'monday':
                CRMCommon.SetValue("oxi_observationstotechnician", "MO -")
                break;

            case 'tuesday':
                CRMCommon.SetValue("oxi_observationstotechnician", "TU -")
                break;

            case 'wednesday':
                CRMCommon.SetValue("oxi_observationstotechnician", "WE -")
                break;

            case 'thursday':
                CRMCommon.SetValue("oxi_observationstotechnician", "TH -")
                break;

            case 'friday':
                CRMCommon.SetValue("oxi_observationstotechnician", "FR -")
                break;

            case 'saturday':
                CRMCommon.SetValue("oxi_observationstotechnician", "SA -")
                break;

            case 'sunday':
                CRMCommon.SetValue("oxi_observationstotechnician", "SU -")
                break;

            default:
                break;
        }
    }

}

function onChangePatientItem(executionContext) {
    setTimeout(() => { addAddresses(executionContext); }, 2000);
}

function addAddresses(executionContext) {
    CRMCommon.FormContextGlobal = executionContext.getFormContext();

    var delegation = CRMCommon.getValueFromQuickViewForm("patientitem", "oxi_delegationid");

    if (CRMCommon.GetValue("oxi_patientitemid") != null) {

        if (CRMCommon.GetValue("oxi_taskaddress") == 279320001) { //Dirección de facturación

            var postalCodeinvoice = CRMCommon.getValueFromQuickViewForm("facturacion", "oxi_postalcodeid");
            var Addresstypeinvoice = CRMCommon.getValueFromQuickViewForm("facturacion", "oxi_addresstype");
            var addressinvoice = CRMCommon.getValueFromQuickViewForm("facturacion", "oxi_address");
            var addressnumberinvoice = CRMCommon.getValueFromQuickViewForm("facturacion", "oxi_addressnumber");
            var floorandletterinvoice = CRMCommon.getValueFromQuickViewForm("facturacion", "oxi_buildingandletter");
            var localityinvoice = CRMCommon.getValueFromQuickViewForm("facturacion", "oxi_localityid");


            if (postalCodeinvoice != null)
                CRMCommon.SetValue("oxi_postalcodepatientitem", postalCodeinvoice);


            if (Addresstypeinvoice != null)
                CRMCommon.SetValue("oxi_addresstype", Addresstypeinvoice);


            if (addressinvoice != null)
                CRMCommon.SetValue("oxi_addressofpatientitem", addressinvoice);


            if (addressnumberinvoice != null)
                CRMCommon.SetValue("oxi_addressnumberpatientitem", addressnumberinvoice);


            if (floorandletterinvoice != null)
                CRMCommon.SetValue("oxi_floorandletterpatientitem", floorandletterinvoice);


            if (localityinvoice != null)
                CRMCommon.SetValue("oxi_localitypatientitem", localityinvoice);

            if (delegation != null)
                CRMCommon.SetValue("oxi_delegation", delegation);


        }

        else { //Dirección de entrega

            var postalCode = CRMCommon.getValueFromQuickViewForm("patientitemdelivery", "oxi_deliverypostalcodeid");
            var Addresstype = CRMCommon.getValueFromQuickViewForm("patientitemdelivery", "oxi_deliveryaddresstype");
            var address = CRMCommon.getValueFromQuickViewForm("patientitemdelivery", "oxi_deliveryaddress");
            var addressnumber = CRMCommon.getValueFromQuickViewForm("patientitemdelivery", "oxi_deliveryaddressnumber");
            var floorandletter = CRMCommon.getValueFromQuickViewForm("patientitemdelivery", "oxi_deliverybuildingandletter");
            var locality = CRMCommon.getValueFromQuickViewForm("patientitemdelivery", "oxi_deliverylocalityid");

            if (postalCode != null)
                CRMCommon.SetValue("oxi_postalcodepatientitem", postalCode);

            if (Addresstype != null)
                CRMCommon.SetValue("oxi_addresstype", Addresstype);

            if (address != null)
                CRMCommon.SetValue("oxi_addressofpatientitem", address);

            if (addressnumber != null)
                CRMCommon.SetValue("oxi_addressnumberpatientitem", addressnumber);

            if (floorandletter != null)
                CRMCommon.SetValue("oxi_floorandletterpatientitem", floorandletter);

            if (locality != null)
                CRMCommon.SetValue("oxi_localitypatientitem", locality);

            if (delegation != null)
                CRMCommon.SetValue("oxi_delegation", delegation);


        }


    }


}



