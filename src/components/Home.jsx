import { Box, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUsersCount } from "../firebase/helper-firestore";
// import { useAuth } from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  // const { user } = useAuth();
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const enqueueMessage = useSnackbar();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const count = await getUsersCount();
        setTotalUsers(count);
      } catch (e) {
        enqueueMessage(e);
      }
    };
    getUsers();
  }, [enqueueMessage]);

  return (
    <div>
      <Box display="flex" justifyContent="center" mt={2}>
        {/* Join {totalUsers} Healthy Beings */}
        <Chip
          // avatar={<Avatar>{totalUsers}</Avatar>}
          label={`Join ${totalUsers} Healthy Beings`}
          variant="outlined"
          color="success"
          onClick={() => navigate("/register")}
        />
        {/* <button onClick={getUsersCount}>Click</button> */}
      </Box>
      {/* <pre>{`${JSON.stringify(user, null, 2)}`}</pre> */}
    </div>
  );
}
