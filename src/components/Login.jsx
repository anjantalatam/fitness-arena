import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAuth } from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";
import { get, startCase } from "lodash";

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const enqueueMessage = useSnackbar();
  // console.log(username);

  const handleLogin = async () => {
    try {
      const response = await loginWithGoogle();
      const username = startCase(
        get(response, "user.displayName").toLowerCase()
      );
      enqueueMessage(
        `Hi ${username}, Welcome back to Fitness Arena`,
        "success"
      );
    } catch (error) {
      enqueueMessage(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5rem",
      }}>
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Login
          </Typography>
          <CardMedia>Select your email in the Pop Up </CardMedia>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" onClick={handleLogin}>
            Login With Google
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
