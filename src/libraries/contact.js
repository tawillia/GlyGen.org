$(function () {

    // init the validator

    $('#contact-form').validator();


    // when the form is submitted
    $('#contact-form').on('submit', function (e) {

        // if the validator does not prevent form submit
        if (!e.isDefaultPrevented()) {
            e.preventDefault();
            var url = getWsUrl("contact");
            var formVal = $(this).serializeArray();
            var formData = {
                "fname": formVal[0].value,
                "lname": formVal[1].value,
                "email": formVal[3].value,
                "subject": formVal[2].value,
                "message": formVal[4].value
            }
            // POST values in the background the the script URL
            $.ajax({
                type: "POST",
                url: url,
                data: "query="+JSON.stringify(formData),
                success: function (result) {
                    // data = JSON object that contact.php returns
                    var messageAlert, messageText;
                    if (result.error_code) {
                        messageAlert = 'alert-danger';
                        messageText = result.error_code;
                    } else {
                        // we recieve the type of the message: success x danger and apply it to the 
                        messageAlert = result.type;
                        messageText = result.message;
                    }
                    contactReply(messageAlert, messageText);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // we recieve the type of the message: success x danger and apply it to the 
                    var messageAlert = 'alert-danger';
                    var messageText = "Oops, something went wrong! We did not receive your message. Please try again later. " + errorThrown;
                    contactReply(messageAlert, messageText);
                    activityTracker("error", "", textStatus + ": " + errorThrown);
                }
            });
            return false;
        }
    })

    function contactReply(messageAlert, messageText) {
        // let's compose Bootstrap alert box HTML
        var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';

        // If we have messageAlert and messageText
        if (messageAlert && messageText) {
            // inject the alert to .messages div in our form
            $('#contact-form').find('.messages').html(alertBox);
            // empty the form
            $('#contact-form')[0].reset();
        }
    }
});