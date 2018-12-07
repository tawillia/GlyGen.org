// @author: Tatiana Williamson
// @description: UO1 Version-1.1.
// @Date: March 08, 2018.

/**
 * Represents a switch handler in glygen settings.
 * @param {string} el - Managing GlyGen settings. The user can enable or disable cookies. 
 */

function switchHandler(el) {
    $(document).ready(function() {
        var $checkbox = $('[name="manageSettingsEnabled"]');
        if(!$checkbox.is(':checked')) {
            $checkbox.attr('checked', false);
            $('#textManageSettingsDisabled').css('display', 'block');
            $('#textManageSettingsEnabled').css('display', 'none');
            $('#manageSettingsDisabled').css('display', 'block');
            $('#manageSettingsEnabled').css('display', 'none');
            
            clearLocalStore();
            doNotLog();
        } else {
            $checkbox.attr('checked', true);
            $('#textManageSettingsDisabled').css('display', 'none');
            $('#textManageSettingsEnabled').css('display', 'block');
            $('#manageSettingsDisabled').css('display', 'none');
            $('#manageSettingsEnabled').css('display', 'block');
            
            clearLocalStore();
            logID();
        }
    });
}

$(document).ready(function(){
    $("textManageSettingsDisabled").reset(function(event){
        event.preventDefault();
    });
});

/**
 * This updates the slider checkbox and text based on what was the user's selection to be logged.
 */
$(document).ready(function () {
    tracking();
    var $checkbox = $('[name="manageSettingsEnabled"]');
    if (localStorage.getItem("ID") === "Anonymous") {             
        // if user selected not to be tracked.
        $checkbox.attr('checked', false);
        $('#textManageSettingsDisabled').css('display', 'block');
        $('#textManageSettingsEnabled').css('display', 'none');
        $('#manageSettingsDisabled').css('display', 'block');
        $('#manageSettingsEnabled').css('display', 'none');
        // activityTracker("user", "", "");
    }
    else if (localStorage.getItem("ID")) {                
        // if an ID exists other than "Anonymous" so continue Logging activity.
        $checkbox.attr('checked', true);
        $('#textManageSettingsDisabled').css('display', 'none');
        $('#textManageSettingsEnabled').css('display', 'block');
        $('#manageSettingsDisabled').css('display', 'none');
        $('#manageSettingsEnabled').css('display', 'block');
        // activityTracker("user", "", "");
    }
    else {                                               
        // If nothing in the local storage then give the user a choice.
        $('#textManageSettingsDisabled').css('display', 'block');
        $('#textManageSettingsEnabled').css('display', 'none');
        $('#textManageSettingsDisabled').html("Do you want GlyGen to remember your searches for your future use? You can improve/streamline your searches by allowing GlyGen to monitor your interaction with our system. For example, your searches can be recorded so you can review them at a later date. This can be changed at any time in this section.");
    }
    $('#loading_image').fadeOut();
})