//@author: Rupali Mahadik
// @update: Aug 6, 2018 - Gaurav Agarwal - added ajax error cases.
// @update: Aug 27, 2018 - Gaurav Agarwal - function to return ajax timeout values and ajax error-failure handling functions.


function getErrorMessage(errorCode) {
    var contactUsMsg = " If the problem persists then you may <a href='contact.html' >contact us</a>";
    switch (errorCode) {
        case 'invalid-query-json':
            return {
                message: "This is not a valid entry. Please try again.",
                title: "Invalid Entry Error"
                //                message: "This is not a valid JSON query. Please try again.",
                //                title: "Invalid Submission"
            };
            break;
        case 'open-connection-failed':
            return {
                message: "Sorry, we couldn't connect to database.",
                title: "Unexpected Error"
            };
            break;
        case 'unexpected-field-in-query':
            return {
                message: "This is unexpected field entry. Please try again",
                title: "Unexpected Field Entry Error"
                //                message: "Unexpected field in query JSON.",
                //                title: "Unexpected Error"
            };
            break;
        case 'invalid-parameter-value-length':
            return {
                message: "Please adjust length of your entry and try again.",
                title: "Invalid Value Length Error"
                //                message: "Display error occurred. We are looking into this problem.",
                //                title: "Unexpected Error"
            };
            break;
        case 'no-search-criteria-submitted':
            return {
                message: "Entry error occurred. Please provide a valid ID.",
                title: "Unexpected Error"
            };
            break;
        case 'non-existent-record':
            return {
                message: "Please choose a different number of records per page.",
                title: "Selection Error"
            };
            break;
        case 'invalid-parameter-value':
            return {
                message: "Please choose a different number of records per page.",
                title: "Selection Error"
            };
            break;
        case 'non-existent-search-result':
            return {
                message: "Please choose a different number of records per page.",
                title: "Selection Error"
            };
            break;
        case 'missing parameter':
            return {
                message: "Please choose a different number of records per page.",
                title: "Selection Error"
            };
            break;
        case 'no-results-found':
            return {
                message: "Sorry, we couldn't find any data matching your entry. Please change your parameters and try again.",
                title: "No Results Found"
                //                message: "Sorry, we couldn't find any results matching your selection.",
                //                title: "Selection Error"
            };

            break;

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
    alertify.alert(title, message).set('modal', false);
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
        searchInitGlycoP = 10000;

    // search
    var searchGlycan = 60000,   //10000,
        searchProtein = 60000;  //10000;

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

        // protein
        case "search_init_protein":
            return searchInitProtein;
        case "search_protein":
            return searchProtein;
        case "list_protein":
            return listProtein;
        case "detail_protein":
            return detailProtein;

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
    activityTracker("error", "", err + ": " + errorThrown + ": search_init WS error");
    $('#loading_image').fadeOut();
}

/**
 * displays and logs appropriate search WS error message.
 * @param {*} jqXHR
 * @param {*} textStatus
 * @param {*} errorThrown
 */
function ajaxSearchFailure(jqXHR, textStatus, errorThrown) {
    var err = decideAjaxError(jqXHR.status, textStatus);
    displayErrorByCode(err);
    activityTracker("error", "", err + ": " + errorThrown);
    $('#loading_image').fadeOut();
}

/**
 * gives general error message for the ajax call.
 * @param {*} jqStatus
 * @param {*} textStatus
 * @return error message.
 */
function decideAjaxError(jqStatus, textStatus){
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
