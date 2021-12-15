import React from "react";
// import { createGymCollection } from "../firebase/helper-firestore";
import { useAuth } from "../hooks/useAuth";

export default function Support() {
  const { uid } = useAuth();

  return (
    <div>
      Support
      {/* <button onClick={() => createGymCollection(uid)}>collection</button> */}
    </div>
  );
}
