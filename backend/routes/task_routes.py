from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required
)
from datetime import datetime
from extensions import db
from models.task import Task

task_bp = Blueprint(
    "task",
    __name__
)

# CREATE TASK
@task_bp.route("/", methods=["POST"])
@jwt_required()
def create_task():

    data = request.get_json()

    task = Task(
    title=data.get("title"),
    description=data.get("description"),
    status=data.get("status", "Todo"),
    priority=data.get("priority", "Medium"),
    due_date=datetime.strptime(
        data.get("due_date"),
        "%Y-%m-%d"
    ).date() if data.get("due_date") else None,
    assigned_to=data.get("assigned_to"),
    project_id=data.get("project_id")
)
    
    db.session.add(task)
    db.session.commit()

    return jsonify({
        "message": "Task created"
    })


# GET TASKS
@task_bp.route("/<int:project_id>", methods=["GET"])
@jwt_required()
def get_tasks(project_id):

    status = request.args.get("status")
    priority = request.args.get("priority")
    assigned_to = request.args.get("assigned_to")

    query = Task.query.filter_by(
        project_id=project_id
    )

    if status:
        query = query.filter_by(
            status=status
        )

    if priority:
        query = query.filter_by(
            priority=priority
        )

    if assigned_to:
        query = query.filter_by(
            assigned_to=assigned_to
        )

    tasks = query.all()

    result = []

    for task in tasks:

        result.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "priority": task.priority,
            "due_date": (
                task.due_date.strftime("%Y-%m-%d")
                if task.due_date else None
            ),
            "assigned_to": task.assigned_to
        })

    return jsonify(result)


# UPDATE TASK STATUS
@task_bp.route("/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):

    task = Task.query.get(task_id)

    data = request.get_json()

    task.status = data.get("status")

    db.session.commit()

    return jsonify({
        "message": "Task updated"
    })


# DELETE TASK
@task_bp.route("/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):

    task = Task.query.get(task_id)

    db.session.delete(task)

    db.session.commit()

    return jsonify({
        "message": "Task deleted"
    })