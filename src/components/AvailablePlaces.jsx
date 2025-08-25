import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./Error.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  // when fetching data it is common to have these 3 states - loading, data and error
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);

  // useEffect ensures that the function is only called once when the component is mounted
  useEffect(() => {
    // define a function to fetch places from the server
    async function fetchPlaces() {
      // set the fetching state to true, used for loading message
      setIsFetching(true);

      // try and catch prevents the app from crashing if the fetch fails, try attempts to run the code contained in the try block, if it fails, the catch block is executed - the areas we're concerned about are the fetch and the if statement
      try {
        // fetch places from the server
        const response = await fetch("http://localhost:3000/places");
        const resData = await response.json();

        // if the response is not ok, throw an error
        if (!response.ok) {
          throw new Error("Failed to fetch places.");
        }
        // set the places in the state
        setAvailablePlaces(resData.places);
      } catch (error) {
        // set the error state to the error message
        setError({
          message:
            error.message || "Could not fetch places, please try again later.",
        });
      }

      // set the fetching state to false, used for loading message
      setIsFetching(false);
    }
    // call the function to fetch places from the server
    fetchPlaces();
  }, []);

  // if there is an error, show the error page
  if (error) {
    return <ErrorPage title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Loading places data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
