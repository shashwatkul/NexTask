from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from extensions import db
from models.workspace import Workspace
from models.workspace_member import WorkspaceMember

workspace_bp = Blueprint(
    "workspace",
    __name__
)

# CREATE WORKSPACE
@workspace_bp.route("/", methods=["POST"])
@jwt_required()
def create_workspace():

    data = request.get_json()

    user_id = get_jwt_identity()

    workspace = Workspace(
        name=data.get("name"),
        description=data.get("description"),
        created_by=user_id
    )

    db.session.add(workspace)
    db.session.commit()

    owner = WorkspaceMember(
        user_id=user_id,
        workspace_id=workspace.id,
        role="Owner"
    )

    db.session.add(owner)
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

# ADD MEMBER
@workspace_bp.route(
    "/<int:workspace_id>/members",
    methods=["POST"]
)
@jwt_required()
def add_member(workspace_id):

    data = request.get_json()

    member = WorkspaceMember(
        user_id=data.get("user_id"),
        workspace_id=workspace_id,
        role=data.get("role", "Member")
    )

    db.session.add(member)
    db.session.commit()

    return jsonify({
        "message": "Member added"
    })


# GET MEMBERS
@workspace_bp.route(
    "/<int:workspace_id>/members",
    methods=["GET"]
)
@jwt_required()
def get_members(workspace_id):

    members = WorkspaceMember.query.filter_by(
        workspace_id=workspace_id
    ).all()

    result = []

    for member in members:

        result.append({
            "id": member.id,
            "user_id": member.user_id,
            "role": member.role
        })

    return jsonify(result)
