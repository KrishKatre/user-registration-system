import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import ProductRequestForm from "./ProductRequestForm";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
    const isLoggedIn = Boolean(localStorage.getItem("authToken")); // Check if token exists

    return (
        <Router>
            <nav style={styles.navbar}>
                <Link to="/" style={styles.link}>Register</Link>
                {!isLoggedIn && <Link to="/login" style={styles.link}>Login</Link>}
                {isLoggedIn && <Link to="/product-request" style={styles.link}>Product Request</Link>}
                {isLoggedIn && <Link to="/dashboard" style={styles.link}>Dashboard</Link>}
                {isLoggedIn && (
                    <button
                        onClick={() => {
                            localStorage.removeItem("authToken");
                            window.location.href = "/login";
                        }}
                        style={{ ...styles.link, background: "none", border: "none", cursor: "pointer" }}
                    >
                        Logout
                    </button>
                )}
            </nav>

            <Routes>
                <Route path="/" element={<RegistrationForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route
                    path="/product-request"
                    element={
                        <ProtectedRoute>
                            <ProductRequestForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

const styles = {
    navbar: {
        padding: "10px",
        backgroundColor: "#f4f4f4",
        marginBottom: "20px",
    },
    link: {
        marginRight: "15px",
        textDecoration: "none",
        color: "#007BFF",
        fontWeight: "bold",
    },
};

export default App;
