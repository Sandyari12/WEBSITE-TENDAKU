import { useState, useEffect } from 'react'
import { Drawer, Button as AntButton, message, Modal } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getRentals,
  updateRental,
  deleteRental,
  getPlaylists,
  createPlaylist,
  deletePlaylist,
  getRentalItemsByRentalId,
} from '../utils/api'

function Admin() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Admin</h2>
      {/* Tambahkan statistik, chart, atau ringkasan lain di sini jika perlu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contoh statistik cards */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">Welcome, Admin!</span>
          <span className="text-gray-500 mt-2">Kelola produk, pesanan, dan playlist melalui menu di sidebar.</span>
        </div>
        {/* Tambahkan card statistik lain jika diinginkan */}
      </div>
    </div>
  );
}

export default Admin