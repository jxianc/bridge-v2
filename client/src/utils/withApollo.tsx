import { withApollo as createWithApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedComments, PaginatedPosts } from "../generated/graphql";

const createClient = () =>
  new ApolloClient({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
            postsByCategory: {
              keyArgs: ["categoryId"],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
            commentsByPost: {
              keyArgs: ["postId"],
              merge(
                existing: PaginatedComments | undefined,
                incoming: PaginatedComments
              ): PaginatedComments {
                return {
                  ...incoming,
                  comments: [
                    ...(existing?.comments || []),
                    ...incoming.comments,
                  ],
                };
              },
            },
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
