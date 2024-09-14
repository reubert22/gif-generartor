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
  const limit = 50;
  const totalPages = total / limit;

  const handleOnChange = (value) => {
    handleClearSearch();
    setSearch(value);
  };

  const handleClearSearch = () => {
    setSearch("");
    setData([]);
    setLoading(false);
    setTotal(0);
    setCurrentPage(1);
    setOffset(0);
  };

  const getGifs = async (offset) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}api_key=${API_KEY}&limit=${limit}&offset=${
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

  const handleLoadMore = () => {
    if (currentPage + 1 <= totalPages) {
      setCurrentPage(currentPage + 1);
      setOffset(offset + limit);
      getGifs(offset + limit);
    }
  };

  const handleGetGifs = () => {
    if (!!data.length) return;

    getGifs(0);
  };

  const hasData = data && !!data.length;
  const isEmpty = !hasData && !loading;

  return (
    <div className="App" style={{ overflow: "auto" }}>
      <div className="container-header">
        <span>Search 4 Gifs</span>
        <input
          style={{ width: 500, height: 32, fontSize: 16 }}
          value={search}
          placeholder="Search..."
          onChange={(e) => handleOnChange(e.target.value)}
        />
        <div>
          <Button title="Search" onClick={handleGetGifs} disabled={!search} />
          <Button title="Clear" onClick={handleClearSearch} />
        </div>
      </div>
      <ContainerSections>
        {hasData &&
          data.map((gif) =>
            gif.images ? <GifSection key={gif.id} gif={gif} /> : null
          )}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasData && !loading && data.length < total && (
            <Button
              disabled={loading}
              title="Load more"
              onClick={handleLoadMore}
            />
          )}
        </div>
        {isEmpty && <EmptySection />}
        {loading && <LoadingIndicator />}
      </ContainerSections>
      {hasData && total && (
        <TotalIndicatorSection showing={data.length} total={total} />
      )}
    </div>
  );
}

export default App;

const GifSection = ({ gif }) => (
  <div style={{ margin: 5, display: "flex", flexDirection: "column" }}>
    <img
      alt={gif.alt_text}
      loading="lazy"
      src={gif.images.preview_gif.url}
      height={200}
      width={200}
    />
    <div className="section-title-container">
      <a
        href={gif.bitly_url ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#fff", textDecoration: "none" }}
      >
        <span style={{ fontSize: 10 }}>{gif.title ?? "No title"}</span>
      </a>
    </div>
  </div>
);

const EmptySection = () => (
  <div className="empty-section">
    <span>No results yet!</span>
  </div>
);

const TotalIndicatorSection = ({ showing, total }) => (
  <div className="total-indicator-section">
    <span style={{ fontSize: 12 }}>
      Showing {showing} of {total}
    </span>
  </div>
);

const LoadingIndicator = () => (
  <div className="loading-section">
    <img alt="loading indicator" src={logo} className="App-logo" />
  </div>
);

const ContainerSections = ({ children }) => (
  <div className="container-section">{children}</div>
);

const Button = ({ title, onClick, disabled = false }) => (
  <button disabled={disabled} onClick={onClick} className="button">
    <span className="button-lbl">{title}</span>
  </button>
);
