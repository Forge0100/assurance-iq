import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Container from "@mui/material/Container";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {Stack} from "@mui/material";

function App() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`https://pixabay.com/api/?key=13417145-d0c367819415b077de5e950e3&q=${search}`)
      .then(response => response.json())
      .then(result => {
        setItems(result.hits);
      });
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;

    setSearch(value);
  };

  return (
    <Container>
      <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
          onSubmit={handleSubmit}
      >
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search images"
            inputProps={{ 'aria-label': 'search images' }}
            onChange={handleSearchChange}
            value={search}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
        </IconButton>
      </Paper>
      <ImageList variant="masonry" cols={4} gap={8}>
        {items.map((item) => (
          <ImageListItem key={item.id}>
            <img
              src={item.previewURL}
              srcSet={item.largeImageURL}
              alt={item.tags}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.tags}
              subtitle={<span>by {item.user}</span>}
              actionIcon={
                <Stack
                  direction={{
                    xs: 'column',
                    sm: 'row',
                  }}
                  sx={{
                    color: '#fff',
                    p: 1,
                  }}
                  alignItems="center"
                >
                  <StarBorderIcon />
                  <span>{item.likes}</span>
                </Stack>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  );
}

export default App;
