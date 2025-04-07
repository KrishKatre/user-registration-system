import React, { useState } from "react";
import { Container, Paper, Typography, RadioGroup, FormControlLabel, Radio, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginRoleSelector = () => {
    const [role, setRole] = useState("unhoused");
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (role === "donor") {
            navigate("/donor-login");
        } else {
            navigate("/login/unhoused");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Select Login Type
                </Typography>
                <Box display="flex" flexDirection="column" gap={3} mt={2}>
                    <RadioGroup value={role} onChange={(e) => setRole(e.target.value)} row>
                        <FormControlLabel value="unhoused" control={<Radio />} label="Unhoused Individual" />
                        <FormControlLabel value="donor" control={<Radio />} label="Donor" />
                    </RadioGroup>
                    <Button variant="contained" onClick={handleSubmit}>
                        Continue to Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginRoleSelector;
