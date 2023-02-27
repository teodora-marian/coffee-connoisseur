import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (query, latLong, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
  };

const getListOfCoffeeStorePhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'coffee shop',
        perPage: 30,
      });
      const unsplashResults = photos.response?.results || [];
      return unsplashResults.map((result) => result.urls["small"]);
}
  
export const fetchCoffeeStores = async (latLong = '46.769587%2C23.592547', limit=6) => {
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores("coffee",latLong,limit),
    options
  );
  const data = await response.json();
  console.log(data);

  return data.results.map((result, idx) => {
      return {
          id: result.fsq_id,
          name: result.name,
          address: result.location.address,
          locality: result.location.locality,
          imgUrl: photos.length >0 ? photos[idx] : null,
      }
  });

  //.catch((err) => console.error(err));
};