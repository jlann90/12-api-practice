import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

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
        const places = await fetchAvailablePlaces();

        // get the current position of the user
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );

          // set the places in the state
          setAvailablePlaces(sortedPlaces);
          // set the fetching state to false, used for loading message
          setIsFetching(false);
        });
      } catch (error) {
        // set the error state to the error message
        setError({
          message:
            error.message || "Could not fetch places, please try again later.",
        });
        // set the fetching state to false, used for loading message
        setIsFetching(false);
      }
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
