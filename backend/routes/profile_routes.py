from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from extensions import db, bcrypt

from models.user import User

profile_bp = Blueprint(
    "profile",
    __name__
)

# GET PROFILE
@profile_bp.route("/", methods=["GET"])
@jwt_required()
def get_profile():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email
    })


# UPDATE PROFILE
@profile_bp.route("/", methods=["PUT"])
@jwt_required()
def update_profile():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    data = request.get_json()

    user.name = data.get(
        "name",
        user.name
    )

    user.email = data.get(
        "email",
        user.email
    )

    if data.get("password"):

        user.password = bcrypt.generate_password_hash(
            data.get("password")
        ).decode("utf-8")

    db.session.commit()

    return jsonify({
        "message": "Profile updated"
    })