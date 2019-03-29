//@author: Rupali Mahadik
// (Rupali Mahadik-Mustache template, Glycosylation table, Highlighting sequence)
// @description: UO1 Version-1.1.
//@Date:19th Feb 2018. Rupali Mahadik-with dummy web service
//@update: 3-April 2018. Rupali Mahadik-with real web service
//@update: June 26-2018- Rupali Mahadik-with web service changes
// @update: July 16, 2018 - Gaurav Agarwal - Error and page visit logging
// @update on July 25 2018 - Gaurav Agarwal - added code for loading gif.
// @update: July 31 2018 - Gaurav Agarwal - added mutation table.
// @update: Aug 1, 2018 - Rupali Mahadik - Table for Biosynthetic enzyme and found glycoprotein
// @update: Aug 6, 2018 - Rupali Mahadik - Grouping for cross ref
// @added: Oct 22, 2018 - Gaurav Agarwal - added downloadPrompt() which gives selection box for downloading data.
// @update: Jan 17th, 2019 - Rupali Mahadik - added new evidence display 

/**
 * Object to hold highlight data in state
 */
var highlight = {};
var SEQUENCE_ROW_RUN_LENGTH = 10;
var SEQUENCE_SPACES_BETWEEN_RUNS = 1;

/**
 * get glycosylation data
 * @param {array} glycosylationData
 * @param {string} type
 * @return an array of highlight info.
 */
function getGlycosylationHighlightData(glycosylationData, type) {
    var result = [];
    var positions = {};
    for (var x = 0; x < glycosylationData.length; x++) {
        if (!positions[glycosylationData[x].position] && (glycosylationData[x].type === type)) {
            positions[glycosylationData[x].position] = true;
            result.push({
                start: glycosylationData[x].position,
                length: 1
            });
        }
    }
    return result;
}

/**
 * Getting mutation data
 * @param {array} mutationData
 * @return an array of highlight info.
 */
function getMutationHighlightData(mutationData) {
    var result = [];
    var positions = {};
    for (var x = 0; x < mutationData.length; x++) {
        if (!positions[mutationData[x].start_pos]) {
            positions[mutationData[x].start_pos] = true;
            result.push({
                start: mutationData[x].start_pos,
                length: (mutationData[x].end_pos - mutationData[x].start_pos) + 1
            });
        }
    }
    return result;
}

/**
 * checking is highlighted or not
 * @param {number} position
 * @param {array} selection
 * @return:boolean if position in the ranges
 */
function isHighlighted(position, selection) {
    var result = false;
    if (selection) {
        for (var x = 0; x < selection.length; x++) {
            var start = selection[x].start;
            var end = selection[x].start + selection[x].length - 1;

            if ((start <= position) && (position <= end)) {
                result = true;
                break;
            }
        }
        return result;
    }
    return false;
}

/**
 * building highlight
 * @param {string} sequence
 * @param {object} highlightData:
 * @returns an array of each charcter of the sequence and is highlighted by its each type
 */
function buildHighlightData(sequence, highlightData) {
    var result = [];
    if (sequence) {
        for (var x = 0; x < sequence.length; x++) {
            var position = x + 1;
            result.push({
                character: sequence[x],
                n_link_glycosylation: isHighlighted(position, highlightData.n_link_glycosylation),
                o_link_glycosylation: isHighlighted(position, highlightData.o_link_glycosylation),
                mutation: isHighlighted(position, highlightData.mutation)
            });
        }
        return result;
    }
    return [];
}

/**
 * building row
 * @param {array} rowData
 * @returns string of sequence
 */
function buildRowText(rowData) {
    var text = [];

    for (var x = 0; x < rowData.length; x++) {
        text.push(rowData[x].character);
    }
    return text.join('');
}

/**
 * building rowhighlight
 * @param {array} rowData
 * @param {string}type
 * @returns string of sequence
 */
function buildRowHighlight(rowData, type) {
    var highlight = [];
    for (var x = 0; x < rowData.length; x++) {
        if (rowData[x][type]) {
            highlight.push('<span class="highlight-highlight-area">&nbsp;</span>');
        } else {
            highlight.push('&nbsp;');
        }
    }
    return highlight.join('');
}

/**
 * creating row
 * @param {number} start
 * @param {array} rowData
 * @returns jquery object of the row
 */
