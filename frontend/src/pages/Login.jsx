import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../services/authService";

function Login() {
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: location.state?.email || "",
        password: ""
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
            const response = await loginUser(formData);

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            alert(response.data.message);

            navigate("/dashboard");

        } catch (error) {
            if (!error.response) {
                alert("Backend server is not running. Please start the backend on port 5000.");
                return;
            }

            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <div className="login-header">
                    <h2>Smart Digital KhataBook</h2>
                    <p>Login to continue</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>

                </form>

                <div className="login-footer">
                    Don't have an account?{" "}
                    <Link to="/">
                        Register
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;
