import axios from "axios";


const API_URL =
    "http://localhost:5000/api/customers";

export const getCustomers = async () => {
    return axios.get(API_URL);
};

export const addCustomer = async (data) => {
    return axios.post(
        `${API_URL}/add`,
        data
    );
};

export const deleteCustomer = async (id) => {
    return axios.delete(
        `${API_URL}/${id}`
    );
};

export const getCustomerTransactions = async (customerId) => {
    return axios.get(
        `${API_URL}/${customerId}/transactions`
    );
};