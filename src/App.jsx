import "./App.css";
import Layout from "./Layout";
import Home from "./pages/Home";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from './redux/slices/authSlice';
import About from './components/About';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Login from './pages/Login';
import MatchDetail from "./pages/MatchDetail";

import Service from "./components/Service";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserInfo());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/match/:id" element={<MatchDetail />} />
      </Route>
    </Routes>
  );
}

export default App;