import React, { useEffect, useState } from "react";
import UpdateRequestForm from "./UpdateRequestForm";

const Dashboard = () => {
    const [productRequests, setProductRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState("priority");
    const [filterPriority, setFilterPriority] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null); // Selected request for update
    const itemsPerPage = 5;

    const fetchData = async (page) => {
        try {
            const token = localStorage.getItem("authToken");

            const response = await fetch(
                `http://localhost:5000/product-requests?page=${page}&limit=${itemsPerPage}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch product requests");
            }

            const data = await response.json();
            setProductRequests(data.productRequests);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching product requests:", error);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleUpdate = (updatedRequest) => {
        const token = localStorage.getItem("authToken");

        fetch(`http://localhost:5000/product-request/${updatedRequest._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedRequest),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update product request");
                }
                return response.json();
            })
            .then((data) => {
                alert("Product request updated successfully!");
                setSelectedRequest(null);
                fetchData(currentPage); // Refresh data
            })
            .catch((error) => {
                console.error("Error updating product request:", error);
                alert("An error occurred while updating the request.");
            });
    };

    const formatDate = (date) => {
        const localDate = new Date(date);
        localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
        return localDate.toLocaleDateString("en-CA");
    };

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
            <h2>Product Requests Dashboard</h2>

            {selectedRequest ? (
                <UpdateRequestForm
                    currentRequest={selectedRequest}
                    onUpdate={handleUpdate}
                    onCancel={() => setSelectedRequest(null)}
                />
            ) : (
                <>
                    {/* Table to Display Product Requests */}
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product URL</th>
                                <th>Priority</th>
                                <th>Request Date</th>
                                <th>Required-by Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productRequests.map((request) => (
                                <tr key={request._id}>
                                    <td>
                                        <img
                                            src={request.imageUrl}
                                            alt="Product"
                                            style={{ width: "100px", height: "auto" }}
                                        />
                                    </td>
                                    <td>
                                        <a
                                            href={request.productUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {request.productUrl}
                                        </a>
                                    </td>
                                    <td>{request.priority}</td>
                                    <td>{formatDate(request.requestDate)}</td>
                                    <td>{formatDate(request.requiredByDate)}</td>
                                    <td>
                                        <button onClick={() => setSelectedRequest(request)}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Dashboard;
