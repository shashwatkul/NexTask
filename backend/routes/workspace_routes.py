from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from extensions import db
from models.workspace import Workspace

workspace_bp = Blueprint(
    "workspace",
    __name__
)

# CREATE WORKSPACE
@workspace_bp.route("/", methods=["POST"])
@jwt_required()
def create_workspace():

    data = request.get_json()

    workspace = Workspace(
        name=data.get("name"),
        description=data.get("description"),
        created_by=get_jwt_identity()
    )

    db.session.add(workspace)
    db.session.commit()

    return jsonify({
        "message": "Workspace created"
    })


# GET WORKSPACES
@workspace_bp.route("/", methods=["GET"])
@jwt_required()
def get_workspaces():

    workspaces = Workspace.query.all()

    result = []

    for workspace in workspaces:

        result.append({
            "id": workspace.id,
            "name": workspace.name,
            "description": workspace.description
        })

    return jsonify(result)