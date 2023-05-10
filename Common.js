/**
* Clase FormType: Nos presenta los tipos de formulario existentes en Dynamics CRM
*
* @class FormType
*
*/
"use strict";
function FormType() { }
FormType.Undefined = 0;
FormType.CREATE = 1;
FormType.UPDATE = 2;
FormType.READONLY = 3;
FormType.DISABLED = 4;
FormType.QUICKCREATE = 5;
FormType.BULKEDIT = 6;
FormType.READOPTIMIZED = 11;

/**
* Clase CRMCommon: Nos sirve para aplicar funcionalidad común a las interfaces de usuario de forma sencilla
*
* @class CRMCommon
* @CRMCommon
*/
"use strict";
var CRMCommon = window.CRMCommon || {};

"use strict";
CRMCommon.FormContextGlobal = null;

"use strict";
CRMCommon.ContextGlobal = null;

(function () {

    /**
    * Función que valida si un campo existe en el formulario actual
    *
    * @function CRMCommon.HasField
    * @param fieldName String: Nombre del campo en formulario
    * @return True/False.
    */
    this.HasField = function (fieldName) {
        try {
            var returnValue = (CRMCommon.FormContextGlobal.getAttribute(fieldName) != null) ? true : false;
            if (returnValue != null) {
                return returnValue;
            }
            else {
                return false;
            }
        }
        catch (e) {
            console.error(e.message);
            return false;
        }
    }
    /**
    * Habilita el campo indicado en el formulario
    *
    * @function CRMCommon.EnableField
    * @param fieldName String: Nombre del campo a habilitar
    */
    this.EnableField = function (fieldName) {
        try {
            CRMCommon.FormContextGlobal.ui.controls.get(fieldName).setDisabled(false);
        }
        catch (e) {
            throw e;
        }
    }

    /**
    * Deshabilita el campo indicado en el formulario
    *
    * @function CRMCommon.DisableField
    * @param fieldName String: Nombre del campo a deshabilitar
    */
    this.DisableField = function (fieldName) {
        try {
            CRMCommon.FormContextGlobal.ui.controls.get(fieldName).setDisabled(true);
        }
        catch (e) {
            throw e;
        }
    }

    /**
    * Deshabilita el campo indicado en el proceso de negocio
    *
    * @function CRMCommon.DisableBPFField
    * @param fieldName String: Nombre del campo a deshabilitar
    */
    this.DisableBPFField = function (fieldName) {
        try {
            var c = CRMCommon.FormContextGlobal.getControl("header_process_" + fieldName);
            if (c != null) {
                c.setDisabled(true);
            }
        }
        catch (e) {
            throw e;
        }
    }

    /**
    * Habilita el campo indicado en el proceso de negocio
    *
    * @function CRMCommon.EnableBPFField
    * @param fieldName String: Nombre del campo a habilitar
    */
    this.EnableBPFField = function (fieldName) {
        try {
            var c = CRMCommon.FormContextGlobal.getControl("header_process_" + fieldName);
            if (c != null) {
                c.setDisabled(false);
            }
        }
        catch (e) {
            throw e;
        }
    }
    /**
    * Deshabilita/Habilita campo según variable boolean
    *
    * @function CRMCommon.EnableDisableField
    * @param fieldName String: Nombre del campo a deshabilitar
    * @param enable Boolean: True/False para habilitar/deshabilitar 
    * @param includeheader Boolean: True/False si incluye header
    */
    this.EnableDisableField = function (fieldName, enable, includeheader) {
        try {
            if (enable) {
                CRMCommon.EnableField(name);
                if (includeheader) CRMCommon.EnableBPFField(fieldName);
            } else {
                CRMCommon.DisableField(name);
                if (includeheader) CRMCommon.DisableBPFField(fieldName);
            }
        }
        catch (e) {
            throw e;
        }
    }
    /**
    * Devuelve el valor del campo indicado en el tipo de datos correspondiente. El tipo puede variar en función del tipo de campo
    * aunque siempre puede convertirse a String
    *
    * @function CRMCommon.GetValue
    * @param fieldName String: Nombre del campo a recuperar
    * @return Valor del campo.
    */
    this.GetValue = function (fieldName) {
        try {
            if (CRMCommon.HasField(fieldName)) {
                return CRMCommon.FormContextGlobal.getAttribute(fieldName).getValue();
            }
            else {
                return null;
            }
        } catch (e) {
            throw e;
        }
    }
    
    /**
    *   Función encargada de filtrar los valores en un campo de tipo LookUp
    *
    *   @function CRMCommon.AddCustomFilter
    *   @param {String} entityReference Nombre del campo LookUp.
    *   @param {String} fetchXml Filtro en formato XML que será aplicado en el campo de tipo LookUp.
    *   @returns {EntityReference/Json} Objeto de tipo EntityReference parseado correctamente.
    *
    *   @example
    *   var FetchXml = "<filter type='and'><condition attribute='emailaddress1' operator='eq' value='" + email + "' /></filter>";
    *   CRMCommon.AddCustomFilter("parentaccountid", FetchXml);
    */
    this.AddCustomFilter = function (entityReference, fetchXml) {
        try {
            CRMCommon.FormContextGlobal.getControl(entityReference).addCustomFilter(fetchXml);
        }
        catch (e) {
        debugger;
            throw e;
        }
    }
    /**
     * 
     * @param entityReference Nombre del campo LookUp.
     * @param viewId GUID de la vista a aplicar
     */
    this.SetDefaultView = function (entityReference, viewId) {

        try{
            CRMCommon.FormContextGlobal.getControl(entityReference).setDefaultView(viewId);
        }
        catch (e) {
            throw e;
        }
    }
    /**
    * Asigna el valor del campo indicado.  El tipo puede variar en función del tipo de campo
    * aunque siempre puede convertirse a String
    *
    * @function CRMCommon.SetValue
    * @param fieldName String: Nombre del campo a modificar
    * @param value String: el valor del campo
    */
    this.SetValue = function (fieldName, value) {
        try {
            CRMCommon.FormContextGlobal.getAttribute(fieldName).setValue(value);
        }
        catch (e) {
            throw e;
        }
    }
    /**
    *   Función encargada de insertar registro a la lista del campo de tipo Lookup
    *
    *   @function CRMCommon.SetLookUp
    *   @param {String} attName Nombre del campo Lookup.
    *   @param {String} registerId Id del campo Lookup.
    *   @param {String} entityName Nombre de la entidad
    *   @param {String} registerName Nombre principal del registro a insertar.
    */
    this.SetLookUp = function (attName, registerId, entityName, registerName) {
    debugger;
        try {
            if (registerId !== null) {
                CRMCommon.FormContextGlobal.getAttribute(attName).setValue([{ id: registerId, name: registerName, entityType: entityName }]);
            } else {
                CRMCommon.FormContextGlobal.getAttribute(attName).setValue(null);
            }
            CRMCommon.FormContextGlobal.data.entity.attributes.get(attName).setSubmitMode("always");
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * 
     * @param quickViewFormName Quick view form name
     * @param fieldName Field name
     * @returns the value of the field name on the quick view form
     */
    this.getValueFromQuickViewForm = function (quickViewFormName, fieldName) {

        try{

            return CRMCommon.FormContextGlobal.ui.quickForms.get(quickViewFormName).getAttribute(fieldName).getValue();
        }
        catch (e){
            return null;
        }
        return null;
    }
    this.getWebApiEndPoint = function (){

        if(CRMCommon.FormContextGlobal != null){
        return CRMCommon.FormContextGlobal.context.getClientUrl() + "/api/data/v9.2/";
        }
        else{
        return parent.Xrm.Page.context.getClientUrl();
        }
    }
    this.AddPreSearch = function(fieldName, functionCallback){

        CRMCommon.FormContextGlobal.getControl(fieldName).addPresearch(functionCallback);
    }
    /**
    *   Función encargada de ejecutar ventana modal de confirm y llamar a una función determinada
    *   dependiendo de la respuesta del usuario (Confirmar / Cancelar)
    *
    *   @function CRMCommon.ConfirmDialog
    *   @param {String} subjectStrings, Mensaje a mostrar en ventana modal del confirm
    *   @param {String} confirmStrings, Titulo a mostrar en ventana modal del confirm
    *   @param {Function} asyncFunctionConfirm, Función a la que se llamará si la respuesta del usuario es "Confirmar"
    *   @param {Function} asyncFunctionCancel, Función a la que se llamará si la respuesta del usuario es "Cancelar"
    *   Ejemplo:
    *   var message = { text:"This is a confirmation.", title:"Confirmation Dialog" };
    *   var confirmOptions = { height: 200, width: 450 };
    *   CRMCommon.ConfirmDialog(message, confirmOptions, asyncFunctionConfirm, asyncFunctionCancel);
    */
    this.ConfirmDialog = function (subjectStrings, confirmStrings, confirmOptions = null, asyncFunctionConfirm = null, asyncFunctionCancel = null) {
        try {
            var confirmString = { cancelButtonLabel: "No", confirmButtonLabel: "Sí", text: subjectStrings, title: confirmStrings };
            var confirmOption = (confirmOptions != null) ? confirmOptions : { height: 120, width: 260 };

            Xrm.Navigation.openConfirmDialog(confirmString, confirmOption).then(
                function (success) {
                    if (success.confirmed){
                        if (asyncFunctionConfirm != null)
                            asyncFunctionConfirm();
                            }
                        else{
                            if (asyncFunctionCancel != null)
                                asyncFunctionCancel();
                                }
                });
        }
        catch (e) {
            throw e;
        }
    }
    this.ConfirmDialogPromise = function (subjectStrings, confirmStrings, confirmOptions = null, asyncFunctionConfirm = null, asyncFunctionCancel = null) {
        try {
            var confirmString = { cancelButtonLabel: "No", confirmButtonLabel: "Sí", text: subjectStrings, title: confirmStrings };
            var confirmOption = (confirmOptions != null) ? confirmOptions : { height: 120, width: 260 };

            return Xrm.Navigation.openConfirmDialog(confirmString, confirmOption).then(
                function (success) {
                    if (success.confirmed){
                        if (asyncFunctionConfirm != null)
                            asyncFunctionConfirm();
                            }
                        else{
                            if (asyncFunctionCancel != null)
                                asyncFunctionCancel();
                                }
                });
        }
        catch (e) {
            throw e;
        }
    }
    /**
    *   Función encargada de mostrar un mensaje de notificación en formulario
    *
    *   @function CRMCommon.SetNotification
    *   @param {String} message Mensaje de notificación a mostrar en formulario.
    *   @param {String} level, Código de tipo texto que define el tipo de mensaje de notificación a mostrar: "INFO  | WARNING | ERROR"
    *   @param {String} uniqueId, Código único que indetificará a la notificación
    */
    this.SetNotification = function (message, level, uniqueId) {
        try {
            if (typeof CRMCommon.FormContextGlobal != "undefined" && !CRMCommon.IsEmpty(CRMCommon.FormContextGlobal)) {
                CRMCommon.FormContextGlobal.ui.setFormNotification(message, level, uniqueId);
            }
            else window.parent.CRMCommon.FormContextGlobal.ui.setFormNotification(message, level, uniqueId);
        }
        catch (e) {
            throw e;
        }
    }
    /**
    * Indica si un campo está informado o no
    *
    * @function CRMCommon.IsEmptyString
    * @param fieldName: el nombre del campo
    * @return true en caso de que no esté informado, false en caso contrario
    */
    this.IsEmptyString = function (fieldName) {
        return (CRMCommon.GetValue(fieldName) == null || CRMCommon.GetValue(fieldName) == "");
    }
    /**
    * Pasando un objeto nos devuelve un booleano indicando si el objeto es vacío o no (vacío = '', nul, undefined)
    * Determina si el objeto pasado por parámetro es o no vacío ("", null, undefined)
    *
    * @function CRMCommon.IsEmpty
    * @param {Object|String} obj Objeto a comprobar si es o no vacío
    * @returns {Boolean} Devuelve <tt>true</tt> si es vacío
    */
    this.IsEmpty = function (obj) {
        var Res = false;
        try {
            if (CRMCommon.Trim(obj) == "" || obj == null || obj == "undefined" || obj == undefined) {
                Res = true;
            }
            return Res;
        }
        catch (e) {
            console.error(e.message);
            return Res;
        }
    }
    /**
    *   Función encargada de eliminar un mensaje de notificación en formulario
    *
    *   @function CRMCommon.ClearNotification
    *   @param {String} uniqueId, Código único de la notificación
    */
    this.ClearNotification = function (uniqueId) {
        try {
            if (typeof CRMCommon.FormContextGlobal != "undefined" && !CRMCommon.IsEmpty(CRMCommon.FormContextGlobal)) {
                CRMCommon.FormContextGlobal.ui.clearFormNotification(uniqueId);
            }
            else window.parent.CRMCommon.FormContextGlobal.ui.clearFormNotification(uniqueId);
        }
        catch (e) {
            throw e;
        }
    }
    /**
    * Guarda el formulario actual
    *
    * @function CRMCommon.SaveEntityForm
    */
    this.SaveEntityForm = function () {
        try {
            CRMCommon.FormContextGlobal.data.entity.save();
        }
        catch (e) {
            throw e;
        }
    }
    /**
    *   Elimina los espacios en blanco de una cadena de texto
    *
    *   @function CRMCommon.Trim
    *   @param {String} myString Cadena de texto a tratar.
    *   @returns {String} Cadena de texto sin espacios en blanco.
    */
    this.Trim = function (myString) {
        var Res = myString;
        try {
            if (myString != null) {
                Res = myString.toString().replace(/\s+/g, '').replace(/\s+$/g, '');
            }

            return Res;
        }
        catch (e) {
            console.error(e.message);
            return Res;
        }
    }
    /**
    * Devuelve el identificador de la entidad que representa el formulario actual (con llaves "{}")
    *
    * @function CRMCommon.GetEntityId
    * @return String: El guid del objeto que representa el formulario actual con llaves "{}"
    */
    this.GetEntityId = function () {
        try {
            if(CRMCommon.FormContextGlobal != null && CRMCommon.FormContextGlobal != undefined){

                return CRMCommon.FormContextGlobal.data.entity.getId();
            }
            else{
                return parent.Xrm.Page.data.entity.getId();
            }
        }
        catch (e) {
            console.error(e.message);
            return "";
        }
    }
    /**
    * Hace visible el campo en el formulario
    *
    * @function CRMCommon.ShowField
    * @param fieldName String: Nombre del campo que se hará visible
    */
    this.ShowField = function (fieldName) {
        try {
            CRMCommon.FormContextGlobal.ui.controls.get(fieldName).setVisible(true);
        }
        catch (e) {
            throw e;
        }
    }
    /**
   *   Función encargada de ejecutar ventana modal de dialogo de alerta
   *
   *   @function CRMCommon.OpenAlertDialog
   *   @param {String} message, Mensaje a mostrar en ventana modal del alert
   *   Ejemplo:
   *   var alertStrings = { confirmButtonLabel:"OK", title:"Alert Dialog" };
   *   var alertOptions = { height: 120, width: 260 };
   *   CRMCommon.openAlertDialog(alertString);
   */
    this.OpenAlertDialog = function (alertStrings, alertOptions = null, asyncFunctionSuccess = null, asyncFunctionError = null) {
        try {
            var alertString = { confirmButtonLabel: "Aceptar", text: alertStrings };
            var alertOption = (alertOptions != null) ? alertOptions : { height: 160, width: 500 };

            Xrm.Navigation.openAlertDialog(alertString, alertOption).then(
                function success(result) {
                    if (asyncFunctionSuccess != null) {
                        asyncFunctionSuccess();
                        console.log("Alert dialog closed");
                    }
                },
                function (error) {
                    if (asyncFunctionError != null) {
                        asyncFunctionError();
                    }
                    console.log(error.message);
                }
            );
        }
        catch (e) {
            throw e;
        }
    }
    /**
    * Devuelve el tipo (el modo en que se encuetra) del formulario que se está mostrando. (Creación, Modificación, Solo lectura, etc.)
    * Ver clase FormType para identificar los tipos de formularios
    *
    * @function CRMCommon.GetFormType
    */
    this.GetFormType = function () {
        try {
            var FormType = CRMCommon.FormContextGlobal.ui.getFormType();
            return (FormType != null) ? FormType : null;
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Realiza la llamada a un action de CRM
     * 
     * @param actionName nombre del action
     * @param parameters parametros de entrada del action
     * @param successCallback callback en caso de exito
     * @param errorCallback callback en caso de error
     */
    this.CallAction = function (actionName, parameters, successCallback, errorCallback) {
        var req = new XMLHttpRequest();
        req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v9.2/" + actionName, true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200 || this.status === 204) {
                    successCallback(this);
                } else {
                    errorCallback(this);
                }
            }
        };
        req.send(JSON.stringify(parameters));
    }
    /**
    * Devuelve el id del usuario actual conectado
    *
    *@function CRMCommon.GetCurrentUserId
    *@return String: El id del usuario actual
    */
    this.GetCurrentUserId = function () {
        try {
            return Xrm.Utility.getGlobalContext().userSettings.userId;
        }
        catch (e) {
            console.error(e.message);
            return "";
        }
    }

    /**
    * Devuelve el nombre del usuario actual conectado
    *
    * @function CRMCommon.GetCurrentUserName
    * @return String: El nombre del usuario actual
    */
    this.GetCurrentUserName = function () {
        try {
            return Xrm.Utility.getGlobalContext().userSettings.userName;
        }
        catch (e) {
            console.error(e.message);
            return "";
        }
    }
    this.GetCurrentUserId = function () {
        try {
            return Xrm.Utility.getGlobalContext().userSettings.userId;
        }
        catch (e) {
            console.error(e.message);
            return "";
        }
    }
    /**
     * set form dirty or not
     * 
     * @param {*} dirty true of false
     */
    this.SetDirtyForm = function(dirty){
        CRMCommon.FormContextGlobal.data.setFormDirty(dirty);
    }
    /**
     * 
     * @param {*} message mensaje a mostrar
     */
    this.ShowLoading = function (message){
        Xrm.Utility.showProgressIndicator(message);
    }
    this.CloseLoading = function (){
        Xrm.Utility.closeProgressIndicator();
    }
    /**
    * Recarga botones ribbon en formulario actual
    *
    * @function CRMCommon.RefreshRibbon
    */
    this.RefreshRibbon = function () {
        try {
            CRMCommon.FormContextGlobal.ui.refreshRibbon();
        }
        catch (e) {
            throw e;
        }
    }
}).call(CRMCommon);