import React from "react";

import { useAuth0 } from "./auth0";

export default function Profile() {
  const { user } = useAuth0();

  return (
    <section>
      <h2>Profile</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </section>
  );
}
