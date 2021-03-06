import { Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { BrowserHead } from "../components/head/BrowserHead";
import { InputField } from "../components/input/InputField";
import { Wrapper } from "../components/common/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { BiLogIn } from "react-icons/bi";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const [login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small" title="Login">
      <BrowserHead title="Login" />
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: "posts:{}" });
              cache.evict({ fieldName: "comments:{}" });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Box mt={2} textAlign="right" color="gray.600" fontStyle="italic">
              <NextLink href="/forgot-password">
                <Link>forgot password</Link>
              </NextLink>
            </Box>
            <Box textAlign="right" color="gray.600" fontStyle="italic">
              <NextLink href="/register">
                <Link>register an account</Link>
              </NextLink>
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              bg="#38EBC0"
              color="black"
              _hover={{ bg: "#32d1ab" }}
              leftIcon={<BiLogIn />}
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);
