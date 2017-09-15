import * as dao from './DataAccess.js'
import * as getRowData from './RowData.js'
import * as util from './Utils.js'

let hostWebUrl;
let appWebUrl;
let user;
let catIDLookup;
let retentionLookup;
let genRetention;
let recordsList
let itemIDLookup
let row
let newFunctionLookup
let deptNameLookup
let repos
let depts
let initialCmt
let adminStatus
export async function run(hWebUrl, aWebUrl) {
  // initializes DataAccess object with hostweb and appweb URLs
  dao.init(hWebUrl, aWebUrl);
  // assigns hostweb and appweb urls to global variables
  hostWebUrl = hWebUrl;
  appWebUrl = aWebUrl;
  // stores user
  user = await util.getUserName();
  if (user) {
    adminStatus = await dao.searchUserInAdminList(user)
    if (!adminStatus.d.results.length) {
      console.log("not admin!")
      return
    }
  }
  let deptInfo = await util.getDeptInfo()
  deptNameLookup = {}
  for (var i = 0; i < deptInfo.length; i++) {
    deptNameLookup[deptInfo[i]['Department_x0020_Number']] = deptInfo[i]['Department_x0020_Name']
  }
  recordsList = await util.getRecordsByDept(-1)
  // stores general retention schedule in global var
  genRetention = await util.getGeneralRetention()
  // populates catIDLookup object to get categories from category IDs and vice
  // versa
  catIDLookup = {}
  retentionLookup = {}
  newFunctionLookup = {}

  for (var i = 0; i < genRetention.length; i++) {
    catIDLookup[genRetention[i]['Record_x0020_Category_x0020_ID']] = genRetention[i]['Record_x0020_Category']
    retentionLookup[genRetention[i]['Record_x0020_Category']] = genRetention[i]['Retention_x0020_Description']
    var newTempList
    if (genRetention[i]['Function'] in newFunctionLookup) {
      newTempList = newFunctionLookup[genRetention[i]['Function']]
    } else {
      newTempList = []
    }
    newTempList.push(genRetention[i]['Record_x0020_Category_x0020_ID'] + ' - ' + genRetention[i]['Record_x0020_Category'])
    newTempList.sort()
    newFunctionLookup[genRetention[i]['Function']] = newTempList;
  }

  repos = await getRepos()
  depts = await getDepts()

  populateAdminTabs();
}

function populateAdminTabs() {

  populateApproveTab()
  populateReportTab()
  populateAddRecordTab()
}

