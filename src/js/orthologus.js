//@author: Rupali Mahadik
// @description: UO1 Version-1.1.
//31st july



/**

 * Adding function to String prototype to shortcut string to a desire length.

 * @param {int} n - The length of the string
 * @returns {int} -Short String
 */

String.prototype.trunc = String.prototype.trunc ||
    function (n) {
        return (this.length > n) ? this.substr(0, n - 1) + '&hellip;' : this;
    };
var id = '';
var page = 1;
var sort = 'uniprot_canonical_ac';
var dir = $('.dir-select').val();
var url = getWsUrl('list_glycangene') + "?action=get_user";
var limit = 10;




/**

 * Format function to create link to the details page

 * @param {object} value - The data binded to that particular cell.
 @return -Details particular Glycan Id
 */
function pageFormat(value, row, index, field) {
    return "<a href='protein_detail.html?uniprot_canonical_ac=" + value + "'>" + value + "</a>";
}

function pageFormat1(value, row, index, field) {
    return "<a href='" + row.gene_link + " ' target='_blank'>" + value + "</a>"
}





/**

 * Format function of the detail table when opening each row [+]

 * @param {int} index - The row clicked

 * @param {object} row - The data object binded to the row
 * @return- detail view with IUPAC AND GLYCOCT
 */


function detailFormat(index, row) {
    var html = [];
    var html = [];
    var evidences = row.evidence;
    for (var i = 0; i < evidences.length; i++) {
        var evidence = evidences[i];
        html.push("<div class='row'>");
        html.push("<ul><li>" + evidence.database + ":<a href=' " + evidence.url + " ' target='_blank'>" + evidence.id + "</a></li></ul>");
        html.push("</div>");
    }
    return html.join('');
}



function editSearch() {
    {
        window.location.replace("glycan_search.html?id=" + id);
        activityTracker("user", id, "edit search");
    }
}


function totalNoSearch(total_length) {
    $('.searchresult').html( "\""  + total_length + " Proteins were found\"");
    // $('.searchresult').html( "&#34;"  + total_length + " results of glycan&#34;");

}


/**
 * Handling a succesful call to the server for list page
 * @param {Object} data - the data set returned from the server on success
 * @param {Array} data.results - Array of individual results
 * @param {Object} data.pagination - the dataset for pagination info
 * @param {Object} data.query - the dataset for query
 */


function ajaxListSuccess(data) {
    // console.log(data);
    //console.log(data.code);
    if (data.code) {
        console.log(data.code);
        displayErrorByCode(data.code);
        activityTracker("error", id, "error code: " + data.code +" (page: "+ page+", sort:"+ sort+", dir: "+ dir+", limit: "+ limit +")");
    } else {


        var $table = $('#gen-table');
        var items = [];
        if (data.results) {
            for (var i = 0; i < data.results.length; i++) {
                var glycan = data.results[i];
                items.push({
                    uniprot_canonical_ac: glycan.uniprot_canonical_ac,
                    gene_link: glycan.gene_link,
                    gene_name: glycan.gene_name,
                    protein_name: glycan.protein_name,
                    organism: glycan.organism,
                    evidence: glycan.evidence,
                    // start_pos: glycan.start_pos,
                    // end_pos: glycan.end_pos,
                    tax_id: glycan.tax_id
                });
            }
        }

        $table.bootstrapTable('removeAll');
        $table.bootstrapTable('append', items);

        buildPages(data.pagination);

        // buildSummary(data.query);



        activityTracker("user", id, "successful response (page: "+ page+", sort:"+ sort+", dir: "+ dir+", limit: "+ limit +")");
    }

}

/// ajaxFailure is the callback function when ajax to GWU service fails
function ajaxListFailure() {
//  $('#error-message').show();
    displayErrorByCode('server_down');
    activityTracker("error", id, "server down (page: "+ page+", sort:"+ sort+", dir: "+ dir+", limit: "+ limit +")");
}

/**

 * LoadDataList function to configure and start the request to GWU  service

 * @param {string} id - The glycan id to load
 * */
function LoadDataList() {

    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("list_glycangene"),
        data: getListPostData(id, page, sort, dir, limit),
        method: 'POST',
        success: ajaxListSuccess,
        error: ajaxListFailure
    };


    // make the server call
    $.ajax(ajaxConfig);
}

/**

 * getParameterByName function to EXtract query parametes from url

 * @param {string} name - The name of the variable variable to extract from query string

 * @param {string} url- The complete url with query string values
 * @return- A new string representing the decoded version of the given encoded Uniform Resource Identifier (URI) component.
 */


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var id = getParameterByName('id');
LoadDataList(id);


/**
 * hides the loading gif and displays the page after the results are loaded.
 * @author Gaurav Agarwal
 * @date July 25, 2018
 */
$(document).ajaxStop(function () {
    $('#loading_image').fadeOut();
});

