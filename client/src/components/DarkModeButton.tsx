import { useColorMode, IconButton } from "@chakra-ui/react";
import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export const DarkModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      color="black"
      bg="#38EBC0"
      _hover={{ bg: "#32d1ab" }}
      aria-label="darkmode"
      icon={colorMode === "light" ? <FiSun /> : <FiMoon />}
      onClick={toggleColorMode}
    />
  );
};
