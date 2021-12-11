import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ marginTop: "100" }}>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
