import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box sx={{
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      zIndex: 1000
    }}>
      <CircularProgress />
    </Box>
  );
}
