import React, { useState } from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Radio,
    RadioGroup,
    Checkbox,
    Button,
    Box,
    Alert
} from "@mui/material";

const shelters = ["Shelter A", "Shelter B", "Shelter C"];

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
        associatedWithShelter: "no",
        selectedShelter: "",
        hasHMISID: "no",
        hmisId: "",
        age: "",
        gender: "",
        ethnicity: "",
        veteran: false,
        disability: false
    });

    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        setSuccessMessage("");

        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            shelterId: formData.associatedWithShelter === "yes" ? formData.selectedShelter : "",
            hmisId: formData.hasHMISID === "yes" ? formData.hmisId : "",
            age: formData.age,
            gender: formData.gender,
            dataLoadAlias: formData.ethnicity,
            dataLoadSource: `${formData.veteran ? "Veteran" : ""}${formData.disability ? ", Disability" : ""}`,
        };

        try {
            const response = await fetch("https://user-registration-backend-4.onrender.com/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Registration successful! You can now log in.");
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    phone: "",
                    associatedWithShelter: "no",
                    selectedShelter: "",
                    hasHMISID: "no",
                    hmisId: "",
                    age: "",
                    gender: "",
                    ethnicity: "",
                    veteran: false,
                    disability: false
                });
            } else {
                setServerError(data.error || "Registration failed.");
            }
        } catch (error) {
            setServerError("Something went wrong. Please try again later.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Homeless Registration
                </Typography>
                {serverError && <Alert severity="error">{serverError}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                <form onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField label="Username" name="username" value={formData.username} onChange={handleChange} required />
                        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                        <TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />

                        <Typography variant="subtitle1">Are you associated with a shelter?</Typography>
                        <RadioGroup row name="associatedWithShelter" value={formData.associatedWithShelter} onChange={handleChange}>
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>

                        {formData.associatedWithShelter === "yes" && (
                            <FormControl fullWidth>
                                <InputLabel>Select Shelter</InputLabel>
                                <Select
                                    name="selectedShelter"
                                    value={formData.selectedShelter}
                                    onChange={handleChange}
                                >
                                    {shelters.map((shelter) => (
                                        <MenuItem key={shelter} value={shelter}>{shelter}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <Typography variant="subtitle1">Do you have an HMIS ID?</Typography>
                        <RadioGroup row name="hasHMISID" value={formData.hasHMISID} onChange={handleChange}>
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>

                        {formData.hasHMISID === "yes" && (
                            <TextField label="HMIS ID" name="hmisId" value={formData.hmisId} onChange={handleChange} fullWidth />
                        )}

                        <TextField label="Age" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 24" fullWidth />
                        <TextField label="Gender Identity" name="gender" value={formData.gender} onChange={handleChange} placeholder="e.g. Male, Female, Non-binary" fullWidth />
                        <TextField label="Race/Ethnicity" name="ethnicity" value={formData.ethnicity} onChange={handleChange} placeholder="e.g. Black, Hispanic, White, etc." fullWidth />

                        <FormControlLabel
                            control={<Checkbox checked={formData.veteran} onChange={handleChange} name="veteran" />}
                            label="Veteran"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={formData.disability} onChange={handleChange} name="disability" />}
                            label="Person with Disabilities"
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
