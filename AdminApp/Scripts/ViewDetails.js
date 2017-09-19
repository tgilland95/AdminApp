 $('.viewDetailsButton').on('click', function () {
    //this is to prevent state issues when getting the data
    var thisRow = $(this).parent().parent()[0].cells;
    //this function returns an object with all of the record data
     function setTempRowData(){
		tempRowData = CurrentRow.getRowData(thisRow); 
	  } 
    //log the returned object
    console.table(tempRowData);
    $('#r-func').prop('disabled', true);
    $('#r-cat').prop('disabled', true);
    $('#r-type').prop('disabled', false);
    $('#r-ret').prop('disabled', true);
    $('#r-exc').prop('disabled', false);
    $('#user-cmts').prop('disabled', false);
    $('#admi-cmts').prop('disabled', false);

    $('#ret-table-alert').empty()
	 $('#myModal').modal('show');
	 
	 
	 
    row = $(this).closest('tr')
    var categoryList = []
    for (var i = 0; i < genRetention.length; i++) {
      categoryList.push(genRetention[i]['Record_x0020_Category_x0020_ID'] + ' - ' + genRetention[i]['Record_x0020_Category'])
    }
    categoryList.sort();

    var funcOptions = ''
    funcOptions += '<option>Select a function</option>'
    var funcList = Object.keys(newFunctionLookup);
    funcList.sort();
    for (var i = 0; i < funcList.length; i++) {
      if (tempRowData.function == funcList[i]) {
        funcOptions += '<option selected="selected">'
      } else {
        funcOptions += '<option>'
      }
      funcOptions += funcList[i]
      funcOptions += '</option>'
    }
    $('#r-func').empty();
    $('#r-func').val('');
    $('#r-func').append(funcOptions);
    var options = ''
    for (var i = 0; i < categoryList.length; i++) {
      if (tempRowData.code == categoryList[i].substring(0, 5)) {
        options += '<option selected="selected">'
      } else {
        options += '<option>'
      }
      options += categoryList[i]
      options += '</option>'
    }
    $('#r-cat').val(tempRowData.recordCategory)
    $('#r-dept').val(tempRowData.depNumber)
    $('#r-code').val(tempRowData.code)
    $('#r-type').val(tempRowData.recordType)
    $('#r-ret').val(tempRowData.retentionSchedule)

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
    if ($('#r-code').val()[0] === 'U') {

      $('#r-func').prop('disabled', false);
      $('#r-cat').prop('disabled', true);
      $('#r-type').prop('disabled', false);
    }
  });