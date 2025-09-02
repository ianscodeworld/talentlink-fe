# TalentLink Recruitment Collaboration Platform

**TalentLink** is a modern, internal recruitment collaboration platform designed to streamline and optimize the hiring process for vendor-supplied candidates. It replaces chaotic and inefficient email and instant messaging communication, providing a single source of truth for Hiring Managers (HMs) and Interviewers.

## 📖 Table of Contents

- [The Problem](#-the-problem)
- [✨ Key Features (MVP 1.5)](#-key-features-mvp-15)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Getting Started](#-getting-started)
- [📝 API Overview](#-api-overview)
- [📌 Project Status](#-project-status)

## 🎯 The Problem

In a fast-paced hiring environment, relying on emails and chat tools to track the interview progress of vendor candidates, collect feedback, and make decisions leads to information fragmentation, delays, and errors. TalentLink addresses these pain points by providing a centralized platform, ensuring every role in the process has timely access to accurate information.

## ✨ Key Features (MVP 1.5)

We have currently completed the MVP 1.5 version, which includes the following core features:

#### **General Features**
- **Role-Based Access Control (RBAC)**: The system strictly distinguishes between **Hiring Manager (HM)** and **Interviewer** roles, providing different views and permissions.
- **Secure Authentication Flow**:
    - Secure authentication based on JSON Web Tokens (JWT).
    - HMs can create new user accounts, which are assigned a temporary password by the system.
    - New users are forced to change their password upon first login to ensure account security.

#### **Hiring Manager (HM) Features**
- **User Management**: A dedicated `/admin/users` page for creating new Interviewer accounts and assigning their professional specialties.
- **Demand Management**:
    - Create new hiring demands and associate them with specialties (e.g., JAVA, REACT).
    - View and sort all hiring demands in a paginated list on the dashboard.
    - Update the status of a hiring demand in real-time (OPEN, HIRED, CLOSED, ON_HOLD).
- **Candidate Management**:
    - **Efficient Data Entry**: Supports **pasting data from emails or spreadsheets** to automatically parse and fill the new candidate form.
    - **Pipeline Progression**: Advance or reject candidates, or place them in an "On Hold" talent pool from the demand detail page.
    - **Finalist Decision-Making**: Provides a final "Hire" action for candidates who have passed all interview rounds (status: `FINALIST`).
    - **History Tracking**: View the complete operational history of any candidate in a clear, chronological timeline.

#### **Interviewer Features**
- **Self-Service Dashboard**:
    - After logging in, Interviewers see a dashboard of all open hiring demands that match their pre-assigned professional specialties.
    - Proactively browse demands instead of passively waiting for assignments.
- **Proactive Feedback Submission**:
    - Can navigate to any relevant demand detail page to view the candidate list.
    - Can submit structured interview feedback (Pass/Fail and evaluation) for any candidate they have interviewed, without needing a prior assignment from an HM.

## 🛠️ Technology Stack

#### **Backend**
- **Java (Spring Boot)**: A robust and stable framework for enterprise-level applications.
- **Spring Security**: Provides comprehensive security, authentication, and authorization services.
- **JWT**: Used for stateless API authentication.
- **JPA / Hibernate**: Data persistence layer.

#### **Frontend**
- **React**: The industry-leading declarative UI library.
- **Redux Toolkit**: An efficient and predictable global state management solution.
- **React Router**: Handles client-side routing.
- **Ant Design**: An enterprise-grade UI component library for rapidly building high-quality interfaces.
- **Axios**: A promise-based HTTP client for communicating with the backend API.

## 🚀 Getting Started

Follow the steps below to run this project locally.

### **Prerequisites**
-   Java 11+ & Maven
-   Node.js 16+ & npm

### **Backend Setup**
1.  Clone the repository:
    ```bash
    git clone [your-backend-repo-url]
    cd [backend-project-folder]
    ```
2.  Configure the database and JWT secret:
    - Copy `application.properties.example` to `application.properties`.
    - Fill in your database connection details and a secure JWT secret in `application.properties`.
3.  Run the backend service:
    ```bash
    mvn spring-boot:run
    ```
    The backend service will start on `http://localhost:8080`.

### **Frontend Setup**
1.  Navigate to the frontend project directory:
    ```bash
    cd talentlink-fe
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure the API address:
    - (If necessary) Modify the `baseURL` in the `src/api/axiosInstance.js` file.
4.  Start the frontend development server:
    ```bash
    npm start
    ```
    The frontend application will start on `http://localhost:3000` and open automatically in your browser.

## 📝 API Overview

This project utilizes a RESTful API design style.
- **Authentication**: All protected endpoints require an `Authorization: Bearer <JWT>` header.
- **Pagination**: All endpoints that return a list support `page`, `size`, and `sort` query parameters.
- **Error Handling**: All API errors return a standardized JSON structure, including `statusCode`, `message`, `details`, etc.

For a more detailed API contract, please refer to the `API_CONTRACT.md` file (it is recommended that you create such a file).

## 📌 Project Status

- **Current Version**: `MVP 1.5` - Complete.
- **Next Steps / Roadmap**: `MVP 2.0`
    - **Batch Email Generation**: Implement the previously discussed batch email report, aggregated by day, specialty, and vendor.
    - **Data Dashboard**: Provide data visualization charts for HMs to analyze key metrics like the hiring funnel, time-to-hire, etc.
    - **Email Notifications**: Implement automated email notifications for key events (e.g., new candidate added, new feedback submitted).
    - **Finer-Grained Permission Management**.

---