import { useLocation, useParams } from "react-router-dom";

export default function Add() {
  const { action } = useParams();
  const { state } = useLocation();

  return (
    <main>
      <h1>KEREN</h1>
    </main>
  );
}
