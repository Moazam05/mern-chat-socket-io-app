// MUI Imports
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  size?: number;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  specificColor?: string;
}

const Spinner = (props: Props) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress
        sx={{
          color: props.specificColor,
        }}
        color={props.color}
        size={props.size}
      />
    </Box>
  );
};

export default Spinner;
