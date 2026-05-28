from flask import Blueprint, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from datetime import date, timedelta

from models.task import Task

dashboard_bp = Blueprint(
    "dashboard",
    __name__
)

@dashboard_bp.route("/metrics", methods=["GET"])
@jwt_required()
def get_metrics():

    user_id = get_jwt_identity()

    today = date.today()

    assigned_tasks = Task.query.filter_by(
        assigned_to=user_id
    ).count()

    completed_tasks = Task.query.filter_by(
        assigned_to=user_id,
        status="Done"
    ).count()

    open_tasks = Task.query.filter(
        Task.assigned_to == user_id,
        Task.status != "Done"
    ).count()

    overdue_tasks = Task.query.filter(
        Task.assigned_to == user_id,
        Task.due_date < today,
        Task.status != "Done"
    ).count()

    upcoming_deadlines = Task.query.filter(
        Task.assigned_to == user_id,
        Task.due_date >= today,
        Task.due_date <= today + timedelta(days=7)
    ).count()

    return jsonify({
        "assigned_tasks": assigned_tasks,
        "completed_tasks": completed_tasks,
        "open_tasks": open_tasks,
        "overdue_tasks": overdue_tasks,
        "upcoming_deadlines": upcoming_deadlines
    })