import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const TableContainer = styled(Box)(({ theme }) => ({
  height: 700,
  width: "100%",
}));

export const Flex = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexGrow: 1,
}));
