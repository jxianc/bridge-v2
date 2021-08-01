import { useColorMode, IconButton } from "@chakra-ui/react";
import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export const DarkModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      p={-1}
      color="white"
      bg="facebook.900"
      _hover={{ bg: "#224987" }}
      aria-label="darkmode"
      icon={colorMode === "light" ? <FiSun /> : <FiMoon />}
      onClick={toggleColorMode}
    />
  );
};
