from flask import Blueprint, jsonify

from flask_jwt_extended import (
    jwt_required
)

from models.activity_log import ActivityLog

activity_bp = Blueprint(
    "activity",
    __name__
)

@activity_bp.route(
    "/<int:task_id>",
    methods=["GET"]
)
@jwt_required()
def get_activity(task_id):

    activities = ActivityLog.query.filter_by(
        task_id=task_id
    ).all()

    result = []

    for activity in activities:

        result.append({
            "id": activity.id,
            "action": activity.action,
            "user_id": activity.user_id
        })

    return jsonify(result)