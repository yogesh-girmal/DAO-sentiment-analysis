import React, { useState } from 'react';
import { Button, Form, Input } from 'antd'; // Replace with your preferred UI library

const Auth: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signup' | 'signin'>('signin');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Implement API calls to your backend here, using username and password
    // and handling different modes (signup or signin)
    // ...

    setUsername('');
    setPassword('');
  };

  const handleModeChange = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <Form onSubmit={handleSubmit}>
      {mode === 'signup' && (
        <Form.Item label="Email">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Item>
      )}
      <Form.Item label="Username">
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      </Form.Item>
      <Form.Item label="Password">
        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </Button>
      <Button onClick={handleModeChange} type="link">
        {mode === 'signin' ? 'Create New Account' : 'Already have an account?'}
      </Button>
    </Form>
  );
};

export default Auth;
