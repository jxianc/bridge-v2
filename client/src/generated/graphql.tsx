import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['Int'];
  body: Scalars['String'];
  points: Scalars['Float'];
  user: User;
  post: Post;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type CommentInput = {
  commentId?: Maybe<Scalars['Int']>;
  body: Scalars['String'];
  postId: Scalars['Int'];
};

export type CommentResponse = {
  __typename?: 'CommentResponse';
  errors?: Maybe<Array<FieldError>>;
  comment?: Maybe<Comment>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  votePost: PointResponse;
  voteComment: PointResponse;
  createComment: CommentResponse;
  createPost: PostResponse;
  editPost: PostResponse;
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  changePassword: UserResponse;
};


export type MutationVotePostArgs = {
  isUpvote: Scalars['Boolean'];
  postId: Scalars['Int'];
};


export type MutationVoteCommentArgs = {
  isUpvote: Scalars['Boolean'];
  commentId: Scalars['Int'];
};


export type MutationCreateCommentArgs = {
  commnetInput: CommentInput;
};


export type MutationCreatePostArgs = {
  postInput: PostInput;
};


export type MutationEditPostArgs = {
  postInput: PostInput;
};


export type MutationRegisterArgs = {
  userInput: UserInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type PaginatedComments = {
  __typename?: 'PaginatedComments';
  comments: Array<Comment>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type PointResponse = {
  __typename?: 'PointResponse';
  errors?: Maybe<Array<FieldError>>;
  success: Scalars['Boolean'];
  point?: Maybe<Scalars['Int']>;
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Float'];
  title: Scalars['String'];
  body: Scalars['String'];
  points: Scalars['Float'];
  comments?: Maybe<Array<Comment>>;
  user: User;
  postCategory: PostCategory;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type PostCategory = {
  __typename?: 'PostCategory';
  id: Scalars['Float'];
  name: Scalars['String'];
};

export type PostInput = {
  postId?: Maybe<Scalars['Int']>;
  title: Scalars['String'];
  body: Scalars['String'];
  postCategoryId: Scalars['Int'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<FieldError>>;
  post?: Maybe<Post>;
};

export type Query = {
  __typename?: 'Query';
  commentsByPost: PaginatedComments;
  categories: Array<PostCategory>;
  postsByTopCategory: Array<TopPosts>;
  singlePost: PostResponse;
  posts: PaginatedPosts;
  postsByCategory: PaginatedPosts;
  me?: Maybe<User>;
};


export type QueryCommentsByPostArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  postId: Scalars['Int'];
};


export type QuerySinglePostArgs = {
  postId: Scalars['Int'];
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryPostsByCategoryArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  categoryId: Scalars['Int'];
};

export type TopPosts = {
  __typename?: 'TopPosts';
  category: PostCategory;
  posts?: Maybe<Array<Post>>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  email: Scalars['String'];
  posts?: Maybe<Array<Post>>;
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  confirmPassword: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegularCommentFragment = (
  { __typename?: 'Comment' }
  & Pick<Comment, 'id' | 'body' | 'points'>
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularPostFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'title' | 'body' | 'points' | 'createdAt' | 'updatedAt'>
  & { user: (
    { __typename?: 'User' }
    & RegularUserFragment
  ), postCategory: (
    { __typename?: 'PostCategory' }
    & Pick<PostCategory, 'id' | 'name'>
  ), comments?: Maybe<Array<(
    { __typename?: 'Comment' }
    & RegularCommentFragment
  )>> }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'email'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'createdAt' | 'updatedAt'>
      & RegularUserFragment
    )> }
  ) }
);

export type CreateCommentMutationVariables = Exact<{
  commentInput: CommentInput;
}>;


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment: (
    { __typename?: 'CommentResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, comment?: Maybe<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'createdAt' | 'updatedAt'>
      & { user: (
        { __typename?: 'User' }
        & RegularUserFragment
      ), post: (
        { __typename?: 'Post' }
        & Pick<Post, 'id' | 'title'>
      ) }
      & RegularCommentFragment
    )> }
  ) }
);

export type CreatePostMutationVariables = Exact<{
  postInput: PostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'PostResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, post?: Maybe<(
      { __typename?: 'Post' }
      & RegularPostFragment
    )> }
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'createdAt' | 'updatedAt'>
      & RegularUserFragment
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  userInput: UserInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'createdAt' | 'updatedAt'>
      & RegularUserFragment
    )> }
  ) }
);

export type VotePostMutationVariables = Exact<{
  postId: Scalars['Int'];
  isUpvote: Scalars['Boolean'];
}>;


export type VotePostMutation = (
  { __typename?: 'Mutation' }
  & { votePost: (
    { __typename?: 'PointResponse' }
    & Pick<PointResponse, 'success' | 'point'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>> }
  ) }
);

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = (
  { __typename?: 'Query' }
  & { categories: Array<(
    { __typename?: 'PostCategory' }
    & Pick<PostCategory, 'id' | 'name'>
  )> }
);

