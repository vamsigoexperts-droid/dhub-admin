import axios from 'axios';

const BASE_URL = 'https://api.doorstephub.com/v1/dhubApi/admin/team';

// Helper function to get auth token
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
};

// Helper function to create headers
const getHeaders = (isFormData = false) => {
    const headers = {
        Authorization: `Bearer ${getAuthToken()}`,
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};

/**
 * Get all team members for a provider
 * @param {string} providerId - Provider ID
 * @param {object} filters - Optional filters (status, isActive, isAvailable, search)
 * @returns {Promise} API response
 */
export const getAllTeamMembers = async (providerId, filters = {}) => {
    try {
        const params = new URLSearchParams({ providerId, ...filters });
        const response = await axios.get(`${BASE_URL}/all?${params.toString()}`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Get team member by ID
 * @param {string} id - Team member ID
 * @param {string} providerId - Provider ID
 * @returns {Promise} API response
 */
export const getTeamMemberById = async (id, providerId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}?providerId=${providerId}`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Create a new team member
 * @param {string} providerId - Provider ID
 * @param {object} teamMemberData - Team member data
 * @returns {Promise} API response
 */
export const createTeamMember = async (providerId, teamMemberData) => {
    try {
        const formData = new FormData();
        formData.append('providerId', providerId);

        // Append all fields to FormData
        Object.keys(teamMemberData).forEach((key) => {
            const value = teamMemberData[key];

            // Handle arrays (skills, languages)
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            }
            // Handle file upload
            else if (value instanceof File) {
                formData.append(key, value);
            }
            // Handle regular fields
            else if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value);
            }
        });

        const response = await axios.post(`${BASE_URL}/create`, formData, {
            headers: getHeaders(true),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Update team member
 * @param {string} id - Team member ID
 * @param {string} providerId - Provider ID
 * @param {object} teamMemberData - Updated team member data
 * @returns {Promise} API response
 */
export const updateTeamMember = async (id, providerId, teamMemberData) => {
    try {
        const formData = new FormData();
        formData.append('providerId', providerId);

        // Append all fields to FormData
        Object.keys(teamMemberData).forEach((key) => {
            const value = teamMemberData[key];

            // Handle arrays (skills, languages)
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            }
            // Handle file upload
            else if (value instanceof File) {
                formData.append(key, value);
            }
            // Handle regular fields
            else if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value);
            }
        });

        const response = await axios.put(`${BASE_URL}/update/${id}`, formData, {
            headers: getHeaders(true),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Delete team member (soft delete)
 * @param {string} id - Team member ID
 * @param {string} providerId - Provider ID
 * @returns {Promise} API response
 */
export const deleteTeamMember = async (id, providerId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/delete/${id}?providerId=${providerId}`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Update team member availability
 * @param {string} id - Team member ID
 * @param {string} providerId - Provider ID
 * @param {boolean} isAvailable - Availability status
 * @returns {Promise} API response
 */
export const updateAvailability = async (id, providerId, isAvailable) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/availability/${id}`,
            { providerId, isAvailable },
            { headers: getHeaders() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Get available team members
 * @param {string} providerId - Provider ID
 * @param {string} serviceCategoryId - Optional service category ID
 * @returns {Promise} API response
 */
export const getAvailableTeamMembers = async (providerId, serviceCategoryId = null) => {
    try {
        const params = new URLSearchParams({ providerId });
        if (serviceCategoryId) {
            params.append('serviceCategoryId', serviceCategoryId);
        }

        const response = await axios.get(`${BASE_URL}/available/list?${params.toString()}`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Get team performance stats
 * @param {string} providerId - Provider ID
 * @returns {Promise} API response
 */
export const getTeamPerformanceStats = async (providerId) => {
    try {
        const response = await axios.get(`${BASE_URL}/stats/performance?providerId=${providerId}`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export default {
    getAllTeamMembers,
    getTeamMemberById,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    updateAvailability,
    getAvailableTeamMembers,
    getTeamPerformanceStats,
};

