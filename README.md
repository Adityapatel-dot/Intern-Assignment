# TaskBoard

TaskBoard is a Kanban-style task management application that helps users organize and track tasks through different stages: **To Do**, **In Progress**, and **Done**. The application features secure JWT-based authentication, task CRUD operations, and drag-and-drop task management.

## Features

* User Registration and Login
* JWT Authentication & Authorization
* Create, Update, and Delete Tasks
* Drag-and-Drop Task Movement
* Task Status Management
* Responsive and Clean User Interface
* Secure Password Hashing with BCrypt

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6+)

### Backend

* Java 17
* Spring Boot 3
* Spring Security
* Spring Data JPA
* JWT Authentication

### Database

* MySQL

## Getting Started

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

Configure the API URL in `frontend/js/config.js` and serve the frontend using any static server:

```bash
npx serve frontend
```

## API Endpoints

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Authenticate user   |
| GET    | /api/tasks         | Get all tasks       |
| POST   | /api/tasks         | Create a task       |
| PUT    | /api/tasks/{id}    | Update a task       |
| DELETE | /api/tasks/{id}    | Delete a task       |

## Future Improvements

* Task priorities
* Due dates and reminders
* Search and filtering
* Mobile drag-and-drop support
* Team collaboration features

## Author

Aditya Patel
