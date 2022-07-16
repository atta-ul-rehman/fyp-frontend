import getDirections from "react-native-google-maps-directions";

export const handleGetDirections = (sorc, dest) => {
 // console.log(dest);
  const data = {
    source: {
      latitude: sorc.latitude,
      longitude: sorc.longitude,
    },
    destination: {
      latitude: dest.latitude,
      longitude: dest.longitude,
    },
    params: [
      {
        key: "travelmode",
        value: "driving", // may be "walking", "bicycling" or "transit" as well
      },
      {
        key: "dir_action",
        value: "navigate", // this instantly initializes navigation using the given travel mode
      },
    ],
    waypoints: [
      {
        latitude: dest.latitude,
        longitude: dest.longitude,
      },
      {
        latitude: dest.latitude,
        longitude: dest.longitude,
      },
      {
        latitude: dest.latitude,
        longitude: dest.longitude,
      },
    ],
  };

  getDirections(data);
};
