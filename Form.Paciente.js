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