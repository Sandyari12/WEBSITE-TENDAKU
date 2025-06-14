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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { getData, createData, updateData, deleteData } from "../utils/api";

const { TextArea } = Input;
const { Option } = Select;

const GROUP_ID = 44;

const Playlist = () => {
  const [form] = Form.useForm();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [id_play, setIdPlay] = useState(null);

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  const fetchPlaylistData = () => {
    setIsLoading(true);
    getData(`/api/playlist/${GROUP_ID}`)
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

        const isEdit = id_play !== null;
        const apiUrl = isEdit
          ? `/api/playlist/update/${id_play}`
          : `/api/playlist/${GROUP_ID}`;
        const apiMethod = isEdit ? updateData : createData;

        apiMethod(apiUrl, formData)
          .then((response) => {
            if (
              response?.message === "Inserted" ||
              response?.message === "Updated" ||
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


const handleDelete = (id_play) => {
  Modal.confirm({
    title: "Hapus Playlist",
    content: "Apakah yakin ingin menghapus playlist ini?",
    okType: "danger",
    okText: "Ya",
    cancelText: "Batal",
    async onOk() {
      try {
        await deleteData(`/api/playlist/${id_play}`);
        message.success("Playlist berhasil dihapus");
        fetchPlaylistData();
      } catch {
        message.error("Gagal menghapus playlist");
      }
    },
  });
};


  const handleEdit = (playlist) => {
    setIdPlay(playlist.id_play);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Playlist Video</h2>
        <Button type="primary" onClick={showModal}>
          Tambah Playlist
        </Button>
      </div>

      <Modal
        title={id_play ? "Edit Playlist" : "Tambah Playlist"}
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
                {id_play ? "Update" : "Simpan"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : playlists.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            Tidak ada data playlist.
          </div>
        ) : (
          playlists.map((playlist) => (
            <Card
              key={playlist.id_play}
              hoverable
              cover={
                <img
                  src={playlist.play_thumbnail}
                  alt={playlist.play_name}
                  className="h-48 object-cover"
                />
              }
              actions={[
                <a
                  key="watch"
                  href={playlist.play_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlayCircleOutlined /> Tonton
                </a>,
                <Button
                  key="edit"
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() => handleEdit(playlist)}
                />,
                <Button
                  key="delete"
                  icon={<DeleteOutlined />}
                  type="text"
                  danger
                  onClick={() => handleDelete(playlist.id_play)}
                />,
              ]}
            >
              <Card.Meta
                title={playlist.play_name}
                description={
                  <>
                    <p className="mb-2">{playlist.play_description}</p>
                    <span className="text-xs text-gray-500">
                      Genre: {playlist.play_genre}
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
