import * as dao from "./DataAccess.js"

export function getQueryStringParameter(paramToRetrieve) {
  var params = document
    .URL
    .split("?")[1]
    .split("&")
  var strParams = ""
  for (var i = 0; i < params.length; i = i + 1) {
    var singleParam = params[i].split("=")
    if (singleParam[0] == paramToRetrieve) 
      return singleParam[1]
  }
}

export async function getUserName() {
  // gets user object from DataAccess function
  let user = await dao.getCurrentUser()
  // parses the username and returns it
  return user.d.Title
}

export async function getDeptInfo() {
  let deptInfo = await dao.getDeptInfo()
  return deptInfo.d.results
}

export async function getDepartments(userName) {
  // gets department object from DataAccess function
  let deptObject = await dao.getUserDepartments(userName)
  var results = deptObject.d.results
  // the user isn't assigned to any departments
  if (results.length == 0) {
    return "None"
  }
  // goes through result list and parses all depts, then adds them to userDepts
  // array allows for multiple entries of the same person
  var userDepts = []
  for (var i = 0; i < results.length; i++) {
    var deptString = results[i]["Department_x0020_Number"]
    // removes whitespace from string
    deptString = deptString.replace(/\s/g, "")
    // adds department to array
    userDepts.push(deptString)
  }
  // converts to list of integers, sorts numbers, converts to list of strings
  userDepts = userDepts.map(x => parseInt(x, 10))
  userDepts = userDepts.sort((a, b) => a - b)
  userDepts = userDepts.map(x => x.toString())
  return userDepts
}

export async function getGeneralRetention() {
  let genRetentionObj = await dao.getGeneralRetention()
  var genRetention = genRetentionObj.d.results
  if (genRetention.length == 0) {
    return "None"
  }
  return genRetention
}

export async function isValidUser() {
  let userName = await getUserName()
  let depts = await getDepartments(userName)
  if (depts == "None") {
    return false
  } else {
    return true
  }
}

export async function getPendingRecords() {
  let pendingRecordsObj = await dao.getPendingRecords()
  var pendingRecords = pendingRecordsObj.d.results
  if (pendingRecords.length == 0) {
    return "None"
  }
  return pendingRecords
}

export async function getRecordsByQuery(field, val, flag) {
  if (field == "dept") {
    let resultListObj = await dao.getRecordsByDept(val)
    var resultList = resultListObj.d.results
    if (resultList.length == 0) {
      return "None"
    }
    return resultList
  } else if (field == "cat") {
    let resultListObj = await dao.getRecordsByCat(val)
    var resultList = resultListObj.d.results
    if (resultList.length == 0) {
      return "None"
    }
    return resultList
  } else if (field == "type") {
    let resultListObj = await dao.getRecordsByType(val, flag)
    var resultList = resultListObj.d.results
    if (resultList.length == 0) {
      return "None"
    }
    return resultList
  }
}

export async function getRecordsByDept(dept) {
  let deptRecords = await dao.getDeptRecords(dept)
  var recordsList = deptRecords.d.results
  if (recordsList.length == 0) {
    return "None"
  }
  return recordsList
}

export async function getCommonRecords() {
  var commonRecords = await dao.getCommonRecords()
  var recordsList = commonRecords.d.results
  if (recordsList.length == 0) {
    return "None"
  }
  return recordsList
}

export async function approveRecords(rows, ids) {
  await dao.approveRecords(rows, ids)
}

export async function updatePendingRecord(row, itemID, newDept, newFunc, newType, newCatID, newCat, newRet, newExc, newAdminCmts, flag,) {
  await dao.updatePendingRecord(row, itemID, newDept, newFunc, newType, newCatID, newCat, newRet, newExc, newAdminCmts, flag,)
}

export async function updateComment(itemID, comment, row) {
  await dao.updateComment(itemID, comment, row)
}

export async function updateRecord(itemID, code, func, type, id, cat, ret, cmts, row) {
  await dao.updateRecord(itemID, code, func, type, id, cat, ret, cmts, row)
}

export async function getDRSCompleteness() {
  let resultListObj = await dao.getDRSCompleteness()
  var resultList = resultListObj.d.results
  if (resultList.length == 0) {
    return "None"
  }
  return resultList
}

export async function deleteRecord(itemID, row) {
  await dao.deleteRecord(itemID, row)
}

export async function addCommonRecord(i, dept, code, func, type, catID) {
  let result = await dao.addCommonRecord(i, dept, code, func, type, catID)
  return result
}

export async function deleteCommonRecord(itemID) {
  await dao.deleteCommonRecord(itemID)
}

export async function getRepos() {
  let result = await dao.getRepos()
  return result.d.results
}

export async function getDepts() {
  let result = await dao.getDepts()
  return result.d.results
}

export async function getSizes() {
  let result = await dao.getSizes()
  return result.d.results
}

export async function updateSize(itemID, size) {
  await dao.updateSize(itemID, size)
}

export async function addSize(dept, size) {
  await dao.addSize(dept, size)
}

export async function addRecord(dept, code, recType, recFunc, recCat, userMsg, commentsPlan, archival, vital, highlyConfidential, recRepo,) {
  await dao.addRecord(dept, code, recType, recFunc, recCat, userMsg, commentsPlan, archival, vital, highlyConfidential, recRepo,)
}