function createHighlightRow(start, rowData) {
    var $row = $('<div class="highlight-row"></div>');
    $('<span class="highlight-line-number"></span>')
        .text(("     " + (start + 1)).slice(-5) + ' ')
        .appendTo($row);

    var $section = $('<span class="highlight-section"></span>');
    $('<span class="highlight-text"></span>')
        .html(buildRowText(rowData))
        .appendTo($section);

    $('<span class="highlight-highlight"></span>')
        .attr('data-type', 'mutation')
        .html(buildRowHighlight(rowData, 'mutation'))
        .hide()
        .appendTo($section);

    $('<span class="highlight-highlight"></span>')
        .attr('data-type', 'n_link_glycosylation')
        .html(buildRowHighlight(rowData, 'n_link_glycosylation'))
        .hide()
        .appendTo($section);

    $('<span class="highlight-highlight"></span>')
        .attr('data-type', 'o_link_glycosylation')
        .html(buildRowHighlight(rowData, 'o_link_glycosylation'))
        .hide()
        .appendTo($section);
    $section.appendTo($row);
    return $row;
}

/**
 * creating UI perline
 * @param {object} highlightData
 * @param {number} perLine
 */
function createHighlightUi(highlightData, perLine) {
    var $ui = $('<div class="highlight-display"></div>');

    var seqTopIndex = "<pre style='border:0px; padding:0px; margin-bottom:0px; font-family:monospace; font-size: 14px;'>                +10        +20        +30        +40        +50</pre>";
    var seqTopIndexLines = "<pre style='border:0px; padding:0px; margin-bottom:0px; font-family:monospace; font-size: 14px;'>                 |          |          |          |          |</pre>";
    $ui.append(seqTopIndex);
    $ui.append(seqTopIndexLines);
    for (var x = 0; x < highlightData.length; x += perLine) {
        var rowDataTemp = adjustSequenceRuns(highlightData.slice(x, x + perLine));
        var rowData = [];
        for (var i = 0; i < rowDataTemp.length; i++) {
            for (var s = 0; s < SEQUENCE_SPACES_BETWEEN_RUNS; s++) {
                rowDataTemp[i].push({
                    character: '&nbsp;',
                    n_link_glycosylation: false,
                    o_link_glycosylation: false,
                    mutation: false
                });
            }
            $.merge(rowData, rowDataTemp[i]);
        }

        var $row = createHighlightRow(x, rowData);
        $ui.append($row);
    }
    $('#sequnce_highlight').append($ui);
}

var uniprot_canonical_ac;

/**
 * Handling a succesful call to the server for details page
 * @param {Object} data - the data set returned from the server on success
 */
function scrollToPanel(hash) {
    //to scroll to the particular sub section.
    if ($(window).width() < 768) { //mobile view
        $('.cd-faq-items').scrollTop(0).addClass('slide-in').children('ul').removeClass('selected').end().children(hash).addClass('selected');
        $('.cd-close-panel').addClass('move-left');
        $('body').addClass('cd-overlay');
    } else {
        $('body,html').animate({
            'scrollTop': $(hash).offset().top - 19
        }, 200);
    }
}

/**
 * Sequence formatting Function
 * @param {string} sequenceString 
 * @return {string} 
 */
function formatSequence(sequenceString) {
    var perLine = 60;
    var output = '';
    var seqTopIndex = "<pre style='border:0px; padding:0px; margin-bottom:0px; font-family:monospace; font-size: 14px;'>                +10        +20        +30        +40        +50</pre>";
    var seqTopIndexLines = "<pre style='border:0px; padding:0px; margin-bottom:0px; font-family:monospace;font-size: 14px;'>                 |          |          |          |          |</pre>";
    output += seqTopIndex;
    output += seqTopIndexLines;

    for (var x = 0; x < sequenceString.length; x += perLine) {
        var y = adjustSequenceRuns(sequenceString.substr(x, perLine)).join(' '.repeat(SEQUENCE_SPACES_BETWEEN_RUNS));
        output += '<span class="non-selection">' + ("     " + (x + 1)).slice(-5) + ' </span>' + y + '\n'
    }
    return output;
}

/**
 * Adjusts a sequence array by splitting it into multiple arrays of max length defined by the constant SEQUENCE_ROW_RUN_LENGTH
 * @author Sanath Bhat
 * @since Nov 15, 2018.
 */
function adjustSequenceRuns(sequence) {
    var y_arr = [];
    for (var i = 0; i < sequence.length; i += SEQUENCE_ROW_RUN_LENGTH) {
        y_arr.push(sequence.slice(i, i + SEQUENCE_ROW_RUN_LENGTH));
    }
    return y_arr;
}

