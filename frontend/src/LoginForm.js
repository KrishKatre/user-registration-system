import React, { useState } from "react";

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
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
            <h2>User Login</h2>
            {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <div>
                <label htmlFor="usernameOrEmail">Username or Email:</label>
                <input
                    type="text"
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>

            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
