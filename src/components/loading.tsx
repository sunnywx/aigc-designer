import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box sx={{
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100vw",
      height: "100vh",
      zIndex: 100
    }}>
      <CircularProgress />
    </Box>
  );
}
