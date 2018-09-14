//@author: Rupali Mahadik
/**
// @update on July 25 2018 - Gaurav Agarwal - added code for loading gif.
// @update: July 27, 2018 - Gaurav Agarwal - commented out the conditional statements in update search.

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
var sort = 'protein_name_long';
var dir = 'desc'
var url = getWsUrl('protein_list');
var limit = 25;

// /**
//  * Reads a new limit and reloads the data.
//  * @param {domNode} element - The element from which we take the new limit value
//  */
// function xlimit(element) {
//     limit = $(element).val();
//     $('.limit-select').val(limit);
//     LoadDataList();
//     activityTracker("user", id, "page limit: " + limit);
// }
//
// /**
//  * Loads the next page of results
//  */
// function next() {
//     page = page + 1;
//     $(".page-select").val(page);
//     LoadDataList();
//     activityTracker("user", id, "page: " + page);
// }
//
// /**
//  * Loads the Previous page of results
//  */
// function prev() {
//     if (page > 1) {
//         page = page - 1;
//         $(".page-select").val(page);
//         LoadDataList();
//         activityTracker("user", id, "page: " + page);
//     }
// }
//
// /**
//  * Reads a new page and reloads the data.
//  * @param {domNode} element - The element from which we take the new page value
//  */
// function xpage(element) {
//     page = $(element).val();
//     $('.page-select').val(page);
//     LoadDataList();
//     activityTracker("user", id, "page: " + page);
// }
//
// /**
//  * Reads a new sort and reloads the data.
//  * @param {domNode} element - The element from which we take the new sort value
//  */
//
// function xsort(element) {
//     sort = $(element).val();
//     $('.sort-select').val(sort);
//     LoadDataList();
//     activityTracker("user", id, "sort: " + sort);
// }
//
// /**
//  * Reads a new asc/dec dirction for data  and reloads the data.
//  * @param {domNode} element - The element from which we take the new direction value
//  */
//
// function xdir(element) {
//     dir = $(element).val();
//     $('.dir-select').val(dir);
//     LoadDataList();
//     activityTracker("user", id, "sort direction: " + dir);
// }
//
// /**
//  * its calculate no of pages using limit and total_length.
//  * @param {integer} total_length - The total_length is total number of records
//  * @param {integer} limit - The limit is records per page
//  * @returns {number} Number of pages
//  */
// function noOfPage(total_length, limit) {
//     var size = Math.ceil(total_length / limit);
//     return size;
// }
//
//
// /**
//  * totalNoSearch show user total search result.
//  * @param {integer} paginationInfo.total_length - The paginationInfo.total_length gives total number of records from pagination object
//  */
// function totalNoSearch(total_length) {
//     $('.searchresult').html(" You Found  " + total_length + " results of protein");
//
// }
//
//
// /**
//  * it creates user interface for pagination for dropdown
//  * @param {Object} paginationInfo - the dataset of pagination info is retun from server
//  * @param {integer} paginationInfo.total_length - The paginationInfo.total_length gives total number of records from pagination object
//  * @param {integer} paginationInfo.limit - The paginationInfo.limit givesrecords per page from pagination object
//  */
//
// function buildPages(paginationInfo) {
//     var total_length = noOfPage(paginationInfo.total_length, paginationInfo.limit);
//     var pageSelectors = $(".page-select");
//     pageSelectors.empty();
//     for (var i = 1; i <= total_length; i++) {
//         pageSelectors.append($("<option></option>").attr("value", i).text(i));
//     }
//     pageSelectors.val(page);
//     /**
//      * this works for Showing user how many results they found .
//
//      */
//     totalNoSearch(paginationInfo.total_length);
//     /**
//      * this works for enabling and disable prev and next button.
//
//      */
//     $(".prevbutton").attr("disabled", (page == 1));
//     $(".nextbutton").attr("disabled", (page == total_length));
// }

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
}



/**
 * it creates user interface for summary
 * @param {Object} queryInfo - the dataset of pagination info is retun from server
 * @param {string} queryInfo.execution_time - The queryInfo.execution_time gives execution_time of query in the form of date.
 * @param {integer} paginationInfo.limit - The paginationInfo.limit givesrecords per page from pagination object
 */



function buildSummary(queryInfo) {
    var summaryTemplate = $('#summary-template').html();
    queryInfo.execution_time= moment().format('MMMM Do YYYY, h:mm:ss a')
    // var excutionDate= new Date(queryInfo.execution_time);
    // queryInfo.execution_time = excutionDate.toLocaleString();
    queryInfo.mass.min = addCommas(queryInfo.mass.min);
    queryInfo.mass.max = addCommas(queryInfo.mass.max);
    var summaryHtml = Mustache.render(summaryTemplate, queryInfo);
    $('#summary-table').html(summaryHtml);
}

/**
 * Redirect to Page index page or search back
 */
function redirectPage1() {
    window.location.replace("http://glycomics.ccrc.uga.edu/ggtest/gui/index.html");
}

