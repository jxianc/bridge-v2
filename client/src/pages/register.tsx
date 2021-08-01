import React from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/dist/client/router";
import { toErrorMap } from "../utils/toErrorMap";
import { Box, Button, Link } from "@chakra-ui/react";
import { FiUserPlus } from "react-icons/fi";
import { BrowserHead } from "../components/BrowserHead";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [register] = useRegisterMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small" title="Register">
      <BrowserHead title="Register" />
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { userInput: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.register.user,
                },
              });
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={6}>
              <InputField name="email" placeholder="email" label="Email" />
            </Box>
            <Box mt={6}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Box mt={6}>
              <InputField
                name="confirmPassword"
                placeholder="confirm password"
                label="Confirm Password"
                type="password"
              />
            </Box>
            <Box mt={2} textAlign="right" color="gray.600" fontStyle="italic">
              <NextLink href="/login">
                <Link>have an account?</Link>
              </NextLink>
            </Box>
            <Button
              mt={6}
              type="submit"
              isLoading={isSubmitting}
              bg="#38EBC0"
              _hover={{ bg: "#32d1ab" }}
              leftIcon={<FiUserPlus />}
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
