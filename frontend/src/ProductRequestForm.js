import React, { useState } from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper
} from "@mui/material";
const ProductRequestForm = () => {
    const [formData, setFormData] = useState({
        productUrl: "",
        priority: "",
        requestDate: new Date().toLocaleDateString("en-CA"), // Formats date as YYYY-MM-DD
        requiredByDate: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.productUrl.trim()) {
            newErrors.productUrl = "Product URL is required.";
        }
        if (!formData.priority || formData.priority < 1 || formData.priority > 10) {
            newErrors.priority = "Priority must be a number between 1 and 10.";
        }
        if (!formData.requiredByDate.trim()) {
            newErrors.requiredByDate = "Required-by date is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");
        if (!validate()) {
            console.log("Form validation failed");
            return;
        } 
        setServerError("");
        console.log("Validation passed, formData:", formData);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("https://user-registration-backend-4.onrender.com/product-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            console.log("Fetch response:", response);
    
            if (response.ok) {
                alert("Product request submitted successfully!");
                setFormData((prev) => ({
                    productUrl: "",
                    priority: "",
                    requestDate: prev.requestDate,
                    requiredByDate: "",
                }));
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || "An error occurred."}`);
            }
        } catch (error) {
            console.error("Error submitting product request:", error.message);
            setServerError(error.message);
            alert("An error occurred while submitting the request.");
        }
    };
    

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Product Request Form
                </Typography>
                {serverError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {serverError}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Product URL"
                            variant="outlined"
                            name="productUrl"
                            value={formData.productUrl}
                            onChange={handleChange}
                            error={Boolean(errors.productUrl)}
                            helperText={errors.productUrl}
                            fullWidth
                        />
                        <TextField
                            label="Priority (1-10)"
                            variant="outlined"
                            type="number"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            error={Boolean(errors.priority)}
                            helperText={errors.priority}
                            fullWidth
                        />
                        <TextField
                            label="Request Date"
                            variant="outlined"
                            type="date"
                            name="requestDate"
                            value={formData.requestDate}
                            InputProps={{ readOnly: true }}
                            fullWidth
                        />
                        <TextField
                            label="Required-By Date"
                            variant="outlined"
                            type="date"
                            name="requiredByDate"
                            value={formData.requiredByDate}
                            onChange={handleChange}
                            error={Boolean(errors.requiredByDate)}
                            helperText={errors.requiredByDate}
                            InputLabelProps={{
                                shrink: true, // Ensure the label doesn't overlap
                            }}
                            fullWidth
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Submit Request
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default ProductRequestForm;
