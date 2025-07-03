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
import { getData, createData, updateData, deleteData } from "../utils/api";

const { TextArea } = Input;
const { Option } = Select;

// const GROUP_ID = 44;

const Playlist = () => {
  const [form] = Form.useForm();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [id, setIdPlay] = useState(null);

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  const fetchPlaylistData = () => {
    setIsLoading(true);
    getData(`/api/v1/playlist/`)
      .then((response) => {
        if (response?.datas) setPlaylists(response.datas);
        else showNotification("error", "Gagal", "Data tidak ditemukan");
      })
      .catch(() => {
        showNotification("error", "Gagal", "Gagal mengambil data playlist");
      })
      .finally(() => setIsLoading(false));
  };

  const showNotification = (type, title, description) => {
    message[type](`${title}: ${description}`);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = new FormData();
        formData.append("play_name", values.play_name);
        formData.append("play_url", values.play_url);
        formData.append("play_thumbnail", values.play_thumbnail);
        formData.append("play_genre", values.play_genre);
        formData.append("play_description", values.play_description);

        const isEdit = id !== null;
        const apiUrl = isEdit
          ? `/api/v1/playlist/${id}`
          : `/api/v1/playlist/`;
        const apiMethod = isEdit ? updateData : createData;

        apiMethod(apiUrl, formData)
          .then((response) => {
            if (
              response?.message === "Inserted" ||
              response?.message === "updated" ||
              (typeof response?.message === "string" && response.message.toLowerCase().includes("ok")) ||
              response?.status === 200
            ) {
              showNotification(
                "success",
                "Sukses",
                isEdit
                  ? "Playlist berhasil diperbarui"
                  : "Playlist berhasil ditambahkan"
              );
              form.resetFields();
              fetchPlaylistData();
              setIsModalVisible(false);
              setIdPlay(null);
            } else {
              showNotification(
                "error",
                "Gagal",
                response?.message || "Gagal menyimpan data"
              );
            }
          })
          .catch(() =>
            showNotification(
              "error",
              "Gagal",
              "Terjadi kesalahan saat menyimpan data"
            )
          );
      })
      .catch(() =>
        showNotification(
          "error",
          "Validasi Gagal",
          "Harap lengkapi semua field"
        )
      );
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Hapus Playlist",
      content: "Apakah yakin ingin menghapus playlist ini?",
      okType: "danger",
      okText: "Ya",
      cancelText: "Batal",
      async onOk() {
        try {
          await deleteData(`/api/v1/playlist/${id}`);
          message.success("Playlist berhasil dihapus");
          fetchPlaylistData();
        } catch {
          message.error("Gagal menghapus playlist");
        }
      },
    });
  };

  const handleEdit = (playlist) => {
    setIdPlay(playlist.id);
    form.setFieldsValue(playlist);
    setIsModalVisible(true);
  };

  const showModal = () => {
    setIdPlay(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIdPlay(null);
  };

  // Group playlists by genre
  const groupedPlaylists = playlists.reduce((acc, playlist) => {
    const genre = playlist.play_genre || "Uncategorized";
    if (!acc[genre]) {
      acc[genre] = [];
    }
    acc[genre].push(playlist);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      {/* Hero Section */}
      <div className="container mx-auto mt-8 relative h-64 flex items-center justify-center text-white rounded-lg shadow-xl overflow-hidden mb-28">
        <img
          src="https://i.pinimg.com/736x/6a/5e/cc/6a5ecc6e1a630ed430f3b427941200d2.jpg"
          alt="PLAYLIST VIDEO TENDAKU"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        <div className="relative z-20 text-center px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 leading-tight drop-shadow-lg text-white" style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.7)' }}>
            PLAYLIST VIDEO TENDAKU
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
            Bagikan Pengalaman Camping Anda dan Temukan Playlist Inspiratif dari Sesama Pengguna TendaKu!
          </p>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white bg-opacity-20 text-white shadow-md mt-4">
            🎥 {playlists.length} Video Tersedia
          </span>
        </div>
      </div>

      {/* Main content area below hero */}
      <div className="container mx-auto px-4 py-8 mt-28">
        <div className="flex justify-between items-center mb-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Semua Playlist</h2>
          <Button type="primary" size="large" className="bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md" onClick={showModal}>
            <PlusOutlined /> Tambah Playlist
          </Button>
        </div>

        <Modal
          title={id ? "Edit Playlist" : "Tambah Playlist"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="play_name"
              label="Judul"
              rules={[{ required: true, message: "Masukkan judul" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="play_url"
              label="URL Video"
              rules={[
                { required: true, message: "Masukkan URL" },
                { type: "url", message: "URL tidak valid" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="play_thumbnail"
              label="URL Thumbnail"
              rules={[
                { required: true, message: "Masukkan URL thumbnail" },
                { type: "url", message: "URL tidak valid" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="play_genre"
              label="Genre"
              rules={[{ required: true, message: "Pilih genre" }]}
            >
              <Select placeholder="Pilih genre">
                <Option value="music">Music</Option>
                <Option value="song">Song</Option>
                <Option value="education">Education</Option>
                <Option value="movie">Movie</Option>
                <Option value="others">Others</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="play_description"
              label="Deskripsi"
              rules={[{ required: true, message: "Masukkan deskripsi" }]}
            >
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item className="text-right">
              <Space>
                <Button onClick={handleCancel}>Batal</Button>
                <Button type="primary" htmlType="submit">
                  {id ? "Update" : "Simpan"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {isLoading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : playlists.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            Tidak ada data playlist.
          </div>
        ) : (
          Object.keys(groupedPlaylists).map((genre) => (
            <div key={genre} className="mb-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 mt-8 pb-2 flex items-center">
                <PlayCircleOutlined className="mr-2 text-blue-500" />
                {genre}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {groupedPlaylists[genre].map((playlist, idx) => (
                  <Card
                    key={playlist.id}
                    hoverable
                    className={`rounded-lg shadow-md overflow-hidden hover-lift floating stagger-${(idx%5)+1}`}
                    cover={
                      <a href={playlist.play_url} target="_blank" rel="noopener noreferrer" className="block relative active:scale-110 active:shadow-3xl hover:scale-105 hover:shadow-2xl transition-transform duration-200">
                        <img
                          src={playlist.play_thumbnail}
                          alt={playlist.play_name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <PlayCircleOutlined className="text-white text-5xl" />
                        </div>
                      </a>
                    }
                    actions={[
                      <Button
                        key="edit"
                        icon={<EditOutlined />}
                        type="text"
                        onClick={() => handleEdit(playlist)}
                      >
                        Edit
                      </Button>,
                      <Button
                        key="delete"
                        icon={<DeleteOutlined />}
                        type="text"
                        danger
                        onClick={() => handleDelete(playlist.id)}
                      >
                        Hapus
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={<h4 className="text-lg font-semibold line-clamp-1">{playlist.play_name}</h4>}
                      description={
                        <div className="flex flex-col">
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2">{playlist.play_description}</p>
                          <Tag color="blue" className="rounded-full text-xs px-2 py-0.5 font-semibold self-start">{playlist.play_genre.toUpperCase()}</Tag>
                        </div>
                      }
                    />
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlist;
