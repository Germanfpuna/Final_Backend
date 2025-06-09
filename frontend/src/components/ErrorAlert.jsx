import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorAlert = ({ message, onClose }) => {
  return (
    <Alert variant="danger" onClose={onClose} dismissible={!!onClose}>
      <Alert.Heading>❌ Error</Alert.Heading>
      <p>{message}</p>
    </Alert>
  );
};

export default ErrorAlert;