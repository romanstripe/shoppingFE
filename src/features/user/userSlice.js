import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import { useNavigate, useDispatch } from "react-router-dom";
import api from "../../utils/api";
import { initialCart, getCartQty } from "../cart/cartSlice";
import ToastMessage from "../../common/component/ToastMessage";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      sessionStorage.setItem("token", response.data.token); //save token
      dispatch(
        showToastMessage({
          message: "Login is completed",
          status: "success",
        })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "Failed to login",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = (navigate) => (dispatch) => {
  sessionStorage.removeItem("token");
  dispatch({ type: "user/logout" }); //동기 작업이라 Thunk 안씀
  dispatch(initialCart()); //getQty 하면 유저아이디 필요하니까 이니셜로 비우기
  dispatch(
    showToastMessage({
      message: "Logout is completed",
      status: "success",
    })
  );
  //navigate("/login");
  //로그아웃 하고 로그인으로 네비게이트 해야한단 조건이 없어서 주석
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", { email, name, password });
      dispatch(
        showToastMessage({
          message: "Registration is completed",
          status: "success",
        })
      );
      navigate("/login");
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "Failed to registrate",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    //authorization을 통해 header에 붙여둠
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return registerUser(error.error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError =
          action.payload || "Login failed due to unknown error";
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
