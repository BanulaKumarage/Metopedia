import logo from "./logo.svg";
import "./App.css";
import SearchBox from "./components/Searchbar";
import MetaphorsTable from "./components/Table";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem, Grid } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


function App() {
  const [phrase, setPhrase] = useState("");
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("search");
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
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
      <Container className="App">
        <Grid container display={"flex"} justifyContent={"center"}>
          <Grid item xs={4}>
            <SearchBox placeholder="Search" setQueryText={setPhrase} />
          </Grid>
          <Grid item xs={2} display={"flex"} alignItems={"center"}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={mode}
              label="mode"
              onChange={(e)=>{setMode(e.target.value)}}
            >
            <MenuItem value={'search'}>All</MenuItem>
            <MenuItem value={'author'}>Author</MenuItem>
            <MenuItem value={'poem'}>Poem</MenuItem>
            <MenuItem value={'source'}>Source Domain</MenuItem>
            <MenuItem value={'target'}>Target Domain</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <MetaphorsTable data={data.hits} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
