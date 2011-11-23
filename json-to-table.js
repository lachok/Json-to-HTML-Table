/**
 * JavaScript format string function
 * 
 */

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : '{' + number + '}'
    ;
  });
};

/**
 * Check if an object is an array
 * 
 * @param input object to test
 *
 * @return boolean true or false
 */
function isArray(input){
    return typeof(input)=='object'&&(input instanceof Array);
}

/**
 * Convert json to html table
 * 
 * @author Lacho Kozhuharov github.com/lachok, based on work by Afshin Mehrabani <afshin dot meh at gmail dot com>
 * 
 * @param jsonData string Json data
 * @param keys array Keys for table header
 * @param containerId string Table id 
 * @param tableClassName string Table css class name
 * 
 * @return string Converted json to html table
 */
function ConvertJsonToTable(jsonData, keys, containerId, tableClassName) {
    //Patterns for table thead & tbody
    var tbl = "<table border='1' cellpadding='1' cellspacing='1' id='" + containerId + "' class='" + tableClassName + "'>{0}{1}</table>";
    var th = "<thead>{0}</thead>";
    var tb = "<tbody>{0}</tbody>";
    var tr = '<tr class="{0}">{1}</tr>';
    var thRow = "<th>{0}</th>";
    var tdRow = '<td>{0}</td>';
    var thCon = "";
    var tbCon = "";
    var trCon = "";

    function getRowClass(isOdd) {
        return isOdd ? 'odd' : 'even';
    }

    if (keys && jsonData) {

        //Creating all table headers
        if(isArray(keys)) {
            for (i = 0; i < keys.length; i++) {
                thCon += thRow.format(keys[i]);
            }
        } else {
            for(var key in keys) {
                if(keys.hasOwnProperty(key)) {
                    if(keys[key].hasOwnProperty('name')) {
                        thCon += thRow.format(keys[key].name);
                    } else {
                        thCon += thRow.format(keys[key]);
                    }
                }
            }
        }

        th = th.format(tr.format('header', thCon));

        //Creating all table rows from Json data
        if (typeof(jsonData[0]) == "object") {
            var isOdd = false;
            for (i = 0; i < jsonData.length; i++) {
                if(isArray(keys)) {
                    for (j = 0; j < keys.length; j++) {
                        tbCon += tdRow.format(jsonData[i][keys[j]]);
                    }
                } else {
                    for(var key in keys) {
                        if(keys.hasOwnProperty(key)) {
                            if(keys[key].hasOwnProperty('onRender')) {
                                tbCon += tdRow.format(keys[key].onRender(jsonData[i][key]));
                            } else {
                                tbCon += tdRow.format(jsonData[i][key]);
                            }
                        }
                    }
                }
                trCon += tr.format(getRowClass(isOdd), tbCon);
                tbCon = "";
                isOdd = !isOdd;
            }
        }
        tb = tb.format(trCon);

        tbl = tbl.format(th, tb);
        return tbl;
    }

    return null;
}