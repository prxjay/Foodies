import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import ExploreFood from "./pages/ExploreFood/ExploreFood";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import MyOrders from "./pages/MyOrders/MyOrders";
import Menubar from "./components/Menubar/Menubar";
import { StoreContext } from "./context/StoreContext";

const App = () => {
  const { token } = useContext(StoreContext);
  return (
    <AuthProvider>
      <Menubar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/explore" element={<ExploreFood />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={token ? <PlaceOrder /> : <Login />} />
        <Route path="/login" element={token ? <Home /> : <Login />} />
        <Route path="/register" element={token ? <Home /> : <Register />} />
        <Route path="/myorders" element={token ? <MyOrders /> : <Login />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
