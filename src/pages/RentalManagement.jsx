import { useState } from 'react';
import { Table, Button, Modal, Form, Select, InputNumber, DatePicker, message, Card, Statistic, Row, Col, Tag } from 'antd';
import { useRental } from '../providers/RentalProvider';
import dayjs from 'dayjs';

const { Option } = Select;

const RentalManagement = () => {
  const { equipment, rentals, createRental, completeRental } = useRental();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const rentalData = {
        ...values,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        totalPrice: calculateTotalPrice(values),
      };
      createRental(rentalData);
      message.success('Penyewaan berhasil dibuat');
      handleCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const calculateTotalPrice = (values) => {
    const selectedEquipment = equipment.find(item => item.id === values.equipmentId);
    if (!selectedEquipment) return 0;
    
    const days = values.dateRange[1].diff(values.dateRange[0], 'day') + 1;
    return selectedEquipment.price * values.quantity * days;
  };

  const calculateStatistics = () => {
    const totalRentals = rentals.length;
    const activeRentals = rentals.filter(r => r.status === 'active').length;
    const totalRevenue = rentals.reduce((sum, rental) => sum + rental.totalPrice, 0);
    const averageRentalDuration = rentals.reduce((sum, rental) => {
      const duration = dayjs(rental.endDate).diff(dayjs(rental.startDate), 'day') + 1;
      return sum + duration;
    }, 0) / (totalRentals || 1);

    return {
      totalRentals,
      activeRentals,
      totalRevenue,
      averageRentalDuration: Math.round(averageRentalDuration),
    };
  };

  const stats = calculateStatistics();

  const columns = [
    {
      title: 'ID Sewa',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Peralatan',
      dataIndex: 'equipmentId',
      key: 'equipmentId',
      render: (equipmentId) => {
        const item = equipment.find(e => e.id === equipmentId);
        return item ? item.name : '-';
      },
    },
    {
      title: 'Penyewa',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Kontak',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
    },
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Periode Sewa',
      key: 'rentalPeriod',
      render: (_, record) => (
        <>
          <div>Mulai: {dayjs(record.startDate).format('DD/MM/YYYY')}</div>
          <div>Selesai: {dayjs(record.endDate).format('DD/MM/YYYY')}</div>
        </>
      ),
    },
    {
      title: 'Total Harga',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `Rp ${price.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'blue'}>
          {status === 'active' ? 'Aktif' : 'Selesai'}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        record.status === 'active' && (
          <Button
            type="primary"
            onClick={() => {
              Modal.confirm({
                title: 'Selesaikan Sewa',
                content: 'Apakah Anda yakin ingin menyelesaikan penyewaan ini?',
                onOk: () => {
                  completeRental(record.id);
                  message.success('Penyewaan berhasil diselesaikan');
                },
              });
            }}
          >
            Selesaikan
          </Button>
        )
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Kelola Penyewaan</h2>
        <Button type="primary" onClick={showModal}>
          Buat Penyewaan Baru
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Penyewaan"
              value={stats.totalRentals}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Penyewaan Aktif"
              value={stats.activeRentals}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Pendapatan"
              value={stats.totalRevenue}
              precision={0}
              prefix="Rp "
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Rata-rata Durasi Sewa"
              value={stats.averageRentalDuration}
              suffix=" hari"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={rentals}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Buat Penyewaan Baru"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="equipmentId"
            label="Peralatan"
            rules={[{ required: true, message: 'Peralatan harus dipilih' }]}
          >
            <Select>
              {equipment.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name} - Stok: {item.stock}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Jumlah"
            rules={[
              { required: true, message: 'Jumlah harus diisi' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const equipmentId = getFieldValue('equipmentId');
                  const selectedEquipment = equipment.find(item => item.id === equipmentId);
                  if (!selectedEquipment || value <= selectedEquipment.stock) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Jumlah melebihi stok yang tersedia'));
                },
              }),
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Periode Sewa"
            rules={[{ required: true, message: 'Periode sewa harus diisi' }]}
          >
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              disabledDate={current => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="customerName"
            label="Nama Penyewa"
            rules={[{ required: true, message: 'Nama penyewa harus diisi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="customerPhone"
            label="Nomor Telepon"
            rules={[{ required: true, message: 'Nomor telepon harus diisi' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RentalManagement; 