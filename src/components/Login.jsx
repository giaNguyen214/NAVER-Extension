import React from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useExtension } from "../context/ExtensionContext";

export default function Login() {
  const { login } = useExtension();
  return (
    <Box className="flex flex-col gap-4 mt-2">
      <Typography variant="h5" className="text-center !font-bold text-gray-700">
        Login
      </Typography>
      <TextField label="Username" size="small" fullWidth />
      <TextField label="Password" type="password" size="small" fullWidth />
      <Button
        variant="contained"
        fullWidth
        onClick={login}
        className="!bg-blue-600"
      >
        Đăng nhập
      </Button>
    </Box>
  );
}
