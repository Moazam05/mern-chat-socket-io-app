import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => {
        return {
          url: "users/updateMe",
          method: "PUT",
          body: data,
        };
      },
    }),
    getAllUsers: builder.query({
      query: (search) => {
        return {
          url: `users?search=${search}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useUpdateUserMutation, useGetAllUsersQuery } = userApiSlice;
