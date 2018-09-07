//@author: Gaurav Agarwal

//update: Rupali Mahadik:  //Glycan webservices, //Protein webservices

// @description: UO1 Version-1.1.

//@update:6 June 2018

//update:20 july://usecases search webservices
//update:31 july:// New base URL updated.

function getWsUrl(request, id, id1) {

    // var ws_base = "http://glygen-vm-tst.biochemistry.gwu.edu/api/";
    var ws_base = "http://tst.api.glygen.org/";
    
    var ws_base_glycan = ws_base+"glycan";
    var ws_base_protein = ws_base+"protein";
    var ws_base_typeahead = ws_base+"typeahead";
    var ws_logging = ws_base+"auth/logging";
    var ws_userID = ws_base+"auth/userid";
    var ws_contact = ws_base+"auth/contact";
    var ws_useCaseSearch=ws_base+"usecases";
    // var ws_base_loci=ws_base+"usecases";

    switch (request.toLowerCase()) {

        //Auth Webservices.
        case "generate_id":
            return ws_userID;
            break;
        case "log_activity":
            return ws_logging;
            break;
        case "contact":
            return ws_contact;
            break;
            
        //Glycan webservices
        case "search_init_glycan":
            return ws_base_glycan + "/search_init";
            break;

        case "glycan_search":
            return ws_base_glycan + "/search";
            break;
            
        case "glycan_image":
            return ws_base_glycan + "/image/" + id;
            break;
       
        case "glycan_list":
            return ws_base_glycan + "/list";
            break;
        case "glycan_detail":
            return ws_base_glycan + "/detail/" + id;
            break;


        //Protein webservices
        case "search_init_protein":
            return ws_base_protein + "/search_init";
            break;
        case "search_protein":
            return ws_base_protein + "/search";
            break;
        case "protein_image_service":
            return ws_base_glycan + "/image/" + id;
            break;
        case "protein_list":
            return ws_base_protein + "/list";
            break;
        case "protein_detail":
            return ws_base_protein + "/detail/" + id;
            break;




        //Typeahead webservices

        case "type-ahead":
            return ws_base_typeahead;
        default:
            return "WWW.GOOGLE.COM";
            break;

        //Usecases search webservices
//Usecases search webservices Q1-Q2-Q3
        case "search_bioenzyme":
            return ws_useCaseSearch + "/glycan_to_biosynthesis_enzymes/9606/" + id;
            break;
        case "search_glycansite":
            return ws_useCaseSearch + "/glycan_to_glycoproteins/9606/" + id;
            break;
        case "search_glycangene":
            return ws_useCaseSearch + "/glycan_to_enzyme_gene_loci/9606/" + id;
            break;

        // usecases list API Q3 and 4
        case "list_glycangene":
            return ws_useCaseSearch + "/ortholog_list";
            break;

        case "loci_list":
            return ws_useCaseSearch + "/genelocus_list";
            break;



        //Usecases search webservices Q4-Q6
        case "search_proteinorthologues":
            return ws_useCaseSearch + "/protein_to_orthologs/" + id;
            break;

        case "search_glycanenzyme":
            return ws_useCaseSearch + "/biosynthesis_enzyme_to_glycans/10090/" + id;
            break;


        //Usecases search webservices Q7-Q8-Q9

        case "search_glycosyltransferases":
            return ws_useCaseSearch + "/species_to_glycosyltransferases/" + id;
            break;
        case "search_glycohydrolases":
            return ws_useCaseSearch + "/species_to_glycohydrolases/" + id;
            break;
        case "search_glycoproteins":
             return ws_useCaseSearch + "/species_to_glycoproteins/" +id + "/" + id1;
            break;



        //Usecases DISEASE webservices Q.10
        case "search_disease":
            return ws_useCaseSearch + "/disease_to_glycosyltransferases";
            break;
    }
}


/**
 * getListPostData  function that returns the string with the correct format the GWU service need to get the list for a specific Id

 * @param {string} id -  serach ID
 */

function getListPostData(id, page, sort, dir, limit) {
    var query = {};
    query.id = id;
    //query.offset = parseInt(page);
    query.sort = sort;
    query.offset = ((page - 1) * limit) + 1;
    query.limit = parseInt(limit);
    query.order = dir;

    return "query=" + JSON.stringify(query);
}


function getSearchtypeheadData(field, value) {
    var query = {};
    query.field = field;
    query.value = value;
    query.limit = 100;
    return "query=" + JSON.stringify(query);
}