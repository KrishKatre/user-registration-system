import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import RegistrationForm from "./RegistrationForm";
import RoleSelector from "./RoleSelector";
import LoginRoleSelector from "./RoleSelectorLogin";
import DonorRegistrationForm from "./DonorRegistrationForm";
import LoginForm from "./LoginForm";
import DonorLoginForm from "./DonorLoginForm";
import ProductRequestForm from "./ProductRequestForm";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
    const isLoggedIn = Boolean(localStorage.getItem("authToken")); // Check if token exists

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
    };

    return (
        <Router>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Product Request System
                    </Typography>
                    <Box>
                        <Button component={Link} to="/" color="inherit">
                            Register
                        </Button>
                        {!isLoggedIn && (
                            <Button component={Link} to="/login" color="inherit">
                                Login
                            </Button>
                        )}
                        {isLoggedIn && (
                            <>
                                <Button component={Link} to="/product-request" color="inherit">
                                    Product Request
                                </Button>
                                <Button component={Link} to="/dashboard" color="inherit">
                                    Dashboard
                                </Button>
                                <Button onClick={handleLogout} color="inherit">
                                    Logout
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/" element={<RoleSelector />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/register-donor" element={<DonorRegistrationForm />} />
                <Route path="/login" element={<LoginRoleSelector />} />
                <Route path="/login/unhoused" element={<LoginForm />} />
                <Route path="/donor-login" element={<DonorLoginForm />} />
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

export default App;
