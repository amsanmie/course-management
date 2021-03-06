/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/student',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(coursename, lecname) {
            let ajax_options = {
                type: 'POST',
                url: 'api/student',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'coursename': coursename,
                    'lecname': lecname
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(coursename, lecname) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/student/' + lecname,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'coursename': coursename,
                    'lecname': lecname
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(lecname) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/student/' + lecname,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $coursename = $('#coursename'),
        $lecname = $('#lecname');

    // return the API
    return {
        reset: function() {
            $lecname.val('');
            $coursename.val('').focus();
        },
        update_editor: function(coursename, lecname) {
            $lecname.val(lecname);
            $coursename.val(coursename).focus();
        },
        build_table: function(student) {
            let rows = ''

            // clear the table
            $('.student table > tbody').empty();

            // did we get a student array?
            if (student) {
                for (let i=0, l=student.length; i < l; i++) {
                    rows += `<tr><td class="coursename">${student[i].coursename}</td><td class="lecname">${student[i].lecname}</td><td>${student[i].timestamp}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $coursename = $('#coursename'),
        $lecname = $('#lecname');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(coursename, lecname) {
        return coursename !== "" && lecname !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let coursename = $coursename.val(),
            lecname = $lecname.val();

        e.preventDefault();

        if (validate(coursename, lecname)) {
            model.create(coursename, lecname)
        } else {
            alert('Problem with first or last name input');
        }
    });

    $('#update').click(function(e) {
        let coursename = $coursename.val(),
            lecname = $lecname.val();

        e.preventDefault();

        if (validate(coursename, lecname)) {
            model.update(coursename, lecname)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let lecname = $lecname.val();

        e.preventDefault();

        if (validate('placeholder', lecname)) {
            model.delete(lecname)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            coursename,
            lecname;

        coursename = $target
            .parent()
            .find('td.coursename')
            .text();

        lecname = $target
            .parent()
            .find('td.lecname')
            .text();

        view.update_editor(coursename, lecname);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
