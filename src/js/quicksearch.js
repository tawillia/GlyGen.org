
//@author:Rupali Mahadik.


//$("#protein2").autocomplete({
//     source: function (request, response) {
//
//         var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("uniprot_canonical_ac", request.term);
//         $.getJSON(queryUrl, function (suggestions) {
//             suggestions.length = Math.min(suggestions.length, 5);
//
//             // if only one suggestion, and suggestion matches value
//            // if ((suggestions.length === 1) && (suggestions[0].toLowerCase() === request.term.toLowerCase())) {
//
//            // }
//
//             // if suggestions.length > 0 then show exact match text
//
//             response(suggestions);
//         });
//     },
//     minLength: 1,
//     select: function (event, ui) {
//         console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
//
//     }
// });
//
//
//
//
//
// function myProteinDetail(){
//
//    var id = $("#protein2").val();
//
//
//    $.ajax({
//         type: 'post',
//         url: getWsUrl("protein_detail",id),
//         success: function (results) {
//             if (results.error_code && (results.error_code === 'non-existent-record')) {
//             } else if (results.error_code) {
//                     displayErrorByCode("Invalid ID");
//             }
//             else {
//                 window.location = "protein_detail.html?uniprot_canonical_ac=" + id +'#basics5';
//             }
//         }
//
//     })
// }







//Q.1- What are the enzymes involved in the biosynthesis of glycan X in human?

$("#bioenzyme").autocomplete({
    source: function (request, response) {

        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("glytoucan_ac", request.term);


        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 10);

            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});



function bioEnzyme(){

    var id = $("#bioenzyme").val();
 //
    //it seems  need that taxID m can we just set it to 10090 ?
    $.ajax({
        type: 'POST',
         url: getWsUrl("search_bioenzyme",id),
        success: function(results) {
            if (results.list_id) {
                window.location = './protein_list.html?id=' + results.list_id;
            }
            else {
                displayErrorByCode('no-results-found');
            }

        }

    })
}

//Q.1-END.



//Q.2- Which proteins have been shown to bear glycan X and which site is this glycan attached to?

$("#glycansite").autocomplete({
    source: function (request, response) {

        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("glytoucan_ac", request.term);


        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 10);

            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});



function glycanSite(){

    var id = $("#glycansite").val();
    //
    //it seems  need that taxID m can we just set it to 10090 ?
    $.ajax({
        type: 'POST',
        url: getWsUrl("search_glycansite",id),
        success: function(results) {
            if (results.list_id) {
                window.location = './protein_list.html?id=' + results.list_id;
            }
            else {
                displayErrorByCode('no-results-found');
            }

        }

    })
}
//end


// Q.3 What are the gene locations of the enzymes involved in the biosynthesis of glycan X in human?



$("#glycangene").autocomplete({
    source: function (request, response) {

        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("glytoucan_ac", request.term);


        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 10);

            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});



function glycanGene(){

    var id = $("#glycangene").val();
    //
    //it seems  need that taxID m can we just set it to 10090 ?
    $.ajax({
        type: 'POST',
        url: getWsUrl("search_glycangene",id),
        success: function(results) {
            if (results.list_id) {
                window.location = './locus_list.html?id=' + results.list_id;
            }
            else {
                displayErrorByCode('no-results-found');
            }

        }

    })
}
//end



//Q4.What are the orthologues of protein X in different species?
$("#proteinorthologues").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("uniprot_canonical_ac", request.term);
        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 5);

            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});





function proteinOrthologues(){

    var id = $("#proteinorthologues").val();
    $.ajax({
        type: 'post',
        url: getWsUrl("search_proteinorthologues",id),
        // url: getWsUrl("search_proteinorthologues",id+"/"),
        // data: json,
        success: function (results) {
            if (results.list_id) {

                window.location = './protein_orthologus.html?id=' + results.list_id;

            }
            else {
                displayErrorByCode('no-results-found');
            }

        }

    })
}

// //Q.5- What are the functions of protein X?
$("#proteinfunction").autocomplete({
    source: function (request, response) {

        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("uniprot_canonical_ac", request.term);
        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 5);

            // if only one suggestion, and suggestion matches value
            // if ((suggestions.length === 1) && (suggestions[0].toLowerCase() === request.term.toLowerCase())) {

            // }

            // if suggestions.length > 0 then show exact match text

            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);

    }
});


function proteinFunction(){

   var id = $("#proteinfunction").val();


   $.ajax({
        type: 'post',
        url: getWsUrl("protein_detail",id),
        success: function (results) {
            if (results.error_code) {
         displayErrorByCode("Invalid ID");
            }
            else {
                window.location = "protein_detail.html?uniprot_canonical_ac=" + id +'#basics7';
            }
        }

    })
}





