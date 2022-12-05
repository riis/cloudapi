import { extendTheme } from "@chakra-ui/react";

export const AppTheme = extendTheme({
  initialColorMode: "light",
  useSystemColor: 'false',
  semanticTokens: {
    colors: {
      componentBorderColor: {
        default: 'gray.200'
      }
    }
  }
})