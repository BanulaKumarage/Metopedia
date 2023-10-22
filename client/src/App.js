import logo from './logo.svg';
import './App.css';
import SearchBox from './components/Searchbar';
import MetaphorsTable from './components/Table';
import { useState, useEffect } from "react";
import axios from "axios";
import { Container } from '@mui/material';

function App() {
  const [phrase, setPhrase] = useState("");
  const [data, setData] = useState([])
  
  useEffect(() => {
      const request = {phrase: phrase};
      axios.post(`http://localhost:3001/search`, request).then((result) => {
        setData(result.data);
      });
    }, [phrase])

  return (
    <Container className="App">
      <SearchBox placeholder="Search Elasticsearch" setQueryText={setPhrase}/>
      <MetaphorsTable data={data.hits} />
    </Container>
  );
}

export default App;
