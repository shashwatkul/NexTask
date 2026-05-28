from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)



from extensions import db, bcrypt
from models.user import User

auth_bp = Blueprint("auth", __name__)


# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "message": "Email already exists"
        }), 400

    hashed_password = bcrypt.generate_password_hash(
        password
    ).decode("utf-8")

    user = User(
        name=name,
        email=email,
        password_hash=hashed_password
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    }), 201


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "message": "Invalid credentials"
        }), 401

    is_valid = bcrypt.check_password_hash(
        user.password_hash,
        password
    )

    if not is_valid:
        return jsonify({
            "message": "Invalid credentials"
        }), 401

    access_token = create_access_token(
        identity=str(user.id)
    )

    refresh_token = create_refresh_token(
        identity=str(user.id)
    )

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    })

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():

    user_id = get_jwt_identity()

    access_token = create_access_token(
        identity=user_id
    )

    return jsonify({
        "access_token": access_token
    })


# PROFILE
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email
    })