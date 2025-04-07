// DonorLoginForm.jsx
import React, { useState } from "react";
import {
  Container, Paper, Typography, TextField,
  Button, Alert, Box
} from "@mui/material";

const DonorLoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrors({ form: "All fields are required." });
      return;
    }

    try {
      const response = await fetch("https://user-registration-backend-4.onrender.com/login-donor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        setSuccessMessage("Login successful!");
        setErrors({});
        window.location.href = "/dashboard"; // or donor dashboard if separate
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
          Donor Login
        </Typography>
        {errors.form && <Alert severity="error">{errors.form}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DonorLoginForm;
