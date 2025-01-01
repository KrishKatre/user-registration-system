import React, { useEffect, useState } from "react";

const Dashboard = () => {
    const [productRequests, setProductRequests] = useState([]);

    // Fetch data from the backend when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/product-requests");
                if (!response.ok) {
                    throw new Error('HTTP Error! Status: ${response.status}');
                }
                const data = await response.json();
                console.log("Fetched product requests:", data);
                setProductRequests(data);
            } catch (error) {
                console.error("Error fetching product requests:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
            <h2>Product Requests Dashboard</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={styles.header}>Image</th>
                        <th style={styles.header}>Product URL</th>
                        <th style={styles.header}>Priority</th>
                        <th style={styles.header}>Request Date</th>
                        <th style={styles.header}>Required-by Date</th>
                    </tr>
                </thead>
                <tbody>
                    {productRequests.map((request) => (
                        <tr key={request._id}>
                            <td style={styles.cell}>
                                <img
                                    src={request.imageUrl}
                                    alt="Product"
                                    style={{ width: "100px", height: "auto" }}
                                />
                            </td>
                            <td style={styles.cell}>
                                <a href={request.productUrl} target="_blank" rel="noopener noreferrer">
                                    {request.productUrl}
                                </a>
                            </td>
                            <td style={styles.cell}>{request.priority}</td>
                            <td style={styles.cell}>
                                {new Date(request.requestDate).toLocaleDateString()}
                            </td>
                            <td style={styles.cell}>
                                {new Date(request.requiredByDate).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    header: {
        border: "1px solid #ddd",
        padding: "8px",
        textAlign: "left",
        backgroundColor: "#f4f4f4",
        fontWeight: "bold",
    },
    cell: {
        border: "1px solid #ddd",
        padding: "8px",
    },
};

export default Dashboard;
