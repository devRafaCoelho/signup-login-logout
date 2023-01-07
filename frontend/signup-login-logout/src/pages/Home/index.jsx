import React from "react";
import { logOut } from "../../utils/storage";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <>
            <h1>Home Page</h1>
            <button onClick={() => {
                logOut();
                navigate("/login");
            }}
            >
                LogOut
            </button>
        </>
    );
}