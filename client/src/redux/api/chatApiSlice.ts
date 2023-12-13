import { apiSlice } from "./apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (data) => {
        return {
          url: "chats",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Chats"],
    }),
    getChat: builder.query({
      query: () => {
        return {
          url: "chats",
          method: "GET",
        };
      },
      providesTags: ["Chats"],
    }),
    createGroupChat: builder.mutation({
      query: (data) => {
        return {
          url: "chats/group",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Chats"],
    }),
    renameGroupChat: builder.mutation({
      query: (data) => {
        return {
          url: `chats/group/${data.chatId}`,
          method: "PUT",
          body: data.body,
        };
      },
      invalidatesTags: ["Chats"],
    }),
    addMemberToGroupChat: builder.mutation({
      query: (data) => {
        return {
          url: `chats/group/${data.chatId}/add`,
          method: "PUT",
          body: data.userId,
        };
      },
      invalidatesTags: ["Chats"],
    }),
    leaveGroupChat: builder.mutation({
      query: (data) => {
        console.log("data", data);
        return {
          url: `chats/group/${data.chatId}/remove`,
          method: "PUT",
          body: data.userId,
        };
      },
      invalidatesTags: ["Chats"],
    }),
  }),
});

export const {
  useCreateChatMutation,
  useGetChatQuery,
  useCreateGroupChatMutation,
  useRenameGroupChatMutation,
  useAddMemberToGroupChatMutation,
  useLeaveGroupChatMutation,
} = chatApiSlice;