/**
 * Prints a number with commas as thousands separator
 * @param {object} nStr 
 * @return {integer} - returns number with comma ex. 1,000
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


function formatEvidences(item) {
    if (item && item.length) {
        for (var i = 0; i < item.length; i++) {
            var currentItem = item[i];
            var databases = [];
            if (currentItem && currentItem.evidence && currentItem.evidence.length) {
                for (var j = 0; j < currentItem.evidence.length; j++) {
                    var evidenceitem = currentItem.evidence[j];
                    var found = '';

                    for (var x = 0; x < databases.length; x++) {
                        var databaseitem = databases[x];
                        if (databaseitem.database === evidenceitem.database) {
                            found = true;
                            databaseitem.links.push({
                                url: evidenceitem.url,
                                id: evidenceitem.id
                            });
                        }
                    }

                    if (!found) {
                        databases.push({
                            database: evidenceitem.database,
                            color: databasecolor(evidenceitem.database),
                            links: [{
                                url: evidenceitem.url,
                                id: evidenceitem.id
                            }]
                        })
                    }
                }
            }
            currentItem.databases = databases;
        }
    }
}
function EvidencebadgeFormator(value, row, index, field) {
    var buttonsHtml = "";
    $.each(value, function (i, v) {
        var linksHtml = "";
        $.each(v.links, function (i, w) {
            linksHtml += '<li class="linkHtml5">' +
                '<a href="' + w.url + '" target="_blank">' + w.id + '</a></li>'
        });

        buttonsHtml += '<span class="evidence_badge">' +
            '<button class="btn btn-primary color-' + v.database + '" type="button" style="background-color: ' + v.color + '; border-color: ' + v.color + '">' + v.database +
            '&nbsp;&nbsp;&nbsp;<span class="badge">' + v.links.length + '</span>' +
            '</button>' +
            '<div class="hidden evidence_links">' +
            '<ul>' + linksHtml + '</ul>' +
            '</div>' +
            '</span>';
    });
    return buttonsHtml;
}
/**
 * Handling a succesful call to the server for details page
 * @param {Object} data - the data set returned from the server on success
 */
