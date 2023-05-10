var globFetchXml = null;

function OnLoad(executionContext) {
    CRMCommon.FormContextGlobal = executionContext.getFormContext();
    CRMCommon.CloseLoading();
    OnChangeTipoCliente(executionContext);


    if (CRMCommon.GetFormType() == 1) {

        setDireccionesFromCliente();
        OnChangeDireccionesIguales(executionContext);
    }

    var numAfiliacion = CRMCommon.GetValue("oxi_affiliatenumber");
    var numAfiliacionCheck = CRMCommon.GetValue("oxi_exceptionaffiliatenumber");

    checkNumAfilStatus();    
    checkAfilFieldsOnLoad(numAfiliacionCheck, numAfiliacion);
    filterBookableResources(executionContext);

    if (CRMCommon.GetValue("oxi_postalcodeid") != null){
        filterLookUpDirEntrega(executionContext, obtener2DigitosCP());
    }

    var province = obtenerProvincia();
    if(province != null){
        CRMCommon.SetValue("oxi_patientprovince", province);
    }
    
}

function OnSave(executionContext) {
    checkNumAfilStatus();    
    identOnChange(executionContext);
}

function OnChangeTipoCliente(executionContext) {

    CRMCommon.FormContextGlobal = executionContext.getFormContext();
    let tipoCliente = CRMCommon.GetValue("oxi_clienttype");
    if (tipoCliente != null) {

        CRMCommon.EnableField("oxi_accountid");
        AddFilterCliente();
    }
    else {

        CRMCommon.DisableField("oxi_accountid");
    }
}
function OnChangeCodigoPostal(executionContext) {

    CRMCommon.FormContextGlobal = executionContext.getFormContext();
    let codigoPostal = CRMCommon.GetValue("oxi_postalcodeid");
    let tipoCliente = CRMCommon.GetValue("oxi_clienttype");
    if (tipoCliente != null && codigoPostal != null) {

        AddFilterCliente();
    }
}
function OnChangeDireccionesIguales(executionContext) {

    CRMCommon.FormContextGlobal = executionContext.getFormContext();
    if (CRMCommon.GetValue("oxi_deliveryaddressequalbillingaddress")) {

        SetDeliveryAddress();
   
    }
    else {

        SetDeliveryAddressEmpty();
    }
}
function OnChangeDireccion(executionContext) {

    CRMCommon.FormContextGlobal = executionContext.getFormContext();
    if (CRMCommon.GetValue("oxi_deliveryaddressequalbillingaddress")) {

        let postalCode = CRMCommon.GetValue("oxi_postalcodeid");
        let addressType = CRMCommon.GetValue("oxi_addresstype");
        let address = CRMCommon.GetValue("oxi_address");
        let addressNumber = CRMCommon.GetValue("oxi_addressnumber");
        let buildingAndLetter = CRMCommon.GetValue("oxi_buildingandletter");
        let locality = CRMCommon.GetValue("oxi_localityid");

        CRMCommon.SetValue("oxi_deliverypostalcodeid", postalCode);
        CRMCommon.SetValue("oxi_deliveryaddresstype", addressType);
        CRMCommon.SetValue("oxi_deliveryaddress", address);
        CRMCommon.SetValue("oxi_deliveryaddressnumber", addressNumber);
        CRMCommon.SetValue("oxi_deliverybuildingandletter", buildingAndLetter);
        CRMCommon.SetValue("oxi_deliverylocalityid", locality);
    }
}

function OnChangePostalCode(executionContext) {

    CRMCommon.FormContextGlobal = executionContext.getFormContext();
    let postalCode = CRMCommon.GetValue("oxi_postalcodeid");
    
    if (postalCode != null) {
        CRMCommon.SetValue("oxi_deliverypostalcodeid", postalCode);
        filterLookUpDirEntrega(executionContext, obtener2DigitosCP());
    }

    var province = obtenerProvincia();
    if (province != null) {
        CRMCommon.SetValue("oxi_provincia", province);
    }
    //filterLookUpLocality(executionContext, obtener2DigitosCP(executionContext));    
}

function AddFilterCliente() {

    let tipoCliente = CRMCommon.GetValue("oxi_clienttype");
    let codigoPostal = CRMCommon.GetValue("oxi_postalcodeid");

    if (tipoCliente != null && codigoPostal != null && CRMCommon.GetValue("oxi_postalcodeid")[0] != null) {

        let viewGuid = "";
        if (tipoCliente == 279320001) {
            viewGuid = "790A32B7-329C-EB11-B1AC-000D3ADCC768";
        }
        else {
            viewGuid = "9C1577AF-329C-EB11-B1AC-000D3ADCC768";
        }
        CRMCommon.SetDefaultView("oxi_accountid", viewGuid);
    }
}

