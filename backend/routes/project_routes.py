from flask import Blueprint, request, jsonify


from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from utils.access_control import (
    is_workspace_member
)

from extensions import db
from models.project import Project

project_bp = Blueprint(
    "project",
    __name__
)

# CREATE PROJECT
@project_bp.route("/", methods=["POST"])
@jwt_required()
def create_project():

    data = request.get_json()

    user_id = get_jwt_identity()

    workspace_id = data.get("workspace_id")

    if not is_workspace_member(
        user_id,
        workspace_id
    ):

        return jsonify({
            "message": "Access denied"
        }), 403

    project = Project(
        name=data.get("name"),
        description=data.get("description"),
        workspace_id=workspace_id
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({
        "message": "Project created"
    })


# GET PROJECTS
@project_bp.route("/<int:workspace_id>", methods=["GET"])
@jwt_required()
def get_projects(workspace_id):

    user_id = get_jwt_identity()

    if not is_workspace_member(
        user_id,
        workspace_id
    ):

        return jsonify({
            "message": "Access denied"
        }), 403

    projects = Project.query.filter_by(
        workspace_id=workspace_id
    ).all()

    result = []

    for project in projects:

        result.append({
            "id": project.id,
            "name": project.name,
            "description": project.description
        })

    return jsonify(result)
    