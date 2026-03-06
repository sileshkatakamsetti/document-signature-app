# Digital Document Signature System

A full-stack web application that allows users to upload PDF documents, send signing requests via email, and collect digital signatures securely.

This system works similar to a simplified **DocuSign** workflow where users upload documents, assign signers, and receive a signed document after the signing process is completed.

---

## Project Overview

The Digital Document Signature System provides a simple and efficient way to manage document signing online.

Users can upload PDF documents, invite signers through email, and track signing progress. The signer receives a secure link, places a digital signature on the document, and submits it. Once completed, the signed document can be downloaded.

This project demonstrates real-world document workflow automation using modern web technologies.

---

## Features

### User Features

* User Registration and Login
* Secure JWT Authentication
* Upload PDF Documents
* Add Signers via Email
* Send Signing Requests
* Track Document Status
* Download Signed Documents

### Signer Features

* Receive Email Signing Link
* Open Secure Signing Page
* Select Signature Location
* Draw Digital Signature
* Submit Signature

### System Features

* Signature Placement on PDF
* Multi-user Document Handling
* MongoDB Database Storage
* REST API Architecture
* Secure Document Access

---

## Tech Stack

### Frontend

* React
* TypeScript
* React Router
* Axios
* React Signature Canvas

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Libraries Used

* pdf-lib – Insert signatures into PDF documents
* nodemailer – Send email invitations
* multer – Upload PDF files
* jsonwebtoken – Authentication

---

## Project Structure

Document-Signature-System

backend
│
├── models
│   ├── User.js
│   ├── Document.js
│   ├── Signature.js
│   └── Signer.js

├── routes
│   ├── authRoutes.js
│   ├── documentRoutes.js
│   ├── signerRoutes.js
│   └── signatureRoutes.js

├── controllers
│   └── pdfController.js

├── middleware
│   └── authMiddleware.js

├── uploads
│   └── PDF files stored here

└── server.js

frontend
│
├── src
│   ├── pages
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   └── SignDocument.tsx

│   ├── components
│   │   └── SignaturePad.tsx

│   └── App.tsx

└── package.json

README.md

---

## Installation Guide

### 1. Clone the Repository

git clone https://github.com/your-username/document-signature-system.git
cd document-signature-system

---

### 2. Install Backend Dependencies

cd backend
npm install

---

### 3. Install Frontend Dependencies

cd frontend
npm install

---

## Environment Variables

Create a `.env` file inside the **backend folder**.

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

EMAIL_USER=[your_email@gmail.com](mailto:your_email@gmail.com)
EMAIL_PASS=your_email_app_password

---

## Running the Application

### Start Backend Server

cd backend
npm start

Backend runs on:

http://localhost:5000

---

### Start Frontend

cd frontend
npm run dev

Frontend runs on:

http://localhost:5173

---

## Application Workflow

1. User registers and logs in to the system.
2. User uploads a PDF document.
3. User adds signer email address.
4. System sends a signing invitation email.
5. Signer opens the email and clicks the signing link.
6. Signer places the digital signature on the document.
7. Signature is saved and embedded into the PDF.
8. The signed document becomes available for download.

---

## API Endpoints

### Authentication

POST /api/auth/register
POST /api/auth/login

### Documents

POST /api/docs/upload
GET /api/docs
GET /api/docs/public/:documentId

### Signers

POST /api/signers
GET /api/signers/:documentId

### Signatures

POST /api/signatures
GET /api/signatures/:documentId

### PDF Generation

GET /api/pdf/sign/:documentId

---

## Future Improvements

* Multi-signer sequential signing
* Document status tracking dashboard
* Signature verification system
* Cloud storage integration
* Document expiration links
* Audit logs for document tracking

---

## Author

Silesh Katakamsetti
Computer Science Engineering Student
Dayananda Sagar University

GitHub:
https://github.com/your-username

---

## License

This project is created for educational and internship purposes.
