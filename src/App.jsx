import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import styles from "./App.module.css";
import AddMovie from "./components/AddMovie";

function App() {
  // const dummyMovies = [
  //   {
  //     id: 1,
  //     title: 'Some Dummy Movie',
  //     openingText: 'This is the opening text of the movie',
  //     releaseDate: '2021-05-18',
  //   },
  //   {
  //     id: 2,
  //     title: 'Some Dummy Movie 2',
  //     openingText: 'This is the second opening text of the movie',
  //     releaseDate: '2021-05-19',
  //   },
  // ];

  //fetching data from star wars api
  const [dummyMovies, setDummyMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDataFromApi = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const fetchedObject = await fetch(
        "https://react-http-48867-default-rtdb.firebaseio.com/MOVIES.json"
      );
      if (!fetchedObject.ok) {
        throw new Error("Something Went Wrong!");
      }
      const data = await fetchedObject.json();
      // console.log(data);
      let requiredData = [];
      for (let dataobj in data) {
        requiredData.push({
          id: dataobj,
          title: data[dataobj]["title"],
          openingText: data[dataobj].openingText,
          releaseDate: data[dataobj]["releaseDate"] || "-",
        });
      }
      // const requiredData = data.results.map((item) => {
      //   return {
      //     id: item["episode_id"],
      //     title: item.title,
      //     openingText: item.opening_crawl,
      //     releaseDate: item.release_date,
      //   };
      // });
      setDummyMovies(requiredData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchDataFromApi();
  }, [fetchDataFromApi]);

  const addMovieHandler = async (movie) => {
    // console.log(movie);
    const response = await fetch(
      "https://react-http-48867-default-rtdb.firebaseio.com/MOVIES.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(await response.json());
  };

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>

      <section>
        <button onClick={fetchDataFromApi}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && !error && <MoviesList movies={dummyMovies} />}
        {isLoading ? "loading..." : ""}
        {error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
