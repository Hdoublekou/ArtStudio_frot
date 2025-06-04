import { Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/favoritesContext';
import { CartProvider } from './context/CartContext'; 
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import CourseApplication from './pages/CourseApplication';
import MyArtworks from './pages/MyArtworks'; 
import Products from './pages/Products';
import Cart from './pages/Cart';
import Addresses from './pages/Addresses';
import Orders from './pages/Orders';
import OrderConfirm from './pages/OrderConfirm';
import ProductDetail from './pages/ProductDetail';
import ShopProducts from './pages/ShopProducts';

export default function App() {
  return (
        <FavoritesProvider>
    <CartProvider>
      <Routes>
        {/* ✅ 首页直接是 Home，不套 Layout */}
        <Route path="/" element={<Home />} />

        {/* ✅ 其他页面统一套 Layout */}
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/course-application" element={<CourseApplication />} />
          <Route path="/my-artworks" element={<MyArtworks />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/my-products" element={<ShopProducts />} />
<Route path="/orders" element={<Orders />} />
<Route path="/orders/:id" element={<Orders />} /> 
<Route path="/order-confirm" element={<OrderConfirm />} />
<Route path="/products/:id" element={<ProductDetail />} />
        </Route>

        {/* ✅ 未匹配到的路径进入 NotFound */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CartProvider>
    </FavoritesProvider>
  );
}
