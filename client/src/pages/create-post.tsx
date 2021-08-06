import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BrowserHead } from "../components/head/BrowserHead";
import CategoryDropDown from "../components/input/categoryDropDown";
import { InputField } from "../components/input/InputField";
import { Wrapper } from "../components/common/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const [createPost] = useCreatePostMutation();
  const [postCategoryId, setPostCategoryId] = useState<number>(0);
  const [categoryError, setCategoryError] = useState<string>("");
  const router = useRouter();
  useIsAuth();

  return (
    <Wrapper variant="small" title="Create Post">
      <BrowserHead title="Create Post" />
      <Box mb={4}>
        <CategoryDropDown
          sendOutSelectedCategoryId={(catId) => {
            setPostCategoryId(parseInt(catId));
          }}
        />
      </Box>
      <Formik
        initialValues={{ title: "", body: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createPost({
            variables: { postInput: { ...values, postCategoryId } },
            update: (cache) => {
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (response.data?.createPost.errors) {
            const errorMap = toErrorMap(response.data.createPost.errors);
            if ("postCategory" in errorMap) {
              setCategoryError(errorMap.postCategory);
            }
            setErrors(errorMap);
          } else if (response.data?.createPost.post) {
            router.push("/");
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
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(CreatePost);
