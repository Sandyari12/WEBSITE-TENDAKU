// ✅ Playlist.jsx (versi awal tanpa context)
import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { TextArea } = Input;
const { Option } = Select;

const Playlist = () => {
  const [form] = Form.useForm();
  const [playlists, setPlaylists] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const fetchPlaylists = async () => {
    try {
      const res = await fetch("/api/v1/playlist");
      const data = await res.json();
      setPlaylists(data.datas || []);
    } catch (error) {
      message.error("Gagal mengambil data playlist");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const payload = {
          play_name: values.play_name,
          play_url: values.play_url,
          play_thumbnail: values.play_thumbnail,
          play_genre: values.play_genre,
          play_description: values.play_description,
        };

        const formData = new FormData();
        Object.keys(payload).forEach((key) =>
          formData.append(key, payload[key])
        );

        const url = editId
          ? `/api/v1/playlist/${editId}`
          : `/api/v1/playlist`;
        const method = editId ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          body: formData,
        });

        if (response.ok) {
          message.success(editId ? "Berhasil diperbarui" : "Berhasil ditambahkan");
          fetchPlaylists();
          form.resetFields();
          setIsModalVisible(false);
          setEditId(null);
        } else {
          message.error("Gagal menyimpan playlist");
        }
      })
      .catch(() => message.error("Harap isi semua field"));
  };

  const handleEdit = (playlist) => {
    setEditId(playlist.id);
    form.setFieldsValue(playlist);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Hapus Playlist",
      content: "Apakah yakin ingin menghapus playlist ini?",
      okType: "danger",
      onOk: async () => {
        try {
          await fetch(`/api/v1/playlist/${id}`, { method: "DELETE" });
          message.success("Playlist berhasil dihapus");
          fetchPlaylists();
        } catch {
          message.error("Gagal menghapus playlist");
        }
      },
    });
  };

  const showModal = () => {
    setEditId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const grouped = playlists.reduce((acc, p) => {
    const genre = p.play_genre || "Uncategorized";
    if (!acc[genre]) acc[genre] = [];
    acc[genre].push(p);
    return acc;
  }, {});

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Playlist Video</h2>
        {isAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Tambah Playlist
          </Button>
        )}
      </div>

      <Modal
        title={editId ? "Edit Playlist" : "Tambah Playlist"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditId(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="play_name" label="Judul" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="play_url" label="URL Video" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="play_thumbnail" label="URL Thumbnail" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="play_genre" label="Genre" rules={[{ required: true }]}>
            <Select>
              <Option value="music">Music</Option>
              <Option value="song">Song</Option>
              <Option value="education">Education</Option>
              <Option value="movie">Movie</Option>
              <Option value="others">Others</Option>
            </Select>
          </Form.Item>
          <Form.Item name="play_description" label="Deskripsi" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Batal</Button>
              <Button type="primary" htmlType="submit">
                {editId ? "Simpan" : "Tambah"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {Object.keys(grouped).map((genre) => (
        <div key={genre} className="mb-10">
          <h3 className="text-xl font-bold mb-4">{genre}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {grouped[genre].map((playlist) => (
              <Card
                key={playlist.id}
                cover={<img alt={playlist.play_name} src={playlist.play_thumbnail} />}
                actions={
                  isAdmin
                    ? [
                        <EditOutlined key="edit" onClick={() => handleEdit(playlist)} />,
                        <DeleteOutlined key="delete" onClick={() => handleDelete(playlist.id)} />,
                      ]
                    : []
                }
              >
                <Card.Meta
                  title={playlist.play_name}
                  description={
                    <>
                      <p>{playlist.play_description}</p>
                      <Tag>{playlist.play_genre}</Tag>
                    </>
                  }
                />
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Playlist;
