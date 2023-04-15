var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stdDBName = "Student";
var stdRelationName = "Student-Rel";
var connToken = "90932831|-31949281539976623|90948216";
var mode = "";
$("#roll").focus();

function ValidateForm() {
    var stdName, stdRoll, stdClass, stdAddress, stdBirth, stdEnrollment;
    stdRoll = $("#roll").val();
    stdName = $("#stdName").val();
    stdAddress = $("#stdAddress").val();
    stdClass = $("#stdclass").val();
    stdBirth = $("#stdBirth").val();
    stdEnrollment = $("#stdEnrollment").val();

    if (stdRoll === "") {
        alert("please Enter Valid Roll NO:");
        $("#roll").focus();
        return "";
    }

    if (stdName === "") {
        alert("please Enter Valid name:");
        $("#stdName").focus();
        return "";
    }

    if (stdClass === "") {
        alert("please Enter Valid Class:");
        $("#stdclass").focus();
        return "";
    }

    if (stdAddress === "") {
        alert("please Enter Valid Address:");
        $("#stdAddress").focus();
        return "";
    }

    if (stdBirth === "") {
        alert("please Select Birthdate:");
        $("#stdBirth").focus();
        return "";
    }

    if (stdEnrollment === "") {
        alert("please Select Enrollment Date:");
        $("#stdEnrollment").focus();
        return "";
    }

    var jsonStrObj = {
        Roll: stdRoll,
        Name: stdName,
        Class: stdClass,
        Address: stdAddress,
        Birthdate: stdBirth,
        EnrollmentDate: stdEnrollment
    };
    return JSON.stringify(jsonStrObj);
}

function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function resetStudent() {
    $("#roll").val("");
    $("#stdName").val("");
    $("#stdAddress").val("");
    $("#stdclass").val("");
    $("#stdBirth").val("");
    $("#stdEnrollment").val("");
    $("#stdSave").prop("disabled", false);
    $("#roll").prop("disabled", false);
    $("#stdChange").prop("disabled", false);
    localStorage.removeItem('recno');
    mode = "";
    $("#roll").focus();
}

function saveStudent() {
    var jsonStr = ValidateForm();
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createPUTRequest(connToken, jsonStr, stdDBName, stdRelationName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommand(putReqStr, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    if(resultObj.status && resultObj.message) {
        alert(resultObj.message);
        resetStudent();
    }
}

function findStudentRecord(data) {
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(data, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(result.status === 200 && result.data) {
        var resultData = result.data[0];
        var student = resultData.record;
        $("#stdName").val(student.Name);
        $("#stdclass").val(student.Class);
        $("#stdAddress").val(student.Address);
        $("#stdBirth").val(student.Birthdate);
        $("#stdEnrollment").val(student.EnrollmentDate);
        $("#stdSave").prop("disabled", true);
        $("#roll").prop("disabled", true);
        localStorage.setItem('recno', resultData.rec_no);
        mode = "update";
    } else {
        $("#stdChange").prop("disabled", true);
    } 
}

$("#roll").change(function(e) {
    var record = {
        "Roll": e.target.value
    };
    var jsonObj = createFIND_RECORDRequest(connToken, stdDBName, stdRelationName, JSON.stringify(record), true, true);
    if(jsonObj) {
        findStudentRecord(jsonObj);
    }
});

function changeStudent() {
    if(mode === 'update') {
        var jsonChg = ValidateForm();
        var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stdDBName, stdRelationName, localStorage.getItem("recno"));
        jQuery.ajaxSetup({async: false});
        var resJsonObj = executeCommand(updateRequest, jpdbBaseUrl, jpdbIML);
        jQuery.ajaxSetup({async: true});
        alert(resJsonObj.message);
        if(resJsonObj.status === 200) {
            resetStudent();
        }
    }
}