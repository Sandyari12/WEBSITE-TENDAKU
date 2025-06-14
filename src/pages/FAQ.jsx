import React from 'react';
import { Typography, Collapse, Card, Button } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const FAQ = () => {
  const faqs = [
    {
      question: 'Bagaimana cara menyewa alat camping?',
      answer: 'Anda dapat menyewa alat camping dengan cara mendaftar/login terlebih dahulu, kemudian pilih produk yang ingin disewa, isi form penyewaan, dan lakukan pembayaran saat pengambilan alat camping.'
    },
    {
      question: 'Berapa lama durasi minimal penyewaan?',
      answer: 'Durasi minimal penyewaan adalah 1 hari. Anda dapat menyewa lebih lama sesuai kebutuhan.'
    },
    {
      question: 'Bagaimana cara pengambilan dan pengembalian alat?',
      answer: 'Anda dapat memilih untuk mengambil sendiri di lokasi kami atau menggunakan layanan pengantaran. Pengembalian alat dapat dilakukan di lokasi kami atau menggunakan layanan pengambilan.'
    },
    {
      question: 'Apa saja syarat dan ketentuan penyewaan?',
      answer: 'Syarat utama adalah memiliki akun terdaftar dan melakukan pembayaran sesuai dengan durasi sewa. Alat harus dikembalikan dalam kondisi baik dan lengkap.'
    },
    {
      question: 'Bagaimana jika alat rusak saat disewa?',
      answer: 'Jika terjadi kerusakan yang disebabkan oleh kelalaian penyewa, akan dikenakan biaya perbaikan atau penggantian sesuai dengan tingkat kerusakan.'
    }
  ];

  return (
    <div>
      <Title level={2}>FAQ & Kontak</Title>

      <Card style={{ marginBottom: '24px' }}>
        <Title level={4}>Pertanyaan yang Sering Diajukan</Title>
        <Collapse>
          {faqs.map((faq, index) => (
            <Panel header={faq.question} key={index}>
              <Paragraph>{faq.answer}</Paragraph>
            </Panel>
          ))}
        </Collapse>
      </Card>

      <Card>
        <Title level={4}>Hubungi Kami</Title>
        <Paragraph>
          Jika Anda memiliki pertanyaan lebih lanjut, silakan hubungi kami melalui WhatsApp:
        </Paragraph>
        <Button 
          type="primary" 
          icon={<WhatsAppOutlined />}
          size="large"
          href="https://wa.me/6281246356760"
          target="_blank"
        >
          Chat WhatsApp
        </Button>
      </Card>
    </div>
  );
};

export default FAQ; 