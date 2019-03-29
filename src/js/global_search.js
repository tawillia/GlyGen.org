/**
* @description calls the global search web service with the search query and displays the result
* @author Gaurav Agarwal
* @since Jan 14, 2019
*/

/**
 * This is a global variable for the searched term. 
 * It's kept global because it's accessed in all the functions.
 */
var term = '';

/**
 * gets the url parameter value from utility.js->getParameterByName() function
 * and calls the ajax function.
 */
$(document).ready(function () {
    term = getParameterByName('search_query');
    $('#display_search_term').text(term);
    term = encodeURIComponent(term);
    loadResult();
});

/**
 * This is the success handling function for the ajax call.
 * @param {JSON} result the json data received from web service
 */
function ajaxSuccess(result) {
    // $('#result').text(JSON.stringify(result));
    var template = $('#result_template').html();
    var content = Mustache.to_html(template, result);
    $('#result').html(content);
    $('#loading_image').fadeOut();
    activityTracker("user", term, "successful search");
}

/**
 * This is the failure handling function for the ajax call.
 * @param {*} jqXHR 
 * @param {*} textStatus 
 * @param {*} errorThrown 
 */
function ajaxFailure(jqXHR, textStatus, errorThrown) {
    // getting the appropriate error message from this function in utility.js file
    var err = decideAjaxError(jqXHR.status, textStatus);
    var errorMessage = JSON.parse(jqXHR.responseText).error_list[0].error_code || err;
    displayErrorByCode(errorMessage);
    activityTracker("error", term, "error: " + errorMessage);

    $('#loading_image').fadeOut();
}

/**
 * This funciton makes the ajax call to the web service with the search query term.
 */
function loadResult() {
    var search_query = {
        "term": term
    };

    $.ajax({
        dataType: "json",
        url: getWsUrl("global_search") + "?query=" + JSON.stringify(search_query),
        method: 'GET',
        success: ajaxSuccess,
        error: ajaxFailure
    });
}