function setDireccionesFromCliente() {

    let postalCode = CRMCommon.getValueFromQuickViewForm("PatientAddress", "oxi_postalcodeid");
    let addressType = CRMCommon.getValueFromQuickViewForm("PatientAddress", "oxi_addresstype");
    let address = CRMCommon.getValueFromQuickViewForm("PatientAddress", "address1_line1");
    let addressNumber = CRMCommon.getValueFromQuickViewForm("PatientAddress", "oxi_addressnumber");
    let buildingAndLetter = CRMCommon.getValueFromQuickViewForm("PatientAddress", "oxi_buildingandletter");
    let locality = CRMCommon.getValueFromQuickViewForm("PatientAddress", "oxi_locality");


    if (CRMCommon.GetValue("oxi_postalcodeid") == null) {

        CRMCommon.SetValue("oxi_postalcodeid", postalCode);
    }
    if (CRMCommon.GetValue("oxi_addresstype") == null) {

        CRMCommon.SetValue("oxi_addresstype", addressType);
    }
    if (CRMCommon.GetValue("oxi_address") == null) {

        CRMCommon.SetValue("oxi_address", address);
    }
    if (CRMCommon.GetValue("oxi_buildingandletter") == null) {

        CRMCommon.SetValue("oxi_buildingandletter", addressNumber);
    }
    if (CRMCommon.GetValue("oxi_addressnumber") == null) {

        CRMCommon.SetValue("oxi_addressnumber", buildingAndLetter);
    }
    if (CRMCommon.GetValue("oxi_localityid") == null) {

        CRMCommon.SetValue("oxi_localityid", locality);
    }

    SetDeliveryAddress();
}
function SetDeliveryAddress() {

    let postalCode = CRMCommon.GetValue("oxi_postalcodeid");
    let addressType = CRMCommon.GetValue("oxi_addresstype");
    let address = CRMCommon.GetValue("oxi_address");
    let addressNumber = CRMCommon.GetValue("oxi_addressnumber");
    let buildingAndLetter = CRMCommon.GetValue("oxi_buildingandletter");
    let locality = CRMCommon.GetValue("oxi_localityid");
   
    CRMCommon.SetValue("oxi_deliverypostalcodeid", postalCode);
    CRMCommon.SetValue("oxi_deliveryaddresstype", addressType); 
    CRMCommon.SetValue("oxi_deliveryaddress", address);
    CRMCommon.SetValue("oxi_deliveryaddressnumber", addressNumber);
    CRMCommon.SetValue("oxi_deliverybuildingandletter", buildingAndLetter);
    CRMCommon.SetValue("oxi_deliverylocalityid", locality);        
    
}

function SetDeliveryAddressEmpty() {

    CRMCommon.SetValue("oxi_deliverypostalcodeid", null);
    CRMCommon.SetValue("oxi_deliveryaddresstype", null);
    CRMCommon.SetValue("oxi_deliveryaddress", null);
    CRMCommon.SetValue("oxi_deliveryaddressnumber", null);
    CRMCommon.SetValue("oxi_deliverybuildingandletter", null);
    CRMCommon.SetValue("oxi_deliverylocalityid", null);
}

function obtenerProvincia() {
    if (CRMCommon.GetValue("oxi_postalcodeid") != null) {
        var postalcodeId = CRMCommon.GetValue("oxi_postalcodeid")[0].id;
        var postalcode = CRMCommon.GetValue("oxi_postalcodeid")[0].name.substring(0, 2); //primeros 2 dígitos - provincia

        var province = null;
        
        //Consulta la entidad Provincia usando el servicio web
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/oxi_provinces?$filter=oxi_code eq '" + postalcode + "'", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    if (results.value.length > 0) {
                        province = results.value[0].oxi_name;
                    }
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send();

        return province;
    }
}

function obtener2DigitosCP() {

    if (CRMCommon.GetValue("oxi_postalcodeid") != null) {
        var postalcode = CRMCommon.GetValue("oxi_postalcodeid")[0].name;


        postalcode = postalcode.substring(0, 2) //primeros 2 dígitos - provincia

        return postalcode;

    }
}

//filtro para consultas
function filterBookableResources(executionContext) {
    var formContext = executionContext.getFormContext();

    formContext.getControl("cr712_preferredappointment").addPreSearch(function () {

        addCustomeLookupFilterBookableResource();
    });

}

