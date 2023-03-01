import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../storage/store-context";

const useTrackLocation = () => {
    //creating new state for displaying error messages:
    const [locationErrorMsg, setLocationErrorMsg] = useState('');

    //creating state to return Lat&Long:
    // const [latLong, setLatLong] = useState ('')
    //commented the above out, as i'm including it in useContext

    //creating state for 'Loading...'
    const [isFindingLocation, setIsFindingLocation] = useState(false);

    const {dispatch} = useContext(StoreContext);

    const success = (position) => {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        //setLatLong(`${latitude},${longitude}`);
        dispatch({
            type:ACTION_TYPES.SET_LAT_LONG,
            payload:{latLong: `${latitude},${longitude}`}
        })
        setLocationErrorMsg(''); //clearing the error message in case of success
        setIsFindingLocation(false);//no need for 'Loading...' in case of success
    };
    
    const error = () => {
        setIsFindingLocation(false);
        setLocationErrorMsg('Unable to retrieve your location') //if use doesn't grant access to geolocation
    };

    const handleTrackLocation = () => {
        setIsFindingLocation(true); // we only want the 'Loading...' state to be truw when the button is clicked

        if (!navigator.geolocation) {
            setLocationErrorMsg('Geolocation is not supported by your browser'); //if geolocation is not defined
            setIsFindingLocation(false);
          } else {
            //status.textContent = 'Locating…';
            navigator.geolocation.getCurrentPosition(success, error);
          }
    };

    return {
        // latLong,
        handleTrackLocation,
        locationErrorMsg,
        isFindingLocation,
    }
};

export default useTrackLocation;