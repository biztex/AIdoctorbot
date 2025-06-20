import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3",
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
    },
    teal: {
      50: "#e0f2f1",
      100: "#b2dfdb",
      200: "#80cbc4",
      300: "#4db6ac",
      400: "#26a69a",
      500: "#009688",
      600: "#00897b",
      700: "#00796b",
      800: "#00695c",
      900: "#004d40",
    },
  },
  fonts: {
    heading: "system-ui, sans-serif",
    body: "system-ui, sans-serif",
  },
})

export default theme
