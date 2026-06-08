# Authentication System – JWT, Refresh Token, OTP & Multi-Device Session Management

A **production-ready authentication system** built with *Node.js*, *Express.js*, and *MongoDB*, implementing modern authentication practices including *JWT Authentication*, *Refresh Token Rotation*, *Email OTP Verification*, *Multiple devices session management*and *Logout from all devices*.

## Features

* User Registration
* User Login
* JWT Access Token Authentication
* Refresh Token Rotation
* Email Verification via OTP
* Secure Password Hashing with bcrypt
* Session Management
* Logout from Current Device
* Logout from All Devices
* Protected Routes
* MongoDB Integration with Mongoose
* Environment Variable Configuration

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Tokens)
* bcryptjs
* Nodemailer
* Cookie Parser
* dotenv

## Project Structure

```text
src/
├── config/
│   ├── config.js
│   └── connect.js
├── controllers/
│   └── auth.controller.js
├── middleware/
├── models/
├── routes/
├── utils/
└── app.js

server.js
package.json
```

## Authentication Flow

### Registration

1. User registers with email and password.
2. Password is hashed before storage.
3. An OTP is generated and sent to the user's email.
4. User verifies the OTP.
5. Account is marked as verified.

### Login

1. User logs in with credentials.
2. Server validates credentials.
3. Access Token and Refresh Token are generated.
4. Refresh Token session is stored in the database.

### Token Refresh

1. Client sends Refresh Token.
2. Server validates the session.
3. New Access Token and Refresh Token are issued.
4. Previous Refresh Token becomes invalid.

### Logout

* Current Device Logout:

  * Removes the active session.

* Logout From All Devices:

  * Removes all active sessions associated with the user.

## API Endpoints

### Authentication

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| POST   | /api/auth/register      | Register a new user     |
| POST   | /api/auth/verify-otp    | Verify email OTP        |
| POST   | /api/auth/login         | Login user              |
| POST   | /api/auth/refresh-token | Generate new tokens     |
| POST   | /api/auth/logout        | Logout current device   |
| POST   | /api/auth/logout-all    | Logout from all devices |

## Installation

### Clone the Repository

```bash
git clone https://github.com/ihrysklps/Authentication-System-JWT-Refresh-Token-OTP-Logout-All-Devices.git
cd Authentication-System-JWT-Refresh-Token-OTP-Logout-All-Devices
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

### Run the Project

Development Mode:

```bash
npm run dev
```

Production Mode:

```bash
npm start
```

## Security Features

* Password hashing using bcrypt
* Refresh token hashing before database storage
* Refresh token rotation
* Session tracking per device
* OTP-based email verification
* JWT-based authorization
* Environment-based secret management

---------------------------------------
Copyright (c) 2026 Hrydyansh Shukla

If you found this project useful, consider giving it a star on GitHub.
