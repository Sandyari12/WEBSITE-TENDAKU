import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const { Title } = Typography;

// Data dummy
const pesananPerBulan = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    {
      label: 'Pesanan',
      data: [12, 19, 15, 22, 30, 25, 28, 20, 18, 24, 27, 32],
      backgroundColor: 'rgba(24, 144, 255, 0.7)',
      borderColor: 'rgba(24, 144, 255, 1)',
      borderWidth: 2,
      borderRadius: 8,
    },
  ],
};

const produkTerlaris = {
  labels: ['Tenda Dome', 'Kompor', 'Sleeping Bag', 'Lampu LED', 'Matras'],
  datasets: [
    {
      label: 'Jumlah Disewa',
      data: [40, 32, 28, 20, 15],
      backgroundColor: [
        'rgba(24, 144, 255, 0.7)',
        'rgba(82, 196, 26, 0.7)',
        'rgba(250, 173, 20, 0.7)',
        'rgba(255, 77, 79, 0.7)',
        'rgba(114, 46, 209, 0.7)'
      ],
      borderColor: [
        'rgba(24, 144, 255, 1)',
        'rgba(82, 196, 26, 1)',
        'rgba(250, 173, 20, 1)',
        'rgba(255, 77, 79, 1)',
        'rgba(114, 46, 209, 1)'
      ],
      borderWidth: 2,
      borderRadius: 8,
    },
  ],
};

const statusPesanan = {
  labels: ['Menunggu', 'Selesai', 'Dibatalkan'],
  datasets: [
    {
      label: 'Status',
      data: [8, 22, 3],
      backgroundColor: [
        'rgba(24, 144, 255, 0.7)',
        'rgba(82, 196, 26, 0.7)',
        'rgba(255, 77, 79, 0.7)'
      ],
      borderColor: [
        'rgba(24, 144, 255, 1)',
        'rgba(82, 196, 26, 1)',
        'rgba(255, 77, 79, 1)'
      ],
      borderWidth: 2,
    },
  ],
};

const pendapatanPerBulan = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    {
      label: 'Pendapatan (Rp)',
      data: [1200000, 1800000, 1500000, 2200000, 3000000, 2500000, 2800000, 2000000, 1800000, 2400000, 2700000, 3200000],
      fill: true,
      backgroundColor: 'rgba(82, 196, 26, 0.2)',
      borderColor: 'rgba(82, 196, 26, 1)',
      tension: 0.4,
      pointBackgroundColor: 'rgba(82, 196, 26, 1)',
      pointBorderColor: '#fff',
      pointRadius: 5,
    },
  ],
};

const Graph = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa', padding: 0 }}>
      <div className="p-6 max-w-7xl mx-auto">
        <Title level={2} className="mb-6" style={{ color: '#222', fontWeight: 700 }}>Statistik & Grafik</Title>
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} md={12}>
            <Card title="Pesanan per Bulan" style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(24,144,255,0.06)' }}>
              <Bar data={pesananPerBulan} options={{ responsive: true, plugins: { legend: { display: false } } }} height={220} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Produk Terlaris" style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(24,144,255,0.06)' }}>
              <Bar data={produkTerlaris} options={{ responsive: true, plugins: { legend: { display: false } } }} height={220} />
            </Card>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Status Pesanan" style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(24,144,255,0.06)' }}>
              <Doughnut data={statusPesanan} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} height={220} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Pendapatan per Bulan" style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(24,144,255,0.06)' }}>
              <Line data={pendapatanPerBulan} options={{ responsive: true, plugins: { legend: { display: false } } }} height={220} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Graph; 