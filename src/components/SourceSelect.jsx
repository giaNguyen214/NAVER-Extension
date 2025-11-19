import React, { useEffect } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { useExtension } from "../context/ExtensionContext";

export default function SourceSelect() {
  const {
    availableSources,
    fetchSources,
    selectedSourceIds,
    toggleSource,
    isLoading,
    navigate,
  } = useExtension();

  // Tự động gọi API lấy source khi mở màn hình này
  useEffect(() => {
    if (availableSources.length === 0) fetchSources();
  }, []);

  return (
    <div className="flex flex-col gap-3 h-80">
      {" "}
      {/* Set height cố định để scroll */}
      <div className="flex items-center border-b pb-2">
        <IconButton size="small" onClick={() => navigate("menu")}>
          ⬅
        </IconButton>
        <Typography variant="subtitle1" className="font-bold">
          Chọn nguồn đối chiếu
        </Typography>
      </div>
      {isLoading && availableSources.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <List className="overflow-y-auto flex-1 border rounded bg-gray-50">
          {availableSources.map((source) => (
            <ListItem
              key={source.id}
              dense
              button
              onClick={() => toggleSource(source.id)}
            >
              <Checkbox
                edge="start"
                checked={selectedSourceIds.includes(source.id)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText
                primary={source.name}
                secondary={`Trust: ${source.trustScore}%`}
              />
            </ListItem>
          ))}
        </List>
      )}
      <Button
        variant="contained"
        disabled={selectedSourceIds.length === 0}
        onClick={() => navigate("verify")}
        className="!bg-green-600 hover:!bg-green-700"
      >
        Tiếp tục Verify ({selectedSourceIds.length})
      </Button>
    </div>
  );
}
