import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

interface GenericState<T> {
    data?: T
}

// const getFromLocalStorage = (key: string) => {
//     if (!key || typeof window === 'undefined') {
//         return ""
//     }
//     return localStorage.getItem(key)
// }

// const token = getFromLocalStorage('token');

const authSlice = createSlice({
    name: 'auth',
    initialState: { currentUser: /* token ? jwtDecode(token) : */ {} as GenericState<object> },
    reducers: {
        setCurrentUser: (state, action: PayloadAction<object>) => {
            state.currentUser = action.payload
        }
    },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;