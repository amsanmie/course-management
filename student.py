"""
This is the student module and supports all the ReST actions for the
STUDENT collection
"""

# System modules
from datetime import datetime

# 3rd party modules
from flask import make_response, abort


def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))


# Data to serve with our API
STUDENT = {
    "Makinde": {
        "coursename": "Docker",
        "lecname": "Makinde",
        "timestamp": get_timestamp(),
    },
    "Oluwasanmi": {
        "coursename": "Terraform",
        "lecname": "Oluwasanmi",
        "timestamp": get_timestamp(),
    },
    "Tolu": {
        "coursename": "Jenkins",
        "lecname": "Tolu",
        "timestamp": get_timestamp(),
    },
}


def read_all():
    """
    This function responds to a request for /api/student
    with the complete lists of student

    :return:        json string of list of student
    """
    # Create the list of student from our data
    return [STUDENT[key] for key in sorted(STUDENT.keys())]


def read_one(lecname):
    """
    This function responds to a request for /api/student/{lecname}
    with one matching student from student

    :param lecname:   last name of student to find
    :return:        student matching last name
    """
    # Does the student exist in student?
    if lecname in STUDENT:
        student = STUDENT.get(lecname)

    # otherwise, nope, not found
    else:
        abort(
            404, "student with last name {lecname} not found".format(lecname=lecname)
        )

    return student


def create(student):
    """
    This function creates a new student in the student structure
    based on the passed in student data

    :param student:  student to create in student structure
    :return:        201 on success, 406 on student exists
    """
    lecname = student.get("lecname", None)
    coursename = student.get("coursename", None)

    # Does the student exist already?
    if lecname not in STUDENT and lecname is not None:
        STUDENT[lecname] = {
            "lecname": lecname,
            "coursename": coursename,
            "timestamp": get_timestamp(),
        }
        return STUDENT[lecname], 201

    # Otherwise, they exist, that's an error
    else:
        abort(
            406,
            "student with last name {lecname} already exists".format(lecname=lecname),
        )


def update(lecname, student):
    """
    This function updates an existing student in the student structure

    :param lecname:   last name of student to update in the student structure
    :param student:  student to update
    :return:        updated student structure
    """
    # Does the student exist in student?
    if lecname in STUDENT:
        STUDENT[lecname]["coursename"] = student.get("coursename")
        STUDENT[lecname]["timestamp"] = get_timestamp()

        return STUDENT[lecname]

    # otherwise, nope, that's an error
    else:
        abort(
            404, "student with last name {lecname} not found".format(lecname=lecname)
        )


def delete(lecname):
    """
    This function deletes a student from the student structure

    :param lecname:   last name of student to delete
    :return:        200 on successful delete, 404 if not found
    """
    # Does the student to delete exist?
    if lecname in STUDENT:
        del STUDENT[lecname]
        return make_response(
            "{lecname} successfully deleted".format(lecname=lecname), 200
        )

    # Otherwise, nope, student to delete not found
    else:
        abort(
            404, "student with last name {lecname} not found".format(lecname=lecname)
        )
