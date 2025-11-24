# Chat App API Documentation

Base URL: `/api`

## Authentication & Users

### Register User
**POST** `/users`

Creates a new user, logs them in, and establishes a session.

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "bio": "Hello world"
}
```

**Response (201 Created):**
- Sets Cookies: `jwt` (HttpOnly), `sessionToken` (HttpOnly), `refreshToken` (HttpOnly)
```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Hello world"
  }
}
```

### Login
**POST** `/users/login`

Authenticates a user and establishes a session. **Enforces Single Session Policy**: Logging in deletes all previous sessions for this user.

**Request Body:**
```json
{
  "identifier": "johndoe", // username or email
  "password": "securepassword"
}
```

**Response (200 OK):**
- Sets Cookies: `jwt`, `sessionToken`, `refreshToken`
```json
{
  "message": "Login successful",
  "user": { ... }
}
```

### Get Current User Profile
**GET** `/users/:id`
*Requires Authentication*

**Response (200 OK):**
```json
{
  "_id": "...",
  "name": "...",
  ...
}
```

### Update User
**PUT** `/users/:id`
*Requires Authentication*

**Request Body:** (All fields optional)
```json
{
  "name": "New Name",
  "bio": "New Bio"
}
```

## Sessions

### Renew Session
**PUT** `/sessions/renew`

Renews the session using the `refreshToken` cookie. Rotates the refresh token (issues a new one).

**Request:**
- Cookies: `refreshToken`

**Response (200 OK):**
- Sets New Cookies: `sessionToken`, `refreshToken`
```json
{
  "success": true,
  "message": "Session renewed",
  "expiresAt": "..."
}
```

### Get Active Sessions
**GET** `/sessions`
*Requires Authentication*

Returns a list of active sessions for the current user.

### Delete Session (Logout)
**DELETE** `/sessions/:sessionId`
*Requires Authentication*

Deletes a specific session.

## Security Features

- **Dynamic Secrets**: JWTs are signed with a secret derived from the user's password hash. Changing the password invalidates all existing tokens.
- **PII Protection**: JWT payload does not contain email, only `userId`.
- **Refresh Token Rotation**: Refresh tokens are rotated on every use.
- **Single Session**: Only one active session is allowed per user.
