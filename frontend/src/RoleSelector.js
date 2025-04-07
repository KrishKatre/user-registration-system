// RoleSelector.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box, Paper } from "@mui/material";

const RoleSelector = () => {
    const navigate = useNavigate();

    const handleSelect = (role) => {
        if (role === "unhoused") {
            navigate("/register");
        } else if (role === "donor") {
            navigate("/register-donor");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 6, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Register As
                </Typography>
                <Box display="flex" flexDirection="column" gap={2} mt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleSelect("unhoused")}
                    >
                        I'm Unhoused
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={() => handleSelect("donor")}
                    >
                        I'm a Donor
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default RoleSelector;
