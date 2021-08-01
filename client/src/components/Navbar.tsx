import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { FaRainbow } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import NextLink from "next/link";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { FiUserPlus } from "react-icons/fi";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/dist/client/router";
import { DarkModeButton } from "./DarkModeButton";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const { data, loading } = useMeQuery({ skip: isServer() });
  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const router = useRouter();
  const [navbarMenu, setNavbarMenu] = useState<JSX.Element>(<Spinner />);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  useEffect(() => {
    if (data && data.me) {
      setNavbarMenu(
        <>
          <Box fontSize="xl" fontWeight="semibold" mr={4}>
            {data.me.username}
          </Box>
          <Button
            color="black"
            bg="#38EBC0"
            _hover={{ bg: "#32d1ab" }}
            leftIcon={<BiLogOut />}
            onClick={() => setShowLogoutModal(!showLogoutModal)}
            isLoading={loading}
          >
            logout
          </Button>
          <Modal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(!showLogoutModal)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Logout</ModalHeader>
              <ModalCloseButton />
              <ModalBody>Are you sure you want to logout?</ModalBody>
              <ModalFooter>
                <Button
                  color="black"
                  bg="#38EBC0"
                  _hover={{ bg: "#32d1ab" }}
                  leftIcon={<BiLogOut />}
                  mr={3}
                  onClick={async () => {
                    logout();
                    await apolloClient.resetStore();
                    router.push("/");
                  }}
                >
                  logout
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowLogoutModal(false)}
                >
                  cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );
    } else {
      setNavbarMenu(
        <>
          <NextLink href="/login">
            <Button
              color="black"
              bg="#38EBC0"
              _hover={{ bg: "#32d1ab" }}
              leftIcon={<BiLogIn />}
            >
              login
            </Button>
          </NextLink>
          <NextLink href="/register">
            <Button
              color="black"
              bg="#38EBC0"
              _hover={{ bg: "#32d1ab" }}
              leftIcon={<FiUserPlus />}
            >
              register
            </Button>
          </NextLink>
        </>
      );
    }
  }, [data, loading, showLogoutModal]);

  return (
    <Flex
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb="1em"
      p={3}
      bg="facebook.900"
      color="white"
    >
      <Box ml={{ base: "0%", md: "0%", lg: "15%" }} fontWeight="bold">
        <Link style={{ textDecoration: "none" }} to={"/"}>
          <HStack _hover={{ color: "#1BD3A7" }}>
            <Box>
              <FaRainbow size="3em" />
            </Box>
            <Heading size="2xl">Bridge</Heading>
          </HStack>
        </Link>
      </Box>
      <HStack mr={{ base: "0%", md: "0%", lg: "15%" }} spacing={8}>
        {navbarMenu}
        <DarkModeButton />
      </HStack>
    </Flex>
  );
};
