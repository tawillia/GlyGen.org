//@author: Rupali Mahadik
// @description: UO1 Version-1.1.
// @update: July 16, 2018 - Gaurav Agarwal - Error and page visit logging
// @update on July 25 2018 - Gaurav Agarwal - added code for loading gif.
// @update: July 31 2018 - Gaurav Agarwal - added mutation table.

var uniprot_canonical_ac;
/**
 * Handling a succesful call to the server for details page
 * @param {Object} data - the data set returned from the server on success


 */
function scrollToPanel(hash) {
    //to scroll to the particular sub section.
    // $(hash).next('.cd-faq-content').slideToggle(200).end().parent('li').toggleClass('content-visible');
    if ($(window).width() < 768) {   //mobile view
        $('.cd-faq-items').scrollTop(0).addClass('slide-in').children('ul').removeClass('selected').end().children(hash).addClass('selected');
        $('.cd-close-panel').addClass('move-left');
        $('body').addClass('cd-overlay');
    } else {
        $('body,html').animate({ 'scrollTop': $(hash).offset().top - 19 }, 200);
    }
}

// Sequence formatting Function
function formatSequence (sequenceString) {
    var perLine = 60;
    var output = '';

    for(var x = 0; x < sequenceString.length; x += perLine) {
        var y = sequenceString.substr(x, perLine);
        // output += ("     " + (x+1)).slice(-5) + ' ' + y + '\n';
        output += '<span class="non-selection">' + ("     " + (x+1)).slice(-5) + ' </span>' + y + '\n'
    }
    return output;
}

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

