import { Navigate, Outlet } from "react-router-dom";

const ProctectedRoute=()=>{
    const token=localStorage.getItem("jwt");

    return token?<><Outlet/></>:<Navigate to="login"/>;
}
export default ProctectedRoute;