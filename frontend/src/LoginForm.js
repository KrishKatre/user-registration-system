import React, { useState } from "react";

const LoginForm = () => {
    const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        let valid = true;
        const newErrors = {};

        // Validate username/email
        if (!formData.usernameOrEmail.trim()) {
            newErrors.usernameOrEmail = "Username or email is required.";
            valid = false;
        }

        // Validate password
        if (!formData.password.trim()) {
            newErrors.password = "Password is required.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        // Simulate server-side validation
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Login successful!");
            } else {
                setServerError(result.error || "Invalid credentials.");
            }
        } catch (err) {
            setServerError("An error occurred. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
            <h2>Login</h2>

            <div>
                <label htmlFor="usernameOrEmail">Username or Email:</label>
                <input
                    type="text"
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                />
                {errors.usernameOrEmail && <p style={{ color: "red" }}>{errors.usernameOrEmail}</p>}
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
                {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
            </div>

            {serverError && <p style={{ color: "red" }}>{serverError}</p>}

            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
