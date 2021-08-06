import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BrowserHead } from "../../../components/head/BrowserHead";
import CategoryDropDown from "../../../components/input/categoryDropDown";
import { InputField } from "../../../components/input/InputField";
import { Wrapper } from "../../../components/common/Wrapper";
import {
  useEditPostMutation,
  useSinglePostQuery,
} from "../../../generated/graphql";
import { toErrorMap } from "../../../utils/toErrorMap";
import { withApollo } from "../../../utils/withApollo";

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
  const router = useRouter();
  const postId = parseInt(
    typeof router.query.postId === "string" ? router.query.postId : ""
  );
  const [postCategoryId, setPostCategoryId] = useState<number>(0);
  const [categoryError, setCategoryError] = useState<string>("");
  const [renderEditPost, setRenderEditPost] = useState<JSX.Element>();
  const [editPost] = useEditPostMutation();
  const { data, loading } = useSinglePostQuery({
    variables: {
      postId,
    },
  });

  useEffect(() => {
    if (!data && loading) {
      setRenderEditPost(<div>loading...</div>);
    } else if (data && data.singlePost && data.singlePost.post) {
      const post = data.singlePost.post;

      setRenderEditPost(
        <Wrapper variant="small" title="Edit Post">
          <BrowserHead title="Edit Post" />
          <Box mb={4}>
            <CategoryDropDown
              preselected={post.postCategory}
              sendOutSelectedCategoryId={(catId) => {
                setPostCategoryId(parseInt(catId));
              }}
            />
          </Box>
          <Formik
            initialValues={{ title: post.title, body: post.body }}
            onSubmit={async (values, { setErrors }) => {
              console.log(post.postCategory.id);
              const response = await editPost({
                variables: {
                  postInput: {
                    ...values,
                    postCategoryId: postCategoryId
                      ? postCategoryId
                      : post.postCategory.id,
                    postId,
                  },
                },
              });
              if (response.data?.editPost.errors) {
                const errorMap = toErrorMap(response.data.editPost.errors);
                if ("postCategory" in errorMap) {
                  setCategoryError(errorMap.postCategory);
                }
                setErrors(errorMap);
              } else if (response.data?.editPost.post) {
                router.push(`/post/${postId}`);
                console.log("success");
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField name="title" placeholder="title" label="Title" />
                <Box mt={4}>
                  <InputField
                    textarea
                    name="body"
                    placeholder="body..."
                    label="Body"
                  />
                </Box>
                {categoryError ? <Box color="red">{categoryError}</Box> : null}
                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  bg="#38EBC0"
                  color="black"
                  _hover={{ bg: "#32d1ab" }}
                >
                  Edit Post
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      );
    } else {
      setRenderEditPost(null);
    }
  }, [data, loading, categoryError, postCategoryId]);

  return <Box>{renderEditPost}</Box>;
};

export default withApollo({ ssr: false })(EditPost);
