import React, { useState, useEffect, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  AppState,
  Modal,
  ActivityIndicator,
  TextInput,
  Keyboard
} from "react-native";
import { Icon } from "react-native-elements";
import CountDown from "react-native-countdown-component";
import HomeHeader from "../components/HomeHeader";
import { colors } from "../global/styles";
import Foodcart from "../components/FoodCard";
import Filter from "../components/Filters";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { BaseUrl } from "../constants/Baseurl";
const SCREEN_WIDTH = Dimensions.get("window").width;
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useToast } from "react-native-fast-toast";

export default function Homescreen({ navigation }) {
  const [delivery, setDelivery] = useState(true);
  const [indexCheck, setIndexCheck] = useState("0");
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setchecked] = useState([]);
  const [checked2, setchecked2] = useState([]);
  const [sliderValue, setsliderValue] = useState(0);
  const [restaurantsData, setrestaurantsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast=useToast()
  //const comingTime = useRef(new Date());
  //const leavingTime = useRef(new Date());
  const appState = useRef(AppState.currentState);
  // const [currentAppState, setCurrentAppState] = useState(appState.current);
  const USER = useSelector((state) => state.LoginedUser.LoginedUser);
  const business_searched = useSelector(
    (state) => state?.businessName.businessName
  );
  // useEffect(() => {
  //   const subscription = AppState.addEventListener(
  //     "change",
  //     handleAppStateChange
  //   );
  //   return () => {
  //     subscription.remove();
  //   };
  // }, [currentAppState]);
  // const appLeavingTime = useSelector(
  //   (state) => state.Order_delivery_timer?.appLeaving_time
  // );
  // const Order_Delivery_time_Details_reset = () => {
  //   setDeliverytime(null);
  //   dispatch({
  //     type: "Set_Delivery_leaving_time_to_default",
  //   });
  // };
  // const handleAppStateChange = (nextAppState) => {
  //   if (nextAppState === "background") {
  //     appState.current = nextAppState;
  //     setCurrentAppState(appState.current);
  //     leavingTime.current = new Date();
  //     let time = leavingTime.current;
  //     let time2 = deliveryTime[0].time;
  //     console.log("leaving time called", time2);
  //     dispatch({
  //       type: "Set_Leaving_time",
  //       payload: {
  //         time,
  //       },
  //   })
  //     dispatch({
  //       type: "set_DeliveryTime",
  //       payload: {
  //         time: time2,
  //         id: 200,
  //       },
  //     });
  //   } else if (nextAppState == "active" && appLeavingTime !== []) {
  //     appState.current = nextAppState;
  //     console.log("active app state");
  //     setCurrentAppState(appState.current);
  //     comingTime.current = new Date();
  //     let appComeTime = comingTime.current;
  //     setDeliverytime((t) =>
  //       t.map((e) => ({
  //         time: e?.time - (appComeTime - appLeavingTime) / 1000,
  //         id: e.id,
  //       }))
  //     );
  //   } else {
  //     console.log("do nothing");
  //   }
  // };
  const delivery_price = [0, 10, 20, 30, 40];
  const filtered_price = [
    { name: 9, type: "$" },
    { name: 99, type: "$$" },
    { name: 999, type: "$$$" },
    { name: 9999, type: "$$$$" },
  ];
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [mainData, setMaindata] = useState([]);
  function getUnique(array) {
    var uniqueArray = [];
    // Loop through array values
    for (var value of array) {
      if (uniqueArray.indexOf(value) === -1) {
        uniqueArray.push(value);
      }
    }
    return uniqueArray;
  }

  useEffect(() => {
    console.log(business_searched);
    const getData = async () => {
      setLoading(true);
      await fetch(`http://${BaseUrl}:5000/api/v1/${business_searched}`)
        .then((response) => response.json())
        .then((json) => {
          let temp = [];
          setrestaurantsData(json.data);
          setMaindata(json.data);
          if (business_searched == "res") {
            
            json.data.map((e) => temp.push(e.foodtype));
            setFilterData(
              temp
                .filter((v, i) => temp.indexOf(v) === i)
                .map((e, i) => ({ id: i, name: e }))
            );
          }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    };
    getData();
  }, []);
  const ApplyFilter = () => {
    // console.log(sliderValue)
    let zero;
    let last;
    let val;
    if (checked.length == 0) {
      last = 9999;
      zero = 99;
    } else if (checked.length == 1) {
      last = 9999;
      zero = checked[0];
    } else if (checked.length > 1) {
      last = checked[checked.length - 1];
      zero = checked[0];
    }
    val = sliderValue;
    console.log("ok2", last);
    setrestaurantsData(
      mainData.filter(
        (e) =>
          e.deliveryTime >= val &&
          e.averagePrice > zero &&
          e.averagePrice < last
      )
    );
    // console.log(mainData.filter((e)=>e.deliveryTime>=val&&e.averagePrice>zero&&e.averagePrice<last))
    setModalVisible(false);
    setchecked([]);
    setchecked2([]);
    setsliderValue(0);
  };
  function hasWhiteSpace(s) {
    return /\s/.test(s);
  }
  function capitalizeFirstLetter(str) {
    const data = hasWhiteSpace(str);
    //console.log(data)
    //console.log(mainData.map((e) => e.restaurantName))
   // console.log(str)
    if (!data) {
      let temp=mainData.map((e) => e.restaurantName).filter((f)=>f.toLowerCase().includes(str))
     // console.log(mainData)
      if(temp?.length>0){
        setrestaurantsData(mainData.filter((e) => e.restaurantName.toLowerCase().includes(str)));
        setSearchValue("")
      }
      else{
        setSearchValue("")
        toast.show("No Data Found", {
          duration: 1000,
          style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
        });
        setrestaurantsData(mainData);
      }
      
    } else {
      const arr = str.split(" ");
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }
      const str2 = arr.join(" ");
      setrestaurantsData(mainData.filter((e) => e.restaurantName == str2));
    }
  }

  const categories = [
    {
      name: "Picked for you",
      icon: (
        <Icon name="local-police" type="material" color={"grey"} size={22} />
      ),
      check: <Icon name="check" type="material" color={"grey"} size={22} />,
    },
    {
      name: "Delivery time",
      icon: <Icon name="timer" type="material" color={"grey"} size={22} />,
      check: <Icon name="check" type="material" color={"grey"} size={22} />,
    },
    {
      name: "Rating",
      icon: (
        <Icon name="star-border" type="material" color={"grey"} size={22} />
      ),
      check: <Icon name="check" type="material" color={"grey"} size={22} />,
    },
    {
      name: "Popular",
      icon: <Icon name="whatshot" type="material" color={"grey"} size={22} />,
      check: <Icon name="check" type="material" color={"grey"} size={22} />,
    },
  ];

  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {
          <Filter
            setModalVisible={setModalVisible}
            setchecked={setchecked}
            checked={checked}
            filtered_price1={filtered_price}
            setchecked2={setchecked2}
            checked2={checked2}
            delivery_price1={delivery_price}
            categories1={categories}
            sliderValue={sliderValue}
            setsliderValue={setsliderValue}
            FilterApplied={ApplyFilter}
          />
        }
      </Modal>
      <SafeAreaView style={styles.container}>
        <HomeHeader navigation={navigation} />
        <ScrollView
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={true}
        >
          {business_searched == "res" && (
            <View
              style={{
                backgroundColor: colors.cardbackground,
                paddingBottom: 5,
              }}
            >
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setDelivery(true);
                  }}
                >
                  <View
                    style={[
                      styles.deliveryButton,
                      {
                        backgroundColor: delivery
                          ? colors.buttons
                          : colors.grey5,
                      },
                    ]}
                  >
                    <Text style={styles.deliveryText}>Delivery</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setDelivery(false);
                    //  navigation.navigate("RestaurantHomeScreen", { id: 0 });
                  }}
                >
                  <View
                    style={{
                      ...styles.deliveryButton,
                      backgroundColor: delivery ? colors.grey5 : colors.buttons,
                    }}
                  >
                    <Text style={styles.deliveryText}>Pick Up</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={{padding:1,borderWidth:1,borderColor:"#ececec"}}>

          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection:'row',
              marginTop: 10,
              alignItems: "center",
              paddingHorizontal: 5,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 7,
                backgroundColor: "white",
                width: "90%",
                alignSelf: "center",
                borderColor: "#cfcfcf",
                borderWidth: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextInput
                style={{ width: "90%" }}
                placeholder="Search By Name"
                value={searchValue}
                onFocus={() => {}}
                onChangeText={(text) => {
                  setSearchValue(text);
                }}
                returnKeyType="go"
                onSubmitEditing={() => {
                  Keyboard.dismiss;
                  capitalizeFirstLetter(searchValue)
                }}
              />
              <Icon
                name="search"
                size={25}
                onPress={() => {
                  capitalizeFirstLetter(searchValue);
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={{
                marginRight: 3,
              }}
            >
              <Icon
                type="material-community"
                name="tune"
                color={colors.grey1}
                size={26}
              />
            </TouchableOpacity>
          </View>
          {filterData.length > 0 ? (
            <View>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={filterData}
                keyExtractor={(item) => item.id}
                extraData={indexCheck}
                renderItem={({ item, index }) => (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setIndexCheck(item.id);
                      setrestaurantsData(
                        mainData.filter((e) => e.foodtype == item.name)
                      );
                      // console.log(filterData)
                    }}
                  >
                    <View
                      style={
                        indexCheck === item.id
                          ? { ...styles.smallCardSelected }
                          : { ...styles.smallCard }
                      }
                    >
                      <View>
                        <Text
                          style={
                            indexCheck === item.id
                              ? { ...styles.smallCardTextSected }
                              : { ...styles.smallCardText }
                          }
                        >
                          {item.name}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              />
            </View>
          ) : (
            <View></View>
          )}

          <View style={[styles.headerTextView, { marginTop: 5 }]}>
            <Text style={styles.headerText}>
              {business_searched === "res" ? "Free Delivery now" : ""}
            </Text>
          </View>
          {restaurantsData.length > 0 ? (
            <FlatList
              style={{ marginTop: 10, marginBottom: 10 }}
              horizontal={true}
              data={restaurantsData}
              keyExtractor={(item, index) => item._id}
              showsHorizontalScrollIndicator={true}
              renderItem={({ item }) => (
                <View style={{ marginRight: 5,width:300 }}>
                  <Foodcart
                    
                    images={{ uri: item.photo }}
                    restaurantName={item.restaurantName}
                    farAway={item.deliveryTime}
                    businessAddress={item.businessAddress}
                    averageReview={item.averageRating ? item.averageRating : 0}
                    numberOfReview={item.totalReviews ? item.totalReviews : 0}
                    OnPress={() => {
                      // console.log("res home");
                      navigation.navigate("RestaurantHomeScreen", {
                        id: item._id,
                      });
                    }}
                  />
                </View>
              )}
            />
          ) : loading == true ? (
            <ActivityIndicator size="large" />
          ) : (
            <View
              style={{
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No Result Found</Text>
            </View>
          )}

          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>
              {business_searched == "res"
                ? "Restaurants in your Area"
                : "Saloons In your Area"}
            </Text>
          </View>

          <View style={{ width: SCREEN_WIDTH, paddingTop: 10 }}>
            {restaurantsData.map((item) => (
              <View key={item.id} style={{ paddingBottom: 20 }}>
                <Foodcart
                  screenwidth={SCREEN_WIDTH * 0.95}
                  images={{ uri: item.photo }}
                  restaurantName={item.restaurantName}
                  farAway={item.deliveryTime}
                  businessAddress={item.businessAddress}
                  averageReview={item.averageRating ? item.averageRating : 0}
                  numberOfReview={item.totalReviews ? item.totalReviews : 0}
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {delivery && (
          <View style={styles.floatButton}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("RestaurantsMapScreen");
              }}
            >
              <Icon
                name="place"
                type="material"
                size={32}
                color={colors.buttons}
              />

              <Text style={{ color: colors.grey2 }}>Map</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deliveryButton: {
    paddingHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 5,
  },

  deliveryText: {
    marginLeft: 5,
    fontSize: 16,
  },

  filterView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginHorizontal: 10,
    marginVertical: 10,
  },

  clockView: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    paddingHorizontal: 5,
    marginRight: 20,
  },
  addressView: {
    flexDirection: "row",
    backgroundColor: colors.grey5,
    borderRadius: 15,
    paddingVertical: 3,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  headerText: {
    color: colors.grey2,
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  headerTextView: {
    backgroundColor: colors.grey5,
    paddingVertical: 3,
  },

  smallCard: {
    borderRadius: 10,
    backgroundColor: colors.cardbackground,
    borderColor: colors.grey5,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    width: 75,
    margin: 10,
    height: 35,
  },

  smallCardSelected: {
    borderRadius: 10,
    backgroundColor: colors.buttons,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    width: 80,
    margin: 10,
    height: 40,
  },

  smallCardTextSected: {
    fontWeight: "bold",
    color: colors.cardBackground,
  },

  smallCardText: {
    fontWeight: "bold",
    color: colors.grey2,
  },

  floatButton: {
    position: "absolute",
    bottom: 10,
    right: 15,
    backgroundColor: "white",
    elevation: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
  },
});
