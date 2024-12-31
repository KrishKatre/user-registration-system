import React, { useState } from "react";

const ProductRequestForm = () => {
    const [formData, setFormData] = useState({
        productUrl: "",
        priority: "",
        requestDate: new Date().toISOString().split("T")[0], // Auto-filled with today's date
        requiredByDate: "",
    });

    const [errors, setErrors] = useState({});

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Submit the form data (add your API call logic here)
        console.log("Form submitted:", formData);
        alert("Product request submitted successfully!");
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
            <h2>Product Request Form</h2>

            <div>
                <label htmlFor="productUrl">Product URL:</label>
                <input
                    type="url"
                    id="productUrl"
                    name="productUrl"
                    value={formData.productUrl}
                    onChange={handleChange}
                />
                {errors.productUrl && <p style={{ color: "red" }}>{errors.productUrl}</p>}
            </div>

            <div>
                <label htmlFor="priority">Priority (1-10):</label>
                <input
                    type="number"
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    min="1"
                    max="10"
                />
                {errors.priority && <p style={{ color: "red" }}>{errors.priority}</p>}
            </div>

            <div>
                <label htmlFor="requestDate">Request Date:</label>
                <input
                    type="date"
                    id="requestDate"
                    name="requestDate"
                    value={formData.requestDate}
                    readOnly
                />
            </div>

            <div>
                <label htmlFor="requiredByDate">Required-By Date:</label>
                <input
                    type="date"
                    id="requiredByDate"
                    name="requiredByDate"
                    value={formData.requiredByDate}
                    onChange={handleChange}
                />
                {errors.requiredByDate && (
                    <p style={{ color: "red" }}>{errors.requiredByDate}</p>
                )}
            </div>

            <button type="submit">Submit Request</button>
        </form>
    );
};

export default ProductRequestForm;
