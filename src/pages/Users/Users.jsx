import React from "react";
import UserTable from "../../components/users/user-table";

export default function Users() {
  return (
    <section>
      <main>
        <div>
          <h1>Users</h1>
          <p>This is the Users page.</p>
        </div>
        <div>
          <UserTable/>
        </div>
      </main>
    </section>
  );
}
