function createAppointment(executionContext) {
       
    CRMCommon.SaveEntityForm();
    debugger; 
 if(executionContext.getAttribute("cr712_preferredappointment").getValue() == null)
    {
        var consulta = 0;
    }
    else
    {
        var consulta = executionContext.getAttribute("cr712_preferredappointment").getValue()[0].id;
    }
    var clienttype = executionContext.getAttribute("oxi_customertype").getValue();

    var qs = "&id=" + CRMCommon.GetEntityId() + "&param1=" + consulta + "&param2=" + clienttype;   
  
    
   /*var data = {
        "id": Xrm.Page.data.entity.getId(),
        "customParam": "customParam1"
    };*/

    var pageInput = {
        pageType: "webresource",
        webresourceName: "cr712_/Html/BookDialog.html",
        id: Xrm.Page.data.entity.getId(),
        data: qs

    };
    var navigationOptions = {
        target: 2,
        width: 500, // value specified in pixel
        height: 400, // value specified in pixel
        position: 1
    };
    Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
        function success(response) {
            debugger;
            console.log(Xrm.Page.data.entity.getId());
            if(response.returnValue.button == "accept"){
                setTimeSlot(response.returnValue.id, executionContext);
            }
        },
        function error(err) {
            // Handle errors
            debugger;
        }
    );
}
function setTimeSlot(consulta, executionContext) {

    var id = Xrm.Page.data.entity.getId().replace('{', '').replace('}', '');

    var parameters = {};
    parameters.bookableresourceId = consulta;
    parameters.patientItemId = id;
    var req = new XMLHttpRequest();
    req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v9.2/oxi_SetResourceRequirement", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200 || this.status === 204) {
                debugger;
                isNaN();
                FpsUtils.Form.bookButtonAction(executionContext, Xrm.Page.data.entity.getId(), "oxi_patientitem");
            } else {
                debugger;
                //Xrm.Utility.alertDialog(this.statusText);
                console.log(this);
            }
        }
    };
    req.send(JSON.stringify(parameters));

}