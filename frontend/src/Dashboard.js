import React, { useEffect, useState } from "react";

const Dashboard = () => {
    const [productRequests, setProductRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [sortOption, setSortOption] = useState("priority"); // Default sorting by priority
    const [filterPriority, setFilterPriority] = useState(""); // Filter by priority

    // Fetch data from the backend when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
    
                const response = await fetch("http://localhost:5000/product-requests", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Include token in the Authorization header
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch product requests");
                }
    
                const data = await response.json();
                setProductRequests(data);
                setFilteredRequests(data); // Initially, filteredRequests = productRequests
            } catch (error) {
                console.error("Error fetching product requests:", error);
            }
        };
    
        fetchData();
    }, []);
    

    // Apply sorting and filtering whenever productRequests, sortOption, or filterPriority changes
    useEffect(() => {
        let updatedRequests = [...productRequests];

        // Apply filtering
        if (filterPriority) {
            updatedRequests = updatedRequests.filter(
                (request) => request.priority === parseInt(filterPriority)
            );
        }

        // Apply sorting
        updatedRequests.sort((a, b) => {
            if (sortOption === "priority") {
                return a.priority - b.priority;
            } else if (sortOption === "date") {
                return new Date(a.requestDate) - new Date(b.requestDate);
            }
            return 0;
        });

        setFilteredRequests(updatedRequests);
    }, [productRequests, sortOption, filterPriority]);

    // Function to format dates in the local timezone as YYYY-MM-DD
    const formatDate = (date) => {
        const localDate = new Date(date);
        localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset()); // Adjust back to local timezone
        return localDate.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
    };
    

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
            <h2>Product Requests Dashboard</h2>

            {/* Sorting and Filtering Controls */}
            <div style={{ marginBottom: "20px" }}>
                <label>
                    Sort By:
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="priority">Priority</option>
                        <option value="date">Request Date</option>
                    </select>
                </label>
                <label style={{ marginLeft: "20px" }}>
                    Filter By Priority:
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    />
                </label>
                <button onClick={() => setFilterPriority("")} style={{ marginLeft: "10px" }}>
                    Clear Filter
                </button>
            </div>

            {/* Table to Display Product Requests */}
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
                    {filteredRequests.map((request) => (
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
                            <td style={styles.cell}>{formatDate(request.requestDate)}</td>
                            <td style={styles.cell}>{formatDate(request.requiredByDate)}</td>
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
