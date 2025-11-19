import React from "react";
import { Button, Typography } from "@mui/material";
import { useExtension } from "../context/ExtensionContext";

export default function Dashboard() {
  const { navigate, logout } = useExtension();

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h6" className="text-center !font-bold text-gray-700">
        Dashboard
      </Typography>
      <div className="grid grid-cols-2 gap-3">
        <MenuBtn
          icon="📂"
          label="Chọn Source"
          onClick={() => navigate("source")}
        />
        <MenuBtn
          icon="✅"
          label="Verify Page"
          onClick={() => navigate("verify")}
        />
        <MenuBtn icon="📝" label="Summarize" onClick={() => {}} />
        <Button
          variant="contained"
          color="error"
          onClick={logout}
          className="!bg-red-50 !text-red-600 shadow-none border !border-red-200"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

const MenuBtn = ({ icon, label, onClick }) => (
  <Button
    variant="outlined"
    onClick={onClick}
    className="!flex !flex-col !gap-2 !py-4 !border-gray-300 !text-gray-700 hover:!bg-gray-50"
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-xs font-bold">{label}</span>
  </Button>
);
