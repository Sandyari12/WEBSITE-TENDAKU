import { useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useRental } from '../providers/RentalProvider';

const { Option } = Select;

const EquipmentList = () => {
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useRental();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const categories = ['all', 'Tenda', 'Peralatan Tidur', 'Peralatan Masak', 'Peralatan Navigasi', 'Peralatan Keamanan'];
  const priceRanges = [
    { value: 'all', label: 'Semua Harga' },
    { value: '0-50000', label: 'Rp 0 - 50.000' },
    { value: '50000-100000', label: 'Rp 50.000 - 100.000' },
    { value: '100000-200000', label: 'Rp 100.000 - 200.000' },
    { value: '200000+', label: '> Rp 200.000' },
  ];

  const showModal = (equipment = null) => {
    setEditingEquipment(equipment);
    if (equipment) {
      form.setFieldsValue(equipment);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEquipment(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingEquipment) {
        updateEquipment(editingEquipment.id, values);
        message.success('Peralatan berhasil diperbarui');
      } else {
        addEquipment(values);
        message.success('Peralatan berhasil ditambahkan');
      }
      handleCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Hapus Peralatan',
      content: 'Apakah Anda yakin ingin menghapus peralatan ini?',
      onOk: () => {
        deleteEquipment(id);
        message.success('Peralatan berhasil dihapus');
      },
    });
  };

  const filterEquipment = () => {
    return equipment.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          matchesPrice = item.price >= min && item.price <= max;
        } else {
          matchesPrice = item.price >= min;
        }
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });
  };

  const filteredEquipment = filterEquipment();

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Daftar Peralatan Camping</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Tambah Peralatan
        </Button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Input
              placeholder="Cari peralatan..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={setSelectedCategory}
            >
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category === 'all' ? 'Semua Kategori' : category}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: '100%' }}
              value={priceRange}
              onChange={setPriceRange}
            >
              {priceRanges.map(range => (
                <Option key={range.value} value={range.value}>
                  {range.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]}>
        {filteredEquipment.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              hoverable
              cover={<img alt={item.name} src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
              actions={[
                <EditOutlined key="edit" onClick={() => showModal(item)} />,
                <DeleteOutlined key="delete" onClick={() => handleDelete(item.id)} />
              ]}
            >
              <Card.Meta
                title={item.name}
                description={
                  <>
                    <p>Kategori: {item.category}</p>
                    <p>Harga: Rp {item.price.toLocaleString()}/hari</p>
                    <p>Stok: {item.stock}</p>
                    <p>{item.description}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingEquipment ? 'Edit Peralatan' : 'Tambah Peralatan'}
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
            name="name"
            label="Nama Peralatan"
            rules={[{ required: true, message: 'Nama peralatan harus diisi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Kategori"
            rules={[{ required: true, message: 'Kategori harus dipilih' }]}
          >
            <Select>
              <Option value="Tenda">Tenda</Option>
              <Option value="Peralatan Tidur">Peralatan Tidur</Option>
              <Option value="Peralatan Masak">Peralatan Masak</Option>
              <Option value="Peralatan Navigasi">Peralatan Navigasi</Option>
              <Option value="Peralatan Keamanan">Peralatan Keamanan</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Harga Sewa per Hari"
            rules={[{ required: true, message: 'Harga sewa harus diisi' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\Rp\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stok"
            rules={[{ required: true, message: 'Stok harus diisi' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            name="image"
            label="URL Gambar"
            rules={[{ required: true, message: 'URL gambar harus diisi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Deskripsi"
            rules={[{ required: true, message: 'Deskripsi harus diisi' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EquipmentList; 