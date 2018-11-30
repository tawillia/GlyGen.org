// @author: Rupali Mahadik
// @update: Aug 6, 2018 - Gaurav Agarwal - added ajax error cases.
// @update: Aug 27, 2018 - Gaurav Agarwal - function to return ajax timeout values and ajax error-failure handling functions.
// @added: Oct 19, 2018 - Gaurav Agarwal - data download function.

/**
 * function addCommas is a regular expression is used on nStr to add the commas
 * @param {integer} nstr gets divide
 * @returns {number} Number with commas
 */
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
function getErrorMessage(errorCode) {
    // This can appended to the end of the error message displayed for the user to be able to quickly contact us.
    var contactUsMsg = " If the problem persists then you may <a href='contact.html' >contact us</a>";

    switch (errorCode) {
        case 'invalid-query-json':
            return {
                message: "This is not a valid entry. Please try again.",
                title: "Invalid Entry Error"
            };
        case 'open-connection-failed':
            return {
                message: "Sorry, we couldn't connect to database.",
                title: "Unexpected Error"
            };
        case 'unexpected-field-in-query':
            return {
                message: "This is unexpected field entry. Please try again",
                title: "Unexpected Field Entry Error"
            };
        case 'invalid-parameter-value-length':
            return {
                message: "Please adjust length of your entry and try again.",
                title: "Invalid Value Length Error"
            };
        case 'no-search-criteria-submitted':
            return {
                message: "Entry error occurred. Please provide input a term to search for.",
                title: "Unexpected Error"
            };
        case 'non-existent-record':
            return {
                message: "No record exist for the submitted ID",
                title: "Selection Error"
            };
        case 'invalid-parameter-value':
            return {
                message: "Please input correct field values",
                title: "Selection Error"
            };
        case 'non-existent-search-results':
            return {
                message: "No results found for your search query",
                title: "Selection Error"
            };
        case 'missing parameter':
            return {
                message: "Please choose a different number of records per page.",
                title: "Selection Error"
            };
        case 'no-results-found':
            return {
                message: "Sorry, we couldn't find any data matching your entry. Please change your parameters and try again.",
                title: "No Results Found"
            };

        case 'missing-parameter':
            return {
                message: "Missing parameter",
                title: "Selection Error"
            };
        case 'missing-query-key-in-query-json':
            return {
                message: "Incorrectly formatted request.",
                title: "Format error"
            };
        case 'download-type-format-combination-not-supported':
            return {
                message: "Selected Download format is not supported for this page",
                title: "Selection Error"
            };
        case 'download-type-not-supported':
            return {
                message: "Downloading this page is not supported.",
                title: "Selection Error"
            };
        case 'non-existent-mime-type-for-submitted-format':
            return {
                message: "Sorry. We do not support the requested file format.",
                title: "Selection Error"
            };

        case 'timeout':
            return {
                message: "Sorry, the server didn't respond. Please try again later." + contactUsMsg,
                title: "TimeOut Error"
            };

        case 'parsererror':
            return {
                message: "There was an error in the data received. We are looking into it." + contactUsMsg,
                title: "Parsing Error"
            };

        case 'abort':
            return {
                message: "Sorry, your requested was aborted. Please try again." + contactUsMsg,
                title: "Request Aborted"
            };

        case 0:
            return {
                message: "Could not connect to the server." + contactUsMsg,
                title: "Not Connected"
            };

        case 404:
            return {
                message: "Could not connect to the server." + contactUsMsg,
                title: "Server not found"
            };

        case 500:
            return {
                message: "An Internal server error occured. We are doing our best to resolve it." + contactUsMsg,
                title: "Server error"
            };

        default:
            return {
                message: "Oops, something went wrong. Please try again later." + contactUsMsg,
                title: "Unexpected Error"
            };
    }
}

/**
 * Display Error message using alertify
 */
function displayError(message, title) {
    var pagePath = window.location.pathname;
    if (pagePath.substring(pagePath.lastIndexOf('/') + 1).toLocaleLowerCase().includes("list")) {
        // for all list pages, if any error occurs, it will go back to the previous page.
        alertify.alert(title, message, function(){ window.history.back(); }).set('modal', false);;
    } else {
        alertify.alert(title, message).set('modal', false);
    }
}

function displayErrorByCode(errorCode) {
    var error = getErrorMessage(errorCode);
    displayError(error.message, error.title);
}

/**
 * Gives the timeout value for ajax calls to repective web services.
 * @param {string} ajaxWebService - The name of web service being called.
 * @return timeout value in milliseconds.
 */
