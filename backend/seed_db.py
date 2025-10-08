from app import create_app
from app.models import db, Todo

app = create_app()

with app.app_context():
    sample_todos = [
        Todo(text="Finish SWE40006 backend", created_at="08/10/2025"),
        Todo(text="Test frontend integration", created_at="08/10/2025"),
        Todo(text="Write README and commit", created_at="08/10/2025", completed=True)
    ]
    db.session.bulk_save_objects(sample_todos)
    db.session.commit()
    print("Sample todos seeded.")
