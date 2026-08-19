import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AppContext from "./AppContext";

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AppContext);
    //console.log(token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;