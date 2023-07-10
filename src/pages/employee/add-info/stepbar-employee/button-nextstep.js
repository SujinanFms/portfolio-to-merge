import { purple } from "@mui/material/colors";
import { Stack, styled } from "@mui/material";
import { Button } from "rsuite";

export const ColorButton = styled(Button)(({ theme }) => ({
  
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
      color: "#f4a9e3"
    },
  }));