function populateReportTab() {

  var deptList = []
  var catList = []
  for (var i = 0; i < recordsList.length; i++) {
    if (deptList.indexOf(recordsList[i]['Department_x0020_Number']) == -1) {
      deptList.push(recordsList[i]['Department_x0020_Number'])
    }
    if (catList.indexOf(recordsList[i]['Record_x0020_Category_x0020_ID']) == -1) {
      if (recordsList[i]['Record_x0020_Category_x0020_ID'] == null) {
        continue
      }
      catList.push(recordsList[i]['Record_x0020_Category_x0020_ID'])
    }
  }

  var deptOptions = ''
  var catOptions = ''
  var tempDeptList = []

  for (var i = 0; i < deptList.length; i++) {
    tempDeptList.push(deptList[i])
  }
  tempDeptList.sort()
  for (var i = 0; i < tempDeptList.length; i++) {
    deptOptions += '<option>' + tempDeptList[i] + '</option>'
  }
  catList.sort()
  for (var i = 0; i < catList.length; i++) {
    catOptions += '<option>' + catList[i] + ' - ' + catIDLookup[catList[i]] + '</option>'
  }

  $('#report-tab').append('</br></br><form class="form-horizontal"> \
                              <div cl' +
      'ass="form-group"> \
                                <label class="control-label ' +
      'col-sm-2" for="dept-select">Filter by Department:</label> \
                    ' +
      '            <div class="col-sm-5"> \
                                  <select c' +
      'lass="form-control" id="dept-select"> \
                                    ' + deptOptions + ' \
                                  </select> \
                               ' +
      ' </div> \
                                <div class="col-sm-5"> \
             ' +
      '                     <button type="button" id="dept-submit" class="btn btn-defau' +
      'lt">Submit</button> \
                                </div> \
                 ' +
      '             </div> \
                              <div class="form-group"> \
 ' +
      '                               <label class="control-label col-sm-2" for="cat-se' +
      'lect">Filter by Category:</label> \
                                <div class="' +
      'col-sm-5"> \
                                  <select class="form-control" id="' +
      'cat-select"> \
                                    ' + catOptions + ' \
                                  </select> \
                               ' +
      ' </div> \
                                <div class="col-sm-5"> \
             ' +
      '                     <button type="button" id="cat-submit" class="btn btn-defaul' +
      't">Submit</button> \
                                </div> \
                  ' +
      '            </div> \
                              <div class="form-group"> \
  ' +
      '                              <label class="control-label col-sm-2" for="type-bo' +
      'x">Filter by Record Type:</label> \
                                <div class="' +
      'col-sm-5"> \
                                  <input type="text" class="form-co' +
      'ntrol" id="type-select"> \
                                </div> \
            ' +
      '                    <div class="col-sm-5"> \
                                  <' +
      'button type="button" id="type-submit" class="btn btn-default">Submit</button> \
' +
      '                                </div> \
                                </br> ' +
      '\
                                <div class="col-sm-6 checkbox"> \
            ' +
      '                      <center><label><input type="checkbox" id="exact-chbx"> Exa' +
      'ct Match</label></center> \
                                </div> \
           ' +
      '                   </div> \
                              <div class="form-group' +
      '"> \
                                <label class="control-label col-sm-2" for="' +
      'admin-buttons">DRS / Review:</label> \
                                <div clas' +
      's="col-sm-7"> \
                                  <div id="admin-buttons"> \
   ' +
      '                                 <button type="button" id="drs-complete" class="' +
      'btn btn-default">DRS Complete</button> \
                                    <bu' +
      'tton type="button" id="drs-not-complete" class="btn btn-default">DRS Not Complet' +
      'e</button> \
                                    <button type="button" id="revie' +
      'w-complete" class="btn btn-default">Review Complete</button> \
                 ' +
      '                   <button type="button" id="review-not-complete" class="btn btn' +
      '-default">Review Not Complete</button> \
                                  </div' +
      '> \
                                </div> \
                              </div' +
      '> \
                            </form>')
  $('#report-tab').append('<div id="type-alert"></div>')
  $('#report-tab').append('<div id="report-table"></div>')

  $('form input').on('keypress', function (e) {
    return e.which !== 13
  })

  $('#dept-submit').click(function () {
    $('#type-alert').html()
    $('#report-table').html()
    getResults('dept', $('#dept-select').val(), 0)
  })

  $('#cat-submit').click(function () {
    $('#type-alert').html()
    $('#report-table').html()
    getResults('cat', $('#cat-select').val().slice(0, 5), 0)
  })

  $('#type-submit').click(function () {
    $('#type-alert').html()
    $('#report-table').html()
    if ($('#type-select').val().length < 3) {
      $('#report-table').html('</br><div class="alert alert-info" role="alert">Query needs to contain at least ' +
          '3 characters</div>')
      return
    }

    if ($('#exact-chbx').is(':checked')) {
      getResults('type', $('#type-select').val(), 1)
    } else {
      getResults('type', $('#type-select').val(), 0)
    }
  })

  $('#drs-complete').click(function () {
    $('#type-alert').html()
    $('#report-table').html()
    getDRSCompleteness('DRS', 'Yes')
  })

  $('#drs-not-complete').click(function () {
    $('#type-alert').html()
    $('#report-table').html()
    getDRSCompleteness('DRS', 'No')
  })

  $('#review-complete').click(function () {
    $('#type-alert').html()
    $('#report-table').html()
    getDRSCompleteness('Review', 'Yes')
  })

  $('#review-not-complete').click(function () {
    $('#type-alert').html()
    $('#report-table').html()
    getDRSCompleteness('Review', 'No')
  })
}

async function getDRSCompleteness(flag1, flag2) {
  let resultList = await util.getDRSCompleteness()
  var elements = []
  if (flag1 == 'DRS') {
    for (var i = 0; i < resultList.length; i++) {
      if (resultList[i]['DRS_x0020_Completed'] == flag2) {
        elements.push(i)
      }
    }
  } else {
    for (var i = 0; i < resultList.length; i++) {
      if (resultList[i]['Annual_x0020_Review_x0020_Comple'] == flag2) {
        elements.push(i)
      }
    }
  }
  populateTable(resultList, elements)
}

async function getResults(field, val, flag) {
  let resultList = await util.getRecordsByQuery(field, val, flag)

  if (resultList == 'None') {
    $('#report-table').html('</br><div class="alert alert-info" role="alert">No records returned from the que' +
        'ry</div>')
    return
  }
  populateReportTable(resultList)
}

function populateTable(resultList, elements) {
  var tableRows = ''
  for (var i = 0; i < elements.length; i++) {
    var dept = resultList[elements[i]]['Department_x0020_Number']
    var drsComplete = resultList[elements[i]]['DRS_x0020_Completed']
    var reviewComplete = resultList[elements[i]]['Annual_x0020_Review_x0020_Comple']
    tableRows += '<tr><td class="singleLine">' + dept + ' - ' + deptNameLookup[dept] + '</td>'
    tableRows += '<td class="singleLine">' + drsComplete + '</td>'
    tableRows += '<td class="singleLine">' + reviewComplete + '</td></tr>'
  }

  $('#report-table').html('</br>')
  var tempStr = '<table class="table table-striped"><thead><tr><th>Department</th><th>DRS Complet' +
      'e</th>'
  tempStr += '<th>Annual Review Complete</th></tr></thead><tbody>' + tableRows + '</tbody></table></br>'
  $('#report-table').append(tempStr)
  addDownloadButton()
}

