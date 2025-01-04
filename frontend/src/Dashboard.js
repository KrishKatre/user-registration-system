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

    // Fetch data from the backend with pagination, sorting, and filtering
    const fetchData = async (page, sort = "priority", filter = "") => {
        try {
            const token = localStorage.getItem("authToken");

            const queryParams = new URLSearchParams({
                page,
                limit: itemsPerPage,
                sort,
                ...(filter ? { filterPriority: filter } : {}), // Include filter only if set
            });

            const response = await fetch(
                `http://localhost:5000/product-requests?${queryParams.toString()}`,
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

    // Fetch data whenever the current page, sort option, or filter changes
    useEffect(() => {
        fetchData(currentPage, sortOption, filterPriority);
    }, [currentPage, sortOption, filterPriority]);

    // Handle update of a product request
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
                fetchData(currentPage, sortOption, filterPriority); // Refresh data
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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
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
                    {/* Sorting and Filtering Controls */}
                    <div style={{ marginBottom: "20px" }}>
                        <label>
                            Sort By:
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="priority">Priority</option>
                                <option value="requestDate">Request Date</option>
                                <option value="requiredByDate">Required-by Date</option>
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

                    {/* Pagination Controls */}
                    <div
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span style={{ margin: "0 10px" }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
