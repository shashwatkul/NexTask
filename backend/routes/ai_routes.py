import os
import json

from datetime import date
from dotenv import load_dotenv

from flask import (
    Blueprint,
    request,
    jsonify
)

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from openai import OpenAI

from models.task import Task

load_dotenv(
    dotenv_path=".env"
)

ai_bp = Blueprint(
    "ai",
    __name__
)

client = OpenAI(

    base_url=
    "https://openrouter.ai/api/v1",

    api_key=os.getenv(
        "OPENAI_API_KEY"
    )
)

print(
    os.getenv(
        "OPENAI_API_KEY"
    )
)

# =====================================
# AI TASK ENRICHMENT
# =====================================

@ai_bp.route(
    "/enrich-task",
    methods=["POST"]
)
@jwt_required()
def enrich_task():

    data = request.get_json()

    title = data.get("title")

    if not title:

        return jsonify({
            "message":
            "Task title is required"
        }), 400

    try:

        SYSTEM_PROMPT = """
You are an expert project management AI assistant.

Your task is to convert rough task titles into structured engineering task briefs.

IMPORTANT RULES:
- Output MUST be valid JSON only
- Do NOT include markdown
- Do NOT include explanations
- Do NOT hallucinate fields
- Follow the exact schema
- Keep descriptions concise but useful
- acceptance_criteria must be an array of strings
- priority must be one of:
  low, medium, high, critical
- suggested_labels must contain short labels only
- If task is vague, make best reasonable assumptions
- Never invent technologies not implied by context

Required JSON schema:

{
  "description": "...",
  "acceptance_criteria": [
    "...",
    "..."
  ],
  "priority": "low | medium | high | critical",
  "suggested_labels": [
    "..."
  ]
}
"""

        response = (
            client.chat.completions.create(

                model=
                "openai/gpt-4o-mini",

                messages=[

                    {
                        "role": "system",
                        "content":
                        SYSTEM_PROMPT
                    },

                    {
                        "role": "user",
                        "content":
                        f"Task title: {title}"
                    }
                ],

                temperature=0.3
            )
        )

        content = (
            response.choices[0]
            .message.content
        )

        parsed = json.loads(content)

        return jsonify(parsed)

    except Exception as e:

        print(e)

        return jsonify({
            "message":
            "AI enrichment failed",
            "error": str(e)
        }), 500


# =====================================
# AI DAILY STANDUP
# =====================================

@ai_bp.route(
    "/generate-standup",
    methods=["GET"]
)
@jwt_required()
def generate_standup():

    try:

        user_id = int(
    get_jwt_identity()
  )

        today = date.today()

        completed_tasks = Task.query.filter(
            Task.assigned_to == user_id,
            Task.status == "Done"
        ).all()

        in_progress_tasks = Task.query.filter(
            Task.assigned_to == user_id,
            Task.status == "In Progress"
        ).all()

        overdue_tasks = Task.query.filter(
            Task.assigned_to == user_id,
            Task.due_date.isnot(None),
            Task.due_date < today,
            Task.status != "Done"
        ).all()

        completed_list = [

            task.title

            for task in completed_tasks

        ] or ["No completed tasks"]

        progress_list = [

            task.title

            for task in in_progress_tasks

        ] or ["No active tasks"]

        blocker_list = [

            task.title

            for task in overdue_tasks

        ] or ["No blockers"]

        SYSTEM_PROMPT = """
You are an AI agile assistant.

Generate a concise professional daily standup update.

Format:

Yesterday:
- ...

Today:
- ...

Blockers:
- ...

Rules:
- Keep it concise
- Use bullet points
- Be professional
- Use only provided task data
- Do not hallucinate
"""

        USER_PROMPT = f"""
Completed Tasks:
{completed_list}

In Progress Tasks:
{progress_list}

Overdue Tasks:
{blocker_list}
"""

        response = (
            client.chat.completions.create(

                model=
                "openai/gpt-4o-mini",

                messages=[

                    {
                        "role": "system",
                        "content":
                        SYSTEM_PROMPT
                    },

                    {
                        "role": "user",
                        "content":
                        USER_PROMPT
                    }
                ],

                temperature=0.3
            )
        )

        standup = (
            response.choices[0]
            .message.content
        )

        return jsonify({
            "standup": standup
        })

    except Exception as e:

        print(e)

        return jsonify({
            "message":
            "Standup generation failed",
            "error": str(e)
        }), 500