function populateReportTable(resultList) {
  var tableRows = ''
  var hasException = false
  var hasUserComments = false
  var hasAdminComments = false
  for (var i = 0; i < resultList.length; i++) {
    if (resultList[i]['Retention_x0020_Exception'] != null) {
      hasException = true
    }
    if (resultList[i]['Message_x0020_To_x0020_Admin'] != null) {
      hasUserComments = true
    }
    if (resultList[i]['Message_x0020_From_x0020_Admin'] != null) {
      hasAdminComments = true
    }
  }

  for (var i = 0; i < resultList.length; i++) {
    var recCatID = resultList[i]['Record_x0020_Category_x0020_ID']
    var tempGenRec
    for (var j = 0; j < genRetention.length; j++) {
      tempGenRec = genRetention[j]
      if (tempGenRec['Record_x0020_Category_x0020_ID'] == recCatID) {
        break
      }
    }
    var dept = resultList[i]['Department_x0020_Number']
    if (dept == null) {
      dept = ''
    }
    var deptName = deptNameLookup[dept]
    if (deptName == null) {
      deptName = ''
    }
    var func = resultList[i]['Function']
    if (func == null) {
      func = ''
    }
    var recType = resultList[i]['Record_x0020_Type']
    if (recType == null) {
      recType = ''
    }
    var recCat = tempGenRec['Record_x0020_Category']
    if (recCat == null) {
      recCat = ''
    }
    if (recCatID == null) {
      recCatID = ''
    }
    var retention = tempGenRec['Retention_x0020_Description']
    if (retention == null) {
      retention = ''
    }
    var exception = resultList[i]['Retention_x0020_Exception']
    if (exception == null) {
      exception = ''
    }
    var adminMsg = resultList[i]['Message_x0020_To_x0020_Admin']
    if (adminMsg == null) {
      adminMsg = ''
    }
    var userMsg = resultList[i]['Message_x0020_From_x0020_Admin']
    if (userMsg == null) {
      userMsg = ''
    }
    var status = resultList[i]['Status']
    if (status == null) {
      status = ''
    }

    tableRows += '<tr><td class="singleLine">' + dept + '</td>'
    tableRows += '<td class="singleLine">' + deptName + '</td>'
    tableRows += '<td id="rtype" class="singleLine">' + recType + '</td>'
    tableRows += '<td class="singleLine">' + func + '</td>'
    tableRows += '<td class="singleLine">' + recCatID + '</td>'
    tableRows += '<td class="singleLine">' + recCat + '</td>'
    tableRows += '<td>' + retention + '</td>'
    tableRows += '<td>' + exception + '</td>'
    tableRows += '<td>' + adminMsg + '</td>'
    tableRows += '<td>' + userMsg + '</td>'
    tableRows += '<td>' + status + '</td></tr>'
  }

  $('#report-table').html('</br>')

  var tempStr = '<div style="overflow-x:scroll" width="1500px"><table class="table table-striped"' +
      ' style="width:100%"><thead><tr><th>Dept #</th><th>Dept Name</th>'
  tempStr += '<th>Record Type</th><th>Function</th><th>Category ID</th><th>Record Category</th' +
      '><th style="width:15%">Retention</th>'
  tempStr += '<th style="width:10%">Exception</th><th style="width:10%">Msg From User</th>'
  tempStr += '<th style="width:10%">Msg To User</th><th>Status</th></tr></thead><tbody>' + tableRows + '</tbody></table></br></div></br>'

  $('#report-table').append(tempStr)
  addDownloadButton()
}

function addDownloadButton() {
  $('#report-table').append('<a id="download-btn" class="btn btn-primary" href="#" role="button" download="">' +
      'Download</a>')
  $('#report-table').append('</br></br>')
  $('#download-btn').click(function () {
    var csv = ''
    var rows = $('#report-table table')[0].rows
    for (var i = 0; i < rows.length; i++) {
      var children = rows[i].children
      for (var j = 0; j < children.length; j++) {
        csv += '"' + children[j].innerText + '",'
      }
      csv += '\n'
    }
    this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(csv)
    var date = new Date()
    var downloadStr = 'values-' + date
      .getTime()
      .toString() + '.csv'
    this.download = downloadStr
  })
}

