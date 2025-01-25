import React, { useState } from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Grid2,
    Paper
} from "@mui/material";
const LoginForm = () => {
    const [formData, setFormData] = useState({
        usernameOrEmail: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.usernameOrEmail || !formData.password) {
            setErrors({ form: "All fields are required." });
            return;
        }
    
        try {
            const response = await fetch("https://user-registration-backend-4.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem("authToken", data.token); // Save token to localStorage
                setSuccessMessage("Login successful!");
                setErrors({});
                // Redirect to dashboard
                window.location.href = "/dashboard";
            } else {
                setErrors({ form: data.error || "Login failed." });
            }
        } catch (error) {
            setErrors({ form: "Something went wrong. Please try again later." });
        }
    };
    

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>
                {errors.form && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.form}
                    </Alert>
                )}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Username or Email"
                            variant="outlined"
                            name="usernameOrEmail"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Login
                        </Button>
                    </Box>
                </form>
                <Grid2 container justifyContent="center" mt={2}>
                    <Typography variant="body2">
                        Don't have an account? <a href="/">Register</a>
                    </Typography>
                </Grid2>
            </Paper>
        </Container>
    );
};


export default LoginForm;
