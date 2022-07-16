import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import MapView from "react-native-maps";
import { Button, Icon } from "react-native-elements";
import StarRating from "../components/StarRating";
import { colors } from "../global/styles";
import MapFilter from "../components/MapFilter";
import { BaseUrl } from "../constants/Baseurl";
import Loading from "../components/Loader";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export default function RestaurantsMapScreen({ navigation }) {
  const [restaurantsData, setrestaurantsData] = useState([]);
  const [categories2, setCategories2] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    const getData = async () => {
      setLoading(true);
      await fetch(`http://${BaseUrl}:5000/api/v1/res`)
        .then((response) => response.json())
        .then((json) => {
          setrestaurantsData(json.data);
          setCategories2(
            json.data
              .map((e) => ({
                name: e.foodtype,
              }))
              .filter((f) => f.name !== undefined)
          );
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setLoading(false), console.log(restaurantsData.length);
        });
    };
    setLoading(false);
    getData();
  }, []);

  const [radius, setRadius] = useState();
  const initialMapState = {
    region: {
      latitude: 31.558,
      longitude: 74.35071,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    },
  };
  const [state, setState] = useState(initialMapState);
  const onRegionChange = (region) => {
    setState({
      region: {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.045,
        longitudeDelta: 0.045,
      },
    });
    // console.log("region changed", parseFloat("556"));
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [circleVisible, setCircleVisible] = useState(false);
  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);
  const _map = useRef(null);
  const _scrollView = useRef(null);

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= restaurantsData.length) {
        index = restaurantsData.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const { coordinates } = restaurantsData[index].location;
          _map.current.animateToRegion(
            {
              latitude: coordinates[0],
              longitude: coordinates[1],
              latitudeDelta: state.region.latitudeDelta,
              longitudeDelta: state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  });
  useEffect(() => {
    setCircleVisible(false);
  }, []);
  const interpolations = restaurantsData.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp",
    });

    return { scale };
  });

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === "ios") {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
  };
  const getFilteredData = async () => {
    setLoading(true);
    await fetch(
      `http://${BaseUrl}:5000/api/v1/res/radius/${state.region.latitude}/${
        state.region.longitude
      }/${radius / 2}`
    )
      .then((response) => response.json())
      .then((json) => {
        setrestaurantsData(json.data);
        setCategories2(
          json.data
            .map((e) => ({
              name: e.foodtype,
            }))
            .filter((f) => f.name !== undefined)
        );
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const RadiusFilter = () => {
    getFilteredData();
    restaurantsData.filter((data) => data);
    setModalVisible(false);
    setCircleVisible(true);
    setRadius(parseInt(radius));
    _map.current.animateToRegion(
      {
        latitude: state.region.latitude,
        longitude: state.region.longitude,
        latitudeDelta: 0.45,
        longitudeDelta: 0.45,
      },
      650
    );
  };
  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <MapFilter
          state={state}
          radius={radius}
          setRadius={setRadius}
          pressed={RadiusFilter}
          onRegionChange={onRegionChange}
          setModalVisible={setModalVisible}
        />
      </Modal>
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Loading size={50} />
        </View>
      ) : (
        <View>
          <MapView
            ref={_map}
            initialRegion={state.region}
            style={{
              width,
              height,
            }}
          >
            {restaurantsData.map((marker, index) => {
              const scaleStyle = {
                transform: [
                  {
                    scale: interpolations[index].scale,
                  },
                ],
              };

              return (
                <MapView.Marker
                  key={index}
                  coordinate={{
                    latitude: marker.location.coordinates[0],
                    longitude: marker.location.coordinates[1],
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                  }}
                  onPress={(e) => onMarkerPress(e)}
                >
                  <Animated.View style={[styles.markerWrap]}>
                    <Animated.Image
                      source={require("../assets/map_marker.png")}
                      style={[styles.marker, scaleStyle]}
                      resizeMode="cover"
                    />
                  </Animated.View>
                </MapView.Marker>
              );
            })}
            {radius !== 0 && (
              <MapView.Circle
                center={state.region}
                radius={radius ? radius * 1000 : 0}
                strokeWidth={1}
                strokeColor={"#1a66ff"}
                fillColor={"rgba(230,238,255,0.5)"}
              />
            )}
          </MapView>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search here"
              placeholderTextColor="#000"
              autoCapitalize="none"
              style={{ flex: 1, padding: 0 }}
            />
            <Icon name="search" type="material" size={28} />
          </View>
          <View style={styles.Filter}>
            <Icon
              type="material-community"
              name="tune"
              color={colors.grey1}
              size={35}
              onPress={() => setModalVisible(true)}
            />
          </View>

          <ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={true}
            height={50}
            style={styles.chipsScrollView}
            contentInset={{
              // iOS only
              top: 0,
              left: 0,
              bottom: 0,
              right: 20,
            }}
            contentContainerStyle={{
              paddingRight: Platform.OS === "android" ? 20 : 0,
            }}
          >
            {categories2.map((category, index) => (
              <TouchableOpacity key={index} style={styles.chipsItem}>
                {category.icon}
                <Text>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Animated.ScrollView
            ref={_scrollView}
            horizontal
            pagingEnabled
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={true}
            snapToInterval={CARD_WIDTH + 20}
            snapToAlignment="center"
            style={styles.scrollView}
            contentInset={{
              top: 0,
              left: SPACING_FOR_CARD_INSET,
              bottom: 0,
              right: SPACING_FOR_CARD_INSET,
            }}
            contentContainerStyle={{
              paddingHorizontal:
                Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
              paddingVertical: 40,
            }}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: mapAnimation,
                    },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
          >
            {restaurantsData.map((marker, index) => (
              <View style={styles.card} key={index}>
                <Image
                  source={{ uri: marker.photo }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>
                    {marker.restaurantName}
                  </Text>
                  <StarRating
                    ratings={marker?.averageReview ? marker.averageReview : 0}
                    reviews={marker?.numberOfReview ? marker.numberOfReview : 0}
                  />
                  <Text numberOfLines={1} style={styles.cardDescription}>
                    {marker.businessAddress}
                  </Text>
                  <View style={styles.button}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("RestaurantHomeScreen", {
                          id: index,
                          restaurantName: marker.restaurantName,
                        });
                      }}
                      style={[
                        styles.signIn,
                        {
                          borderColor: "#FF6347",
                          borderWidth: 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.textSign,
                          {
                            color: "#FF6347",
                          },
                        ]}
                      >
                        Order Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </Animated.ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    height: "100%",
  },
  // Callout bubble
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
    // marginBottom: -15
  },
  // Character name
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Character image
  image: {
    width: "100%",
    height: 80,
  },
  container: {
    flex: 1,
  },
  Filter: {
    position: "absolute",
    marginTop: Platform.OS === "ios" ? 40 : 30,
    alignSelf: "flex-end",
    borderRadius: 5,
    padding: 8,
  },
  searchBox: {
    position: "absolute",
    marginTop: Platform.OS === "ios" ? 40 : 35,
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "83%",
    alignSelf: "center",
    borderRadius: 5,
    padding: 8,
    right: 45,
  },
  chipsScrollView: {
    position: "absolute",
    top: Platform.OS === "ios" ? 90 : 88,
    paddingHorizontal: 10,
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: "center",
    marginTop: 5,
  },
  signIn: {
    width: "100%",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
