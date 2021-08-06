import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BrowserHead } from "../../../components/head/BrowserHead";
import { InputField } from "../../../components/input/InputField";
import { Wrapper } from "../../../components/common/Wrapper";
import { useCreateCommentMutation } from "../../../generated/graphql";
import { toErrorMap } from "../../../utils/toErrorMap";
import { useIsAuthForCreateComment } from "../../../utils/useIsAuth";
import { withApollo } from "../../../utils/withApollo";

const CreateComment: NextPage<{ postId: string }> = () => {
  const router = useRouter();
  const postId =
    typeof router.query.postId === "string" ? router.query.postId : "";
  useIsAuthForCreateComment(postId);
  const [createComment] = useCreateCommentMutation();
  const [postIdError, setPostIdError] = useState<string>("");

  return (
    <Wrapper variant="small" title="Create Comment">
      <BrowserHead title="Create Comment" />
      <Formik
        initialValues={{ body: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createComment({
            variables: {
              commentInput: {
                ...values,
                postId: parseInt(postId),
              },
            },
            update: (cache) => {
              cache.evict({ fieldName: "comments:{}" });
            },
          });
          if (response.data?.createComment.errors) {
            const errorMap = toErrorMap(response.data.createComment.errors);
            if ("postId" in errorMap) {
              setPostIdError(response.data.createComment.errors[0].message);
            }
            setErrors(errorMap);
          } else if (response.data?.createComment.comment) {
            router.push(`/post/${router.query.postId}`);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              textarea
              name="body"
              placeholder="body..."
              label="Body"
            />
            {postIdError ? <Box color="red">{postIdError}</Box> : null}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              bg="#38EBC0"
              color="black"
              _hover={{ bg: "#32d1ab" }}
            >
              Create Comment
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(CreateComment);