function ajaxSuccess(data) {

    if (data.error_code) {
        activityTracker("error", uniprot_canonical_ac, data.error_code);
        // added by Gaurav on July 27, 2018. Web service error display.
        alertify.alert('Error occured', data.error_code);
    }
    else {
        activityTracker("user", data.uniprot_canonical_ac, "successful response");
        var template = $('#item_template').html();
        var string = data.sequence.sequence;
        data.sequence.sequence = formatSequence(string);
        for (var i = 0; i < data.isoforms.length; i++) {
            // assign the newly result of running formatSequence() to replace the old value
            data.isoforms[i].sequence.sequence = formatSequence(data.isoforms[i].sequence.sequence);
            data.isoforms[i].locus.start_pos = addCommas(data.isoforms[i].locus.start_pos);
            data.isoforms[i].locus.end_pos = addCommas(data.isoforms[i].locus.end_pos);
            // console.log(data.isoforms[i]);
        }

   // CrossRef


        // define variable to for itemscrossref
        var itemscrossRef=[];
//check data.
        if(data.crossref){
            for (var i = 0; i < data.crossref.length; i++) {
                var crossrefitem = data.crossref[i];
                var found = '';
                for(var j=0; j < itemscrossRef.length; j++){
                    var databaseitem  = itemscrossRef[j];
                    if(databaseitem.database === crossrefitem.database){
                        found = true;
                        databaseitem.links.push(
                            {
                                url: crossrefitem.url,
                                id: crossrefitem.id
                            }
                        );
                    }
                }
                if(!found){
                    itemscrossRef.push({
                        database: crossrefitem.database,
                        links: [{
                            url: crossrefitem.url,
                            id: crossrefitem.id
                        }]
                    });
                }
            }

            data.itemscrossRef = itemscrossRef;

        }
       // //pathway
        var itemsPathway=[];
        if(data.pathway){
            for (var i = 0; i < data.pathway.length; i++) {
                var pathwayitem = data.pathway[i];
                var found = false;
                for(var j=0; j < itemsPathway.length; j++){
                    var databaseitem1  = itemsPathway[j];
                    if(databaseitem1. resource === pathwayitem. resource){
                        found = true;
                        databaseitem1.links.push(

                            {
                                url: pathwayitem.url,
                                id: pathwayitem.id,
                                name: pathwayitem.name

                            }
                        );
                    }
                }
                if(!found){
                    itemsPathway.push({
                        resource: pathwayitem. resource,
                        links: [{
                            url: pathwayitem.url,
                            id: pathwayitem.id
                        }]
                    });
                }
            }

            data.itemsPathway = itemsPathway;

        }

        data.itemsGlycosyl = [];
        data.itemsGlycosyl2 = [];
        if (data.glycosylation) {

            for (var i = 0; i < data.glycosylation.length; i++) {

                var glycan = data.glycosylation[i];
                if(glycan.glytoucan_ac){
                    data.itemsGlycosyl.push({
                        glytoucan_ac: glycan.glytoucan_ac,
                        residue: glycan.residue + glycan.position,
                        type: glycan.type,
                        evidence: glycan.evidence

                    });
                }
                else{
                    data.itemsGlycosyl2.push({
                        residue: glycan.residue + glycan.position,
                        type: glycan.type,
                        evidence: glycan.evidence
                    });
                }
            }
        }



//mustach rending
        var html = Mustache.to_html(template, data);
        var $container = $('#content');

// getting array

        var itemsMutate = [];
        var itemsExpressionTissue = [];
        var itemsExpressionDisease = [];
        // filling in glycosylation data





// filling in expression_disease
        if (data.expression_disease) {
            for (var i = 0; i < data.expression_disease.length; i++) {
                var expressionD = data.expression_disease[i];
                itemsExpressionDisease.push({
                    name: expressionD.name,
                    disease: expressionD.disease,
                    significant: expressionD.significant,
                    trend: expressionD.trend,
                    evidence: expressionD.evidence
                    // "significant":"yes",
                    // "trend":"down",

                });
            }
        }


// filling in expression_tissue
        if (data.expression_tissue) {
            for (var i = 0; i < data.expression_tissue.length; i++) {
                var expressionT = data.expression_tissue[i];
                itemsExpressionTissue.push({
                    name: expressionT.name,
                    tissue: expressionT.tissue,
                    present: expressionT.present,
                    evidence: expressionT.evidence


                });
            }
        }

// log it to see what would get sent to mustache
        console.log(data);

// Mustache.render(template, data);hgbgghvythvhgtfkgyhjhsgghg


        // filling in mutation data
        if (data.mutation) {
            for (var i = 0; i < data.mutation.length; i++) {
                var mutate = data.mutation[i];
                itemsMutate.push({
                    annotation: mutate.annotation,
                    disease: mutate.disease,
                    type: mutate.type,
                    start_pos: mutate.start_pos,
                    end_pos: mutate.end_pos,
                    // merging the two sequences, separated by arrow symbol.
                    sequence: mutate.sequence_org + " &#8594 " + mutate.sequence_mut,
                    evidence: mutate.evidence
                });
            }
        }


        $container.html(html);

        $container.find('.open-close-button').each(function (i, element) {
            $(element).on('click', function () {
                var $this = $(this);
                var buttonText = $this.text();
                if (buttonText === '+') {
                    $this.text('-');
                    $this.parent().next().show();
                } else {
                    $this.text('+');
                    $this.parent().next().hide();


                }
            });
        });

        // $container.find('#basics5x').click();

        // glycosylation table




        $('#glycosylation-table').bootstrapTable({
            columns: [{
                field: 'glytoucan_ac',
                title: 'GlyTouCan Accession',
                sortable: true,
                formatter: function (value, row, index, field) {
                    return "<a href='glycan_detail.html?glytoucan_ac=" + value + "'>" + value + "</a>"
                }
            },
                {
                    field: 'type',
                    title: 'Type',
                    sortable: true
                },

                {
                    field: 'residue',
                    title: 'Residue',
                    sortable: true
                },
                {
                    field: 'imageFormat',
                    title: 'Glycan Image',
                    sortable: true,
                    formatter: function imageFormat(value, row, index, field) {
                        var url = getWsUrl('glycan_image', row.glytoucan_ac);
                        return "<div class='img-wrapper'><img class='img-cartoon' src='" + url + "' alt='Cartoon' /></div>";
                    }
                }
                ],
            pagination: 10,
            data: data.itemsGlycosyl,
            detailView: true,
            detailFormatter: function (index, row) {
                var html = [];
                var evidences = row.evidence;
                for (var i = 0; i < evidences.length; i++) {
                    var evidence = evidences[i];
                    html.push("<div class='row'>");
                    html.push("<div class='col-xs-12'>" + evidence.database + ":<a href=' " + evidence.url + " ' target='_blank'>" + evidence.id + "</a></div>");
                    html.push("</div>");
                }
                return html.join('');
            },
            onPageChange: function(){
                scrollToPanel("#basics6");
            }
        });


        // glycosylation table
        $('#glycosylation-table2').bootstrapTable({
            columns: [

                {
                    field: 'type',
                    title: 'Type',
                    sortable: true
                },

                {
                    field: 'residue',
                    title: 'Residue',
                    sortable: true
                }


            ],
            pagination: 10,
            data: data.itemsGlycosyl2,
            detailView: true,
            detailFormatter: function (index, row) {
                var html = [];
                var evidences = row.evidence;
                for (var i = 0; i < evidences.length; i++) {
                    var evidence = evidences[i];
                    html.push("<div class='row'>");
                    html.push("<div class='col-xs-12'><li class='list-group'>" + evidence.database + ":<a href=' " + evidence.url + " ' target='_blank'>" + evidence.id + "</a></li></div>");
                    html.push("</div>");
                }
                return html.join('');
            },

        });

        $(".EmptyFind").each(function() {
            var $tid = $(this).attr("id");
            var $txt = $(this).text();
            if ($txt == "") {
                $('a[data-target=#' + $tid + ']').closest('table').hide();
            }
        });
        $('#loading_image').fadeOut();
        // mutation table
        $('#mutation-table').bootstrapTable({
            columns: [{
                field: 'annotation',
                title: 'Annotation name',
                sortable: true
            },
                {
                    field: 'disease',
                    title: 'Disease',
                    sortable: true,
                    formatter: function (value, row, index, field) {
                        var diss;
                        if (value.icd10)
                            diss = value.name + " (ICD10:" + value.icd10 + " ; DOID:<a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
                        else
                            diss = value.name + " (DOID:<a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
                        return diss;
                    }
                },
                {
                    field: 'start_pos',
                    title: 'Start pos',
                    sortable: true
                },
                {
                    field: 'end_pos',
                    title: 'End pos',
                    sortable: true
                },
                {
                    field: 'sequence',
                    title: 'Sequence',
                    sortable: true
                },
                {
                    field: 'type',
                    title: 'Type',
                    sortable: true
                }],
            pagination: 10,
            data: itemsMutate,
            detailView: true,
            detailFormatter: function (index, row) {
                var html = [];
                var evidences = row.evidence;
                for (var i = 0; i < evidences.length; i++) {
                    var evidence = evidences[i];
                    html.push("<div class='row'>");
                    html.push("<div class='col-xs-12'><li class='list-group'>" + evidence.database + ": <a href=' " + evidence.url + " ' target='_blank'>" + evidence.id + "</a></li></div>");
                    html.push("</div>");
                }
                return html.join('');
            },


        });

        $('#loading_image').fadeOut();


// expression Disease table
        $('#expressionDisease-table').bootstrapTable({
            columns: [
                {
                    field: 'disease',
                    title: 'Disease',
                    sortable: true,
                    formatter: function (value, row, index, field) {
                        var diss1;
                        if (value.icd10)
                            diss1 = value.name + " (ICD10:" + value.icd10 + " ; DOID:<a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
                        else
                            diss1 = value.name + " (DOID:<a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
                        return diss1;
                    }
                },


                {
                    field: 'significant',
                    title: 'Significant',
                    sortable: true
                },
                {
                    field: 'trend',
                    title: 'Expression Trend',
                    sortable: true
                },
            ],
            pagination: 10,
            data: itemsExpressionDisease,
            detailView: true,
            detailFormatter: function (index, row) {
                var html = [];
                var evidences = row.evidence;
                for (var i = 0; i < evidences.length; i++) {
                    var evidence = evidences[i];
                    html.push("<div class='row'>");
                    html.push("<div class='col-xs-12'><li class='list-group'>" + evidence.database + ": <a href=' " + evidence.url + " ' target='_blank'>" + evidence.id + "</a></li></div>");
                    html.push("</div>");
                }
                return html.join('');
            },

        });

        $('#loading_image').fadeOut();



// expression Disease table
    $('#expressionTissue-table').bootstrapTable({
        columns: [
            {
                field: 'tissue',
                title: 'Tissue',
                sortable: true,
                formatter: function (value, row, index, field) {
                        return value.name + " (UBERON:<a href='" + value.url + "' target='_blank'>"  + value.uberon + "</a>)"
                }
            },
            {
                field: 'present',
                title: 'Present',
                sortable: true
            }

        ],

        pagination: 10,
        data: itemsExpressionTissue,
        detailView: true,
        detailFormatter: function (index, row) {
            var html = [];
            var evidences = row.evidence;
            for (var i = 0; i < evidences.length; i++) {
                var evidence = evidences[i];
                html.push("<div class='row'>");
                html.push("<div class='col-xs-12'><li class='list-group'>" + evidence.database + ": <a href=' " + evidence.url + " ' target='_blank'>" + evidence.id + "</a></li></div>");
                html.push("</div>");
            }
            return html.join('');
        },

    });
}
$('#loading_image').fadeOut();
}






