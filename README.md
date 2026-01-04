# 👕 Garments Order & Production Tracker System!

## 📌 Project Description!

The **Garments Order & Production Tracker System (GOPTS)** is a full-stack web application designed to help small and medium-sized garment factories efficiently manage orders, production workflows, inventory, and delivery tracking!
The system supports **role-based access control** for Admin, Manager, and Buyer, ensuring smooth coordination from order placement to final delivery!

🌐 **Live Site:** [https://mygopts.web.app/](https://mygopts.web.app/)!
🔗 **Client Repository:** [https://github.com/Al-Roman23/My_GOPTS_ClienT](https://github.com/Al-Roman23/My_GOPTS_ClienT)!
🔗 **Server Repository:** [https://github.com/Al-Roman23/My_GOPTS_ServeR](https://github.com/Al-Roman23/My_GOPTS_ServeR)!

---

## 🎯 Project Purpose!

* Digitize garments production and order management workflows!
* Enable real-time tracking of production stages and order status!
* Provide a secure and scalable role-based dashboard system!
* Improve efficiency, transparency, and communication between buyers, managers, and admins!

---

## ✨ Key Features!

### 🔐 Authentication & Authorization!

* Email & password authentication using Firebase!
* Google or GitHub social login integration!
* JWT token stored securely in cookies!
* Fully protected private routes for all dashboards!

### 🏠 Home Page!

* Modern hero banner with CTA buttons!
* “Our Products” section (6 products loaded from MongoDB)!
* Step-by-step “How It Works” section!
* Customer feedback carousel!
* Two additional custom-designed sections!
* Smooth Framer Motion animations!

### 🛒 Product & Order System!

* All products page with search and filter functionality!
* Detailed product pages with images, demo video, MOQ, and payment options!
* Role-based booking and order placement system!
* Quantity validation based on minimum order and stock availability!

### 📊 Dashboards!

* Admin dashboard for managing users, products, and orders!
* Manager dashboard for product creation, approval, and tracking!
* Buyer dashboard for viewing and tracking personal orders!

### 🚚 Order Tracking!

* Step-by-step production timeline updates!
* Status tracking such as Cutting, Sewing, Finishing, QC, Packing, and Shipping!
* Read-only tracking access for buyers!

### ⚙️ Additional Features!

* Dark and light theme toggle across the application!
* Fully responsive design for mobile, tablet, and desktop!
* Reusable components and modals!
* Toast & SweetAlert notifications for all CRUD operations!
* Loading spinners during API calls!
* Custom 404 Not Found page!
* Dynamic page titles for better SEO!

---

## 🛠 Technologies Used!

### Frontend!

* React.js!
* React Router DOM!
* Tailwind CSS!
* Framer Motion!
* React Hook Form!
* Axios!
* SweetAlert2 / React Toastify!

### Backend!

* Node.js!
* Express.js!
* MongoDB!
* Firebase Admin SDK!
* JWT Authentication!

---

## ⚙️ Installation & Setup!

### 1️⃣ Clone the Client Repository!

```bash
git clone https://github.com/Al-Roman23/My_GOPTS_ClienT.git!
cd My_GOPTS_ClienT!
```

### 2️⃣ Install Dependencies!

```bash
npm install!
```

### 3️⃣ Environment Variables!

Create a `.env` file in the root directory!

```env
VITE_API_URL=http://localhost:5000!
VITE_FIREBASE_API_KEY=your_firebase_key!
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain!
VITE_FIREBASE_PROJECT_ID=your_project_id!
```

### 4️⃣ Run Development Server!

```bash
npm run dev!
```

### 5️⃣ Build for Production!

```bash
npm run build!
```

---

## 🚀 Deployment!

* Client deployed on Firebase Hosting!
* Server deployed on a production-ready hosting platform!
* Firebase authorized domains configured correctly!
* No CORS, 404, 504, or reload issues in production!

---

## 👥 User Roles!

### 👑 Admin!

* Manage users and update roles!
* Suspend users with feedback reasons!
* Manage all products and orders!
* Access analytics and dashboard insights!

### 🧑‍💼 Manager!

* Add and manage products!
* Approve or reject orders!
* Update order tracking and production stages!

### 🧑 Buyer!

* Browse and place orders!
* Track order progress!
* View suspension feedback if account is suspended!

---

## 📦 Information!

**Admin Email:** [mizukiokada@gmail.com](mailto:mizukiokada@gmail.com)!
**Admin Password:** A12345a@!
**Manager Email:** [alroman@gmail.com](mailto:alroman@gmail.com)!
**Manager Password:** A12345a@!
**Live Site Link:** [https://mygopts.web.app/](https://mygopts.web.app/)!
**Github Repository (Server):** [https://github.com/Al-Roman23/My_GOPTS_ServeR](https://github.com/Al-Roman23/My_GOPTS_ServeR)!
**Github Repository (Client):** [https://github.com/Al-Roman23/My_GOPTS_ClienT](https://github.com/Al-Roman23/My_GOPTS_ClienT)!

---
