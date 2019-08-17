/* Script to list the offered courses under selected course category for Natural Learning Is Fun(Courses page)
 * Author: HartCode programmer
 * Date: 08/16/2019
 */
"Use Strict";
/* Ready event during onload 
 */
$(function() {

    // Assign reference to required field for processing
    const selectCategoryListField = $("#selectCategoryList");
    let errorMsgIdField = $("#errorMsgId");
    let listOfCoursesObjects, listOfCategoriesObjs;

    // Store the JSON category data by making AJAX - JSON call to load the dropdown during onload.
    $.getJSON("/api/categories", function(data) {
            listOfCategoriesObjs = data;
        })
        // on success load the page with the dropdown
        .done(function() {
            loadCategoriesDropDown(listOfCategoriesObjs, selectCategoryListField);
        })
        // on failure, Request user to retry
        .fail(function() {
            console.log("failure");
            errorMsg = "Failure to get server data, please retry"
            errorMsgIdField.html(errorMsg);
            errorMsgIdField.addClass("badInput");
        });


    //Event handler function to assign for onchange
    selectCategoryListField.on("change", function() {
        // validate user inputs
        let isValid = checkUserInput(selectCategoryListField, errorMsgIdField);
        if (isValid) {
            //JSON call to get list of courses by selection category
            $.getJSON(("/api/courses/bycategory/" + selectCategoryListField.val()), function(data) {
                    listOfCoursesObjects = data;
                })
                .done(function() {
                    // on success, build the list of available courses for selected category
                    listCourses(listOfCoursesObjects);
                })
                .fail(function() {
                    // on failure, build informational message to user
                    errorMsg = "Failure to get server data, please retry"
                    errorMsgIdField.html(errorMsg);
                    errorMsgIdField.addClass("badInput");
                });
            $("#errorMsgId").empty();
        } else {
            // Clear the course List table, if there are errors
            $("#courseslist").empty();
        }
    });
});

/* Event Handler function to load categories Menu dropdown during windows Onload 
 * @param = listOfCategoriesObjs (javascript object) - contains list of category and value from server  
 * @param = selectCategoryListField (dropdown) - contains reference to course category dropdown
 * calls to None
 */
function loadCategoriesDropDown(listOfCategoriesObjs, selectCategoryListField) {
    for (let i = 0; i < listOfCategoriesObjs.length; i++) {
        selectCategoryListField.append($("<option></option>").val(listOfCategoriesObjs[i].Value).html(listOfCategoriesObjs[i].Category));
    }
}

/* Event Handler function to create table with list of courses for the selected category during onchange event 
 * @param = listOfCoursesObjects (javascript object) - contains list of courses for the selected category 
 * calls to createTableHead(), createTableBody()
 */
function listCourses(listOfCoursesObjects) {
    let table = $("#courseslist");
    table.addClass("table container table-responsive table-striped mt-3 ml-5");
    // create table head and body
    createTableHead(table);
    createTableBody(table);
    // Build table course list
    $.each(listOfCoursesObjects, function(key, value) {
        table.append("<tr><td>" + value.Title + "</td><td>" + value.Location + "</td><td>" + value.StartDate + "</td>" +
            "<td><a class='btn-sm btn-info' href='details.html?id=" + value.CourseId + "'>View Details</a></td>");
    })
}

/* function is to create a table body, if not available and assign an ID to table body
 * @param table (Table reference) - Table with list of courses
 * calls: None
 */
function createTableBody(table) {
    // create tbody if it does not exist and assign an ID, if already exists, clear them  
    // table.innerHTML = " "; use if we want to clear the whole table
    let tbody = $("tbody");
    if (tbody.length != 0) {
        tbody.empty();
    } else {
        table.append("<tbody></tbody>")
        $("tbody").attr("id", "coursesTbodyId");
    }
}

/* function is to create a table head for table ID - courseslist
 * @param table (Table reference) - Table with list of courses
 * calls: None
 */
function createTableHead(table) {
    let thead = $("thead");
    if (thead.length == 0) {
        table.append("<thead><tr><th>Title</th><th>Location</th><th>Start Date</th><th>More Info</th></tr></thead>");
    }
}

/* This function is to validate user selection
 * populate error message field
 * @param (string) - selected course category type dropdown
 * @param (string) - Error message field to build appropriate error message
 * calls: None
 */
function checkUserInput(selectCategoryListField, errorMsgIdField) {
    let errorMsg, isError = false;
    // set Error flag based on number validation
    if ((selectCategoryListField.val()) == " ") {
        errorMsg = "Select valid courses from 'Courses Lists' dropdown to display";
        isError = true;
    } else {
        isError = false;
    }
    // Set attribute and content for para tag - Error message / Success
    if (isError == true) {
        errorMsgIdField.html(errorMsg);
        errorMsgIdField.addClass("badInput");
        return false;
    } else {
        return true;
    }
}