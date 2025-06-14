import { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios'; // Nanti akan digunakan untuk API calls

const { Option } = Select;
const { TextArea } = Input;

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load playlists from API when component mounts
  useEffect(() => {
    fetchPlaylists();
  }, []);

  // Fungsi untuk mengambil data dari API
  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      // Nanti akan diganti dengan API call
      // const response = await axios.get('http://your-api-url/playlists');
      // setPlaylists(response.data);
      
      // Sementara masih pakai localStorage
      const savedPlaylists = localStorage.getItem('playlists');
      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      }
    } catch (error) {
      message.error('Gagal mengambil data playlist');
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        // Update existing playlist
        // Nanti akan diganti dengan API call
        // await axios.put(`http://your-api-url/playlists/${editingId}`, values);
        
        // Sementara masih pakai localStorage
        setPlaylists(prev => prev.map(playlist => 
          playlist.id === editingId ? { ...values, id: editingId } : playlist
        ));
        message.success('Playlist berhasil diperbarui');
      } else {
        // Add new playlist
        // Nanti akan diganti dengan API call
        // const response = await axios.post('http://your-api-url/playlists', values);
        // setPlaylists(prev => [...prev, response.data]);
        
        // Sementara masih pakai localStorage
        const newId = Date.now();
        setPlaylists(prev => [...prev, { ...values, id: newId }]);
        message.success('Playlist berhasil ditambahkan');
      }
      form.resetFields();
      setIsModalVisible(false);
      setEditingId(null);
    } catch (error) {
      message.error('Gagal menyimpan playlist');
      console.error('Error saving playlist:', error);
    }
  };

  const handleEdit = (playlist) => {
    setEditingId(playlist.id);
    form.setFieldsValue(playlist);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Hapus Playlist',
      content: 'Apakah Anda yakin ingin menghapus playlist ini?',
      okText: 'Ya',
      okType: 'danger',
      cancelText: 'Tidak',
      async onOk() {
        try {
          // Nanti akan diganti dengan API call
          // await axios.delete(`http://your-api-url/playlists/${id}`);
          
          // Sementara masih pakai localStorage
          setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
          message.success('Playlist berhasil dihapus');
        } catch (error) {
          message.error('Gagal menghapus playlist');
          console.error('Error deleting playlist:', error);
        }
      }
    });
  };

  const showModal = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Playlist Video</h1>
        <Button type="primary" onClick={showModal} size="large">
          Tambah Playlist
        </Button>
      </div>

      <Modal
        title={editingId ? "Edit Playlist" : "Tambah Playlist Baru"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="play_name"
            label="Judul"
            rules={[{ required: true, message: 'Mohon masukkan judul' }]}
          >
            <Input placeholder="Masukkan judul playlist" />
          </Form.Item>

          <Form.Item
            name="play_url"
            label="URL Video"
            rules={[
              { required: true, message: 'Mohon masukkan URL video' },
              { type: 'url', message: 'URL tidak valid' }
            ]}
          >
            <Input placeholder="Masukkan URL video YouTube" />
          </Form.Item>

          <Form.Item
            name="play_thumbnail"
            label="URL Thumbnail"
            rules={[
              { required: true, message: 'Mohon masukkan URL thumbnail' },
              { type: 'url', message: 'URL tidak valid' }
            ]}
          >
            <Input placeholder="Masukkan URL thumbnail" />
          </Form.Item>

          <Form.Item
            name="play_genre"
            label="Genre"
            rules={[{ required: true, message: 'Mohon pilih genre' }]}
          >
            <Select placeholder="Pilih genre">
              <Option value="music">Music</Option>
              <Option value="song">Song</Option>
              <Option value="movie">Movie</Option>
              <Option value="education">Education</Option>
              <Option value="others">Others</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="play_description"
            label="Deskripsi"
            rules={[{ required: true, message: 'Mohon masukkan deskripsi' }]}
          >
            <TextArea rows={4} placeholder="Masukkan deskripsi playlist" />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={handleCancel}>Batal</Button>
              <Button type="primary" htmlType="submit">
                {editingId ? 'Update' : 'Simpan'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            Loading...
          </div>
        ) : playlists.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Belum ada playlist. Silakan tambahkan playlist baru.
          </div>
        ) : (
          playlists.map((playlist) => (
            <Card
              key={playlist.id}
              hoverable
              cover={
                <img
                  alt={playlist.play_name}
                  src={playlist.play_thumbnail}
                  className="h-48 object-cover"
                />
              }
              actions={[
                <a
                  key="watch"
                  href={playlist.play_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  <PlayCircleOutlined /> Tonton
                </a>,
                <Button
                  key="edit"
                  type="text"
                  icon={<EditOutlined />}
                  className="text-yellow-500"
                  onClick={() => handleEdit(playlist)}
                >
                  Edit
                </Button>,
                <Button
                  key="delete"
                  type="text"
                  icon={<DeleteOutlined />}
                  className="text-red-500"
                  onClick={() => handleDelete(playlist.id)}
                >
                  Hapus
                </Button>
              ]}
            >
              <Card.Meta
                title={playlist.play_name}
                description={
                  <>
                    <p className="text-gray-600 mb-2">{playlist.play_description}</p>
                    <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                      {playlist.play_genre}
                    </span>
                  </>
                }
              />
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlist; 