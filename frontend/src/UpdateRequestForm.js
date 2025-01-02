import React, { useState } from "react";

const UpdateRequestForm = ({ currentRequest, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState({
        priority: currentRequest.priority,
        requiredByDate: new Date(currentRequest.requiredByDate).toISOString().split("T")[0],
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
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
        onUpdate({ ...currentRequest, ...formData });
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
            <h2>Update Product Request</h2>

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

            <div style={{ marginTop: "20px" }}>
                <button type="submit">Update</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default UpdateRequestForm;
