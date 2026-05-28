from extensions import db

class Task(db.Model):

    __tablename__ = "tasks"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    status = db.Column(
        db.String(50),
        default="Todo"
    )

    priority = db.Column(
        db.String(50),
        default="Medium"
    )

    due_date = db.Column(
        db.Date
    )

    assigned_to = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )

    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id")
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )