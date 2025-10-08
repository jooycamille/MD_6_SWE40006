# Folder Structure

backend/
├── app/
│ ├── **init**.py # Flask app and DB initialization
│ ├── config.py # Config
│ ├── models.py # SQLAlchemy models
│ ├── routes.py # API endpoints
├── .env # Environment variables
├── docker-compose.yml # Docker orchestration
├── Dockerfile # Docker container config
├── init_db.py # DB initialization script
├── seed_db.py # Seed initial data
├── requirements.txt # Python dependencies
├── run.py # App entry point
├── README.md # You're here

# Setup Instructions

1. Create virtual environment
   `python -m venv venv`
   `source venv/bin/activate`

# or venv\Scripts\activate

2. Install dependencies
   `pip install -r requirements.txt`

3. Initialise database
   `python init_db.py`

4. Optional: Seed with sample todos
   `python seed_db.py`

5. Run the app
   `python run.py`

6. Docker
   `docker-compose up --build`

# Todo API Documentation

Base URL: `http://localhost:5000/api`

## Endpoints

### GET /api/todos

- Fetch list of all todos
- Request Body: None
- Response: `200 OK`

[
{
"id": 1,
"text": "Buy groceries",
"createdAt": "2025-10-08",
"completed": false
},
{
"id": 2,
"text": "Wash car",
"createdAt": "2025-10-07",
"completed": true
}
]

### POST /api/todos

- Add a new todo
- Request Headers: Content-Type: application/json
- Request Body:
  {
  "text": "Finish homework",
  "createdAt": "2025-10-08"
  }
- Response: `201 Created`
  {
  "id": 3,
  "text": "Finish homework",
  "createdAt": "2025-10-08",
  "completed": false
  }
- Errors: `400 Bad Request`
  { "error": "Todo text is required" }

### PUT /api/todos/<id>

- update a todo by its ID
- Request Headers: Content-Type: application/json
- Request Body:
  {
  "text": "Finish project",
  "createdAt": "2025-10-09",
  "completed": true
  }

- Response: `200 OK`
  {
  "id": 3,
  "text": "Finish project",
  "createdAt": "2025-10-09",
  "completed": true
  }

- Errors:
  `400 Bad Request` : if data is missing or text is empty
  `400 Not Found` : if todo doesn't exist

### DELETE /api/todos/<id>

- Delete a todo by ID
- Request Body: None
- Returns: `200 OK`
  { "message": "Todo deleted" }

### Other Common Error

`500 Internal Server Error` : Server/database error
