import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCustomer.css";
import { addCustomer } from "../services/customerService";

function AddCustomer() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        aadharNumber: "",
        address: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await addCustomer(formData);

            alert(response.data.message);

            navigate("/customers");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Customer Save Failed"
            );

        }

    };

    return (
        <div className="add-customer-page">

            <div className="page-title">
                <h1>Add New Customer</h1>
                <p>Create customer account in Smart Digital KhataBook</p>
            </div>

            <div className="customer-form-card">

                <div className="form-header">

                    <div className="form-icon">
                        👤
                    </div>

                    <div className="form-info">
                        <h2>Customer Information</h2>
                        <p>Fill customer details below</p>
                    </div>

                </div>

                <form onSubmit={handleSubmit}>

                    {/* Customer Name */}

                    <div className="form-group">
                        <label>Customer Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Customer Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Mobile */}

                    <div className="form-group">
                        <label>Mobile Number</label>

                        <input
                            type="text"
                            name="mobile"
                            placeholder="Enter Mobile Number"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}

                    <div className="form-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email Address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Aadhaar */}

                    <div className="form-group">
                        <label>Aadhaar Card Number</label>

                        <input
                            type="text"
                            name="aadharNumber"
                            placeholder="Enter Aadhaar Number"
                            value={formData.aadharNumber}
                            onChange={handleChange}
                            maxLength="12"
                        />
                    </div>

                    {/* Address */}

                    <div className="form-group full-width">
                        <label>Address</label>

                        <textarea
                            rows="4"
                            name="address"
                            placeholder="Enter Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Buttons */}

                    <div className="button-group">

                        <button
                            type="submit"
                            className="save-btn"
                        >
                            Save Customer
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/customers")}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddCustomer;