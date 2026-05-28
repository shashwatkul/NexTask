from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from extensions import db

from models.comment import Comment
from models.activity_log import ActivityLog

comment_bp = Blueprint(
    "comment",
    __name__
)

# ADD COMMENT
@comment_bp.route("/", methods=["POST"])
@jwt_required()
def add_comment():

    data = request.get_json()

    user_id = get_jwt_identity()

    comment = Comment(
        content=data.get("content"),
        user_id=user_id,
        task_id=data.get("task_id")
    )

    db.session.add(comment)

    activity = ActivityLog(
        action="Added a comment",
        user_id=user_id,
        task_id=data.get("task_id")
    )

    db.session.add(activity)

    db.session.commit()

    return jsonify({
        "message": "Comment added"
    })


# GET COMMENTS
@comment_bp.route(
    "/<int:task_id>",
    methods=["GET"]
)
@jwt_required()
def get_comments(task_id):

    comments = Comment.query.filter_by(
        task_id=task_id
    ).all()

    result = []

    for comment in comments:

        result.append({
            "id": comment.id,
            "content": comment.content,
            "user_id": comment.user_id
        })
    return jsonify(result)

# UPDATE COMMENT
@comment_bp.route(
    "/<int:comment_id>",
    methods=["PUT"]
)
@jwt_required()
def update_comment(comment_id):

    user_id = get_jwt_identity()

    comment = Comment.query.get(
        comment_id
    )

    if not comment:

        return jsonify({
            "message": "Comment not found"
        }), 404

    if str(comment.user_id) != str(user_id):

        return jsonify({
            "message": "Unauthorized"
        }), 403

    data = request.get_json()

    comment.content = data.get(
        "content",
        comment.content
    )

    db.session.commit()

    return jsonify({
        "message": "Comment updated"
    })


# DELETE COMMENT
@comment_bp.route(
    "/<int:comment_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_comment(comment_id):

    user_id = get_jwt_identity()

    comment = Comment.query.get(
        comment_id
    )

    if not comment:

        return jsonify({
            "message": "Comment not found"
        }), 404

    if str(comment.user_id) != str(user_id):

        return jsonify({
            "message": "Unauthorized"
        }), 403

    db.session.delete(comment)

    db.session.commit()

    return jsonify({
        "message": "Comment deleted"
    })