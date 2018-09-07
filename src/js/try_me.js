/**
 * @description ajax calls for the try me questions with static values on the index page.
 * @author Gaurav Agarwal
 * @since Aug 2, 2018
 */

function tryMeAjaxFailure() {
    displayErrorByCode('server_down');
    activityTracker("error", "", "Try me failure");
    $('#loading_image').fadeOut();
}

/**
 * @description this prepends the loading image code to the body.
 */
function loadingImg() {
    // style explicitly set to display none so fade In effect can work.
    $('body').prepend("<div id='loading_image' style='display: none;'>" +
        "<img src='images/page_loading.gif' />" +
        "</div>");
    $('#loading_image').fadeIn();
}

/**
 * Q1. - What are the enzymes involved in the biosynthesis of Man5 in human?
 */
function tryBioEnzyme() {
    loadingImg();
    var id = "G55220VL";    // Man5 glycan ID
    $.ajax({
        type: 'POST',
        url: getWsUrl("search_bioenzyme", id),
        error: tryMeAjaxFailure,
        success: function (results) {
            if (results.list_id) {
                window.location = './protein_list.html?id=' + results.list_id;
                activityTracker("user", id, "Try me - Q1 - Man5 BioEnzyme");
                $('#loading_image').fadeOut();
            }
            else {
                displayErrorByCode('no-results-found');
                activityTracker("error", id, "Try me - Q1 - Man5 BioEnzyme: no result found");
                $('#loading_image').fadeOut();
            }
        }
    })
}

/**
 * Q2. -  Which proteins have been shown to bear a bi-antennary fully sialated N-Glycan
 *  and which site is this glycan attached to?
 */
function tryGlycanSite() {
    loadingImg();
    var id = "G73866ZM";
    $.ajax({
        type: 'POST',
        url: getWsUrl("search_glycansite", id),
        error: tryMeAjaxFailure,
        success: function (results) {
            if (results.list_id) {
                activityTracker("user", id, "Try me - Q2 - bi-antennary fully sialated N-Glycan");
                window.location = './protein_list.html?id=' + results.list_id;
                $('#loading_image').fadeOut();
            }
            else {
                displayErrorByCode('no-results-found');
                activityTracker("error", id, "Try me - Q2 - bi-antennary fully sialated N-Glycan: no result found");
                $('#loading_image').fadeOut();
            }
        }
    })
}

/**
 * Q3. - Which glycans might have been synthesized in mouse using Mgat1?
 */
function tryMouseGlycans() {
    loadingImg();
    var jsonData = {
        "operation": "AND",
        "query_type": "search_glycan",
        "mass": {},
        "number_monosaccharides": {},
        "enzyme": { "type": "gene", "id": "MGAT1" },
        "tax_id": 10090
    };
    var json = "query=" + JSON.stringify(jsonData);

    $.ajax({
        type: 'post',
        url: getWsUrl("glycan_search"),
        data: json,
        error: tryMeAjaxFailure,
        success: function (results) {
            if (results.error_code) {
                displayErrorByCode(results.error_code);
                activityTracker("error", "", "Try me - Q3 - glycans in mouse using MGAT1: "+results.error_code+" for " + json);
                $('#loading_image').fadeOut();
            } else if ((results.list_id !== undefined) && (results.list_id.length === 0)) {
                displayErrorByCode('no-results-found');
                activityTracker("user", "", "Try me - Q3 - glycans in mouse using MGAT1: no result found for "+json);
                $('#loading_image').fadeOut();
            } else {
                activityTracker("user", "", "Try me - Q3 - glycans in mouse using MGAT1");
                window.location = './glycan_list.html?id=' + results.list_id;
                $('#loading_image').fadeOut();
            }
        }
    });
}