function ajaxSuccess(data) {
    if (data.error_code) {
        activityTracker("error", uniprot_canonical_ac, data.error_code);
        // added by Gaurav on July 27, 2018. Web service error display.
        alertify.alert('Error occured', data.error_code);
    } else {
        activityTracker("user", uniprot_canonical_ac, "successful response");
        var template = $('#item_template').html();
        if (data.sequence) {
            var originalSequence = data.sequence.sequence;
            data.sequence.sequence = formatSequence(originalSequence);

            if (data.isoforms) {
                for (var i = 0; i < data.isoforms.length; i++) {
                    // assign the newly result of running formatSequence() to replace the old value
                    data.isoforms[i].sequence.sequence = formatSequence(data.isoforms[i].sequence.sequence);
                    data.isoforms[i].locus.start_pos = addCommas(data.isoforms[i].locus.start_pos);
                    data.isoforms[i].locus.end_pos = addCommas(data.isoforms[i].locus.end_pos);
                    if (data.isoforms[i].locus && data.isoforms[i].locus.evidence) {
                        data.isoforms[i].evidence = data.isoforms[i].locus.evidence;
                        formatEvidences([data.isoforms[i]]);
                    }
                }
            }


        }

        formatEvidences(data.species);
        formatEvidences(data.function);
        formatEvidences(data.mutation);
        formatEvidences(data.glycosylation);
        formatEvidences(data.expression_disease);
        formatEvidences(data.expression_tissue);
        formatEvidences(data.disease);

     


        var itemscrossRef = [];
        //check data.
        if (data.crossref) {
            for (var i = 0; i < data.crossref.length; i++) {
                var crossrefitem = data.crossref[i];
                var found = '';
                for (var j = 0; j < itemscrossRef.length; j++) {
                    var databaseitem = itemscrossRef[j];
                    if (databaseitem.database === crossrefitem.database) {
                        found = true;
                        databaseitem.links.push({
                            url: crossrefitem.url,
                            id: crossrefitem.id
                        });
                    }
                }
                if (!found) {
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

        var itemsPathway = [];
        if (data.pathway) {
            for (var i = 0; i < data.pathway.length; i++) {
                var pathwayitem = data.pathway[i];
                var found = '';
                for (var j = 0; j < itemsPathway.length; j++) {
                    var databaseitem1 = itemsPathway[j];
                    if (databaseitem1.resource === pathwayitem.resource) {
                        found = true;
                        databaseitem1.links.push({
                            url: pathwayitem.url,
                            id: pathwayitem.id,
                            name: pathwayitem.name
                        });
                    }
                }
                if (!found) {
                    itemsPathway.push({
                        resource: pathwayitem.resource,
                        links: [{
                            url: pathwayitem.url,
                            id: pathwayitem.id,
                            name: pathwayitem.name
                        }]
                    });
                }
            }

            data.itemsPathway = itemsPathway;
        }

        if (data.glycosylation) {
            highlight.o_link_glycosylation = getGlycosylationHighlightData(data.glycosylation, 'O-linked');
            highlight.n_link_glycosylation = getGlycosylationHighlightData(data.glycosylation, 'N-linked');
       
            data.glycosylation.sort(function (a, b) {
                // compare residue firs
                if (a.residue < b.residue) { return -1; }
                else if (b.residue < a.residue) { return 1; }
                // compare position
                else if (a.position < b.position) { return -1; }
                else if (b.position < a.position) { return 1; }
    
                // else the same
                return 0;
            });
       
            data.hasGlycosylation = (data.glycosylation.length > 0);
        }

        function hasGlycanId(item) {
            return (item.glytoucan_ac !== undefined);
        }

        if (data.glycosylation) {
            data.glycosylation = data.glycosylation.map(function (item) {
                item.residue = item.residue + item.position;
                return item;
            });

            data.itemsGlycosyl = data.glycosylation.filter(hasGlycanId);

            data.itemsGlycosyl2 = data.glycosylation.filter(function (item) {
                return !(hasGlycanId(item));
            });
        }

        var html = Mustache.to_html(template, data);
        var $container = $('#content');
        var itemsMutate = [];


        // filling in mutation data
        if (data.mutation) {
            // Get data for sequence highlight
            highlight.mutation = getMutationHighlightData(data.mutation);

            for (var i = 0; i < data.mutation.length; i++) {
                var mutate = data.mutation[i];
                formatEvidences([mutate]);

                itemsMutate.push({
                    annotation: mutate.annotation,
                    disease: mutate.disease,
                    type: mutate.type,
                    start_pos: mutate.start_pos,
                    end_pos: mutate.end_pos,
                    // merging the two sequences, separated by arrow symbol.
                    sequence: mutate.sequence_org + " &#8594 " + mutate.sequence_mut,
                    evidence: mutate.evidence,
                    database: mutate.databases
                });
            }
        }

        var sequenceData = buildHighlightData(originalSequence, highlight);

        $container.html(html);
        // setupEvidenceList();

        if (window.innerWidth <= 500) {
            createHighlightUi(sequenceData, 10);
        } else {
            createHighlightUi(sequenceData, 60);
        }
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

        // glycosylation table
        $('#glycosylation-table').bootstrapTable({
            columns: [
                {
                    field: 'databases',
                    title: 'Sources',
                    sortable: true,
                    formatter: EvidencebadgeFormator
                },
                {
                    field: 'glytoucan_ac',
                    title: 'GlyTouCan <br/> Accession',
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
                    title: 'Image of Glycan Structure',
                    sortable: true,
               
                    formatter: function imageFormat(value, row, index, field) {
                        var url = getWsUrl('glycan_image', row.glytoucan_ac);
                        return "<div class='img-wrapper'><img class='img-cartoon' src='" + url + "' alt='Cartoon' /></div>";
                    }
                }
            ],
            pagination: 10,
            data: data.itemsGlycosyl,
            onPageChange: function () {
                scrollToPanel("#glycosylation");
                setupEvidenceList();
            }
        });

        // glycosylation table
        $('#glycosylation-table2').bootstrapTable({
            columns: [
                {
                    field: 'databases',
                    title: 'Sources',
                    sortable: true,
                    formatter: EvidencebadgeFormator
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
                   
                }
            ],
            pagination: 10,
            data: data.itemsGlycosyl2,
            onPageChange: function () {
                scrollToPanel("#glycosylation");
                setupEvidenceList();
            }
        });

        $(".EmptyFind").each(function () {
            var $tid = $(this).attr("id");
            var $txt = $(this).text();
            if ($txt == "") {
                $('a[data-target=#' + $tid + ']').closest('table').hide();
            }
        });
        $('#loading_image').fadeOut();
        // mutation table
        $('#mutation-table').bootstrapTable({
            columns: [
                {
                    field: 'database',
                    title: 'Sources',
                    sortable: true,
                    formatter: EvidencebadgeFormator
                },

                {
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
                            diss = value.name + " (ICD10: " + value.icd10 + " ; DOID: <a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
                        else
                            diss = value.name + " (DOID: <a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
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
            onPageChange: function () {
                setupEvidenceList();
            }
        });

        $('#loading_image').fadeOut();

        // expression Disease table
        $('#expressionDisease-table').bootstrapTable({
            columns: [
                {
                    field: 'databases',
                    title: 'Sources',
                    sortable: true,
                    formatter: EvidencebadgeFormator
                },
                {
                    field: 'disease',
                    title: 'Disease',
                    sortable: true,
                    formatter: function (value, row, index, field) {
                        var diss1;
                        if (value.icd10)
                            diss1 = value.name + " (ICD10: " + value.icd10 + " ; DOID: <a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
                        else
                            diss1 = value.name + " (DOID: <a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
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
            data: data.expression_disease,
            onPageChange: function () {

                setupEvidenceList();
            }
        });

        $('#loading_image').fadeOut();

        // expression Disease table
        $('#expressionTissue-table').bootstrapTable({
            columns: [
                {
                    field: 'databases',
                    title: 'Sources',
                    sortable: true,
                    formatter: EvidencebadgeFormator
                },
                {
                    field: 'tissue',
                    title: 'Tissue',
                    sortable: true,
                    formatter: function (value, row, index, field) {
                        return value.name + " (UBERON: <a href='" + value.url + "' target='_blank'>" + value.uberon + "</a>)"
                    }
                },
                {
                    field: 'present',
                    title: 'Present',
                    sortable: true,
                    class: 'upper-case'
                }

            ],

            pagination: 10,
            data: data.expression_tissue,
            onPageChange: function () {

                setupEvidenceList();
            }
        });
    }

    setupEvidenceList();
    $('#loading_image').fadeOut();
}

/**
 * @param {data} the callback function to logging service on failure
 * Returns the GWU services fails.
 */
function ajaxFailure(jqXHR, textStatus, errorThrown) {
    // getting the appropriate error message from this function in utility.js file
    var err = decideAjaxError(jqXHR.status, textStatus);
    var errorMessage = JSON.parse(jqXHR.responseText).error_list[0].error_code || err;
    displayErrorByCode(errorMessage);
    activityTracker("error", uniprot_canonical_ac, err + ": " + errorMessage);
    $('#loading_image').fadeOut();
}

/**
 * @param {id} the LoadData function to configure and start the request to GWU service
 * Returns the GWU services.
 */

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

function setupEvidenceList () {
    var $evidenceBadges = $('.evidence_badge');
    $evidenceBadges.each(function () {
        var $badge = $(this);

        if (!$badge.attr('data-badge')) {
            $badge.find('button').on('click', show_evidence);
            $badge.attr('data-badge', true);
        }
    });
}

function show_evidence() {
    var $evidenceList = $(this).next();
    var isHidden = $evidenceList.hasClass('hidden');
    //$(".evidence_links").addClass("hidden");

    if (isHidden) {
        $evidenceList.removeClass("hidden");
    } else {
        $evidenceList.addClass("hidden");
    }

}

/**
 * getParameterByName function to extract query parametes from url
 * @param {name} string for the name of the variable variable to extract from query string
 * @param {url} string with the complete url with query string values
 * Returns the GWU services.
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

/**
 * to check checkbox selected not selected
 * @param {string} type
 */
function checkUncheck(type, element) {
    var $elements = $('[data-type="' + type + '"]');

    if (element.checked) {
        $elements.show();
    } else {
        $elements.hide();
    }
}

$(document).ready(function () {
    uniprot_canonical_ac = getParameterByName('uniprot_canonical_ac');
    document.title = uniprot_canonical_ac + " Detail - glygen"; //updates title with the protein ID
    LoadData(uniprot_canonical_ac);
});

/**
 * Gets the values selected in the download dropdown 
 * and sends to the downloadFromServer() function in utility.js
 * @author Gaurav Agarwal
 * @since Oct 22, 2018.
 */
function downloadPrompt() {
    var page_type = "protein_detail";
    var format = $('#download_format').val();
    var IsCompressed = $('#download_compression').is(':checked');
    downloadFromServer(uniprot_canonical_ac, format, IsCompressed, page_type);
}
