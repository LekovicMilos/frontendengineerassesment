import { useState, SyntheticEvent } from 'react';

export function useSnackbar() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleCloseSnackbar = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return {
    snackbarOpen,
    snackbarMessage,
    setSnackbarOpen,
    setSnackbarMessage,
    handleCloseSnackbar,
  };
}
