import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const signupUser = createAsyncThunk(
    "users/signupUser",
    async ({ firstName, lastName, userName, email, password }, thunkAPI) => {
        // console.log(firstName, lastName, userName, email, password)
        try {
            const response = await fetch(
                "http://localhost:1337/api/auth/local/register?populate=*",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: `{ "firstName": "${firstName}", "lastName": "${lastName}", "username": "${userName}", "email": "${email}", "password": "${password}" }`,
                    redirect: 'follow'
                }
            );
            let data = await response.json();
            // console.log("data", data);

            if (response.status === 200) {
                localStorage.setItem("jwt_token", data.jwt);
                return data;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log("Error", e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

export const  loginUser= createAsyncThunk(
    "users/login",
    async ({ identifier, password }, thunkAPI) => {
        // console.log(identifier, password)
        try {
            const response = await fetch(
                "http://localhost:1000/api/users/signin",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: `{ "email": "${identifier}", "password": "${password}" }`,
                }
            );
            let data = await response.json();
            // console.log("response", data);
            // console.log(response.status)
            if (response.status === 200) {
                // console.log("response === 200")
                localStorage.setItem("jwt_token", data.token);
                return data;
            } else {
                // console.log("response === error")
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log("Error", e.response.data);
            thunkAPI.rejectWithValue(e.response.data);
        }
    }
);


export const fetchUserBytoken = createAsyncThunk(
    'users/fetchUserByToken',
    async ({ token }, thunkAPI) => {
        // console.log(token)
        try {
            const response = await fetch(
                'http://localhost:1000/api/users/getUserInfo2',
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            let data = await response.json();
            // console.log(data);

            if (response.status === 200) {
                return { ...data };
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
);


export const userSlice = createSlice({
    name: "user",
    initialState: {
        email: "",
        name: "",
        avtar: "",
        jwt: "",
        mobile:0,
        address:"",
        activeTrans:[],
        prevTrans:[],
        isAdmin: false,
        isFetching: false,
        isSuccess: false,
        isError: false,
        errorMessage: "",
    },
    reducers: {
        // Reducer comes here
        clearState: (state) => {
            state.email = "";
            state.name = "";
            state.avtar = "";
            state.jwt = "";
            state.mobile=0;
            state.address="";
            state.activeTrans= [],
            state.prevTrans= [],
            state.isAdmin = false;
            state.isError = false;
            state.isSuccess = false;
            state.isFetching = false;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(signupUser.fulfilled,(state, { payload }) =>{
            // console.log('fullfilled', payload.user)
            state.isFetching = false;
            state.isSuccess = true;
            state.email = payload.user.email;
            state.mobile = payload.user.mobile;
            state.name = payload.user.name;
            state.avtar = payload.user.photo;
            state.address = payload.user.address;
            state.activeTrans = payload.user.activeTrans;
            state.prevTrans = payload.user.prevTrans;
            state.isAdmin = payload.user.isAdmin;
            state.jwt = payload.token;
        });

        builder.addCase(signupUser.pending,(state) => {
            state.isFetching = true;
        });
        builder.addCase(signupUser.rejected,(state, { payload }) => {
            // console.log('rejected', payload)
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.error.message;
        });
        builder.addCase(loginUser.fulfilled,(state, { payload }) => {
            // console.log('loginData', payload)
            state.email = payload.user.email;
            state.mobile = payload.user.mobile;
            state.name = payload.user.name;
            state.avtar = payload.user.photo;
            state.address = payload.user.address;
            state.activeTrans = payload.user.activeTrans;
            state.prevTrans = payload.user.prevTrans;
            state.isAdmin = payload.user.isAdmin;
            state.jwt = payload.token;
            state.isFetching = false;
            state.isSuccess = true;
            return state;
        });
        builder.addCase(loginUser.rejected,(state, { payload }) => {
            // console.log('payload', payload);
            state.isFetching = false;
            state.isError = true;
            state.errorMessage = payload.message;
        });
        builder.addCase(loginUser.pending,(state) => {
            state.isFetching = true;
        });
        builder.addCase(fetchUserBytoken.pending,(state) => {
            state.isFetching = true;
        });
        builder.addCase(fetchUserBytoken.fulfilled,(state, { payload }) => {
            // console.log(payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.email = payload.userData.email;
            state.mobile = payload.userData.mobileNumber;
            state.name = payload.userData.userFullName;
            state.avtar = payload.userData.photo;
            state.address = payload.userData.address;
            state.activeTrans = payload.userData.activeTransactions;
            state.prevTrans = payload.userData.prevTransactions;
            state.isAdmin = payload.userData.isAdmin;
            state.jwt = payload.token;
            state.jwt = localStorage.getItem('jwt_token');
        });
        builder.addCase(fetchUserBytoken.rejected,(state) => {
            // console.log('fetchUserBytoken');
            state.isFetching = false;
            state.isError = true;
        });
    },
});


export const { clearState } = userSlice.actions;
export const userSelector = (state) => state.user;
export default userSlice.reducer
