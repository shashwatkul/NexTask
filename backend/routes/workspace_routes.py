from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from extensions import db

from models.workspace import Workspace
from models.workspace_member import WorkspaceMember
from models.user import User

workspace_bp = Blueprint(
    "workspace",
    __name__
)

# =====================================
# CREATE WORKSPACE
# =====================================

@workspace_bp.route("/", methods=["POST"])
@jwt_required()
def create_workspace():

    data = request.get_json()

    # VALIDATION

    if (
        not data.get("name") or
        not data.get("description")
    ):

        return jsonify({
            "message":
            "All fields are required"
        }), 400

    user_id = get_jwt_identity()

    # CREATE WORKSPACE

    workspace = Workspace(
        name=data.get("name"),
        description=data.get("description"),
        created_by=user_id
    )

    db.session.add(workspace)

    db.session.commit()

    # PREVENT DUPLICATE OWNER ENTRY

    existing_owner = (
        WorkspaceMember.query.filter_by(
            user_id=user_id,
            workspace_id=workspace.id
        ).first()
    )

    if not existing_owner:

        owner = WorkspaceMember(
            user_id=user_id,
            workspace_id=workspace.id,
            role="Owner"
        )

        db.session.add(owner)

        db.session.commit()

    return jsonify({
        "message":
        "Workspace created"
    })


# =====================================
# GET WORKSPACES
# =====================================

@workspace_bp.route("/", methods=["GET"])
@jwt_required()
def get_workspaces():

    user_id = get_jwt_identity()

    memberships = (
        WorkspaceMember.query.filter_by(
            user_id=user_id
        ).all()
    )

    result = []

    seen_workspaces = set()

    for membership in memberships:

        workspace = Workspace.query.get(
            membership.workspace_id
        )

        if (
            workspace and
            workspace.id not in seen_workspaces
        ):

            result.append({
                "id": workspace.id,
                "name": workspace.name,
                "description":
                workspace.description,
                "role":
                membership.role
            })

            seen_workspaces.add(
                workspace.id
            )

    return jsonify(result)


# =====================================
# DELETE WORKSPACE
# =====================================

@workspace_bp.route(
    "/<int:workspace_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_workspace(workspace_id):

    user_id = get_jwt_identity()

    workspace = Workspace.query.get(
        workspace_id
    )

    if not workspace:

        return jsonify({
            "message":
            "Workspace not found"
        }), 404

    # CHECK OWNER ROLE

    member = (
        WorkspaceMember.query.filter_by(
            workspace_id=workspace_id,
            user_id=user_id
        ).first()
    )

    if (
        not member or
        member.role != "Owner"
    ):

        return jsonify({
            "message":
            "Only workspace owner can delete workspace"
        }), 403

    db.session.delete(workspace)

    db.session.commit()

    return jsonify({
        "message":
        "Workspace deleted"
    })


# =====================================
# GET + ADD MEMBERS
# =====================================

@workspace_bp.route(
    "/<int:workspace_id>/members",
    methods=["GET", "POST"]
)
@jwt_required()
def workspace_members(workspace_id):

    # =================================
    # GET MEMBERS
    # =================================

    if request.method == "GET":

        members = (
            WorkspaceMember.query.filter_by(
                workspace_id=workspace_id
            ).all()
        )

        result = []

        for member in members:

            result.append({
                "id": member.id,
                "user_id": member.user_id,
                "role": member.role
            })

        return jsonify(result)

    # =================================
    # ADD MEMBER
    # =================================

    if request.method == "POST":

        data = request.get_json()

        email = data.get("email")

        if not email:

            return jsonify({
                "message":
                "Email is required"
            }), 400

        user = User.query.filter_by(
            email=email
        ).first()

        if not user:

            return jsonify({
                "message":
                "User not found"
            }), 404

        existing_member = (
            WorkspaceMember.query.filter_by(
                workspace_id=workspace_id,
                user_id=user.id
            ).first()
        )

        if existing_member:

            return jsonify({
                "message":
                "User already a member"
            }), 400

        member = WorkspaceMember(
            user_id=user.id,
            workspace_id=workspace_id,
            role=data.get(
                "role",
                "Member"
            )
        )

        db.session.add(member)

        db.session.commit()

        return jsonify({
            "message":
            "Member added"
        })


# =====================================
# UPDATE MEMBER ROLE
# =====================================

@workspace_bp.route(
    "/members/<int:member_id>",
    methods=["PUT"]
)
@jwt_required()
def update_member_role(member_id):

    member = WorkspaceMember.query.get(
        member_id
    )

    if not member:

        return jsonify({
            "message":
            "Member not found"
        }), 404

    data = request.get_json()

    member.role = data.get(
        "role",
        member.role
    )

    db.session.commit()

    return jsonify({
        "message":
        "Role updated"
    })


# =====================================
# REMOVE MEMBER
# =====================================

@workspace_bp.route(
    "/members/<int:member_id>",
    methods=["DELETE"]
)
@jwt_required()
def remove_member(member_id):

    member = WorkspaceMember.query.get(
        member_id
    )

    if not member:

        return jsonify({
            "message":
            "Member not found"
        }), 404

    db.session.delete(member)

    db.session.commit()

    return jsonify({
        "message":
        "Member removed"
    })