export function getRowData(src) {
   var i = 0;
   var d = [];

   while (i < 8) {
      d.push(src[i].innerHTML)
      i++
   }
   return d = {
      'depNumber': d[0],
      'depName': d[1],
      'code': d[2],
      'recordType': d[3],
      'function': d[4],
      'retentionCategory': d[5] + ' - ' + d[6],
      'retentionSchedule': d[7]
   }
}