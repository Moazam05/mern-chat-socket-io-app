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
  }),
});

export const { useUpdateUserMutation } = userApiSlice;
