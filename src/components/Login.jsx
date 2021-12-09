import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAuth } from "../hooks/useAuth";
import NotificationBar from "./common/NotificationBar";

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState(null);
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
            Login
          </Typography>
          <CardMedia>Select your email in the Pop Up </CardMedia>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="contained"
            onClick={async () => {
              try {
                await loginWithGoogle();
                setMessage("Welcome to Fitness Arena");
                setSeverity("success");
              } catch (error) {
                setMessage(error);
                setSeverity("error");
              }
            }}
          >
            Login With Google
          </Button>
        </CardActions>
      </Card>
      <NotificationBar message={message} severity={severity} />
    </div>
  );
}
