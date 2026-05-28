from models.workspace_member import (
    WorkspaceMember
)

def is_workspace_member(
    user_id,
    workspace_id
):

    member = WorkspaceMember.query.filter_by(
        user_id=user_id,
        workspace_id=workspace_id
    ).first()

    return member is not None