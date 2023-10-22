import * as React from "react";
import Paper from "@mui/material/Paper";
import Box  from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import '../App.css'
export default function SearchBox({ placeholder, setQueryText }) {
  return (
      <Box sx={{ p: "2px 4px", display: "flex", justifyContent: "center", mb:"2rem", mt:"2rem"}}>
        <Paper
          component="form"
        >
          <InputBase
            onChange={(e) => setQueryText(e.target.value)}
            sx={{ ml: 1, flex: 1 }}
            placeholder={placeholder}
            inputProps={{ "aria-label": "search metaphores" }}
          />
          <IconButton type="submit" disabled={true} sx={{ p: "10px" }} aria-label="search" >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
  );
}