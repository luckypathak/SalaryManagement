# Salary Manager

A minimal, full-stack application built for managing 10,000+ employees and viewing salary insights. Built as an assessment task to demonstrate architectural decisions, AI tool usage, and full-stack engineering capability.

## Features
- **Authentication**: JWT-based secure login using Django Rest Framework SimpleJWT.
- **Manage Employees**: Full CRUD (Create, Read, Update, Delete) capability for employees.
- **Fast Seeding**: A highly optimized Django management command that uses `bulk_create` to seed 10,000 realistic employees in ~0.5 seconds.
- **Salary Insights**: An analytics dashboard showing minimum, maximum, and average salaries per country, along with job-specific salary insights.
- **Modern UI**: Built with React (Vite) and TailwindCSS for a fast, responsive, and professional experience.

## Technology Stack
- **Backend**: Python, Django, Django Rest Framework, SQLite.
- **Frontend**: React.js, Vite, TailwindCSS v4, Axios, React Router v6.
- **Testing**: Pytest (Backend).

## Setup & Installation

### 1. Clone the repository
\`\`\`bash
git clone <repository_url>
cd SalaryManager
\`\`\`

### 2. Backend Setup
1. Create and activate a Python virtual environment:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\\Scripts\\activate
   \`\`\`
2. Install Python dependencies:
   \`\`\`bash
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pytest-django
   \`\`\`
3. Run migrations and seed the database with 10,000 employees:
   \`\`\`bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   python manage.py seed
   \`\`\`
4. Create an admin user for login:
   \`\`\`bash
   python manage.py createsuperuser
   # (Enter username and password when prompted)
   \`\`\`
5. Start the backend server:
   \`\`\`bash
   python manage.py runserver 8000
   \`\`\`

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install NPM dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open your browser and navigate to `http://localhost:5173`. Use the superuser credentials you created in step 2.4 to log in.

## Running Tests
To run the backend unit tests, activate the virtual environment and run Pytest:
\`\`\`bash
cd backend
pytest
\`\`\`
This will execute a suite of deterministic, fast unit tests covering the API endpoints (CRUD operations and Salary Insights calculations).

## Architectural Decisions & AI Usage
- **Database Choice**: SQLite was chosen to minimize setup friction for this assessment, but the use of Django's ORM means it can be swapped to PostgreSQL with zero code changes.
- **Seeder Optimization**: Standard iterative `.save()` in Django for 10k records takes minutes. By utilizing `bulk_create` in `employees/management/commands/seed.py`, the seeding time is reduced to milliseconds.
- **Authentication**: Chosen JWT because it is stateless, easily handled by React (stored in localStorage), and prevents cross-site request forgery inherently via Authorization headers.
- **AI Acceleration**: Used AI to scaffold repetitive boilerplate (like the `EmployeeList.jsx` table, basic Axios interceptors, and Pytest fixture setup). This allowed focusing on critical business logic like the `SalaryInsightsView` Django aggregation queries (`Avg`, `Min`, `Max` across the DB).
