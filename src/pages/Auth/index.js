import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';

export default function Auth() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}