export type CommentsByPostQueryVariables = Exact<{
  postId: Scalars['Int'];
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type CommentsByPostQuery = (
  { __typename?: 'Query' }
  & { commentsByPost: (
    { __typename?: 'PaginatedComments' }
    & Pick<PaginatedComments, 'hasMore'>
    & { comments: Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'createdAt' | 'updatedAt'>
      & { user: (
        { __typename?: 'User' }
        & RegularUserFragment
      ) }
      & RegularCommentFragment
    )> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'createdAt' | 'updatedAt'>
    & RegularUserFragment
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & RegularPostFragment
    )> }
  ) }
);

export type PostsByCategoryQueryVariables = Exact<{
  categoryId: Scalars['Int'];
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsByCategoryQuery = (
  { __typename?: 'Query' }
  & { postsByCategory: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & RegularPostFragment
    )> }
  ) }
);

export type PostsByTopCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsByTopCategoryQuery = (
  { __typename?: 'Query' }
  & { postsByTopCategory: Array<(
    { __typename?: 'TopPosts' }
    & { category: (
      { __typename?: 'PostCategory' }
      & Pick<PostCategory, 'id' | 'name'>
    ), posts?: Maybe<Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'title'>
    )>> }
  )> }
);

export type SinglePostQueryVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type SinglePostQuery = (
  { __typename?: 'Query' }
  & { singlePost: (
    { __typename?: 'PostResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, post?: Maybe<(
      { __typename?: 'Post' }
      & { comments?: Maybe<Array<(
        { __typename?: 'Comment' }
        & Pick<Comment, 'createdAt' | 'updatedAt'>
        & { user: (
          { __typename?: 'User' }
          & RegularUserFragment
        ) }
      )>> }
      & RegularPostFragment
    )> }
  ) }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  email
}
    `;
export const RegularCommentFragmentDoc = gql`
    fragment RegularComment on Comment {
  id
  body
  points
}
    `;
export const RegularPostFragmentDoc = gql`
    fragment RegularPost on Post {
  id
  title
  body
  points
  user {
    ...RegularUser
  }
  postCategory {
    id
    name
  }
  comments {
    ...RegularComment
  }
  createdAt
  updatedAt
}
    ${RegularUserFragmentDoc}
${RegularCommentFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
      createdAt
      updatedAt
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateCommentDocument = gql`
    mutation CreateComment($commentInput: CommentInput!) {
  createComment(commnetInput: $commentInput) {
    errors {
      field
      message
    }
    comment {
      ...RegularComment
      user {
        ...RegularUser
      }
      post {
        id
        title
      }
      createdAt
      updatedAt
    }
  }
}
    ${RegularCommentFragmentDoc}
${RegularUserFragmentDoc}`;
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      commentInput: // value for 'commentInput'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, options);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($postInput: PostInput!) {
  createPost(postInput: $postInput) {
    errors {
      ...RegularError
    }
    post {
      ...RegularPost
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularPostFragmentDoc}`;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      postInput: // value for 'postInput'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
      createdAt
      updatedAt
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($userInput: UserInput!) {
  register(userInput: $userInput) {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
      createdAt
      updatedAt
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const VotePostDocument = gql`
    mutation VotePost($postId: Int!, $isUpvote: Boolean!) {
  votePost(postId: $postId, isUpvote: $isUpvote) {
    errors {
      ...RegularError
    }
    success
    point
  }
}
    ${RegularErrorFragmentDoc}`;
export type VotePostMutationFn = Apollo.MutationFunction<VotePostMutation, VotePostMutationVariables>;

/**
 * __useVotePostMutation__
 *
 * To run a mutation, you first call `useVotePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVotePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [votePostMutation, { data, loading, error }] = useVotePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      isUpvote: // value for 'isUpvote'
 *   },
 * });
 */
export function useVotePostMutation(baseOptions?: Apollo.MutationHookOptions<VotePostMutation, VotePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VotePostMutation, VotePostMutationVariables>(VotePostDocument, options);
      }
export type VotePostMutationHookResult = ReturnType<typeof useVotePostMutation>;
export type VotePostMutationResult = Apollo.MutationResult<VotePostMutation>;
export type VotePostMutationOptions = Apollo.BaseMutationOptions<VotePostMutation, VotePostMutationVariables>;
export const CategoriesDocument = gql`
    query Categories {
  categories {
    id
    name
  }
}
    `;

