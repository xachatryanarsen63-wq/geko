import { api } from "../../services/api";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "users",

      providesTags: ["Users"],
    }),

    getUserById: builder.query({
      query: (id) => `users/${id}`,
    }),

    addUser: builder.mutation({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
} = usersApi;