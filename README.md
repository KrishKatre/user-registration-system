# User Registration System

## Overview
This project is a full-stack application that allows users to register, log in, manage product requests, and view their personalized dashboards. The system supports user authentication, pagination, sorting, filtering, and CRUD operations for product requests.

---

## Features
1. **User Registration and Login:**
   - Users can register and log in securely using JWT-based authentication.
   - Passwords are hashed using bcrypt for enhanced security.

2. **Product Requests:**
   - Users can submit product requests with details like priority, request date, required-by date, and product URL.
   - Product requests are displayed in a paginated dashboard with sorting and filtering options.
   - Users can edit or delete their product requests.

3. **Pagination and Sorting:**
   - Pagination ensures efficient data handling for large datasets.
   - Sorting by priority, request date, or required-by date is supported.

4. **Visual Enhancements:**
   - Material-UI is used for a modern and responsive user interface.

5. **Backend Integration:**
   - A RESTful API built with Express and MongoDB supports all CRUD operations.

---

## Technology Stack
- **Frontend:** React, Material-UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Other Tools:** Puppeteer for web scraping product images

---

## Setup Instructions

### Prerequisites
1. Node.js (v16 or higher)
2. MongoDB (local or cloud instance)
3. Git

### Backend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd user-registration-system/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add the following:
   ```env
   SECRET_KEY=your_secret_key
   MONGO_URI=mongodb://127.0.0.1:27017/user_registration
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The backend server will run at `http://localhost:5000`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```
   The frontend server will run at `http://localhost:3000`.

---

## Usage

1. **Register:**
   - Navigate to the `/register` page and create a new account.

2. **Login:**
   - Navigate to the `/login` page and log in with your credentials.

3. **Dashboard:**
   - After logging in, access your personalized dashboard to view your product requests.

4. **Create Product Request:**
   - Submit a product request using the `Product Request Form` available in the dashboard.

5. **Update Product Request:**
   - Click the "Edit" button next to a product request to update its details.

6. **Delete Product Request:**
   - Delete a product request using the delete option available in the dashboard.

---

## API Endpoints

### Authentication
- **POST /register:** Register a new user.
- **POST /login:** Authenticate a user and receive a JWT.
- **POST /logout:** Invalidate the current JWT.

### Product Requests
- **GET /product-requests:** Fetch paginated, sorted, and filtered product requests for the authenticated user.
- **POST /product-request:** Create a new product request.
- **PUT /product-request/:id:** Update an existing product request.
- **DELETE /product-request/:id:** Delete a product request.

### Web Scraping
- **POST /fetch-product-image:** Fetch the product image URL using Puppeteer.

---

## Deployment

### Backend Deployment
1. Deploy the backend on a cloud platform like Heroku, AWS, or Render.
2. Set the environment variables (e.g., `SECRET_KEY`, `MONGO_URI`) in the deployment environment.

### Frontend Deployment
1. Build the frontend for production:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to a hosting service like Netlify, Vercel, or AWS S3.

3. Update the API URL in the frontend to point to the deployed backend.

---

## Testing
1. Use Postman to test the API endpoints.
2. Verify edge cases like invalid inputs, unauthorized access, and server errors.
3. Perform UI testing to ensure the dashboard and forms work as expected.

---

## Future Improvements
1. Add user profile management.
2. Implement role-based access control (e.g., admin vs. regular user).
3. Enhance performance for large datasets.

---

## Contributors
- Krish Katre

---

## License
This project is licensed under the MIT License.

