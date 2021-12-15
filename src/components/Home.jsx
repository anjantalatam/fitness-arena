import React, { useEffect, useState } from "react";
import { getUsersCount } from "../firebase/helper-firestore";
// import { useAuth } from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";

export default function Home() {
  // const { user } = useAuth();
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
    <div style={{ marginTop: "100" }}>Join {totalUsers} Healthy Beings</div>
  );
}
