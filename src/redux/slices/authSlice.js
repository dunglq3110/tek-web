
// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../utils/constant';

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
            // Store token in localStorage
            if (response.data.statusCode === 200) {
                localStorage.setItem('token', response.data.data.token);
                return response.data.data;
            }
            return rejectWithValue(response.data.message);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/register`, userData);
            if (response.data.statusCode === 201) {
                return response.data;
            }
            return rejectWithValue(response.data.message);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const getUserInfo = createAsyncThunk(
    'auth/getUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await axios.get(`${BASE_URL}/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.statusCode === 200) {
                return response.data.data;
            }

            return rejectWithValue(response.data.message);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user info');
        }
    }
);


export const changeNickname = createAsyncThunk(
    'auth/changeNickname',
    async (nickname, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const response = await axios.put(
                `${BASE_URL}/user/profile/nickname`,
                nickname,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.statusCode === 200) {
                return { nickname };
            }

            return rejectWithValue(response.data.message);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Nickname update failed');
        }
    }
);

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async ({ oldPassword, newPassword }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const response = await axios.put(
                `${BASE_URL}/user/profile/password`,
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.statusCode === 200) {
                return { message: 'Password changed successfully' };
            }

            return rejectWithValue(response.data.message);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to change password');
        }
    }
);


export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem('token');
            return null;
        } catch (error) {
            return rejectWithValue('Logout failed');
        }
    }
);
export const updateUserIcon = createAsyncThunk(
    'auth/updateUserIcon',
    async ({ iconId, iconData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const response = await axios.put(
                `${BASE_URL}/user/profile/icon`,
                JSON.stringify(iconId),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.statusCode === 200) {
                return { iconId, iconData };
            }

            return rejectWithValue(response.data.message);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update icon');
        }
    }
);


// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    registerSuccess: false,
    profileUpdateSuccess: false,
    passwordChangeSuccess: false,
};

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.registerSuccess = false;
            state.profileUpdateSuccess = false;
            state.passwordChangeSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.userResponse;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registerSuccess = false;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.registerSuccess = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.registerSuccess = false;
            })

            // Get user info cases
            .addCase(getUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserIcon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserIcon.fulfilled, (state, action) => {
                state.loading = false;
                if (state.user) {
                    state.user.iconId = action.payload.iconId;
                    state.user.iconData = action.payload.iconData;
                }
                state.error = null;
            })
            .addCase(updateUserIcon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Change password cases
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.passwordChangeSuccess = false;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
                state.passwordChangeSuccess = true;
                state.error = null;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.passwordChangeSuccess = false;
            })
            .addCase(changeNickname.pending, (state) => {
                state.loading = true;
                state.profileUpdateSuccess = false;
                state.error = null;
            })
            .addCase(changeNickname.fulfilled, (state, action) => {
                state.loading = false;
                if (state.user) {
                    state.user.nickname = action.payload.nickname;
                }
                state.profileUpdateSuccess = true;
                state.error = null;
            })
            .addCase(changeNickname.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.profileUpdateSuccess = false;
            })

            // Logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            });

    },
});

export const { clearErrors, clearSuccess } = authSlice.actions;

export default authSlice.reducer;