/**
 * @param {data} the callback function to GWU service if fails
 */
//  * Returns the GWU services fails.

function ajaxFailure(jqXHR, textStatus, errorThrown) {
    // getting the appropriate error message from this function in utility.js file
    var err = decideAjaxError(jqXHR.status, textStatus);
    displayErrorByCode(err);
    activityTracker("error", uniprot_canonical_ac, err + ": " + errorThrown);
    $('#loading_image').fadeOut();
}

/**
 * @param {id} the LoadData function to configure and start the request to GWU  service
 */
//  * Returns the GWU services.
//

function LoadData(uniprot_canonical_ac) {

    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("protein_detail", uniprot_canonical_ac),
        method: 'POST',
        timeout: getTimeout("detail_protein"),
        success: ajaxSuccess,
        error: ajaxFailure
    };


    // calls the service
    $.ajax(ajaxConfig);

}

//getParameterByName function to extract query parametes from url
/**
 * @param {name} string for the name of the variable variable to extract from query string
 * @param {url}string with the complete url with query string values
 */
//  * Returns the GWU services.
//


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function () {
    uniprot_canonical_ac = getParameterByName('uniprot_canonical_ac');
    document.title = uniprot_canonical_ac + " Detail - glygen";   //updates title with the protein ID
    LoadData(uniprot_canonical_ac);
});







