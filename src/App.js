import axios from "axios";
import { useState } from "react";

import logo from "./logo.svg";
import "./App.css";

const API_KEY = "";
const BASE_URL = "https://api.giphy.com/v1/gifs/search?";

function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);

  const handleOnChange = (value) => setSearch(value);

  const handleClearSearch = () => {
    setSearch("");
    setData([]);
    setLoading(false);
    setTotal(0);
    setCurrentPage(1);
    setOffset(0);
  };

  const handleLoadMore = () => {
    const totalPages = total / 20;
    if (currentPage + 1 <= totalPages) {
      setCurrentPage(currentPage + 1);
      setOffset(offset + 20 + 1);
      handleGetGifs(offset + 20);
    }
  };

  const handleGetGifs = async (offset) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}api_key=${API_KEY}&limit=20&offset=${
          offset ? offset : null
        }&q=${search}`
      );

      if (response.status === 200) {
        setData([...data, ...response.data?.data]);
        setTotal(response.data.pagination.total_count);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const hasData = data && !!data.length;
  const isEmpty = !hasData && !loading;

  return (
    <div className="App" style={{ overflow: "auto" }}>
      <header className="App-header">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: 300,
            alignItems: "center",
            justifyContent: "space-evenly",
            width: "80%",
          }}
        >
          <span>Search 4 Gifs</span>
          <input
            style={{ width: 500, height: 32 }}
            value={search}
            onChange={(e) => handleOnChange(e.target.value)}
          />
          <div>
            <Button
              title="Search"
              onClick={() => handleGetGifs(0)}
              disabled={!search}
            />
            <Button title="Clear" onClick={handleClearSearch} />
          </div>
        </div>
        {!!total && <TotalSection total={total} />}
        <ContainerSections>
          {hasData &&
            data.map((gif) =>
              gif.images ? <GifSection key={gif.id} gif={gif} /> : null
            )}
          {hasData && !loading && (
            <Button title="Load more" onClick={handleLoadMore} />
          )}
          {isEmpty && <EmptySection />}
          {loading && <LoadingIndicator />}
        </ContainerSections>
      </header>
    </div>
  );
}

export default App;

const GifSection = ({ gif }) => (
  <div style={{ margin: 5 }}>
    <img
      alt="gif_generated"
      loading="lazy"
      src={gif.images.preview_gif.url}
      height={200}
      width={200}
    />
  </div>
);

const EmptySection = () => <p>No results yet!</p>;

const TotalSection = ({ total }) => (
  <span style={{ fontSize: 16 }}>Total results: {total}</span>
);

const LoadingIndicator = () => (
  <img
    alt="loading indicator"
    src={logo}
    height={200}
    width={200}
    className="App-logo"
  />
);

const ContainerSections = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "80%",
        flexWrap: "wrap",
        maxHeight: 300,
        height: 300,
        marginTop: 30,
        overflow: "auto",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        borderWidth: 1,
        borderColor: "#cecece",
        borderStyle: "solid",
        borderRadius: 6,
      }}
    >
      {children}
    </div>
  );
};

const Button = ({ title, onClick, disabled = false }) => {
  return (
    <button style={{ margin: 5 }} disabled={disabled} onClick={onClick}>
      {title}
    </button>
  );
};