//Q.6- Which glycans might have been synthesized in mouse using enzyme X?

$("#glycanenzyme").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("enzyme_uniprot_canonical_ac", request.term);
        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 5);

            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});





function glycanEnzyme(){

    var id = $("#glycanenzyme").val();
    $.ajax({
        type: 'post',
        url: getWsUrl("search_glycanenzyme",id),
        // data: json,
        success: function (results) {
            if (results.list_id) {
                window.location = './glycan_list.html?id=' + results.list_id;
            }
            else {

                displayErrorByCode('no-results-found');
            }

        }

    })
}

//Q.7- What are the glycosyltransferases in species X?



var searchInitValues;


$(document).ready(function () {
    $.getJSON(getWsUrl("search_init_glycan"), function (result) {
        searchInitValues = result;

        var orgElement = $("#organism1").get(0);
        createOption(orgElement, result.organism[0].name, result.organism[0].id);
        createOption(orgElement, result.organism[1].name, result.organism[1].id);

    });
});
function createOption(ddl, text, value) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.text = text;
    ddl.options.add(opt);
}

function glycosylTransferases(){

    var id = $("#organism1").val();
    $.ajax({
        type: 'post',
        url: getWsUrl("search_glycosyltransferases",id),
        // data: json,
        success: function (results) {
            if (results.list_id) {
                window.location = './protein_list.html?id=' + results.list_id;
            }
            else {

                displayErrorByCode('no-results-found');
            }

        }

    })
}


//Q.8- What are the glycohydrolases in species X?



var searchInitValues;


$(document).ready(function () {
    $.getJSON(getWsUrl("search_init_glycan"), function (result) {
        searchInitValues = result;

        var orgElement = $("#organism2").get(0);
        createOption(orgElement, result.organism[0].name, result.organism[0].id);
        createOption(orgElement, result.organism[1].name, result.organism[1].id);

    });
});
function createOption(ddl, text, value) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.text = text;
    ddl.options.add(opt);
}

function glycoHydrolases(){

    var id = $("#organism2").val();
    $.ajax({
        type: 'post',
        url: getWsUrl("search_glycohydrolases",id),
        // data: json,
        success: function (results) {
            if (results.list_id) {
                window.location = './protein_list.html?id=' + results.list_id;
            }
            else {

                displayErrorByCode('no-results-found');
            }

        }

    })
}




//Q.9- What are the reported or predicted glycosylated proteins in species X?



var searchInitValues;


$(document).ready(function () {
    $.getJSON(getWsUrl("search_init_glycan"), function (result) {
        searchInitValues = result;

        var orgElement = $("#organism3").get(0);
        createOption(orgElement, result.organism[0].name, result.organism[0].id);
        createOption(orgElement, result.organism[1].name, result.organism[1].id);

    });
});
function createOption(ddl, text, value) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.text = text;
    ddl.options.add(opt);
}

function glycoProteins(){

    var id = $("#organism3").val();
    // var id=$("#glycosyltransferasesdisease").val();

    var id1 = $("#species").val();
    $.ajax({
        type: 'post',
        url: getWsUrl("search_glycoproteins" ,id,id1),
        // data: json,
        success: function (results) {
            if (results.list_id) {
                window.location = './protein_list.html?id=' + results.list_id;
            }
            else {

                displayErrorByCode('no-results-found');
            }

        }

    })
}


//Q.10- What are the reported or predicted glycosylated proteins in species X?

$("#glycosyltransferasesdisease").autocomplete({
    source: function (request, response) {

        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("disease_name", request.term);


        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 10);

            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});



function glycosyTtransferasesDisease(){

    var id = $("#glycosyltransferasesdisease").val();

    //it seems  need that taxID m can we just set it to 10090 ?
    $.ajax({
        type: 'POST',
        url: getWsUrl("search_disease",id),
        success: function(results) {
            if (results.list_id) {
                window.location = './protein_list.html?id=' + results.list_id;
            }
            else {
                displayErrorByCode('no-results-found');
            }

        }

    })
}






function glycosyTtransferasesDisease(){
    // displays the loading gif when the ajax call starts
    $('#loading_image').fadeIn();


    var disease = $("#glycosyltransferasesdisease").val();



    var formObject = {
        do_name: disease,
        tax_id: 0

    };
    var json = "query=" + JSON.stringify(formObject);
    $.ajax({
        type: 'POST',
        url: getWsUrl("search_disease"),
        data: json,
        success: function(results) {
            if (results.list_id) {
                window.location = './protein_list.html?id=' + results.list_id;
            }
            else {
                displayErrorByCode('no-results-found');
            }

        }

    })
}
//Q.10.

