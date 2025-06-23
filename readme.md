# Peshawar Stays

A modern, full-stack hotel and property booking platform for Peshawar, built with Next.js, TypeScript, MongoDB, and Tailwind CSS. The platform supports user authentication, property management, bookings, reviews, and an admin dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication:** Register, login, logout, password reset, JWT-based sessions, OTP verification.
- **Role-Based Dashboards:** Separate dashboards for Customers, Hosts, and Admins.
- **Property Listings:** Add, edit, delete, and view hotel/property listings with images, amenities, and pricing.
- **Booking System:** Book properties, view booking history, cancel bookings.
- **Admin Panel:** Manage users, properties, and bookings; view analytics and reports.
- **Reviews & Ratings:** Users can leave reviews and ratings for properties.
- **Responsive UI:** Mobile-first design using Tailwind CSS and shadcn/ui.
- **Email Notifications:** Registration, booking confirmations, and password reset via Nodemailer.
- **Data Visualization:** Charts and analytics for admins using Chart.js.
- **Security:** Password hashing (bcrypt), JWT authentication, input validation.
- **Modern UI/UX:** Animations (Framer Motion), icons (Lucide), notifications (React Toastify, SweetAlert2).

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Lucide Icons
- **Backend:** Next.js API routes, Node.js, TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, bcrypt
- **Email:** Nodemailer
- **State Management:** React Context, custom hooks
- **Other:** Chart.js, React Toastify, SweetAlert2, Axios

---

## Folder Structure

```
.
├── app/                # Next.js app directory (pages, layouts, API routes)
│   ├── api/            # API route handlers (auth, booking, profile, etc.)
│   ├── dashboard/      # Dashboards for Customer, Host, Admin
│   ├── hotels/         # Hotel listing pages
│   ├── hotel/          # Individual hotel details
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── forgot-password/ # Password reset pages
│   ├── verify-otp/     # OTP verification pages
│   ├── profile/        # User profile pages
│   └── ...             # Other feature pages
├── components/         # Reusable UI components (buttons, cards, dialogs, etc.)
├── constants/          # Application-wide constants
├── context/            # React context providers (e.g., AuthContext)
├── hooks/              # Custom React hooks (e.g., useAuth, useUser)
├── lib/                # Utility libraries (db, mailer, otp, etc.)
├── middleware/         # Custom Next.js middleware (e.g., auth checks)
├── models/             # Mongoose models (User, Property, Booking, Review, etc.)
├── public/             # Static assets (images, favicon, etc.)
├── styles/             # Global and component styles (Tailwind, custom CSS)
├── types/              # TypeScript type definitions and interfaces
├── utils/              # Helper functions and utilities
├── .env.local          # Environment variables
├── tailwind.config.ts  # Tailwind CSS configuration
├── package.json        # Project metadata and scripts
└── ...
```

---

## Setup & Installation

### 1. Clone the repository

```sh
git clone https://github.com/your-username/peshawar-stays.git
cd peshawar-stays
```

### 2. Install dependencies

```sh
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

### 4. Run the development server

```sh
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable    | Description                       |
| ----------- | --------------------------------- |
| MONGODB_URI | MongoDB connection string         |
| JWT_SECRET  | Secret key for JWT authentication |
| EMAIL_USER  | Email address for Nodemailer      |
| EMAIL_PASS  | Email password for Nodemailer     |

---

## Available Scripts

- `pnpm dev` — Start the development server
- `pnpm build` — Build for production
- `pnpm start` — Start the production server
- `pnpm lint` — Lint the codebase

---

## API Overview

### Authentication

- `POST /api/auth/register` — Register a new user (with OTP verification)
- `POST /api/auth/login` — Login and receive JWT token
- `POST /api/auth/forgot-password` — Request password reset (email OTP)
- `POST /api/auth/reset-password` — Reset password with OTP

### Properties

- `GET /api/properties` — List all properties
- `POST /api/properties` — Add new property (Host/Admin)
- `PUT /api/properties/:id` — Edit property
- `DELETE /api/properties/:id` — Delete property

### Bookings

- `POST /api/bookings` — Create a booking
- `GET /api/bookings` — Get user bookings
- `DELETE /api/bookings/:id` — Cancel booking

### Reviews

- `POST /api/reviews` — Add a review
- `GET /api/reviews/:propertyId` — Get reviews for a property

### Admin

- `GET /api/admin/users` — List all users
- `GET /api/admin/bookings` — List all bookings
- `GET /api/admin/properties` — List all properties

---
