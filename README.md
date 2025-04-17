# KoreConnect

KoreConnect is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to provide a seamless user experience for managing food orders. The application includes both user and admin interfaces, allowing users to browse menus, place orders, and track their order status, while admins can manage menus, track orders, and view analytics.

## Features

### User Features
- **User Authentication**: Secure login and signup with JWT authentication.
- **Browse Menus**: Users can browse available food menus.
- **Order Management**: Place orders and track their status.
- **Profile Management**: Update personal information and view order history.
- **Cart Functionality**: Add items to the cart and proceed to checkout.

### Admin Features
- **Dashboard**: View and manage all orders.
- **Menu Management**: Add, update, or remove menu items.
- **Order Tracking**: Update order statuses and view order details.
- **Analytics**: View sales and order analytics.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Netlify (Frontend), Render (Backend)

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas account or local MongoDB server
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/KoreConnect.git
   cd KoreConnect
   ```

2. **Backend Setup:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the backend directory and add your environment variables:
     ```
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     PORT=5000
     NODE_ENV=production
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Frontend Setup:**
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env.production` file in the frontend directory and add your environment variables:
     ```
     VITE_API_URL=https://your-backend-url.com
     ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

## Deployment

- **Frontend**: Deployed on Netlify. Ensure the `VITE_API_URL` in `.env.production` points to your deployed backend.
- **Backend**: Deployed on Render. Ensure all environment variables are set in the Render dashboard.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact 19manikandan2005@gmail.com.
---

Developed by **[max-mani](https://github.com/max-mani)** and Team KoreConnect.
