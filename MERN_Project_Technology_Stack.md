# MERN CRUD Project Technology Stack

## Frontend (Client)

  Technology          Purpose
  ------------------- -----------------------------------------------------
  React 19            Build the user interface using components
  Vite                Fast development server and build tool
  Material UI (MUI)   Ready-made responsive UI components
  Axios               HTTP client for communicating with the backend APIs
  JavaScript (ES6+)   Application logic
  CSS                 Styling (along with MUI styling system)

### Frontend Folder Structure

``` text
client/
├── src/
│   ├── api/
│   │   └── apiClient.js
│   ├── services/
│   │   └── userApi.js
│   ├── pages/
│   │   └── UserPage.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
```

## Backend (Server)

  Technology   Purpose
  ------------ -------------------------------------------------
  Node.js      JavaScript runtime
  Express.js   REST API framework
  MongoDB      NoSQL database
  Mongoose     ODM (Object Data Modeling) for MongoDB
  dotenv       Manage environment variables
  cors         Enable cross-origin requests
  nodemon      Automatically restart server during development

### Backend Folder Structure

``` text
server/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── app.js
│   └── server.js
├── .env
├── package.json
```

## Database

  Technology                  Purpose
  --------------------------- ------------------------------------------
  MongoDB Community Edition   Store application data
  Mongoose Schema             Define document structure and validation

Example document:

``` json
{
  "_id": "...",
  "name": "Lucky Rana",
  "email": "lucky@example.com",
  "age": 28,
  "createdAt": "...",
  "updatedAt": "..."
}
```

## API Architecture

``` text
React (Frontend)
        │
        │ Axios
        ▼
Express REST API
        │
        ▼
Controllers
        │
        ▼
Mongoose
        │
        ▼
MongoDB
```

## REST APIs Implemented

  Method   Endpoint           Description
  -------- ------------------ -----------------
  GET      `/api/users`       Fetch all users
  POST     `/api/users`       Create a user
  PUT      `/api/users/:id`   Update a user
  DELETE   `/api/users/:id`   Delete a user

## Development Tools

-   Visual Studio Code
-   MongoDB Compass
-   MongoDB Shell (mongosh)
-   Postman or `curl`
-   Git
-   npm

## Overall Architecture

``` text
                React + Vite
                      │
              Material UI (MUI)
                      │
                   Axios
                      │
           HTTP REST API Requests
                      │
                Express.js Server
                      │
               Controller Layer
                      │
               Mongoose Models
                      │
                  MongoDB
```

## Summary

This project uses the **MERN** stack:

-   **M** --- MongoDB
-   **E** --- Express.js
-   **R** --- React
-   **N** --- Node.js

The application follows a clean layered architecture and provides full
CRUD functionality using REST APIs. It is designed to be easily extended
with authentication, validation, pagination, logging, file uploads, and
deployment support.
