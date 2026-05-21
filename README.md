# StudySync Academic Dashboard

StudySync is a comprehensive academic dashboard built with Django. It helps students manage their subjects, attendance, assignments, notes, study planning, and calendar events all in one centralized hub.

## Prerequisites

- Python 3.8+
- pip (Python package installer)

## Installation & Setup

Follow these steps to run the project locally:

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd studysync-academic-dashboard
```

### 2. Create a Virtual Environment (Recommended)
```bash
python -m venv studyenv

# On Windows:
studyenv\Scripts\activate

# On macOS/Linux:
source studyenv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```
*Note: If `requirements.txt` is missing, you can simply install django via `pip install django`.*

### 4. Apply Database Migrations
Run the following commands to create the SQLite database tables:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Run the Development Server
```bash
python manage.py runserver
```

## Access the Application

Once the server is running, open your web browser and go to:
- **Application:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

Sign up for a new account directly from the application's login screen to get started.

## Features

- **Dashboard:** Overview of your academic life with dynamic Chart.js charts.
- **Setup Workspace:** Configure your current semester subjects and weekly timetable.
- **Attendance Tracker:** Mark attendance and see critical safe/danger thresholds.
- **Assignments:** Track tasks with auto-overdue tagging based on deadlines.
- **Study Planner:** Schedule study sessions and set weekly goals.
- **Notes:** Create and pin important notes with category tags.
- **Calendar:** Unified month-view for all exams, deadlines, and personal events.

## Tech Stack
- **Backend:** Django (Python)
- **Database:** SQLite (default)
- **Frontend:** HTML, Vanilla CSS (Custom Design System), JavaScript
- **Charts:** Chart.js