async function populateApproveTab() {
  itemIDLookup = {}
  let pendingList = await util.getPendingRecords()
  if (pendingList == 'None') {
    return
  }
  var tableRows = ''
  var hasUserComments = false
  var hasAdminComments = false
  var hasException = false
  for (var i = 0; i < pendingList.length; i++) {
    if (pendingList[i]['Message_x0020_From_x0020_Admin'] != null) {
      hasAdminComments = true
    }
    if (pendingList[i]['Message_x0020_To_x0020_Admin'] != null) {
      hasUserComments = true
    }
  }
  hasException = true

  var chkList = []
  var rowNumList = []
  for (var i = 0; i < pendingList.length; i++) {
    var recCatID = pendingList[i]['Record_x0020_Category_x0020_ID']
    var tempGenRec
    for (var j = 0; j < genRetention.length; j++) {
      tempGenRec = genRetention[j]
      if (tempGenRec['Record_x0020_Category_x0020_ID'] == recCatID) {
        break
      }
    }
    var dept = pendingList[i]['Department_x0020_Number']
    var deptName = deptNameLookup[dept]
    var code = pendingList[i]['Code']
    var dept_code = dept + code
    itemIDLookup[dept_code] = pendingList[i]['ID']
    var func = pendingList[i]['Function']
    var recType = pendingList[i]['Record_x0020_Type']
    var recCat = tempGenRec['Record_x0020_Category']
    var retention = tempGenRec['Retention_x0020_Description']
    var exception = pendingList[i]['Retention_x0020_Exception']
    var adminMsg = pendingList[i]['Message_x0020_To_x0020_Admin']
    var userMsg = pendingList[i]['Message_x0020_From_x0020_Admin']

    if (recCatID == null || recCatID == 'common') {
      recCatID = ''
      recCat = ''
    }

    if (func == null) {
      func = ''
    }

    if (exception == null) {
      exception = ''
    }

    if (adminMsg == null) {
      adminMsg = ''
    }

    if (userMsg == null) {
      userMsg = ''
    }

    tableRows += '<tr id="row' + (i + 1) + '"><td class="singleLine">' + dept + '</td>'
    tableRows += '<td class="singleLine">' + deptName + '</td>'
    tableRows += '<td class="singleLine" style="display:none">' + code + '</td>'
    tableRows += '<td id="rtype">' + recType + '</td>'
    tableRows += '<td>' + func + '</td>'
    tableRows += '<td>' + recCatID + '</td>'
    tableRows += '<td>' + recCat + '</td>'
    tableRows += '<td>' + retention + '</td>'
    tableRows += '<td>' + exception + '</td>'
    tableRows += '<td >' + adminMsg + '</td>'
    tableRows += '<td>' + userMsg + '</td>'
    tableRows += '<td><button type="button" class="btn-xs btn-primary viewDetailsButton">View Deta' +
        'ils</button></td>'
    tableRows += '<td style="text-align:center"><input type="checkbox" value="" id="approveChbx' + (i + 1) + '"></td></tr>'
    chkList.push('#approveChbx' + (i + 1))
    rowNumList.push(i + 1)
  }

  $(document)
    .on('change', '[type=checkbox]', function (chkbx) {
      var isEnabled = false
      for (var i = 0; i < chkList.length; i++) {
        if ($(chkList[i]).is(':checked')) {
          isEnabled = true
          break
        }
      }
      if (isEnabled) {
        $('#approveButton').prop('disabled', false)
      } else {
        $('#approveButton').prop('disabled', true)
      }
    })

  var tempStr = '</br><div style="overflow-x:scroll; width:120em" ><table class="table table-stri' +
      'ped" id="pendingTable" style="width:100%"><thead><tr><th>Dept #</th><th>Dept Nam' +
      'e</th>'
  tempStr += '<th style="display:none">Code</th><th style="width:20em">Record Type</th><th>Fun' +
      'ction</th><th>Category ID</th><th>Record Category</th><th style="width:20em">Ret' +
      'ention</th>'
  tempStr += '<th style="10em">Exception</th><th style="width:15em">Msg From User</th>'
  tempStr += '<th style="width:15em">Msg To User</th><th></th><th>Approve</th></tr></thead><tb' +
      'ody>' + tableRows + '</tbody></table></br></div>'

  $('#approve-tab').html(tempStr)

  $('#approve-tab').append('<div id="approve-alert"></div>')
  $('#approve-tab').append('</br><button type="button" class="btn btn-primary" id="approveButton" disabled>A' +
      'pprove</button>')
  $('#approve-tab').append('<div id="myModal" class="modal fade" role="dialog"> \
                          ' +
      '    <div class="modal-dialog"> \
                                <div class="mod' +
      'al-content"> \
                                  <div class="modal-header"> \
  ' +
      '                                  <h4 class="modal-title">View Details</h4> \
  ' +
      '                                </div> \
                                  <div ' +
      'class="modal-body"> \
                                    <form id="modform" cla' +
      'ss="form-horizontal"> \
                                      <div class="form-g' +
      'roup"> \
                                        <label class="control-label col' +
      '-sm-3" for="r-dept">Dept: </label> \
                                        <di' +
      'v class="col-sm-7"> \
                                          <input type="tex' +
      't" class="form-control" id="r-dept"> \
                                        <' +
      '/div> \
                                      </div> \
                         ' +
      '             <div class="form-group" style="display:none"> \
                   ' +
      '                     <label class="control-label col-sm-3" for="r-code">Code: </' +
      'label> \
                                        <div class="col-sm-7"> \
      ' +
      '                                    <input type="text" class="form-control" id="' +
      'r-code" disabled> \
                                        </div> \
           ' +
      '                           </div> \
                                      <div c' +
      'lass="form-group"> \
                                        <label class="contr' +
      'ol-label col-sm-3" for="r-type">Record Type: </label> \
                        ' +
      '                <div class="col-sm-7"> \
                                       ' +
      '   <input type="text" class="form-control" id="r-type"> \
                      ' +
      '                  </div> \
                                      </div> \
      ' +
      '                                <div class="form-group"> \
                     ' +
      '                   <label class="control-label col-sm-3" for="r-func">Function: ' +
      '</label> \
                                        <div class="col-sm-7"> \
    ' +
      '                                      <select class="form-control" id="r-func"><' +
      '/select> \
                                        </div> \
                    ' +
      '                  </div> \
                                      <div class="for' +
      'm-group"> \
                                        <label class="control-label ' +
      'col-sm-3" for="r-cat">Record Category: </label> \
                              ' +
      '          <div class="col-sm-7"> \
                                          <se' +
      'lect class="form-control" id="r-cat" disabled></select> \
                      ' +
      '                  </div> \
                                      </div> \
      ' +
      '                                <div class="form-group"> \
                     ' +
      '                   <label class="control-label col-sm-3" for="r-ret">Retention: ' +
      '</label> \
                                        <div class="col-sm-7"> \
    ' +
      '                                      <textarea style="resize:none" class="form-' +
      'control" id="r-ret" disabled></textarea> \
                                     ' +
      '   </div> \
                                      </div> \
                     ' +
      '                 <div class="form-group"> \
                                    ' +
      '    <label class="control-label col-sm-3" for="r-exc">Exception: </label> \
    ' +
      '                                    <div class="col-sm-7"> \
                   ' +
      '                       <textarea style="resize:none" class="form-control" id="r-' +
      'exc"></textarea> \
                                        </div> \
            ' +
      '                          </div> \
                                      <div cl' +
      'ass="form-group"> \
                                        <label class="contro' +
      'l-label col-sm-3" for="user-cmts">Msg From User: </label> \
                    ' +
      '                    <div class="col-sm-7"> \
                                   ' +
      '       <textarea style="resize:none" class="form-control" id="user-cmts" disable' +
      'd></textarea> \
                                        </div> \
               ' +
      '                       </div> \
                                      <div class' +
      '="form-group"> \
                                        <label class="control-l' +
      'abel col-sm-3" for="admin-cmts">Msg To User: </label> \
                        ' +
      '                <div class="col-sm-7"> \
                                       ' +
      '   <textarea style="resize:none" class="form-control" id="admin-cmts"></textarea' +
      '> \
                                        </div> \
                           ' +
      '           </div> \
                                    </form> \
              ' +
      '                    </div> \
                                  <div class="modal' +
      '-footer"> \
                                    <button type="button" class="btn' +
      ' btn-default" id="saveRecord">Save</button> \
                                  ' +
      '  <button type="button" class="btn btn-default" data-dismiss="modal">Close</butt' +
      'on> \
                                  </div> \
                               ' +
      ' </div> \
                              </div> \
                            </d' +
      'iv>');
  $('#r-cat').on('change', function () {

    var newCatID = $(this)
      .val()
      .substring(0, 5)
    var tempRecord
    for (var i = 0; i < genRetention.length; i++) {
      tempRecord = genRetention[i]
      if (newCatID == tempRecord['Record_x0020_Category_x0020_ID']) {
        break
      }
    }
    $('#r-func').val(tempRecord['Function'])
    $('#r-ret').val(tempRecord['Retention_x0020_Description'])
  })

  $('.viewDetailsButton').on('click', function () {
    var tempRowDataArg = $(this)
      .parent()
      .parent()[0]
      .cells;
    var tempRowData = getRowData.getRowData(tempRowDataArg);

    $('#r-func').prop('disabled', true);
    $('#r-cat').prop('disabled', true);
    $('#r-type').prop('disabled', false);
    $('#r-ret').prop('disabled', true);
    $('#r-exc').prop('disabled', false);
    $('#user-cmts').prop('disabled', false);
    $('#admi-cmts').prop('disabled', false);
    console.log($('#modform')[0][1].value)

    $('#ret-table-alert').empty()

    $('#myModal').modal('show');
    row = $(this).closest('tr')
    var categoryList = []
    for (var i = 0; i < genRetention.length; i++) {
      categoryList.push(genRetention[i]['Record_x0020_Category_x0020_ID'] + ' - ' + genRetention[i]['Record_x0020_Category'])
    }
    categoryList.sort();

    var temp_id = $(this)
      .closest('tr')
      .children()[5]
      .innerHTML
    var temp_func = $(this)
      .closest('tr')
      .children()[4]
      .innerHTML
    var funcOptions = ''
    funcOptions += '<option>Select a function</option>'
    var funcList = Object.keys(newFunctionLookup);
    funcList.sort();
    for (var i = 0; i < funcList.length; i++) {
      if (temp_func == funcList[i]) {
        funcOptions += '<option selected="selected">'
      } else {
        funcOptions += '<option>'
      }
      funcOptions += funcList[i]
      funcOptions += '</option>'
    }
    $('#r-func').append(funcOptions);
    if ($('#r-func').val() != 'Select a function' && $('#r-func').val() != '' && $('#r-func').val() != null) {

      var catOptions = '<option>Select a category</option>';
      for (var i = 0; i < newFunctionLookup[temp_func].length; i++) {
        if (newFunctionLookup[temp_func][i].substring(0, 5) == temp_id) {
          catOptions += '<options selected="selected">'
        } else {
          catOptions += '<option>'
        }
        catOptions += newFunctionLookup[temp_func][i]
        catOptions += '</option>'
      }
      $('#r-cat').empty()
      $('#r-cat').append(catOptions);
    }

    var options = ''
    for (var i = 0; i < categoryList.length; i++) {
      if (temp_id == categoryList[i].substring(0, 5)) {
        options += '<option selected="selected">'
      } else {
        options += '<option>'
      }
      options += categoryList[i]
      options += '</option>'
    }
    $('#r-cat').append(options)
    $('#r-dept').val($(this).closest('tr').children()[0].innerHTML)
    $('#r-code').val($(this).closest('tr').children()[2].innerHTML)
    $('#r-type').val($(this).closest('tr').children()[3].innerHTML)
    $('#r-ret').val($(this).closest('tr').children()[7].innerHTML)

    var temp_record
    for (var i = 0; i < recordsList.length; i++) {
      temp_record = recordsList[i]
      if (temp_record['Department_x0020_Number'] == $('#r-dept').val() && temp_record['Code'] == $('#r-code').val()) {
        break
      }

    }
    $('#r-exc').val(temp_record['Retention_x0020_Exception'])
    $('#user-cmts').val(temp_record['Message_x0020_To_x0020_Admin'])
    $('#admin-cmts').val(temp_record['Message_x0020_From_x0020_Admin'])
    initialCmt = $('#admin-cmts').val()
    console.trace("trace 1");
    if ($('#r-code').val()[0] === 'U') {

      $('#r-func').prop('disabled', false);
      $('#r-cat').prop('disabled', false);
      $('#r-type').prop('disabled', false);
    }
  });
  $('#r-func').change(function () {
    if ($('#r-func').val() == '') {
      $('#r-cat').empty()
      $('#r-cat').prop('disabled', true)
      $('#r-cat').val('')
      return
    }
    $('#r-cat').prop('disabled', false)
    var catOptions = '<option selected="selected" disabled>Select a category</option><option></option>'
    for (var i = 0; i < newFunctionLookup[$('#r-func').val()].length; i++) {
      catOptions += '<option>'
      catOptions += newFunctionLookup[$('#r-func').val()][i]
      catOptions += '</option>'
    }
    $('#r-cat').empty()
    $('#r-cat').append(catOptions)
  })
  $('#saveRecord').on('click', function () {
    dept_code = row.children()[0].innerHTML + row.children()[2].innerHTML
    var itemID = itemIDLookup[dept_code]
    var newDept = $('#r-dept').val()
    var newFunc = $('#r-func').val()
    var newType = $('#r-type').val()
    var newCatID = $('#r-cat')
      .val()
      .substring(0, 5)
    var newCat = $('#r-cat')
      .val()
      .substring(8)
    var newRet = $('#r-ret').val()
    var newExc = $('#r-exc').val()
    var newAdminCmts = $('#admin-cmts').val()

    var flag
    if (newAdminCmts == initialCmt) {
      flag = 'No'
    } else {
      flag = 'Yes'
    }

    if (row.children()[0].innerHTML != newDept) {
      var new_dept_code = newDept + $('#r-code').val()
      delete itemIDLookup[dept_code]
      itemIDLookup[new_dept_code] = itemID
    }
    update(row, itemID, newDept, newFunc, newType, newCatID, newCat, newRet, newExc, newAdminCmts, flag)
    $('#myModal').modal('hide');

    $('#approve-alert').html('</br><div class="alert alert-info" role="alert">Processing...</div>')

  })
  $('#approveButton').click(function () {
    var rowList = []
    var ids = []
    $('input:checkbox').each(function () {
      if ($(this).is(':checked')) {
        var row = $(this).closest('tr')
        rowList.push(row)
        var dept_code = row.children()[0].innerHTML + row.children()[2].innerHTML
        var itemID = itemIDLookup[dept_code]
        ids.push(itemID)
      }
    })
    approveRecords(rowList, ids)
    $('#approve-alert').html('</br><div class="alert alert-info" role="alert">Processing...</div>')
  })
}

