"use client";

import { 
  useState, useEffect 
} from "react";
import {
  Container,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
  Grid,
  MenuItem,
  Select,
  CircularProgress,
  Box,
  Chip,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import Link from "next/link";

type Tool = {
  id: string;
  name: string;
  category: string;
  description: string;
  link: string;
};


export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      primary: {
        main: prefersDarkMode ? "#ba68c8" : "#673ab7",
      },
      secondary: {
        main: prefersDarkMode ? "#ffa726" : "#ff9800",
      },
    },
    typography: {
      fontFamily: ['"Roboto"', "Arial", "sans-serif"].join(","),
    },
  });

  useEffect(() => {
    fetch("/api/tools")
      .then((res) => res.json())
      .then((data) => {
        setTools(data);
        setLoading(false);
      });
  }, []);

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || tool.category === category)
  );

  const categories = ["All", ...new Set(tools.map((tool) => tool.category))];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{ 
              fontWeight: "bold", mb: 1, color: "text.primary" 
            }}
          >
            🔍 AICatch - Discover AI Tools
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Explore the best AI tools for various categories.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label="Search AI Tools"
            fullWidth
            variant="outlined"
            onChange={(e) => setSearch(e.target.value)}
            InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
          />

          <Select
            value={category}
            fullWidth
            displayEmpty
            onChange={(e) => setCategory(e.target.value)}
            sx={{ color: "text.primary" }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredTools.map((tool) => (
              <Grid item xs={12} sm={6} md={4} key={tool.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow:
                      "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
                    },
                    backgroundColor: theme.palette.background.paper
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                      {tool.name}
                    </Typography>
                    <Chip
                      label={tool.category}
                      size="small"
                      sx={{ mt: 1, mb: 1 }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        my: 1,
                        height: "80px",
                        overflow: "hidden",
                      }}
                    >
                      {tool.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Link href={tool.link} passHref target="_blank">
                      <Button variant="contained" color="primary" fullWidth>
                        Visit
                      </Button>
                    </Link>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
}
