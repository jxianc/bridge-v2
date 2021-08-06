import { Box, Button, Flex, Link, Spacer } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withApollo } from "../../utils/withApollo";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BrowserHead } from "../../components/BrowserHead";
import { InputField } from "../../components/input/InputField";
import { Wrapper } from "../../components/Wrapper";
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage<{ token: string }> = () => {
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper title="Change Password" variant="small">
      <BrowserHead title="Change Password" />
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.changePassword.user,
                },
              });
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="newPassword"
              label="New Password"
              type="password"
            />
            {tokenError ? (
              <Flex>
                <Box color="red">{tokenError}</Box>
                <Spacer />
                <Box textAlign="right" color="gray.600" fontStyle="italic">
                  <NextLink href="/forgot-password">
                    <Link>click here to get a new one</Link>
                  </NextLink>
                </Box>
              </Flex>
            ) : null}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
