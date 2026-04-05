# 🛒 Full-Stack E-Commerce Platform

A complete, production-ready multi-vendor e-commerce platform with Stripe payment integration, featuring User, Seller, and Admin role management. Built with Spring Boot backend and React frontend This project is containerized with **Docker** and ready for cloud deployment..
## 🏗 System Architecture

The project is divided into two main layers:
* **Backend:** Spring Boot REST API (Java, JPA, PostgreSql, Spring Security).
* **Frontend:** React.js Single Page Application (SPA) with Material UI for a clean, responsive design.

## 🚀 Key Features

- 🔐 **Secure Authentication** - JWT-based stateless authentication with HttpOnly cookies
- 💳 **Stripe Payment Integration** - Secure payment processing..
- 👥 **Multi-Role System** - User (Customer), Seller (Vendor), and Admin roles
- 🛒 **Shopping Cart & Checkout:** Real-time cart management and address handling.
- 📊 **Analytics Dashboard** - Sales analytics for sellers and admins
- 📱 **Responsive UI** - Fully responsive design built with **Material UI (MUI)**, optimized for both mobile and desktop devices
- 🧠 **State Management** - Efficient client-side state handling in React for smooth user experience and dynamic UI updates
- 🚀 **RESTful API** - Well-designed, scalable backend architecture

## 🛠 Tech Stack

### Backend
- **Language:** Java 21+
- **Framework:** Spring Boot 3.5.7
- **Database:** PostgreSql
- **ORM:** Spring Data JPA / Hibernate
- **Security:** Spring Security (JWT)
- 🌐 Database Configuration (Neon DB)
- The application is configured to connect to a PostgreSQL database via environment variables.

### Frontend
- **Library:** React.js
- **UI Framework:** Material UI (MUI)
- **HTTP Client:** Axios
- **Routing:** React Router DOM

## 🚀 How to Run the Project

Follow these steps to get the project up and running on your local machine.

### 1️⃣ Database Configuration (Neon DB)
The project uses **Neon.tech** as its database. 
1. Create a project on [Neon](https://neon.tech/).
2. Keep your **Connection String**, **Username**, and **Password** ready.

### 2️⃣ Run Backend using Docker 🐳
The backend is already containerized and available on **Docker Hub**. You can run it directly without cloning the backend source code:

```bash
# 1. Pull the image from Docker Hub
docker pull abdelrahman1a/ecommerce-backend:latest

# 2. Run the container with Neon environment variables
docker run -d -p 8080:8080 \
  --name ecommerce-api \
  -e DB_URL=jdbc:postgresql://[YOUR_NEON_HOST]/neondb?sslmode=require \
  -e DB_USERNAME=[YOUR_NEON_USER] \
  -e DB_PASSWORD=[YOUR_NEON_PASSWORD] \
  abdelrahman1a/ecommerce-backend:latest
