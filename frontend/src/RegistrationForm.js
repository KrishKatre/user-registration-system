import React, { useState } from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper,
} from "@mui/material";
const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let valid = true;
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required.";
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
            valid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
            valid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await fetch("https://user-registration-backend-4.onrender.com/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Registration successful! You can now log in.");
                setFormData({ username: "", email: "", password: "" });
                setErrors({});
            } else {
                setErrors({ form: data.error || "Registration failed." });
            }
        } catch (error) {
            setErrors({ form: "Something went wrong. Please try again later." });
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    User Registration
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
                            label="Username"
                            variant="outlined"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={Boolean(errors.username)}
                            helperText={errors.username}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            fullWidth
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Register
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default RegistrationForm;