function getTimeout(ajaxWebService) {
    // useCase question
    var usecaseQ1 = 10000,
        usecaseQ2 = 10000,
        usecaseQ3 = 10000,
        usecaseQ4 = 10000,
        usecaseQ5 = 10000,
        usecaseQ6 = 10000,
        usecaseQ7 = 10000,
        usecaseQ8 = 10000,
        usecaseQ9 = 10000;

    // search Init
    var searchInitGlycan = 10000,
        searchInitProtein = 10000,
        searchInitGlycoP = 10000,
        homeInit = 10000;

    // search
    var searchGlycan = 60000,   //10000,
        searchProtein = 60000,  //10000;
        searchSimpleGlycan = 60000,
        searchSimpleProtein = 60000;

    // list
    var listGlycan = 5000,
        listProtein = 5000,
        listLocus = 5000;

    // detail
    var detailGlycan = 5000,
        detailProtein = 5000;

    // contact us
    var contact = 5000;

    switch (ajaxWebService.toLowerCase()) {
        // glycan
        case "search_init_glycan":
            return searchInitGlycan;
        case "search_glycan":
            return searchGlycan;
        case "list_glycan":
            return listGlycan;
        case "detail_glycan":
            return detailGlycan;
        case "home_init":
            return homeInit;
        case "glycan_search_simple":
            return searchSimpleGlycan;

        // protein
        case "search_init_protein":
            return searchInitProtein;
        case "search_protein":
            return searchProtein;
        case "list_protein":
            return listProtein;
        case "detail_protein":
            return detailProtein;
        case "protein_search_simple":
            return searchSimpleProtein;

        // Glycoprotein
        case "search_init_glycoprotein":
            return searchInitGlycoP;

        // useCase
        case "usecase_q1":
            return usecaseQ1;
        case "usecase_q1":
            return usecaseQ2;
        case "usecase_q1":
            return usecaseQ3;
        case "usecase_q1":
            return usecaseQ4;
        case "usecase_q1":
            return usecaseQ5;
        case "usecase_q1":
            return usecaseQ6;
        case "usecase_q1":
            return usecaseQ7;
        case "usecase_q1":
            return usecaseQ8;
        case "usecase_q1":
            return usecaseQ9;

        // locus list
        case "loci_list":
            return listLocus;

        // contact us
        case "contact":
            return contact;

        default:
            return 5000;
    }
}

/**
 * logs appropriate search_init WS error message.
 * @param {*} jqXHR
 * @param {*} textStatus
 * @param {*} errorThrown
 */
function searchInitFailure(jqXHR, textStatus, errorThrown) {
    var err = decideAjaxError(jqXHR.status, textStatus);
    var errorMessage = JSON.parse(jqXHR.responseText).error_list[0].error_code || errorThrown;
    activityTracker("error", "", err + ": " + errorMessage + ": search_init WS error");
    $('#loading_image').fadeOut();
}

/**
 * displays and logs appropriate search WS error message.
 * @param {*} jqXHR
 * @param {*} textStatus
 * @param {*} errorThrown
 */
function ajaxSearchFailure(jqXHR, textStatus, errorThrown) {
    // getting the appropriate error message from this function in utility.js file
    var err = decideAjaxError(jqXHR.status, textStatus);
    var errorMessage = JSON.parse(jqXHR.responseText).error_list[0].error_code || err;
    displayErrorByCode(errorMessage);
    activityTracker("error", null, err + ": " + errorMessage);
    $('#loading_image').fadeOut();
}

/**
 * gives general error message for the ajax call.
 * @param {*} jqStatus
 * @param {*} textStatus
 * @return error message.
 */
function decideAjaxError(jqStatus, textStatus) {
    var err = '';
    if (textStatus === 'timeout' || textStatus === 'abort' || textStatus === 'parsererror') {
        err = textStatus;
    }
    else if (jqStatus === 0 || jqStatus === 404 || jqStatus === 500) {
        err = jqStatus;
    } else {
        err = textStatus;
    }
    return err;
}

/**
 * This will download the data of the respective page in the user selected format.
 * @author Gaurav Agarwal
 * @since 19th Oct 2018.
 * 
 * @param {string} id the ID of the glycan or protein page. (ex.: uniprot_canonical_ac)
 * @param {string} format the file format or mimeType of the data to be received.
 * @param {boolean} compressed "true" to receive compressed data otherwise it is "false".
 * @param {string} type the page whose data needs to be downloaded.
 */
function downloadFromServer(id, format, compressed, type) {
    var download_query = {
        "id": id,
        "type": type,
        "format": format,
        "compressed": compressed
    };
    $('#loading_image').fadeIn();

    var mimeType = "text";
    if (format === "csv") {
        mimeType = "text/csv";
    } else if (format === "fasta") {
        mimeType = "text/plain";
    } else if (format === "json") {
        mimeType = "application/json";
    } else if (format === "image") {
        mimeType = "image/png";
    } else if (format === "tsv") {
        mimeType = "text/tsv";
    }

    $.ajax({
        method: 'POST',
        dataType: "text",
        url: getWsUrl('data_download') + "?query=" + JSON.stringify(download_query),
        success: function (result) {
            //uses the download.js library.
            download(result, type + "_" + id, mimeType);        // + "." + format
            activityTracker("user", id, "successful download");
            $('#loading_image').fadeOut();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // getting the appropriate error message from this function in utility.js file
            var err = decideAjaxError(jqXHR.status, textStatus);
            var errorMessage = JSON.parse(jqXHR.responseText).error_list[0].error_code || err;
            displayErrorByCode(errorMessage);
            activityTracker("error", id, "Download error: " + errorMessage);
            $('#loading_image').fadeOut();
        }
    });
}

// for stopping the download dropdown to close on click.
$(document).on('click', '.gg-download', function (e) {
    e.stopPropagation();
});

/**
 * 
 * @param {String} date Date string returned by backend (format: YYYY-MM-DD hh:mm:ss Z offset)
 * returns date string in MM/DD/YYYY format
 */
function getDateMMDDYYYY(date) {
    return date.slice(5, 7) + '/' + date.slice(8, 10) + '/' + date.slice(0, 4);
}