import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useAuth } from "../hooks/useAuth";
import { createUser } from "../firebase/helper-firestore";
import { startCase, get } from "lodash";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../hooks/useSnackbar";

export default function Register() {
  const { loginWithGoogle } = useAuth();

  const enqueueSnackbar = useSnackbar();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await loginWithGoogle();
      const data = {
        name: startCase(get(response, "user.displayName").toLowerCase()),
        email: get(response, "user.email"),
        isEmailVerified: get(response, "user.emailVerified"),
      };
      await createUser(response?.user?.uid, data);
      enqueueSnackbar("Welcome to Fitness Arena", "success");
      navigate("/");
    } catch (error) {
      enqueueSnackbar(error, "error");
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
      }}
    >
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Register
          </Typography>
          <CardMedia>Select your email in the Pop Up </CardMedia>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" onClick={handleRegister}>
            Register With Google
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
