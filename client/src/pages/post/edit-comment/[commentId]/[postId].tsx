import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Wrapper } from "../../../../components/common/Wrapper";
import { BrowserHead } from "../../../../components/head/BrowserHead";
import { InputField } from "../../../../components/input/InputField";
import {
  useEditCommentMutation,
  useSingleCommentQuery,
} from "../../../../generated/graphql";
import { toErrorMap } from "../../../../utils/toErrorMap";
import { withApollo } from "../../../../utils/withApollo";

interface EditCommentProps {}

export const EditComment: React.FC<EditCommentProps> = ({}) => {
  const router = useRouter();
  const postId = parseInt(
    typeof router.query.postId === "string" ? router.query.postId : ""
  );
  const commentId = parseInt(
    typeof router.query.commentId === "string" ? router.query.commentId : ""
  );
  const [postIdError, setPostIdError] = useState<string>("");
  const [renderEditComment, setRenderEditComment] = useState<JSX.Element>();
  const [editComment] = useEditCommentMutation();
  const { data, loading } = useSingleCommentQuery({
    variables: {
      commentId,
    },
  });

  useEffect(() => {
    if (!data && loading) {
      setRenderEditComment(<div>loading...</div>);
    } else if (data && data.singleComment && data.singleComment.comment) {
      const comment = data.singleComment.comment;

      setRenderEditComment(
        <Wrapper variant="small" title="Edit Comment">
          <BrowserHead title="Edit Comment" />
          <Formik
            initialValues={{ body: comment.body }}
            onSubmit={async (values, { setErrors }) => {
              const response = await editComment({
                variables: {
                  commentInput: {
                    ...values,
                    commentId,
                    postId,
                  },
                },
              });
              if (response.data?.editComment.errors) {
                const errorMap = toErrorMap(response.data.editComment.errors);
                if ("postId" in errorMap) {
                  setPostIdError(response.data.editComment.errors[0].message);
                }
                setErrors(errorMap);
              } else if (response.data?.editComment.comment) {
                router.push(`/post/${postId}`);
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
                  Edit Comment
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      );
    } else {
      setRenderEditComment(null);
    }
  }, [data, loading, commentId, postId, postIdError]);

  return <Box>{renderEditComment}</Box>;
};

export default withApollo({ ssr: false })(EditComment);
