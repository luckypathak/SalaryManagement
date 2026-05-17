# Salary Management System - Planning & Architecture

## Overview
A minimal, fully functional end-to-end software for an HR Manager to manage employees and view salary insights.

## Architectural Decisions
1.  **Backend Framework**: Python + Django Rest Framework (DRF)
    *   **Why**: Fast development, built-in ORM, robust out-of-the-box admin panel if needed, and excellent validation via serializers.
    *   **Database**: SQLite (built-in, easy to set up for this exercise without requiring external services like PostgreSQL).
    *   **Authentication**: Django Rest Framework SimpleJWT (JSON Web Token) for simple, secure authentication between React and Django.
2.  **Frontend Framework**: React + Vite
    *   **Why**: Extremely fast build times, lightweight, and modern.
    *   **Styling**: Tailwind CSS for rapid UI development with a clean, professional aesthetic.
    *   **State Management**: Standard React hooks + Context API for auth.
3.  **Data Seeding Strategy**:
    *   Generate random employees using Python's `random`.
    *   Use `bulk_create` in Django ORM to insert 10,000 records in a single or few queries. This ensures the script is highly performant.
4.  **Testing Strategy**:
    *   Django `APITestCase` for backend unit tests.
    *   Testing core endpoints (CRUD, Insights).

## Incremental Commit Plan
1.  Initialize project and create planning documentation.
2.  Setup Django backend, create models, and implement the fast seeder.
3.  Implement CRUD APIs and Analytics APIs + unit tests.
4.  Setup React frontend with Vite & Tailwind.
5.  Implement Frontend Authentication and UI components.
6.  Final polish and documentation.
