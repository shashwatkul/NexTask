from extensions import db

class ActivityLog(db.Model):

    __tablename__ = "activities"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    action = db.Column(
        db.String(255)
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )

    task_id = db.Column(
        db.Integer,
        db.ForeignKey("tasks.id")
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )