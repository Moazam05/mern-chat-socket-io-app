import { apiSlice } from "./apiSlice";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: (data) => {
        return {
          url: "messages",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Messages"],
    }),
    getMessages: builder.query({
      query: (chatId) => {
        return {
          url: `messages/${chatId}`,
          method: "GET",
        };
      },
      providesTags: ["Messages"],
    }),
  }),
});

export const { useCreateMessageMutation, useGetMessagesQuery } =
  messageApiSlice;
