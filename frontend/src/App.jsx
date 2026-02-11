import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { HotelList } from './pages/merchant/HotelList';
import { HotelForm } from './pages/merchant/HotelForm';
import { HotelDetail } from './pages/merchant/HotelDetail';
import { HotelAuditList } from './pages/admin/HotelAuditList';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/merchant" element={<ProtectedRoute allowedRoles={"merchant"}><HotelList /></ProtectedRoute>} />
          <Route path="/merchant/hotels/new" element={<ProtectedRoute allowedRoles={"merchant"}><HotelForm /></ProtectedRoute>} />
          <Route path="/merchant/hotels/:id" element={<ProtectedRoute allowedRoles={"merchant"}><HotelDetail /></ProtectedRoute>} />
          <Route path="/merchant/hotels/:id/edit" element={<ProtectedRoute allowedRoles={"merchant"}><HotelForm /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={"admin"}><HotelAuditList /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