/**
 * __useCategoriesQuery__
 *
 * To run a query within a React component, call `useCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
      }
export function useCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<typeof useCategoriesLazyQuery>;
export type CategoriesQueryResult = Apollo.QueryResult<CategoriesQuery, CategoriesQueryVariables>;
export const CommentsByPostDocument = gql`
    query CommentsByPost($postId: Int!, $limit: Int!, $cursor: String) {
  commentsByPost(postId: $postId, limit: $limit, cursor: $cursor) {
    hasMore
    comments {
      ...RegularComment
      user {
        ...RegularUser
      }
      createdAt
      updatedAt
    }
  }
}
    ${RegularCommentFragmentDoc}
${RegularUserFragmentDoc}`;

/**
 * __useCommentsByPostQuery__
 *
 * To run a query within a React component, call `useCommentsByPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentsByPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsByPostQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useCommentsByPostQuery(baseOptions: Apollo.QueryHookOptions<CommentsByPostQuery, CommentsByPostQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommentsByPostQuery, CommentsByPostQueryVariables>(CommentsByPostDocument, options);
      }
export function useCommentsByPostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentsByPostQuery, CommentsByPostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommentsByPostQuery, CommentsByPostQueryVariables>(CommentsByPostDocument, options);
        }
export type CommentsByPostQueryHookResult = ReturnType<typeof useCommentsByPostQuery>;
export type CommentsByPostLazyQueryHookResult = ReturnType<typeof useCommentsByPostLazyQuery>;
export type CommentsByPostQueryResult = Apollo.QueryResult<CommentsByPostQuery, CommentsByPostQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
    createdAt
    updatedAt
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...RegularPost
    }
  }
}
    ${RegularPostFragmentDoc}`;

/**
 * __usePostsQuery__
 *
 * To run a query within a React component, call `usePostsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function usePostsQuery(baseOptions: Apollo.QueryHookOptions<PostsQuery, PostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
      }
export function usePostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsQuery, PostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
        }
export type PostsQueryHookResult = ReturnType<typeof usePostsQuery>;
export type PostsLazyQueryHookResult = ReturnType<typeof usePostsLazyQuery>;
export type PostsQueryResult = Apollo.QueryResult<PostsQuery, PostsQueryVariables>;
export const PostsByCategoryDocument = gql`
    query PostsByCategory($categoryId: Int!, $limit: Int!, $cursor: String) {
  postsByCategory(categoryId: $categoryId, limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...RegularPost
    }
  }
}
    ${RegularPostFragmentDoc}`;

/**
 * __usePostsByCategoryQuery__
 *
 * To run a query within a React component, call `usePostsByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsByCategoryQuery({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function usePostsByCategoryQuery(baseOptions: Apollo.QueryHookOptions<PostsByCategoryQuery, PostsByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostsByCategoryQuery, PostsByCategoryQueryVariables>(PostsByCategoryDocument, options);
      }
export function usePostsByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsByCategoryQuery, PostsByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostsByCategoryQuery, PostsByCategoryQueryVariables>(PostsByCategoryDocument, options);
        }
export type PostsByCategoryQueryHookResult = ReturnType<typeof usePostsByCategoryQuery>;
export type PostsByCategoryLazyQueryHookResult = ReturnType<typeof usePostsByCategoryLazyQuery>;
export type PostsByCategoryQueryResult = Apollo.QueryResult<PostsByCategoryQuery, PostsByCategoryQueryVariables>;
export const PostsByTopCategoryDocument = gql`
    query PostsByTopCategory {
  postsByTopCategory {
    category {
      id
      name
    }
    posts {
      id
      title
    }
  }
}
    `;

/**
 * __usePostsByTopCategoryQuery__
 *
 * To run a query within a React component, call `usePostsByTopCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsByTopCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsByTopCategoryQuery({
 *   variables: {
 *   },
 * });
 */
export function usePostsByTopCategoryQuery(baseOptions?: Apollo.QueryHookOptions<PostsByTopCategoryQuery, PostsByTopCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostsByTopCategoryQuery, PostsByTopCategoryQueryVariables>(PostsByTopCategoryDocument, options);
      }
export function usePostsByTopCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsByTopCategoryQuery, PostsByTopCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostsByTopCategoryQuery, PostsByTopCategoryQueryVariables>(PostsByTopCategoryDocument, options);
        }
export type PostsByTopCategoryQueryHookResult = ReturnType<typeof usePostsByTopCategoryQuery>;
export type PostsByTopCategoryLazyQueryHookResult = ReturnType<typeof usePostsByTopCategoryLazyQuery>;
export type PostsByTopCategoryQueryResult = Apollo.QueryResult<PostsByTopCategoryQuery, PostsByTopCategoryQueryVariables>;
export const SinglePostDocument = gql`
    query SinglePost($postId: Int!) {
  singlePost(postId: $postId) {
    errors {
      ...RegularError
    }
    post {
      ...RegularPost
      comments {
        user {
          ...RegularUser
        }
        createdAt
        updatedAt
      }
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularPostFragmentDoc}
${RegularUserFragmentDoc}`;

/**
 * __useSinglePostQuery__
 *
 * To run a query within a React component, call `useSinglePostQuery` and pass it any options that fit your needs.
 * When your component renders, `useSinglePostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSinglePostQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useSinglePostQuery(baseOptions: Apollo.QueryHookOptions<SinglePostQuery, SinglePostQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SinglePostQuery, SinglePostQueryVariables>(SinglePostDocument, options);
      }
export function useSinglePostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SinglePostQuery, SinglePostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SinglePostQuery, SinglePostQueryVariables>(SinglePostDocument, options);
        }
export type SinglePostQueryHookResult = ReturnType<typeof useSinglePostQuery>;
export type SinglePostLazyQueryHookResult = ReturnType<typeof useSinglePostLazyQuery>;
export type SinglePostQueryResult = Apollo.QueryResult<SinglePostQuery, SinglePostQueryVariables>;