import { Link } from "react-router-dom";

export default function BackToAdminBtn() {
  return (
    <Link
      to="/admin-panel"
      className="btn btn-outline btn-sm mb-5 rounded-full"
    >
      Volver a administración
    </Link>
  );
}
