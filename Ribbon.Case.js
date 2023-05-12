function sendTechnician() {
    CRMCommon.SetValue("oxi_send", true);
    sendOnchange();

}

function visibleTechnicianSend() {

    var subject = CRMCommon.GetValue("subjectid");
    var customer = CRMCommon.GetValue("customerid");
    var dayassistance = CRMCommon.GetValue("oxi_dayattendance");    
    var executionDate = CRMCommon.GetValue("oxi_taskexecutiondate");
    var sendstatus = false;

    if (subject != null && customer != null) {
        if (dayassistance)
            sendstatus = true;

        else if (dayassistance == false && executionDate != null) {
            sendstatus = true;
        }
    }
    else {
        sendstatus = false;
    }

    return sendstatus;

}

function completeTask()
{
    CRMCommon.SaveEntityForm();
    CRMCommon.SetValue("statuscode",279320000); //completed
}