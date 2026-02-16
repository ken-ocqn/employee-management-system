import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export const uploadEmployeePhoto = async (employeeId, photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await axios.post(
        `${API_URL}/employee/upload-photo/${employeeId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        }
    );

    return response.data;
};

export const deleteEmployeePhoto = async (employeeId) => {
    const response = await axios.delete(
        `${API_URL}/employee/delete-photo/${employeeId}`,
        {
            withCredentials: true,
        }
    );

    return response.data;
};
