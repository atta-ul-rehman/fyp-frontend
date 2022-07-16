import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Share,
  Linking,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Icon } from "react-native-elements";
import { colors, parameters } from "../global/styles";
import RestaurantHeader from "../components/RestaurantHeader";
import Business_info_component from "../RestaurantHomeComponent/Business_info_component";
import Highlights_from_business from "../RestaurantHomeComponent/Highlights_from_business";
import LocationPickerDemo from "../components/ChooseLocationFromMap";
import ViewPhotocard from "../RestaurantHomeComponent/ViewPhotocard";
import ViewMorebutton from "../components/ViewMoreButton";
import Reviews from "../RestaurantHomeComponent/Reveiw";
import { handleGetDirections } from "../Helpers/getDirections";
import { useSelector, useDispatch } from "react-redux";
import { BaseUrl } from "../constants/Baseurl";
import { SafeAreaView } from "react-native-safe-area-context";
const SCREEN_WIDTH = Dimensions.get("window").width;
const initialLayout = SCREEN_WIDTH;
const RestaurantHomeScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [index, setIndex] = useState(0);
  const activeUserLocation = useSelector(
    (state) => state.LoginedUser.userLocation
  );
  const business_searched = useSelector(
    (state) => state?.businessName.businessName
  );
  const [reviewAdded, setreviewAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const url = "https://awesome.contents.com/";
  const title = "Awesome Contents";
  const message = "Please check this out.";
  const USER = useSelector((state) => state.LoginedUser.LoginedUser);
  const options = {
    title,
    url,
    message,
  };
  const [restphotos, setRestphotos] = useState([]);
  const onShare = async () => {
    const link="FYP-FRONTEND-12617088e4824d809eedcc3cbcb273b8-signed.apk"
    try {

      const result = await Share.share({
        message:
          "Download This Falla from playstore Now!",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const [restaurantDistance, setrestaurantDistance] = useState();
  const [mobileno, setmobilebo] = useState("89985509");
  const [restaurantsData, setrestaurantsData] = useState();
  const getRestPhotos = async () => {
    await fetch(
      `http://${BaseUrl}:5000/api/v1/${business_searched}/${id}/photo`
    )
      .then((response) => response.json())
      .then((json) => {
        setRestphotos(json.data);
      })
      .catch((error) => console.error(error));
  };

  const getDistanceFromRestaurant = async () => {
    {
      loading &&
        (await fetch(
          `https://www.mapquestapi.com/directions/v2/routematrix?key=nkX0pCcAg1zmkKBa4jPLZKavKIqZDlvd&narrativeType=microformat&from=${activeUserLocation.latitude},${activeUserLocation.longitude}&to=${state.region.latitude},${state.region.longitude}`
        )
          .then((response) => response.json())
          .then((json) => {
            setrestaurantDistance(json.distance);
            console.log(json);
          })
          .catch((error) => console.error(error)));
    }
  };
  const [state, setState] = useState();
  useEffect(() => {
    const getData = async () => {
      await fetch(`http://${BaseUrl}:5000/api/v1/${business_searched}/${id}`)
        .then((response) => response.json())
        .then((json) => {
          setrestaurantsData(json.data);
          setState({
            region: {
              latitude: json.data.location.coordinates[0],
              longitude: json.data.location.coordinates[1],
              latitudeDelta: 0.045,
              longitudeDelta: 0.045,
            },
          });
          setLoading(true);
        })
        .catch((error) => console.error(error));
    };
    getData();
    //console.log("activeUserLocation", activeUserLocation);
    getRestPhotos();
  }, [id]);
  useEffect(() => {
    getDistanceFromRestaurant();
  }, [loading]);
  const dialCall = ({ phn }) => {
    let phoneNumber = mobileno;
    if (Platform.OS === "android") {
      phoneNumber = "tel:${" + mobileno + "}";
    } else {
      phoneNumber = "telprompt:${" + mobileno + "}";
    }
    Linking.openURL(phoneNumber);
  };

  const menuePressed = () => {
    navigation.navigate("RestaurantStack", {
      screen: "MenuProductScreen",
      params: {
        id: restaurantsData?._id,
        deliveryTime: restaurantsData?.deliveryTime,
      },
    });
  };
  const saloonPressed = () => {
    navigation.navigate("HairdryStack", {
      screen: "HairdryRequestQuote",
      params: {
        id: restaurantsData?._id,
        deliveryTime: restaurantsData?.deliveryTime,
      },
    });
  };
  const businessName = useSelector((state) => state.businessName.businessName);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cardbackground }}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <View>
          <RestaurantHeader
            id={id}
            navigation={navigation}
            image={restaurantsData?.photo}
          />
        </View>
        <View
          style={{
            borderBottomColor: colors.grey2,
            borderBottomWidth: 1,
          }}
        />

        {restaurantsData?.discount ? (
          <View style={styles.view1}>
            <Text style={styles.text1}>
              GET {restaurantsData?.discount}% OFF ON FOOD TOTAL
            </Text>
          </View>
        ) : (
          <View style={styles.view1}>
            <Text style={styles.text1}>NO Discount Offered ON FOOD</Text>
          </View>
        )}

        <View
          style={{
            borderBottomColor: colors.grey2,
            borderBottomWidth: 1,
          }}
        />

        <View style={styles.view2}>
          <View style={styles.view3}>
            <Text style={styles.text2}>{restaurantsData?.restaurantName}</Text>
            <Text style={styles.text3}>{restaurantsData?.foodType}</Text>
            <View style={styles.view4}>
              <Icon
                name="star"
                type="material-community"
                color={colors.grey3}
                size={15}
              />
              <Text style={styles.text4}>{restaurantsData?.averageRating}</Text>
              <Text style={styles.text5}>{restaurantsData?.totalReview}</Text>
              <Icon
                name="map-marker"
                type="material-community"
                color={colors.grey3}
                size={15}
              />
              <Text style={styles.text6}>
                  {restaurantDistance ? restaurantDistance[1]: 0 } mi away  
              </Text>
            </View>
          </View>

          <View style={styles.view5}>
            <Text style={styles.text6}>Collect</Text>
            <View style={styles.view7}>
              <Text style={styles.text7}>{restaurantsData?.collectTime}</Text>
              <Text style={styles.text8}>min</Text>
            </View>
          </View>
          <View style={styles.view5}>
            <Text style={styles.text6}>Delivery</Text>
            <View style={styles.view9}>
              <Text style={styles.text9}>{restaurantsData?.deliveryTime}</Text>
              <Text>min{}</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.view1_u}>
          <View style={styles.view2_u}>
            <StyledButton
              name="Add"
              icon="add-a-photo"
              clicked={() => {
                console.log(activeUserLocation);
              }}
            />
            <StyledButton
              name="Menu"
              icon="save"
              clicked={() => {
                businessName === "Saloon" ? saloonPressed() : menuePressed();
              }}
            />
            <StyledButton name="Share" icon="ios-share" clicked={onShare} />
            <StyledButton
              name="Reserve Now"
              icon="book-online"
              clicked={() => {
                businessName=="res"&&
                navigation.navigate("RestResevation",{id:restaurantsData._id})
              }}
            />
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
              padding: 5,
              flexDirection: "row",
              marginRight: 7,
              borderBottomColor: "#eceeec",
              borderBottomWidth: 1,
            }}
          >
            <Icon name="verified" type="material" color="lightblue" size={50} />
            <Text style={{ marginTop: 12, marginLeft: 5, fontSize: 16 }}>
              {" "}
              Verfied Lisence{" "}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                marginTop: 10,
                right: 0,
                padding: 5,
                borderWidth: 1,
                borderColor: "#cfcfcf",
                position: "absolute",
              }}
            >
              <Text style={{ color: "black", fontSize: 13 }}>
                See Lisence Info
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingTop: 5,
              alignItems: "center",
            }}
          >
            <Business_info_component
              website={restaurantsData?.email}
              phone_Number={restaurantsData?.phone}
              business_name={business_searched}
            />
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
            <Text
              style={{
                color: "black",
                fontSize: 22,
                fontWeight: "700",
                paddingVertical: 10,
              }}
            >
              From The Business
            </Text>
            <Text>
              hdksd kabdkjasdbksd kjdkjsa kdksd kjahdksahd kadksa kashdksad
              kasdkasd kashdkas
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 0 }}>
          {state && <LocationPickerDemo state={state} pinching={false} />}
        </View>
        <View style={{ marginTop: 5, paddingHorizontal: 10 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 10,
              paddingHorizontal: 5,
              borderBottomWidth: 1,
              borderBottomColor: "#ececec",
              alignItems: "center",
            }}
            onPress={() => {
              handleGetDirections(activeUserLocation, state.region);
              console.log(state.region);
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "500" }}>
              Get Directions
            </Text>
            <Icon name="directions" type="material" size={36} color={"grey"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 15,
              paddingBottom: 5,
              paddingHorizontal: 5,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "400" }}>
              {restaurantsData?.businessAddress}
            </Text>
           
              <Text style={{ fontSize: 15, fontWeight: "300" }}>
                {restaurantDistance? restaurantDistance[1] :0 } mi 
              </Text>
            
          </TouchableOpacity>
        </View>

        <View style={styles.divider}></View>
        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <Text style={{ fontSize: 23, fontWeight: "700", marginBottom: 10 }}>
            Business photos
          </Text>
          {restphotos && (
            <FlatList
              horizontal={true}
              data={restphotos}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={true}
              renderItem={({ item }) => (
                <ViewPhotocard
                  image={item.image}
                  type={item.type}
                  totalPhotos={restphotos?.length}
                  onPress={() => {
                    navigation.navigate("TopTabNavigator", {
                      data: restphotos,
                    });
                  }}
                />
              )}
            />
          )}
        </View>
        <View style={styles.divider}></View>
        <Highlights_from_business />
        <View style={styles.divider}></View>
        {restaurantsData && (
          <Reviews
            id={restaurantsData?._id}
            resName={restaurantsData?.restaurantName}
            averageRating={restaurantsData?.averageRating}
            reviewAdded={reviewAdded}
            setreviewAdded={setreviewAdded}
          />
        )}
      </ScrollView>
      <View style={styles.floatButton}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ChatScreen", {
              screen: "Chat",
              params: {
                resId: restaurantsData?._id,
                resName: restaurantsData?.restaurantName,
                resPhoto: restaurantsData?.photo,
                conversation_Id: restaurantsData?._id + "-" + USER[0]._id,
              },
            });
          }}
        >
          <Image
            source={require("../../aseets/Rstuarents/icons8-chat-50.png")}
            style={{ height: 35, width: 35, alignSelf: "center" }}
          />
          <Text style={{ color: colors.grey2 }}>Chat Now</Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center" }}>
        <ViewMorebutton
          title={
            business_searched == "saloon" ? "Book Appointment" : "Start Order"
          }
          OnPress={() => {
            business_searched == "saloon" ? saloonPressed() : menuePressed();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default RestaurantHomeScreen;
const StyledButton = ({ icon, name, clicked }) => (
  <TouchableOpacity
    View
    style={{
      padding: 6,
      borderWidth: 1,
      borderColor: "#cfcfcf",
      flexDirection: "row",
    }}
    onPress={clicked}
  >
    <Icon
      name={icon}
      color="grey"
      type="material"
      size={18}
      style={{ paddingRight: 3 }}
    />
    <Text style={{ color: "grey", fontSize: 13 }}>{name}</Text>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  container: { flex: 1 },
  view1_u: {
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: "#eceeec",
    marginHorizontal: 5,
    marginTop: 15,
  },

  view2_u: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-evenly",
    borderBottomWidth: 5,
    borderBottomColor: "#eceeec",
  },

  divider: {
    borderWidth: 4,
    borderColor: "#ececec",
    marginTop: 20,
  },
  view1: {
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  text1: { color: "green", fontSize: 14, fontWeight: "bold" },
  floatButton: {
    position: "absolute",
    bottom: 60,
    right: 15,
    backgroundColor: "white",
    elevation: 10,
    width: 80,
    height: 80,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  view2: {
    flexDirection: "row",
    flex: 1,
    marginBottom: 5,
    marginHorizontal: 10,
    justifyContent: "space-between",
    backgroundColor: colors.cardBackground,
    paddingTop: 2,
  },

  view3: { flex: 8 },

  text2: { fontSize: 20, fontWeight: "bold", color: colors.grey1 },

  text3: { fontSize: 15, color: colors.grey3 },

  view4: { flexDirection: "row", alignItems: "center", marginTop: 2 },

  text4: {
    fontFamily: "serif",
    fontSize: 13,
    color: colors.grey3,
    marginLeft: 2,
  },

  text5: {
    fontFamily: "serif",
    fontSize: 13,
    color: colors.grey3,
    marginLeft: 2,
    marginRight: 5,
  },
  text6: {
    fontSize: 13,
    color: colors.grey3,
    marginLeft: 0,
  },

  view5: { flex: 3, alignItems: "center", paddingTop: 3 },

  view7: {
    width: 40,
    height: 40,
    alignItems: "center",
    borderRadius: 20,
    justifyContent: "space-evenly",
  },

  text7: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    marginTop: 5,
  },

  text8: { fontSize: 13, color: colors.black, marginBottom: 5 },

  text9: { fontSize: 15, fontWeight: "bold", color: colors.cardBackground },

  view9: {
    width: 40,
    height: 40,
    backgroundColor: colors.buttons,
    alignItems: "center",
    borderRadius: 20,
    justifyContent: "space-evenly",
  },
});
