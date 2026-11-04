import { Link } from "react-router-dom";

export default function BackToAdminBtn(){
    return(

        <Link to="/admin-panel" className="btn btn-primary mb-4">Volver a administración</Link>

    )
}