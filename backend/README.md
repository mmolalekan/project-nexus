# Qurbaan E-Commerce API

## Description

Qurbaan streamlines the journey from farm to fork, offering an innovative e-commerce platform where users can easily purchase high-quality beef shares. By cutting out unnecessary middlemen, it ensures fair and transparent pricing and provides convenient delivery options for all users' needs.

This repository contains the backend API for the **Qurbaan E-Commerce Platform**.
The system handles:

- User authentication
- Secure JWT cookie-based login/session
- Email verification
- Forgot/reset password
- Profile updates (including bank info)
- Booking of cow/beef slots
- Dynamic pricing
- Flutterwave payment integration (via webhook)
- Referral program with earnings

The backend is organized into:

- `users` — authentication, profiles, verification
- `booking` — slot booking, payments, referrals

---

## Features

### **User & Authentication (`users` app)**

- Custom user model (email login)
- Secure **httpOnly cookie-based JWT**
- Email verification with expiring 6-digit codes
- Password reset & forgot password logic
- Profile update endpoint
- Bank details update
- Celery async tasks:
  - send verification emails
  - send reset password emails

---

### **Booking & Payment (`booking` app)**

- Dynamic pricing based on package type, slots, and delivery option
- Slot limits per transaction & per user
- Flutterwave payment integration
- Webhook verification ensures backend-controlled payment status
- Referral system:
  - Log successful referrals
  - Pay referral bonus after the first successful paid booking
  - Celery task updates referrer earnings asynchronously

---

## Technologies Used

| Technology                      | Purpose                |
| ------------------------------- | ---------------------- |
| **Python**                      | Backend language       |
| **Django**                      | Web framework          |
| **Django REST Framework (DRF)** | API layer              |
| **SimpleJWT**                   | Authentication system  |
| **Celery**                      | Background tasks       |
| **Redis**                       | Celery broker          |
| **PostgreSQL**                  | Database (recommended) |
| **Flutterwave**                 | Payment gateway        |
| **Swagger / Redoc**             | API documentation      |

---

## Installation

### **1. Clone the Repository**

```bash
git clone https://github.com/mmolalekan/project-nexus.git
cd project-nexus/backend
```

---

### **2. Create and Activate Virtual Environment**

```bash
python3 -m venv .venv
source .venv/bin/activate   # macOS / Linux
```

---

### **3. Install Dependencies**

```bash
pip install -r requirements.txt
```

---

### **4. Environment Variables**

Create a `.env` file in the root directory (refer to `.env.example`) and add the following variables:

```env
SECRET_KEY=<your_secret_key>
DJANGO_SETTINGS_MODULE=backend.config.prod #.dev for development, .prod for production
COOKIE_SECURE=True
COOKIE_SAMESITE=Lax # or Strict for production environment

# Database Configuration
ENGINE=django.db.backends.postgresql
NAME=db_name
USER_NAME=username
PASSWORD=password
HOST=host_address
PORT=port_number

# EMAIL INFO
EMAIL_HOST_USER=<your_email_host_user>
EMAIL_HOST_PASSWORD=<your_email_host_password>

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=<your_flutterwave_public_key>
FLUTTERWAVE_SECRET_KEY=<your_flutterwave_secret_key>
FLUTTERWAVE_ENCRYPTION_KEY=<your_flutterwave_encryption_key>
FLUTTERWAVE_WEBHOOK_SECRET=<your_flutterwave_webhook_secret>
```

---

### **5. Apply Migrations**

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### **6. Start Server and Background Workers**

#### **Run Django server**

```bash
python manage.py runserver
```

#### **Run Celery worker**

```bash
celery -A backend worker -l info
```

Ensure Redis is installed and running.

---

## API Endpoints

### **User Authentication**

| Endpoint                    | Method    | Description             |
| --------------------------- | --------- | ----------------------- |
| `/v1/auth/register/`        | POST      | Register new user       |
| `/v1/auth/verify-email/`    | POST      | Verify email code       |
| `/v1/auth/login/`           | POST      | Login & set JWT cookies |
| `/v1/auth/login/`           | POST      | Login & set JWT cookies |
| `/v1/auth/token/refresh/`   | POST      | Refresh JWT token       |
| `/v1/auth/logout/`          | POST      | Logout & clear cookies  |
| `/v1/auth/profile/`         | GET       | Get user profile        |
| `/v1/auth/profile/update/`  | PUT/PATCH | Update user profile     |
| `/v1/auth/forgot-password/` | POST      | Request password reset  |
| `/v1/auth/reset-password/`  | POST      | Reset user password     |

---

### **Booking System**

| Endpoint                              | Method | Description             |
| ------------------------------------- | ------ | ----------------------- |
| `/v1/booking/validate-referral-code/` | GET    | Validate referral code  |
| `/v1/booking/bookings/`               | GET    | List user bookings      |
| `/v1/booking/generate-payment-link/`  | POST   | Get Flutterwave link    |
| `/v1/booking/flutterwave-webhook/`    | POST   | Payment status callback |

---

## API Documentation

Available after running the server:

- **Swagger UI:**  
  `http://127.0.0.1:8000/swagger/`

- **Redoc:**  
  `http://127.0.0.1:8000/redoc/`

---

## Support

For questions or issues, open an issue in the repository.
