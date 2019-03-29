//@author: Rupali Mahadik
// @update on July 25 2018 - Gaurav Agarwal - added code for loading gif.
// @update: July 27, 2018 - Gaurav Agarwal - commented out the conditional statements in update search.

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
var sort = 'protein_name_long';
var dir = 'desc'
var url = getWsUrl('protein_list');
var limit = 20;

/**
 * it creates user interface for summary
 * @param {Object} queryInfo - the dataset of pagination info is retun from server
 * @param {string} queryInfo.execution_time - The queryInfo.execution_time gives execution_time of query in the form of date.
 * @param {integer} paginationInfo.limit - The paginationInfo.limit givesrecords per page from pagination object
 */

function buildSummary(queryInfo) {
    var summaryTemplate = $('#summary-template').html();
    if (queryInfo.glycosylated_aa) {
        queryInfo.glycosylated_aa = queryInfo.glycosylated_aa.join(', ');
    }
    queryInfo.execution_time = moment().format('MMMM Do YYYY, h:mm:ss a')
    if (queryInfo.mass) {
        queryInfo.mass.min = addCommas(queryInfo.mass.min);
        queryInfo.mass.max = addCommas(queryInfo.mass.max);
    }
    var summaryHtml = Mustache.render(summaryTemplate, queryInfo);
    $('#summary-table').html(summaryHtml);
}

/**
 * Format function of getting total result for each search   [+]
 * @param {total_length} paginationInfo.total_length
 */
function totalNoSearch(total_length) {
    $('.searchresult').html("\"" + total_length + " Proteins were found\"");
}

/**
 * Redirect to a search page with id after clicking editSearch
 * @function [[editSearch]] returns to search page with prefield fields
 */
function editSearch() {
    {
        window.location.replace("glycoprotein_search.html?id=" + getParameterByName("id"));
        activityTracker("user", id, "edit search");
    }
}

/**
 * Format function to create link to the details page
 * @param {object} value - The data binded to that particular cell.
 * @return - Details particular Protein Id
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
        activityTracker("error", id, "error code: " + data.code + " (page: " + page + ", sort: " + sort + ", dir: " + dir + ", limit: " + limit + ")");
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
                    organism: protein.organism,
                    refseq_name: protein.refseq_name,
                    refseq_ac: protein.refseq_ac
                });
            }
        }

        if (data.query.organism && (data.query.organism.id === 0)) {
            data.query.organism.name = "All";
        }
        $table.bootstrapTable('removeAll');
        $table.bootstrapTable('append', items);
        buildPages(data.pagination);
        buildSummary(data.query);
        document.title = 'Glycoprotein-list';
        lastSearch = data;
        activityTracker("user", id, "successful response (page: " + page + ", sort: " + sort + ", dir: " + dir + ", limit: " + limit + ")");
    }
}

/**
 * ajaxFailure is the callback function when ajax to GWU service fails
 * @param {string} jqXHR getting the appropriate error message 
 * @param {string} textStatus getting the appropriate error message 
 * @param {string} errorThrown Displays error message
 */
function ajaxListFailure(jqXHR, textStatus, errorThrown) {
    // getting the appropriate error message from this function in utility.js file
    var err = decideAjaxError(jqXHR.status, textStatus);
    var errorMessage = JSON.parse(jqXHR.responseText).error_list[0].error_code || err;
    displayErrorByCode(errorMessage);
    activityTracker("error", id, err + ": " + errorMessage + " (page: "+ page+", sort: "+ sort+", dir: "+ dir+", limit: "+ limit +")");
}

/**
 * LoadDataList function to configure and start the request to GWU  service
 * @param {string} id - The protein id to load
 **/
function LoadDataList(id) {
    if(!id){
        id= getParameterByName('id');
    }
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
 * hides the loading gif and displays the page after the results are loaded.
 * @author Gaurav Agarwal
 * @date July 25, 2018
 */
$(document).ajaxStop(function () {
    $('#loading_image').fadeOut();
});

$(document).ready(function () {
    var id = getParameterByName('id');
    LoadDataList(id);
    $('#gen-table').on("sort.bs.table", function (event, field, order) {
        // event.preventDefault();
        event.stopPropagation();
        sort = field;
        dir = order;
        LoadDataList();
        activityTracker("user", id, "sort: " + sort);
        return false;
    });
});

/**
 * Gets the values selected in the download dropdown 
 * and sends to the downloadFromServer() function in utility.js
 * @author Gaurav Agarwal
 * @since Oct 22, 2018.
 */
function downloadPrompt() {
    var page_type = "protein_list";
    var format = $('#download_format').val();
    var IsCompressed = $('#download_compression').is(':checked');
    downloadFromServer(id, format, IsCompressed, page_type);
}
