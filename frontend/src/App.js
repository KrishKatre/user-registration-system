import React from "react";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import ProductRequestForm from "./ProductRequestForm";
import Dashboard from "./Dashboard";

const App = () => {
    return (
        <div>
            <RegistrationForm />
            <LoginForm />
            <ProductRequestForm />
            <Dashboard />
        </div>
    );
};

export default App;
