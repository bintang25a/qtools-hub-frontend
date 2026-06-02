import { logout } from "../../_services/auth";

export default function Profile() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <main>
      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}
