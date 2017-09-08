
var hostWebUrl = ''
var appWebUrl = ''

export function init(hWebUrl, aWebUrl) {
  hostWebUrl = hWebUrl;
  appWebUrl = aWebUrl;
}

export function getCurrentUser() {
  return $.ajax({
        url: "../_api/web/currentuser?$select=Title",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" }
      })
}

export function getDeptInfo() {
  return $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Information')/items?@target='" +
          hostWebUrl + "'&$select=*",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function getRepos() {
  return $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Repositories')/items?@target='" +
      hostWebUrl + "'&$select=Repository",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function getDepts() {
  return $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Completeness')/items?@target='" +
      hostWebUrl + "'&$select=Department_x0020_Number",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function getGeneralRetention() {
  return $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('General Retention Schedule')/items?@target='" +
          hostWebUrl + "'&$select=*&$orderby=Function,Record_x0020_Category",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function getPendingRecords() {
  return $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items?@target='" +
          hostWebUrl + "'&$filter=Status eq 'Pending'&$orderby=Department_x0020_Number",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function getRecordsByDept(dept) {
  return $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items?@target='" +
          hostWebUrl + "'&$filter=Department_x0020_Number eq '" + dept + "'&$orderby=Function,Record_x0020_Type",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function getRecordsByCat(cat) {
  return $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items?@target='" +
          hostWebUrl + "'&$filter=Record_x0020_Category_x0020_ID eq '" + cat + "'&$orderby=Department_x0020_Number,Function,Record_x0020_Type",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function getRecordsByType(type, flag) {
  if (flag) {
    return $.ajax({
      url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items?@target='" +
            hostWebUrl + "'&$filter=Record_x0020_Type eq '" + type + "'&$orderby=Department_x0020_Number,Function,Record_x0020_Type",
      method: "GET",
      headers: { "Accept": "application/json; odata=verbose" }
    })
  }
  else {
    return $.ajax({
      url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items?@target='" +
            hostWebUrl + "'&$filter=substringof('" + type + "',Record_x0020_Type)&$orderby=Department_x0020_Number,Function,Record_x0020_Type",
      method: "GET",
      headers: { "Accept": "application/json; odata=verbose" }
    })
  }
}

export function getUserDepartments(userName) {
  return $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Information')/items?@target='" +
          hostWebUrl + "'&$filter=Person_x0020_Responsible_x0020_f eq '" + userName + "'",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function getDRSCompleteness() {
  return $.ajax({
        url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Completeness')/items?@target='" +
          hostWebUrl + "'",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function getCommonRecords() {
  return $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Common Records')/items?@target='" +
          hostWebUrl + "'&$select=*&$orderby=Function,Record_x0020_Type",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function getDeptRecords(dept) {
  if (dept == -1) {
    return $.ajax({
      url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items?@target='" +
            hostWebUrl + "'",
      method: "GET",
      headers: { "Accept": "application/json; odata=verbose" }
    })
  }
  return $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items?@target='" +
          hostWebUrl + "'&$filter=Department_x0020_Number eq '" + dept + "'&$orderby=Function,Record_x0020_Type",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function updatePendingRecord(row, itemID, dept, func, recType, catID, cat, ret, exc, adminCmts, flag) {
  var data = {
    "__metadata": {"type": "SP.Data.Department_x0020_Retention_x0020_ScheduleListItem"},
    "Department_x0020_Number": dept,
    "Function": func,
    "Record_x0020_Type": recType,
    "Record_x0020_Category_x0020_ID": catID,
    "Retention_x0020_Exception": exc,
    "Message_x0020_From_x0020_Admin": adminCmts,
    "New_x0020_Message": flag
  }
  $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items(" + itemID +
          ")?@target='" + hostWebUrl + "'",
    method: "POST",
    contentType: "application/json;odata=verbose",
    data: JSON.stringify(data),
    headers: {
      "Accept": "application/json;odata=verbose",
      "X-RequestDigest": $("#__REQUESTDIGEST").val(),
      "X-HTTP-Method": "MERGE",
      "If-Match": "*"
    },
    success: function() {
      location.reload();
    },
    failure: function() {
      $('#approve-alert').html('</br><div class="alert alert-warning" role="alert">Server error. Please try again.</div>')
    }
  })
}

export function approveRecords(rows, ids) {
  var error = 0
  var data = {
    "__metadata": {"type": "SP.Data.Department_x0020_Retention_x0020_ScheduleListItem" },
    "Status": "Approved"
  }
  for (var i = 0; i < ids.length; i++) {
    $.ajax({
      url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items(" + ids[i] +
            ")?@target='" + hostWebUrl + "'",
      method: "POST",
      contentType: "application/json;odata=verbose",
      data: JSON.stringify(data),
      headers: {
        "Accept": "application/json;odata=verbose",
        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
        "X-HTTP-Method": "MERGE",
        "If-Match": "*"
      },
      success: function() {
        if (i == ids.length && error == 0) {
          location.reload()
        }
      },
      failure: function() {
        error = 1
        if (i == ids.length - 1 && error == 1) {
          $('#approve-alert').html('</br><div class="alert alert-warning" role="alert">Server error. Please try again.</div>')
        }
      }
    })
  }
}

export function updateRecord(itemID, code, func, type, id, cat, ret, cmts, row, flag) {
  var data
  if (flag == 1) {
    data = {
      "__metadata": {"type": "SP.Data.Department_x0020_Retention_x0020_ScheduleListItem" },
      "Code": code,
      "Function": func,
      "Record_x0020_Type": type,
      "Record_x0020_Category_x0020_ID": id,
      "Comments": cmts,
      "Status": "Pending"
    }
  }
  else {
    data = {
      "__metadata": {"type": "SP.Data.Department_x0020_Retention_x0020_ScheduleListItem" },
      "Code": code,
      "Function": func,
      "Record_x0020_Type": type,
      "Record_x0020_Category_x0020_ID": id,
      "Comments": cmts,
    }
  }

  $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items(" + itemID +
          ")?@target='" + hostWebUrl + "'",
    method: "POST",
    contentType: "application/json;odata=verbose",
    data: JSON.stringify(data),
    headers: {
      "Accept": "application/json;odata=verbose",
      "X-RequestDigest": $("#__REQUESTDIGEST").val(),
      "X-HTTP-Method": "MERGE",
      "If-Match": "*"
    },
    success: function() {
      row.children()[0].innerText = code
      row.children()[1].innerText = func
      row.children()[2].innerText = type
      row.children()[3].innerText = id
      row.children()[4].innerText = cat
      row.children()[5].innerText = ret
      row.children()[7].innerText = cmts
      if (flag == 1) {
        row.children()[10].innerText = 'Pending'
      }
    }
  })
}

export function deleteRecord(itemID, row) {
  $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items(" + itemID +
          ")?@target='" + hostWebUrl + "'",
    method: "POST",
    headers: {
      "X-RequestDigest": $("#__REQUESTDIGEST").val(),
      "X-HTTP-Method": "DELETE",
      "If-Match": "*"
    },
    success: function() {row.hide()}
  })
}

export function getSizes() {
  return $.ajax({
        url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Unique Codes')/items?@target='" +
          hostWebUrl + "'",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" }
  })
}

export function updateSize(itemID, size) {
  var data = {
    "__metadata": {"type": "SP.Data.Unique_x0020_CodesListItem" },
    "Unique_x0020_Code": size
  }

  $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Unique Codes')/items(" + itemID +
      ")?@target='" + hostWebUrl + "'",
    method: "POST",
    contentType: "application/json; odata=verbose",
    data: JSON.stringify(data),
    headers: {
      "Accept": "application/json;odata=verbose",
      "X-RequestDigest": $("#__REQUESTDIGEST").val(),
      "X-HTTP-Method": "MERGE",
      "If-Match": "*"
    },
    success: function() {
      return
    }
  })
}

export function addSize(dept, size) {
  var data = {
    "__metadata": {"type": "SP.Data.Unique_x0020_CodesListItem" },
    "Department_x0020_Number": dept,
    "Unique_x0020_Code": size
  }
  $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Unique Codes')/items?@target='" + hostWebUrl + "'",
    method: "POST",
    contentType: "application/json;odata=verbose",
    data: JSON.stringify(data),
    headers: {
      "accept": "application/json;odata=verbose",
      "X-RequestDigest": $("#__REQUESTDIGEST").val()
    },
    success: function() {
      return
    }
  })
}

export function addRecord(dept, code, recType, recFunc, recCat, userMsg, commentsPlan, archival, vital, highlyConfidential, recRepo) {
  var flag
  if (userMsg != '') {
    flag = 'Yes'
  }
  else {
    flag = 'No'
  }
  var data = {
    "__metadata": {"type": "SP.Data.Department_x0020_Retention_x0020_ScheduleListItem" },
    "Department_x0020_Number": dept,
    "Code": code,
    "Function": recFunc,
    "Record_x0020_Type": recType,
    "Record_x0020_Category_x0020_ID": recCat,
    "CommentsPlan": commentsPlan,
    "Message_x0020_From_x0020_Admin": userMsg,
    "Highly_x0020_Confidential": highlyConfidential,
    "Vital": vital,
    "Archival": archival,
    "Repository": recRepo,
    "Status": "Approved",
    "New_x0020_Message": flag
  }
  $.ajax({
    url: appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Department Retention Schedule')/items?@target='" + hostWebUrl + "'",
    method: "POST",
    contentType: "application/json;odata=verbose",
    data: JSON.stringify(data),
    headers: {
      "accept": "application/json;odata=verbose",
      "X-RequestDigest": $("#__REQUESTDIGEST").val()
    },
    success: function() {
      $('#rec-type').val('')
      $('#rec-func').val('Select a function')
      $('#rec-cat').val('Select a category')
      $('#retention').val('')
      $('#msgToUser').val('')
      $('#commentsPlan').val('')
      $('#confidential-chkbx').prop('checked', false)
      $('#vital-chkbx').prop('checked', false)
      $('#archival-chkbx').prop('checked', false)
      $('#add-alert').html('</br><div class="alert alert-success" role="alert">Record added!</div>')
      setTimeout(function() {$('#add-alert').empty()}, 1500)
    },
    failure: function() {
      $('#add-alert').html('</br><div class="alert alert-warning" role="alert">Server error. Record not added.</div>')
      setTimeout(function() {$('#add-alert').empty()}, 2500)
    }
  })
}