async function populateAddRecordTab() {
  $('#add-record-tab').html('')
  $('#add-record-tab').append('<div id="add-fields"></div>')
  $('#add-record-tab').append('<div id="add-alert"></div>')
  $('#add-record-tab').append('<div id="add-buttons"></div>')

  let result = await getSizes()
  var sizeLookup = {}
  for (var i = 0; i < result.length; i++) {
    sizeLookup[result[i]['Department_x0020_Number']] = [
      parseInt(result[i]['Unique_x0020_Code']),
      result[i]['ID']
    ]
  }

  var options = ''
  options += '<option disabled selected>Select a function</option>'
  var funcList = Object.keys(newFunctionLookup)
  funcList.sort()
  for (var i = 0; i < funcList.length; i++) {
    options += '<option>' + funcList[i] + '</option>'
  }
  var repoOptions = ''
  repoOptions += '<option disabled selected>Select a repository</option>'
  for (var i = 0; i < repos.length; i++) {
    repoOptions += '<option>' + repos[i]['Repository'] + '</option>'
  }
  var deptOptions = ''
  deptOptions += '<option disabled selected>Select a department</option>'
  for (var i = 0; i < depts.length; i++) {
    deptOptions += '<option>' + depts[i]['Department_x0020_Number'] + '</option>'
  }

  $('#add-fields').append('</br></br><form class="form-horizontal"> \
                                <div ' +
      'class="form-group"> \
                                  <label class="control-la' +
      'bel col-sm-2" for="rec-dept">Department: <span id="red-ast">*</span></label> \
 ' +
      '                                 <div class="col-sm-8"> \
                      ' +
      '              <select class="form-control" id="rec-dept"> \
                    ' +
      '                ' + deptOptions + ' \
                                    </select> \
                             ' +
      '     </div> \
                                </div> \
                         ' +
      '       <div class="form-group"> \
                                  <label class' +
      '="control-label col-sm-2" for="rec-type">Record Type: <span id="red-ast">*</span' +
      '></label> \
                                  <div class="col-sm-8"> \
         ' +
      '                           <input type="text" class="form-control" id="rec-type"' +
      ' placeholder="Enter record type"> \
                                  </div> \
 ' +
      '                               </div> \
                                <div cla' +
      'ss="form-group"> \
                                  <label class="control-label' +
      ' col-sm-2" for="rec-func">Function: <span id="red-ast">*</span></label> \
      ' +
      '                            <div class="col-sm-8"> \
                           ' +
      '         <select class="form-control" id="rec-func"> \
                         ' +
      '           ' + options + ' \
                                    </select> \
                             ' +
      '     </div> \
                                </div> \
                         ' +
      '       <div class="form-group"> \
                                  <label class' +
      '="control-label col-sm-2" for="rec-cat">Category: <span id="red-ast">*</span></l' +
      'abel> \
                                  <div class="col-sm-8"> \
             ' +
      '                       <select class="form-control" id="rec-cat" disabled> \
   ' +
      '                                 </select> \
                                  <' +
      '/div> \
                                </div> \
                               ' +
      ' <div class="form-group"> \
                                  <label class="cont' +
      'rol-label col-sm-2" for="retention">Retention:</label> \
                       ' +
      '           <div class="col-sm-8"> \
                                    <textare' +
      'a class="form-control" id="retention" rows="2" style="resize:none" disabled></te' +
      'xtarea> \
                                  </div> \
                           ' +
      '     </div> \
                                <div class="form-group"> \
       ' +
      '                           <label class="control-label col-sm-2" for="msgToUser"' +
      '>Message to User:</label> \
                                  <div class="col-sm' +
      '-8"> \
                                    <textarea class="form-control" id="ms' +
      'gToUser" rows="3" style="resize:none" placeholder="Type your message"></textarea' +
      '> \
                                  </div> \
                                <' +
      '/div> \
                                <div class="form-group"> \
             ' +
      '                     <label class="control-label col-sm-2" for="commentsPlan">Co' +
      'mments / Plan:</label> \
                                  <div class="col-sm-8"' +
      '> \
                                    <textarea class="form-control" id="comme' +
      'ntsPlan" rows="3" style="resize:none" placeholder="Type your comment"></textarea' +
      '> \
                                  </div> \
                                <' +
      '/div> \
                                <div class="form-group"> \
             ' +
      '                     <label class="control-label col-sm-2" for="rec-repo">Reposi' +
      'tory: <span id="red-ast">*</span></label> \
                                  <d' +
      'iv class="col-sm-8"> \
                                    <select class="form-c' +
      'ontrol" id="rec-repo"> \
                                    ' + repoOptions + ' \
                                    </select> \
                             ' +
      '     </div> \
                                </div> \
                         ' +
      '       <div class="form-group"> \
                                  <div style="' +
      'padding-left: 15em"> \
                                    <label><input type="c' +
      'heckbox" value="" id="archival-chkbx"> Archival</label> \
                      ' +
      '            </div> \
                                </div> \
                  ' +
      '              <div class="form-group"> \
                                  <div ' +
      'style="padding-left: 15em"> \
                                    <label><input ' +
      'type="checkbox" value="" id="vital-chkbx"> Vital</label> \
                     ' +
      '             </div> \
                                </div> \
                 ' +
      '               <div class="form-group"> \
                                  <div' +
      ' style="padding-left: 15em"> \
                                    <label><input' +
      ' type="checkbox" value="" id="confidential-chkbx"> Highly Confidential</label> ' +
      '\
                                  </div> \
                                </d' +
      'iv> \
                                <div class="form-group"> \
               ' +
      '                   <div style="padding-left: 8em"><span display="inline-block" i' +
      'd="red-ast">*</span> means required field</div> \
                              ' +
      '  </div> \
                              </form>')

  $('#add-buttons').append('<div align="center"><button type="button" class="btn btn-primary" id="add-submit' +
      '">Submit</button></br></br></br></div>')

  $('#rec-func').change(function () {
    $('#retention').val('')
    $('#rec-cat').empty()
    if ($('#rec-func').val() == '') {
      $('#rec-cat').val('')
      $('#rec-cat').prop('disabled', true)
      return
    } else {
      var catOptions = '<option disabled selected="selected">Select a category</option>'
      for (var i = 0; i < newFunctionLookup[$('#rec-func').val()].length; i++) {
        catOptions += '<option>'
        catOptions += newFunctionLookup[$('#rec-func').val()][i]
        catOptions += '</option>'
      }
      $('#rec-cat').append(catOptions)
      $('#rec-cat').prop('disabled', false)
    }
  })

  $('#rec-cat').change(function () {
    var category = $('#rec-cat')
      .val()
      .substring(8)
    $('#retention').val(retentionLookup[category])
  })

  $('#add-submit').click(function () {
    $('#add-alert').empty()
    if ($('#rec-dept option:selected').val() == 'Select a department' || $('#rec-type').val() == '' || $('#rec-func option:selected').val() == 'Select a function' || $('#rec-cat option:selected').val() == 'Select a category' || $('#rec-repo option:selected').val() == 'Select a repository') {
      $('#add-alert').html('</br><div class="alert alert-warning" role="alert">Department, Record Type, Func' +
          'tion, Record Category, and Repository cannot be left blank.</div>')
      setTimeout(function () {
        $('#add-alert').empty()
      }, 4000)
      return
    }
    var dept = $('#rec-dept option:selected').val()
    var size
    var id
    if (dept in sizeLookup) {
      size = sizeLookup[dept][0]
      id = sizeLookup[dept][1]
    } else {
      size = id = -1
    }

    var code = 'U' + size

    var recType = $('#rec-type').val()
    var recFunc = $('#rec-func option:selected').val()
    var recCat = $('#rec-cat option:selected')
      .val()
      .substring(0, 5)

    var userMsg = $('#msgToUser').val()
    var commentsPlan = $('#commentsPlan').val()

    var archival = 'No'
    var vital = 'No'
    var highlyConfidential = 'No'
    if ($('#archival-chkbx').is(':checked')) {
      archival = 'Yes'
    }
    if ($('#vital-chkbx').is(':checked')) {
      vital = 'Yes'
    }
    if ($('#confidential-chkbx').is(':checked')) {
      highlyConfidential = 'Yes'
    }

    var recRepo = $('#rec-repo option:selected').val()

    $('#add-alert').html('</br><div class="alert alert-info" role="alert">Processing...</div>')

    addRecord(dept, code, recType, recFunc, recCat, userMsg, commentsPlan, archival, vital, highlyConfidential, recRepo)

    size++;
    if (id == -1) {
      addSize(dept, size.toString())
    } else {
      updateSize(id, size.toString())
    }
  })
}

async function approveRecords(rows, ids) {
  await util.approveRecords(rows, ids)
}

async function update(row, itemID, newDept, newFunc, newType, newCatID, newCat, newRet, newExc, newAdminCmts, flag) {
  await util.updatePendingRecord(row, itemID, newDept, newFunc, newType, newCatID, newCat, newRet, newExc, newAdminCmts, flag)
}

async function getRepos() {
  return await util.getRepos()
}

async function getDepts() {
  return await util.getDepts()
}

async function getSizes() {
  return await util.getSizes()
}

async function addRecord(dept, code, recType, recFunc, recCat, userMsg, commentsPlan, archival, vital, highlyConfidential, recRepo) {
  await util.addRecord(dept, code, recType, recFunc, recCat, userMsg, commentsPlan, archival, vital, highlyConfidential, recRepo)
}

async function addSize(dept, size) {
  await util.addSize(dept, size)
}

async function updateSize(itemID, size) {
  await util.updateSize(itemID, size)
}