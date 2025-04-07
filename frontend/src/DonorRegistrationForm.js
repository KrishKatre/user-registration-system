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
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";

const shelters = ["Shelter A", "Shelter B", "Shelter C"];

const DonorRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    shelterAffiliation: "",
    socialMedia: "",
    resume: null,
    causes: "",
    preferredContact: "email"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await fetch("https://user-registration-backend-4.onrender.com/register-donor", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        // Clear form if needed
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error("Error registering donor:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Donor Registration
        </Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
            <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            <TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />

            <FormControl fullWidth>
              <InputLabel>Affiliated Shelter</InputLabel>
              <Select name="shelterAffiliation" value={formData.shelterAffiliation} onChange={handleChange}>
                {shelters.map((shelter) => (
                  <MenuItem key={shelter} value={shelter}>{shelter}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Social Media Handle" name="socialMedia" value={formData.socialMedia} onChange={handleChange} />
            <TextField label="Causes You Care About" name="causes" multiline rows={3} value={formData.causes} onChange={handleChange} />

            <FormControl>
              <Typography variant="subtitle1">Preferred Contact Method</Typography>
              <RadioGroup name="preferredContact" value={formData.preferredContact} onChange={handleChange} row>
                <FormControlLabel value="email" control={<Radio />} label="Email" />
                <FormControlLabel value="phone" control={<Radio />} label="Phone" />
                <FormControlLabel value="social" control={<Radio />} label="Social Media" />
              </RadioGroup>
            </FormControl>

            <Button variant="outlined" component="label">
              Upload Resume
              <input type="file" hidden onChange={handleFileChange} name="resume" />
            </Button>

            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DonorRegistrationForm;
