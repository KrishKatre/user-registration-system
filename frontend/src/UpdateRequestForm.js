import React, { useState } from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert
} from "@mui/material";
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
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Update Product Request
                </Typography>
                {Object.values(errors).length > 0 && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {Object.values(errors).join(" \n")}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" gap={2}>
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
                            label="Required-By Date"
                            variant="outlined"
                            type="date"
                            name="requiredByDate"
                            value={formData.requiredByDate}
                            onChange={handleChange}
                            error={Boolean(errors.requiredByDate)}
                            helperText={errors.requiredByDate}
                            fullWidth
                        />
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <Button type="submit" variant="contained" color="primary">
                                Update
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                color="secondary"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default UpdateRequestForm;
