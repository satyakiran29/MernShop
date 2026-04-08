# MernShop

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

## What the project does

**MernShop** is a minimalist, fully functional e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It provides a complete end-to-end shopping experience, robust backend management, unified customer support (including AI chatbot & Tawk.to live chat), role-based access control, and integrated Stripe payments.

Whether you're looking for a solid foundation to build a fast-scaling commerce platform or wanting to explore MERN stack best practices, MernShop offers an integrated architecture out-of-the-box.

## Why the project is useful

MernShop handles the heavy lifting of essential e-commerce features so you can focus on building your business logic. 

**Key Features & Benefits:**
- 🛒 **MernShop**: Clean, minimalist UI for browsing products, managing a persistent shopping cart, and seamless checkout.
- 🔐 **Authentication**: Secure JWT-based user registration and login.
- 🛡️ **Role-Based Access Control (RBAC)**:
  - *Users*: Browse, add to cart, and view order history.
  - *Admins/Sellers*: Manage their own product catalogs and view assigned orders.
  - *Super Admins*: Oversee users, promote roles, and monitor entire platform metrics.
- 💳 **Payments Integration**: Ready-to-go Stripe checkout for secure transaction processing.
- 📧 **Automated Emails**: Integrated with Resend for transactional emails (order confirmations, welcomes).
- 💬 **Omnichannel Support**: Unified chat interface mixing AI assistance and human representative routing (Tawk.to).

## How users can get started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (Local or Atlas)
- Stripe Account (for API keys)
- Resend Account (for email automation API keys)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/satyakiran29/MernShop.git
   cd MernShop
   ```

2. **Backend Setup (`/server`):**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```
   *Edit the `.env` file to configure your `MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, and `RESEND_API_KEY`.*

3. **Frontend Setup (`/client`):**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   ```
   *Edit the `.env` file to include your `VITE_STRIPE_PUBLISHABLE_KEY`.*

### Running the Project

You will need two terminal sessions to run both servers concurrently:

```bash
# Terminal 1: Backend
cd server
npm run dev
# Server running at http://localhost:5000

# Terminal 2: Frontend
cd client
npm run dev
# Client accessible at http://localhost:5173
```

### Usage Example

**API Snippet: Fetching Products**
```javascript
import axios from 'axios';

// Fetch all available products from the store
const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/products');
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
```

*For complete API routes, reference our [API Documentation](docs/API.md).*

## Where users can get help

- **API Documentation:** View the [Detailed API Routes](docs/API.md).
- **Issue Tracker:** Found a bug? File it in the [Issues tab](https://github.com/satyakiran29/MernShop/issues).
- **Community Wiki:** For detailed troubleshooting guides, check out the repository [Wiki](https://github.com/satyakiran29/MernShop/wiki).

## Who maintains and contributes

**Maintainer:** [Satyakiran](https://github.com/satyakiran29) - *Lead Developer & Architect*

We welcome contributions from the community! If you're interested in helping improve MernShop:

1. Read our [Contribution Guidelines](docs/CONTRIBUTING.md) to understand our workflow.
2. Fork the repository and create a feature branch.
3. Submit a Pull Request with a clear description of your changes.

---

### License

This project is open-source and available under the terms defined in the [LICENSE](LICENSE) file.
