// features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../utils/constant';
export const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/user`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    users: [],
    filteredUsers: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        filterUsers: (state, action) => {
            const searchTerm = action.payload.toLowerCase();
            if (searchTerm === '') {
                state.filteredUsers = [];
            } else {
                state.filteredUsers = state.users.filter(
                    user =>
                        user.nickname.toLowerCase().includes(searchTerm) ||
                        user.userName.toLowerCase().includes(searchTerm)
                ).slice(0, 3); // Limit to 3 results
            }
        },
        clearFilteredUsers: (state) => {
            state.filteredUsers = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload.data || [];
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : 'Failed to fetch users';
            });
    },
});

export const { filterUsers, clearFilteredUsers } = userSlice.actions;
export default userSlice.reducer;