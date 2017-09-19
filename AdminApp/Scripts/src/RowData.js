export function getRowData(src) {
   var i = 0;
   var d = [];

   while (i < 13) {
      d.push(src[i].innerHTML)
      i++
   }
   return d = {
      'depNumber': d[0],
      'depName': d[1],
      'code': d[2],
      'recordType': d[3],
      'function': d[4],
      'recordCategory': d[5] + ' - ' + d[6],
      'retentionSchedule': d[7],
      'exception' : d[8],
      'messageFromUser': d[9],
      'messageToUser': d[10]
   }
}

export function getNewRowData(src) {
   var i = 0;
   var d = [];
   let modifiedForm = $('#modform')[0];
   while (i < 9) {
      d.push(src[i].innerHTML)
      i++
   }
   
   return d = {
      'depNumber':modifiedForm[0].value ,
      'code': modifedForm[1].value,
      'recordType': modifiedForm[2],
      'function': modifiedForm[3],
      'recordCategory': modifiedForm[4].value,
      'retentionSchedule': modifedForm[5].value,
      'exception' : modifiedForm[6].value,      
      'messageFromUser' : modifiedForm[7].value,
      'messageToUser' : modifiedForm[8].value
   }
}