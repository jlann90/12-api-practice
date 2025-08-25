export async function fetchAvailablePlaces() {
  // fetch places from the server
  const response = await fetch("http://localhost:3000/places");
  const resData = await response.json();

  // if the response is not ok, throw an error
  if (!response.ok) {
    throw new Error("Failed to fetch places.");
  }

  return resData.places;
}
