# Notes API Backend

A feature-rich Notes Management Backend built using Node.js, Express.js, MongoDB, Mongoose, JWT, and Cookie-Based Authentication.

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* HTTP-Only Cookie Authentication
* Logout

### Notes Management

* Create Notes
* Get All Notes
* Get Note By ID
* Update Notes
* Search Notes
* Filter Notes By Tags
* Pin Notes
* Archive Notes

### Trash System

* Soft Delete Notes
* Get Trash Notes
* Restore Notes

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* cookie-parser

## Installation

```bash
npm install
npm start
```

## Environment Variables

Create a `.env` file:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=your_port_number
```
