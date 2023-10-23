import SearchBox from "./components/Searchbar";
import MetaphorsTable from "./components/Table";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, FormControl, Typography } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem, Grid } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import InputLabel from "@mui/material/InputLabel";
import AppBar from "@mui/material/AppBar";
import Toolbar from '@mui/material/Toolbar';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

function App() {
  const [phrase, setPhrase] = useState("");
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("search");

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    const request = { phrase: phrase };
    axios.post(`http://localhost:3001/${mode}`, request).then((result) => {
      console.log(`Mode: ${mode}`);
      setData(result.data);
    });
  }, [phrase]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <MenuBookRoundedIcon sx={{ display: { xs: "none", md: "flex" }, fontSize: 35, mr: 2 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              MetoPedia
            </Typography>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              MetoPedia
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container className="App">
        <Grid container display={"flex"} justifyContent={"center"}>
          <Grid item xs={4}>
            <SearchBox placeholder="Search" setQueryText={setPhrase} />
          </Grid>
          <Grid item xs={2} display={"flex"} alignItems={"center"}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={mode}
                label="Category"
                onChange={(e) => {
                  setMode(e.target.value);
                }}
              >
                <MenuItem value={"search"}>All</MenuItem>
                <MenuItem value={"author"}>Author</MenuItem>
                <MenuItem value={"poem"}>Poem</MenuItem>
                <MenuItem value={"source"}>Source Domain</MenuItem>
                <MenuItem value={"target"}>Target Domain</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <MetaphorsTable data={data.hits} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
