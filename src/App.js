import React, {useCallback, useMemo, useRef, useState} from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Stack from "@mui/material/Stack";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Container from "@mui/material/Container";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const ITEMS_ON_PAGE = 20;

function App() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState([]);

  const searchRef = useRef('');
  searchRef.current = search;

  const currentPage = useMemo(() => items.length / ITEMS_ON_PAGE, [items]);

  const fetchData = useCallback(() => {
    const nextPage = currentPage + 1;

    fetch(`https://pixabay.com/api/?key=13417145-d0c367819415b077de5e950e3&q=${searchRef.current}&page=${nextPage}&per_page=${ITEMS_ON_PAGE}`)
      .then(response => response.json())
      .then(result => {
        setItems((prev) => ([
          ...prev,
          ...result.hits,
        ]));
        setTotal(result.total);
      });
  }, [currentPage]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();

    setItems([]);

    fetchData();
  }, []);

  const handleSearchChange = useCallback((event) => {
    const { value } = event.target;

    setSearch(value);
  }, []);

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
            value={searchRef.current}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
        </IconButton>
      </Paper>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchData}
        hasMore={items.length < total}
        loader={<h4>Loading...</h4>}
      >
        <ImageList variant="woven" cols={4} gap={8}>
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
                      p: '5px',
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
      </InfiniteScroll>
    </Container>
  );
}

export default App;
