# MERNShop

A minimalist, fully functional e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). MERNShop provides a clean shopping experience with robust backend management, role-based access control, and integrated Stripe payments.

## Features

- **Storefront**: Clean, minimalist UI for browsing products, viewing details, and managing a persistent shopping cart.
- **Authentication**: Secure JWT-based user registration and login.
- **Role-Based Access Control (RBAC)**:
  - **Users**: Browse products, manage cart, place orders, and view order history.
  - **Admins**: Access Admin Dashboard to manage products (Create, Read, Update, Delete) and view overall orders.
  - **Super Admins**: Exclusive access to manage other users (promote/demote roles) across the platform.
- **Payments**: Integrated Stripe checkout process.
- **Responsive Design**: Carefully crafted layout that works seamlessly across desktop and mobile devices.

## Tech Stack

**Client:**
- React (v19)
- React Router DOM
- Vite
- Tailwind CSS (implied via minimalist design classes) / Vanilla CSS
- Axios for API requests
- Lucide React for iconography

**Server:**
- Node.js & Express
- MongoDB with Mongoose
- JSON Web Token (JWT) + bcryptjs for authentication
- Stripe for payment processing
- Resend for email notifications (configured)
- Multer for handling file uploads

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Stripe Account (for API keys)

### Installation

1. **Clone the repository** (if applicable)

2. **Setup the Server**

   Navigate to the `server` directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

   Copy the example environment file and configure your variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to include your specific MongoDB connection string, JWT secret, and Stripe Secret Key.*

3. **Setup the Client**

   Navigate back to the root, then into the `client` directory and install dependencies:
   ```bash
   cd ../client
   npm install
   ```

   Copy the example environment file and configure your variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to include your Stripe Publishable Key.*

### Running the Application

You will need two terminal tabs open to run the client and server concurrently.

**Terminal 1: Start the Server**
```bash
cd server
npm run dev
```

**Terminal 2: Start the Client**
```bash
cd client
npm run dev
```

The application will be accessible at `http://localhost:5173`. The backend development server runs on `http://localhost:5000`.

## How to Use

1. **Sign Up/Log In**: Create a new account. By default, new accounts have the 'User' role.
2. **Shop**: Browse products, add them to your cart, and proceed to checkout.
3. **Checkout**: Enter shipping information and complete the payment using the Stripe test card numbers.
4. **Admin Access**: If you need to test Admin/Super Admin features, you will need to manually update your user document directly in your MongoDB database to change the `role` field from `User` to `Admin` or `Super Admin`. Afterwards, you'll see the respective dashboards in the navigation.

## Support

If you encounter any issues or have questions regarding the setup, please check the [Issues](../../issues) tab on the repository (if hosted) or contact the project maintainer.

## Maintainers

- **Satyakiran** - *Initial work and maintenance*

This project is open-source. Feel free to fork the repository and submit pull requests.
