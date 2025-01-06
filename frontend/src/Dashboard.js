import React, { useEffect, useState } from "react";
import UpdateRequestForm from "./UpdateRequestForm";
import {
    Box,
    Button,
    Pagination,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Paper,
} from "@mui/material";

const Dashboard = () => {
    const [productRequests, setProductRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState("priority");
    const [filterPriority, setFilterPriority] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const itemsPerPage = 5;

    // Fetch data from the backend with pagination, sorting, and filtering
    const fetchData = async (page, sort = "priority", filter = "") => {
        try {
            const token = localStorage.getItem("authToken");

            const queryParams = new URLSearchParams({
                page,
                limit: itemsPerPage,
                sort,
                ...(filter ? { filterPriority: filter } : {}),
            });

            const response = await fetch(
                `https://user-registration-backend-4.onrender.com/product-requests?${queryParams.toString()}`,
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

        fetch(`https://user-registration-backend-4.onrender.com/product-request/${updatedRequest._id}`, {
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
            .then(() => {
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

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box sx={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Product Requests Dashboard
            </Typography>

            {selectedRequest ? (
                <UpdateRequestForm
                    currentRequest={selectedRequest}
                    onUpdate={handleUpdate}
                    onCancel={() => setSelectedRequest(null)}
                />
            ) : (
                <>
                    {/* Sorting and Filtering Controls */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 2,
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box>
                                <Typography variant="body1">Sort By:</Typography>
                                <Select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value="priority">Priority</MenuItem>
                                    <MenuItem value="requestDate">Request Date</MenuItem>
                                    <MenuItem value="requiredByDate">Required-by Date</MenuItem>
                                </Select>
                            </Box>
                            <Box>
                                <Typography variant="body1">Filter By Priority:</Typography>
                                <TextField
                                    type="number"
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                    size="small"
                                    placeholder="Priority"
                                    inputProps={{ min: 1, max: 10 }}
                                />
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setFilterPriority("")}
                        >
                            Clear Filter
                        </Button>
                    </Box>

                    {/* Table to Display Product Requests */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Product URL</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Request Date</TableCell>
                                    <TableCell>Required-by Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productRequests.map((request) => (
                                    <TableRow key={request._id}>
                                        <TableCell>
                                            <img
                                                src={request.imageUrl}
                                                alt="Product"
                                                style={{ width: "100px", height: "auto" }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={request.productUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {request.productUrl}
                                            </a>
                                        </TableCell>
                                        <TableCell>{request.priority}</TableCell>
                                        <TableCell>{formatDate(request.requestDate)}</TableCell>
                                        <TableCell>{formatDate(request.requiredByDate)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setSelectedRequest(request)}
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination Controls */}
                    <Box
                        sx={{
                            marginTop: 2,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Dashboard;
