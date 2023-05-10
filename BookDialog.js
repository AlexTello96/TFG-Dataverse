document.onreadystatechange = function () {

  if (document.readyState == "complete") {
  debugger;
   // getElementsAction();
    appointmentFetch(getUrlParameters().id, getUrlParameters().param2, getUrlParameters().param1);


  }
}

function successcallBR(response) {
  var responseObj = JSON.parse(response);
  var consultaId = getUrlParameters().param1.replace('{', '').replace('}', '').toLowerCase();

  responseObj.value.forEach(function (responseitem) {
    if (responseitem.name != null && responseitem.name != "") {
      var name = responseitem.name;
      var guid = responseitem.bookableresourceid;
      debugger;

      if(guid == consultaId)
      {
        $("#consulta").append('<option value="' + guid + '" selected>' + name + '</option>');
      }
      
      else{
            $("#consulta").append('<option value="' + guid + '">' + name + '</option>');      

      }

      
      
    }

  });

}

function errorcallBR(error) {
  debugger;
  alert(error);
}

function appointmentFetch(patientItemId, isprivate, consulta) {

  //if is Centrox == No y el tipo de cliente no es privado y hay consulta preferida
  if ( isprivate != "279320001" && consulta != "0") {
    var fetchXML = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>" +
      "<entity name='bookableresource'>" +
      "<attribute name='name' />" +
      "<attribute name='createdon' />" +
      "<attribute name='resourcetype' />" +
      "<attribute name='bookableresourceid' />" +
      "<order attribute='name' descending='false' />" +
      "<link-entity name='oxi_hospital' from='oxi_hospitalid' to='oxi_hospitalid' link-type='inner' alias='an'>" +
      "<link-entity name='oxi_province' from='oxi_provinceid' to='oxi_province' link-type='inner' alias='ao'>" +
      "<link-entity name='oxi_hospital' from='oxi_province' to='oxi_provinceid' link-type='inner' alias='ap'>" +
      "<link-entity name='bookableresource' from='oxi_hospitalid' to='oxi_hospitalid' link-type='inner' alias='aq'>" +
      "<link-entity name='oxi_patientitem' from='cr712_preferredappointment' to='bookableresourceid' link-type='inner' alias='ar'>" +
      "<filter type='and'>" +
      "<condition attribute='oxi_patientitemid' operator='eq' uitype='oxi_patientitem' value='" + patientItemId + "' />" +
      "</filter>" +
      "</link-entity>" +
      "</link-entity>" +
      "</link-entity>" +
      "</link-entity>" +
      "</link-entity>" +
      "</entity>" +
      "</fetch>";
  }
 
  //No hay consulta preferida y cliente SI es privado, mostramos todas las consultas privadas de la provincia
  else if(consulta == "0" && isprivate == "279320001")
  {
    var fetchXML = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>"+
    "<entity name='bookableresource'>"+
      "<attribute name='name' />"+
      "<attribute name='createdon' />"+
      "<attribute name='resourcetype' />"+
      "<attribute name='bookableresourceid' />"+
      "<order attribute='name' descending='false' />"+      
      "<link-entity name='oxi_hospital' from='oxi_hospitalid' to='oxi_hospitalid' link-type='inner' alias='af'>"+
        "<link-entity name='oxi_province' from='oxi_provinceid' to='oxi_province' link-type='inner' alias='ag'>"+
          "<link-entity name='oxi_locality' from='oxi_provinceid' to='oxi_provinceid' link-type='inner' alias='ah'>"+
            "<link-entity name='contact' from='oxi_locality' to='oxi_localityid' link-type='inner' alias='ai'>"+
              "<link-entity name='oxi_patientitem' from='oxi_patientid' to='contactid' link-type='inner' alias='aj'>"+
                "<filter type='and'>"+
                  "<condition attribute='oxi_patientitemid' operator='eq' uitype='oxi_patientitem' value='"+ patientItemId +"' />"+
                "</filter>"+
              "</link-entity>"+
            "</link-entity>"+
          "</link-entity>"+
        "</link-entity>"+
      "</link-entity>"+
    "</entity>"+
  "</fetch>";
  } 

    //Cliente NO es privado, mostramos todas las consultas de la provincia
    else
    {
      var fetchXML =  "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>"+
      "<entity name='bookableresource'>"+
        "<attribute name='name' />"+
        "<attribute name='createdon' />"+
        "<attribute name='resourcetype' />"+
        "<attribute name='bookableresourceid' />"+
        "<order attribute='name' descending='false' />"+
        "<link-entity name='oxi_hospital' from='oxi_hospitalid' to='oxi_hospitalid' link-type='inner' alias='be'>"+
          "<link-entity name='oxi_province' from='oxi_provinceid' to='oxi_province' link-type='inner' alias='bf'>"+
            "<link-entity name='oxi_locality' from='oxi_provinceid' to='oxi_provinceid' link-type='inner' alias='bg'>"+
              "<link-entity name='contact' from='oxi_locality' to='oxi_localityid' link-type='inner' alias='bh'>"+
                "<link-entity name='oxi_patientitem' from='oxi_patientid' to='contactid' link-type='inner' alias='bi'>"+
                  "<filter type='and'>"+
                    "<condition attribute='oxi_patientitemid' operator='eq' uitype='oxi_patientitem' value='"+ patientItemId +"' />"+
                  "</filter>"+
                "</link-entity>"+
              "</link-entity>"+
            "</link-entity>"+
          "</link-entity>"+
        "</link-entity>"+
      "</entity>"+
    "</fetch>";
    }

  var req = new XMLHttpRequest();
  req.open(
    "GET",
    parent.Xrm.Page.context.getClientUrl() +
    "/api/data/v9.2/bookableresources?fetchXml=" +
    encodeURIComponent(fetchXML),
    true
  );
  req.setRequestHeader("Prefer", 'odata.include-annotations="*"');
  req.onreadystatechange = function () {
    if (this.readyState === 4) {
      req.onreadystatechange = null;
      if (this.status === 200) {
        successcallBR(this.response);
      } else {
        errorcallBR(this.statusText);
      }
    }
  };
  req.send();
}


function acceptButton(){

    debugger;
    returnValue = {};
    returnValue.button = "accept";
    returnValue.id = $('select#consulta option:selected').val();
    parent.$("button[title='Close']").click()
}
function cancelButton(){
    returnValue = {};
    returnValue.button = "cancel";
    returnValue.id = $('select#consulta option:selected').val();
    parent.$("button[title='Close']").click()
}

function getUrlParameters() {
	var queryString = location.search.substring(1);
	var params = {};
	var queryStringParts = queryString.split("%26");
	for (var i = 0; i < queryStringParts.length; i++) {
		var pieces = queryStringParts[i].split("%3d");
		params[pieces[0].toLowerCase()] = pieces.length === 1 ? null : decodeURIComponent(pieces[1]);
	}
 
	return params;
}

function getElementsAction()
{
  var params = getUrlParameters();

  var consulta = params.id;

  return consulta;
}