function redirectPage2() {
    window.location.href = "http://glycomics.ccrc.uga.edu/ggtest/gui/glycoprotein_search.html";
}


function totalNoSearch(total_length) {
    $('.searchresult').html( "\""  + total_length + " Proteins were found\"");
    // $('.searchresult').html( "&#34;"  + total_length + " results of glycan&#34;");

}

/**
 * Redirect to  searchPage with id after clicking editSearch
 */


function editSearch() {
    {
        window.location.replace("glycoprotein_search.html?id=" + id);
        activityTracker("user", id, "edit search");
    }
}

/**

 * Format function to create link to the details page

 * @param {object} value - The data binded to that particular cell.
 @return -Details particular Protein Id
 */
function PageFormat(value, row, index, field) {
    return "<a href='glycoprotein_detail.html?uniprot_canonical_ac=" + value + "'>" + value + "</a>";
}


/**

 * Format function for column "MASS"

 * @param {object} value - The data binded to that particular cell.
 * @return- Protein Mass if available else NA
 */

function MassFormatter(value) {
    if (value) {
        var mass = value;
        return value;


    } else {
        return "NA";
    }
}


/**

 * Format function of the detail table when opening each row [+]

 * @param {int} index - The row clicked

 * @param {object} row - The data object binded to the row
 * @return- detail view with IUPAC AND GLYCOCT
 */


// function DetailFormat(index, row) {
//     var html = [];
//     var glyco = row.glycoct.replace(/ /g, '\n');
//     html.push('<div class="row"><div class="col-md-2 col-xs-12"><strong>IUPAC</strong></div><div class="col-md-10 col-xs-12"><pre>' + row.iupac + '</pre></div></div>');
//     html.push('<div class="row"><div class="col-md-2 col-xs-12"><strong>GlycoCT</strong></div><div class="col-md-10 col-xs-12"><pre>' + glyco + '</pre></div></div>');
//     return html.join('');
// }


/**

 * updateSearch function of the detail table when opening each row [+]

 * @param {int} index - The row clicked

 * @param {object} row - The data object binded to the row
 * @return- detail view with IUPAC AND GLYCOCT
 */

var lastSearch;

function updateSearch() {
    console.log(lastSearch.query);
    $.ajax({
        method: 'GET',
        dataType: "json",
        // url: 'http://glygen-vm-tst.biochemistry.gwu.edu/api/protein/search?query=' + JSON.stringify(lastSearch.query),
        url: getWsUrl('search_protein')+"?query=" + JSON.stringify(lastSearch.query),
        success: function (result) {
            // if (result.list_id) {
                console.log(result);
                activityTracker("user", id, "update search");
                window.location = 'glycoprotein_list.html?id=' + result.list_id;
            // } else {
            //     // handle if no results
            //     activityTracker("error", id, "update search: no result found");
            // }
        },
        error: ajaxListFailure
    });
}


/**
 * Handling a succesful call to the server for list page
 * @param {Object} data - the data set returned from the server on success
 * @param {Array} data.results - Array of individual results
 * @param {Object} data.pagination - the dataset for pagination info
 * @param {Object} data.query - the dataset for query
 */


function ajaxListSuccess(data) {
    if (data.code) {
        console.log(data.code);
        displayErrorByCode(data.code);
        activityTracker("error", id, "error code: " + data.code +" (page: "+ page+", sort:"+ sort+", dir: "+ dir+", limit: "+ limit +")");
    } else {


        var $table = $('#gen-table');
        var items = [];
        if (data.results) {
            for (var i = 0; i < data.results.length; i++) {
                var protein = data.results[i];
                items.push({
                    uniprot_canonical_ac: protein.uniprot_canonical_ac,
                    mass: protein.mass,
                    gene_name: protein.gene_name,
                    protein_name_long: protein.protein_name_long,
                    //protein_name_short: protein.protein_name_short,
                    organism: protein.organism,
                    refseq_name:protein.refseq_name,
                    refseq_ac:protein.refseq_ac
                });
            }
        }

        $table.bootstrapTable('removeAll');
        $table.bootstrapTable('append', items);

        buildPages(data.pagination);

        buildSummary(data.query);

        document.title = 'Glycoprotein-list';
        lastSearch = data;
        activityTracker("user", id, "successful response (page: "+ page+", sort:"+ sort+", dir: "+ dir+", limit: "+ limit +")");
    }

}

/// ajaxFailure is the callback function when ajax to GWU service fails
function ajaxListFailure() {
    displayErrorByCode('server_down');
    activityTracker("error", id, "server down (page: "+ page+", sort:"+ sort+", dir: "+ dir+", limit: "+ limit +")");
}

/**

 * LoadDataList function to configure and start the request to GWU  service

 * @param {string} id - The protein id to load
 * */
function LoadDataList() {

    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("protein_list"),
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

$(document).ready(function(){
    $('#gen-table').on("sort.bs.table", function(event,field,order){
        // event.preventDefault();
        event.stopPropagation();
        sort = field;
        dir = order;
        LoadDataList();
        activityTracker("user", id, "sort: " + sort);
        return false;
    });
});
