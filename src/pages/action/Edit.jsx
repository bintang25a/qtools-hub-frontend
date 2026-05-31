import { useLocation, useParams } from "react-router-dom";

export default function Edit() {
  const { action } = useParams();
  const { state } = useLocation();

  return (
    <main>
      <h1>KEREN</h1>
    </main>
  );
}
