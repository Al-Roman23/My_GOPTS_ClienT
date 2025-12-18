import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AllProductsPage from "../pages/AllProducts/AllProductsPage";
import PrivateRoute from "./PrivateRoute";
import ProductDetailsPage from "../pages/AllProducts/ProductDetails";
import BookingForm from "../pages/AllProducts/BookingForm";
import PublicTrackOrder from "../pages/Dashboard/User/TrackOrder/PublicTrackOrder";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import RoleRoute from "./RoleRoute";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers/ManageUsers";
import AllProducts from "../pages/Dashboard/Admin/AllProducts/AllProducts";
import AllOrders from "../pages/Dashboard/Admin/AllOrders/AllOrders";
import OrderDetails from "../pages/Dashboard/Admin/OrderDetails/OrderDetails";
import AddProduct from "../pages/Dashboard/Manager/AddProduct/AddProduct";
import ManageProducts from "../pages/Dashboard/Manager/ManageProducts/ManageProducts";
import UpdateProduct from "../pages/Dashboard/Manager/UpdateProduct/UpdateProduct";
import PendingOrders from "../pages/Dashboard/Manager/PendingOrders/PendingOrders";
import ApprovedOrders from "../pages/Dashboard/Manager/ApprovedOrders/ApprovedOrders";
import MyOrders from "../pages/Dashboard/User/MyOrders/MyOrders";
import Profile from "../pages/Dashboard/User/Profile/Profile";
import AdminUpdateProduct from "../pages/Dashboard/Admin/AdminUpdateProduct/AdminUpdateProduct";
import TrackOrder from "../pages/Dashboard/User/TrackOrder/TrackOrder";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "all-products", element: <AllProductsPage /> },
      {
        path: "product/:id",
        element: (
          <PrivateRoute>
            <ProductDetailsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "booking/:id",
        element: (
          <PrivateRoute>
            <BookingForm />
          </PrivateRoute>
        ),
      },
      { path: "track-order", element: <PublicTrackOrder /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      {
        path: "track-order",
        element: (
          <RoleRoute allowed={["buyer"]}>
            <TrackOrder />
          </RoleRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <RoleRoute allowed={["admin"]}>
            <ManageUsers />
          </RoleRoute>
        ),
      },
      {
        path: "all-products",
        element: (
          <RoleRoute allowed={["admin"]}>
            <AllProducts />
          </RoleRoute>
        ),
      },
      {
        path: "all-orders",
        element: (
          <RoleRoute allowed={["admin"]}>
            <AllOrders />
          </RoleRoute>
        ),
      },
      {
        path: "order-details/:id",
        element: (
          <RoleRoute allowed={["admin", "manager"]}>
            <OrderDetails />
          </RoleRoute>
        ),
      },
      {
        path: "add-product",
        element: (
          <RoleRoute allowed={["manager"]}>
            <AddProduct />
          </RoleRoute>
        ),
      },
      {
        path: "manage-products",
        element: (
          <RoleRoute allowed={["manager"]}>
            <ManageProducts />
          </RoleRoute>
        ),
      },
      {
        path: "update-product/:id",
        element: (
          <RoleRoute allowed={["manager"]}>
            <UpdateProduct />
          </RoleRoute>
        ),
      },
      {
        path: "pending-orders",
        element: (
          <RoleRoute allowed={["manager"]}>
            <PendingOrders />
          </RoleRoute>
        ),
      },
      {
        path: "approved-orders",
        element: (
          <RoleRoute allowed={["manager"]}>
            <ApprovedOrders />
          </RoleRoute>
        ),
      },
      {
        path: "my-orders",
        element: (
          <RoleRoute allowed={["buyer"]}>
            <MyOrders />
          </RoleRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <RoleRoute allowed={["buyer", "manager", "admin"]}>
            <Profile />
          </RoleRoute>
        ),
      },
      {
        path: "admin/update-product/:id",
        element: (
          <RoleRoute allowed={["admin"]}>
            <AdminUpdateProduct />
          </RoleRoute>
        ),
      },
    ],
  },
]);
