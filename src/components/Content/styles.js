import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { experimental_sx as sx } from "@mui/system";

export const CreateSheetBox = styled(Box)(
  sx({
    marginTop: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 3,
  })
);