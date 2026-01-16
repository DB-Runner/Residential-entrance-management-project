# 🏢 Smart Entrance - Backend API

![Java](https://img.shields.io/badge/Java-25%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

A robust Building Management System designed to automate communication, finance tracking, and decision-making for condominiums, tailored specifically for the Bulgarian regulatory framework.

---

## 🚀 Key Features

### 🔐 Security & Auth
* **HttpOnly Cookie Authentication:** Secure JWT implementation preventing XSS attacks.
* **Unit Verification:** Secure join process using unique 8-digit access codes per unit.
* **Relation-Based Access:** Granular permission control protecting every service method.

### 🏢 Advanced Administration
* **Hybrid Resident Management:** Full support for "offline" residents (e.g., elderly people). Managers can manually configure unit details (residents count, area size) without requiring user registration, ensuring accurate accounting for the entire building.
* **Multi-Property Support:** A single user account can serve multiple roles simultaneously. You can be the **Manager** of Building A, while being a **Resident** in Building B and owning a second unit in Building C.
* **Seamless Manager Handover:** Current managers can transfer their authority to another user seamlessly.
* **Portfolio:** Unified dashboard to switch between all owned or inhabited units and managed buildings.

### 💰 Finance Management
* **Conditional Automated Billing:** Monthly fees are generated automatically **only after all units are marked as 'Verified'**. This strict validation ensures that the fee distribution (based on residents/area) is mathematically correct before billing starts.
* **Legal Compliance:** The fee calculation logic is fully compliant with the **Bulgarian Condominium Management Act (ЗУЕС)**.
* **Smart Ledger & Overpayments:** Tracks real-time financial balance. Overpayments are automatically credited to the unit's account to cover future fees.
* **Dynamic PDF Receipts:** 📄 The system **automatically generates** and stores official PDF receipts for every transaction. It intelligently incorporates external proofs into the transaction record.
* **Expense Logging:** Managers can register building expenses (e.g., "Elevator Repair") and attach invoices.
* **Fund Tracking:** Separate accounting for **Repair Fund** and **Maintenance Fund**.
* **Payments:**
    * **Stripe Integration:** Direct card payments.
    * **Cash & Bank Transfer:** Manual logging for offline payments.

### 🗳️ Voting System
* **Digital Polls:** Create General Assembly votings.
* **One Unit = One Vote:** Logic to ensure fair voting distribution.
* **Eligibility Checks:** Only verified residents can vote.

### 📢 Community Notices & Events
* **Digital Notice Board:** Replace paper notes with digital announcements.
* **General Assemblies:** Schedule meetings with location and time, notifying all residents instantly.

### 📂 Document Management
* **Archive:** Upload a document related to the building (e.g., "General Rules")
* **Visibility Control:** Toggle visibility for residents vs. internal manager docs.

---

## 🛠️ Tech Stack

* **Framework:** Spring Boot 4
* **Database:** PostgreSQL
* **ORM:** Hibernate / Spring Data JPA
* **Documentation:** OpenAPI (Swagger UI)
* **Build Tool:** Maven

---

## ⚙️ Installation & Setup

### Prerequisites
* Java 25 or higher
* PostgreSQL

### 1. Clone the repository
```bash
git clone https://github.com/yosif1705/smart-entrance.git
cd smart-entrance/backend
```

### 2. Database Initialization
Before starting the application, you must create the dedicated database user and the database itself.

Execute the following SQL commands (replace placeholders with your preferred credentials):

```SQL
-- 1. Create a dedicated user
CREATE ROLE your_db_user WITH LOGIN PASSWORD 'your_db_password';

-- 2. Restrict permissions (Security Best Practice)
ALTER USER your_db_user WITH NOSUPERUSER NOCREATEDB NOCREATEROLE LOGIN;

-- 3. Create the database with the new user as owner
CREATE DATABASE smart_entrance WITH OWNER your_db_user;
```

### 3. Environment Configuration
The application relies on environment variables for sensitive configuration.
1. Locate the .env.example file in the root directory.
2. Duplicate it and rename it to .env.
3. Populate the variables with your local configuration.

### 4. Build & Run
Ensure your environment is using JDK 25. You can run the application using the included Maven Wrapper:

```bash
./mvnw spring-boot:run
```

The server will start on port 8080.
API Base URL: http://localhost:8080/api

### 5. (Optional) Stripe Payments Setup & Testing
To test the payment flow end-to-end without a frontend, follow these steps:

#### A. Get your API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
2. Copy the **Secret Key** (`sk_test_...`).
3. Paste it into your `.env` file as `STRIPE_API_KEY`.

#### B. Setup Webhook Forwarding
Since your backend runs locally, Stripe needs a tunnel to send confirmation events.
1. [Install Stripe CLI](https://docs.stripe.com/stripe-cli).
2. Run: `stripe login`
3. Start listening:
   ```bash
   stripe listen --forward-to localhost:8080/api/webhooks/stripe
   ```
4. Copy the Webhook Secret (whsec_...) from the terminal output and paste it into .env as STRIPE_WEBHOOK_SECRET.


#### C. Test a Real Transaction (End-to-End)
This flow tests the entire loop: API -> Stripe -> CLI Confirmation -> Webhook -> Database Update.

1. Initiate Payment: Call the API endpoint via Swagger (POST /api/units/{id}/payments/stripe) with an amount. Response: You will get a clientSecret looking like: pi_3SgT5Q..._secret_...

2. Extract the ID: Take only the first part of the secret (before the _secret_ part). Example: If secret is pi_3SgT5QGgMS6MplgH0pAEL6Nv_secret_xYz, the ID is pi_3SgT5QGgMS6MplgH0pAEL6Nv.

3. Confirm via CLI: Run this command in a new terminal window to simulate a user entering valid card details:
  ```Bash
  stripe payment_intents confirm pi_YOUR_EXTRACTED_ID --payment-method=pm_card_visa --return-url="https://example.com"
  ```

(Note: pm_card_visa is a Stripe test card that always succeeds).

4. Verify:
  * Check the Stripe Listener terminal: You should see payment_intent.succeeded event being forwarded (200 OK).
  * Check your Backend Logs: You should see "Stripe event processed: CONFIRMED".
  * Check the Database: The transaction status should change from PENDING to CONFIRMED.

### 📖 API Documentation (Swagger UI)
This project includes fully interactive documentation generated by OpenAPI. Once the server is running, you can explore and test all endpoints here:

👉 http://localhost:8080/swagger-ui/index.html

Note: Most endpoints require authentication.
  1. Use the /api/auth/login endpoint in Swagger to log in.
  2. The server sets an HttpOnly Cookie.
  3. Subsequent requests from Swagger will automatically include this cookie. If the cookie expires, login again.
