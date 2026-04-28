# RailwayNext Train Ticket Booking System

RailwayNext is a full-stack train ticket booking platform inspired by Indian Railways and IRCTC, rebuilt with a modern UI, JWT-based security, automatic waitlist upgrades, and an admin operations panel.

## Tech Stack

### Backend
- Java 21
- Spring Boot 3
- Spring Security with JWT
- Spring Data JPA / Hibernate
- MySQL
- Swagger / OpenAPI
- Simple caching via Spring Cache

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- Axios

## Core Features

- Register and login with JWT authentication
- Role-based access for `Admin` and `User`
- Search trains by source, destination, and date
- Book tickets with multi-passenger support
- Real-time status allocation across:
  - `CNF`
  - `RAC`
  - `WL`
- Simulated `TQWL`-style queue behavior using quota type priority
- Automatic waitlist upgrades after cancellation:
  - `WL -> RAC -> CNF`
- PNR number generation
- Ticket wallet with booking history and cancellation
- Refund simulation through payment status updates
- Admin train management and booking overview
- Validation, exception handling, logging, pagination-ready search, and API docs

## Project Structure

```text
Assessment/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/railway/booking/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── enums/
│       │   ├── exception/
│       │   ├── repository/
│       │   ├── security/
│       │   └── service/
│       └── resources/application.properties
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       └── utils/
└── README.md
```

## Database Design

### Tables
- `users`
- `train`
- `booking`
- `passenger`
- `payment`

### Relationships
- One user can have many bookings
- One train can have many bookings
- One booking can have many passengers
- One booking has one payment

## Booking Allocation Logic

The booking engine reallocates all active passengers for a train/date in booking order whenever a booking is created or cancelled.

### Allocation rules
1. Fill confirmed seats first.
2. Overflow passengers in `GENERAL` quota move into `RAC`.
3. Remaining `GENERAL` passengers move into `WL`.
4. `TQWL` passengers are treated as lower-priority overflow and remain on the waitlist simulation.
5. On cancellation, the reallocator automatically upgrades the queue and refreshes seat labels.

This gives deterministic and easy-to-review queue behavior while still simulating realistic railway ticket transitions.

## Sample Seed Data

### Demo Accounts
- Admin
  - Email: `admin@railway.com`
  - Password: `Admin@123`
- User
  - Email: `user@railway.com`
  - Password: `User@123`

### Seeded Trains
- `12002` Shatabdi Express
- `12952` Mumbai Rajdhani
- `12302` Howrah Rajdhani
- `12628` Karnataka Express

## Backend Setup

### Prerequisites
- Java 21
- MySQL 8+
- Maven 3.9+ installed locally

### Configure MySQL
Create or allow Spring Boot to create the database named `railway_booking`.

Default credentials in [application.properties](/c:/Users/msi/Desktop/Assessment/backend/src/main/resources/application.properties):

```properties
spring.datasource.username=root
spring.datasource.password=root
```

Update them if your local MySQL setup differs.

### Run backend

```bash
cd backend
mvn spring-boot:run
```

### Swagger

Open:

```text
http://localhost:8080/swagger-ui.html
```

## Frontend Setup

### Prerequisites
- Node.js 20+

### Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Important API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Trains
- `GET /api/trains/search?source=New Delhi&destination=Mumbai Central&journeyDate=2026-04-29`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/{pnrNumber}`
- `DELETE /api/bookings/{pnrNumber}`

### Admin
- `GET /api/admin/trains`
- `POST /api/admin/trains`
- `PUT /api/admin/trains/{id}`
- `DELETE /api/admin/trains/{id}`
- `GET /api/admin/bookings`

## Notes

- The frontend expects the backend at `http://localhost:8080/api`.
- Caching is enabled via Spring Cache simple provider and can be swapped for Redis later.
- Capacity management is designed so the service layer can evolve into coach-wise or class-wise allocation later.
- For a production deployment, move secrets to environment variables and add refresh tokens, Docker, and proper payment integration.
