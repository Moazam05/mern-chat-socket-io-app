// Redux Imports
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Custom Imports
import { RootState } from "../store";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.user?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Chats", "Messages"],
  endpoints: (builder) => ({}),
});
