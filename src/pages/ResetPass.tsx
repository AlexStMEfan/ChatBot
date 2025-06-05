

import React, { useState } from 'react';
import { Button, Form, Input, Typography, message, Card } from 'antd';

const { Title, Text } = Typography;

const ResetPass: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      // Mock API call — replace with actual backend endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('Ссылка для восстановления пароля отправлена на вашу почту.');
    } catch (error) {
      message.error('Произошла ошибка при отправке письма. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ width: 400 }}>
        <Title level={3}>Восстановление пароля</Title>
        <Text type="secondary">Укажите адрес электронной почты для получения ссылки восстановления.</Text>
        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          <Form.Item
            name="email"
            label="Электронная почта"
            rules={[
              { required: true, message: 'Пожалуйста, введите ваш email' },
              { type: 'email', message: 'Неверный формат email' }
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Отправить ссылку
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPass;