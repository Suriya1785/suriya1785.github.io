/* Script to list the form to enter for student to register for selected course from detail pages  
 * Author: HartCode programmer
 * Date: 08/16/2019
 */
"Use Strict";

$(function() {
    // Read URL and get the user selection to build the courseid
    let urlParams = new URLSearchParams(location.search);
    let courseid = urlParams.get("id");
    let errorMsgIdField = $("#errorMsgId");
    // Set course ID in registration form by catching it from URL during onload
    $("#courseid").val(courseid);
    // set it as button to have validation in the future if there are no more slots available
    let submitBtnField = $("#submitBtn");
    let resetBtnField = $("#resetBtn");

    //Submit button event handler
    submitBtnField.on("click", sendRegistrationForm);

    // Reset button event handler
    resetBtnField.on("click", function() {
        // jquery does not have any reset method, get the form through jquery and reset through javascript
        $("#registerForm").get(0).reset();
        // upon reset, set the courseid value
        $("#courseid").val(courseid);
        $("#errorMsgId").empty();
    })

});


/* function is to send the user entered registration form to server
 * @param: None
 * Calls: None
 */
function sendRegistrationForm() {
    // following did not follow camelCase, as name attribute expected 
    let courseid = $("#courseid").val();
    let inputStudentName = $("#studentname").val();
    let inputEmail = $("#email").val();
    let errorMsgIdField = $("#errorMsgId");
    // validate user input before posting to server
    let isDataValid = validateForm(inputStudentName, inputEmail, errorMsgIdField);
    if (isDataValid) {
        // AJAX call to send the form data to server upon serialization 
        $.post("/api/register", $("#registerForm").serialize(),
            function(data) {
                let regUrl = "details.html?id=" + courseid;
                window.location.replace(regUrl);
            }
        );
        return false;
    }
}

/* function is to validate the filled form and build error message block if applicable 
 * @param: None
 * Calls: None
 */
function validateForm(inputStudentName, inputEmail, errorMsgIdField) {
    let errorMsg = [];
    let isError = false;
    let temp = "";
    // validate empty student name
    if (!inputStudentName.replace(/\s/g, "".length)) {
        errorMsg[errorMsg.length] = "Please enter Student name";
        isError = true;
    }
    //validate e-mail address 
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputEmail))) {
        errorMsg[errorMsg.length] = "Please enter valid email";
        isError = true;
    }

    if (isError == true) {
        // Read error message array and build the error block
        $.each(errorMsg, function(key, value) {
            temp = temp + "</br>" + value;
        })
        errorMsgIdField.html(temp);
        errorMsgIdField.addClass("badInput");
        return false;
    } else {
        return true;
    }

}