function addCustomeLookupFilterBookableResource() {
    var entitytype = CRMCommon.GetValue("oxi_customertype");

    if (entitytype == "279320001") {
        var fetchXML = "<filter type='and'>" +
            "<condition attribute='oxi_resourceprovince' operator='eq' value='" + CRMCommon.GetValue("oxi_patientprovince") + "' />" +
            "<condition attribute='cr712_isprivate' operator='eq' value='1' />" +
            "</filter>";
    }

    else {
        var fetchXML = "<filter type='and'>" +
            "<condition attribute='oxi_resourceprovince' operator='eq' value='" + CRMCommon.GetValue("oxi_patientprovince") + "' />" +
            "</filter>";
    }


    CRMCommon.AddCustomFilter("cr712_preferredappointment", fetchXML);

}

//filtro para dirección de entrega
function filterLookUpDirEntrega(executionContext) {
    var formContext = executionContext.getFormContext();

    if (CRMCommon.GetValue("oxi_postalcodeid") != null) {
        formContext.getControl("oxi_deliverypostalcodeid").addPreSearch(function () {

            addCustomeLookupFilterDirEntrega(obtener2DigitosCP());
        });
    }
    else {
        //for removing the existing filters
        formContext.getControl("oxi_deliverypostalcodeid").removePreSearch(addCustomeLookupFilterDirEntrega(obtener2DigitosCP()));
    }

}

function addCustomeLookupFilterDirEntrega(postalCode2Num) {
    var filterXml = "<filter type='and'><condition attribute='oxi_name' operator='like' value='" + postalCode2Num + "%' /></filter>";

    CRMCommon.AddCustomFilter("oxi_deliverypostalcodeid", filterXml);

}

//al cambiar el tipo de cliente (Seguridad Social, Entidad Colaboradora)
function customerTypeOnChange(executionContext) {

    var customerType = CRMCommon.GetValue("oxi_customertype");

    filterLookUpAccount(executionContext, customerType);

}

//filtro para parametro cliente
function filterLookUpAccount(executionContext, customerType) {
    var formContext = executionContext.getFormContext();

    if (globFetchXml == null) {
        //for adding the existing filters
        formContext.getControl("oxi_clientparameterid").addPreSearch(Filterfunction);
    }

    else {
        //for removing the existing filters
        formContext.getControl("oxi_clientparameterid").removePreSearch(Filterfunction);
        globFetchXml = null;
    }

}

var Filterfunction = function () {

    globFetchXml = "<filter type='and'><condition attribute='oxi_customertype' operator='eq' value='" + CRMCommon.GetValue("oxi_customertype") + "' /></filter>";
    CRMCommon.AddCustomFilter("oxi_clientparameterid", globFetchXml);
}

//comprueba el campo de excepción de número de afiliación
function numAfilCheckOnChange() {
    var numAfiliacionCheck = CRMCommon.GetValue("oxi_exceptionaffiliatenumber");

    checkAfilFieldsOnLoad(numAfiliacionCheck, null);
    checkNumAfilStatus();
}

//comprueba el campo de número de afiliación
function numAfilOnChange() {
    var numAfiliacion = CRMCommon.GetValue("oxi_affiliatenumber");

    checkAfilFieldsOnLoad(false, numAfiliacion);
    checkNumAfilStatus();

}

//comprueba el estado
function checkNumAfilStatus() {
    var numAfilStatus = CRMCommon.GetValue("oxi_affiliatenumber");

    if (numAfilStatus == null) {
        CRMCommon.SetNotification("Número de Afiliación no incluido", "WARNING", "NotifyTecnician");
    }

    else {
        CRMCommon.ClearNotification("NotifyTecnician");
    }
}

function checkAfilFieldsOnLoad(numAfilCheck, numAfil) {


    if (numAfilCheck) {
        CRMCommon.DisableField("oxi_affiliatenumber");

    }

    else {
        CRMCommon.EnableField("oxi_affiliatenumber");
        CRMCommon.SetValue("oxi_exceptionaffiliatenumber", false);
        CRMCommon.DisableField("oxi_exceptionaffiliatenumber");

    }

    if (numAfil == null) {
        CRMCommon.EnableField("oxi_exceptionaffiliatenumber");

    }
}

function identOnChange(executionContext) {
    var formContext = executionContext.getFormContext();

    var pattern = /[^0-9]/ig;

    var currentValue = CRMCommon.GetValue("oxi_affiliatenumber");

    if (pattern.test(currentValue) && currentValue != null) {
        formContext.getControl("oxi_affiliatenumber").setNotification('Invalid value, only numbers allowed');
    }
    else {
        formContext.getControl("oxi_affiliatenumber").clearNotification();
    }  

}