import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Icon } from "react-native-elements";
import Viewcartbutton from "../components/Viewcartbutton";
import Payment from "./ChoosePayment";
import { useDispatch, useSelector } from "react-redux";
import { BaseUrl } from "../constants/Baseurl";
import { useToast } from "react-native-fast-toast";
import LocationPickerDemo from "../components/ChooseLocationFromMap";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

export default function Viewcartscreen({ navigation }) {
  const get_logined = useSelector((state) => state.LoginedUser.userLocation);
  const [state, setState] = useState({
    region: {
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
      latitude: get_logined.latitude,
      longitude: get_logined.longitude,
    },
  });
  const animation = React.useRef(50, 100);

  const onRegionChange = (region) => {
    setState({
      region: {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      },
    });
  };
  const dispatch = useDispatch();
  const [loading, setloading] = useState();
  const [pressed, setpressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [DeliveryAddress, setDeliveryAddress] = useState();

  const toast = useToast();
  const checkedPref = useSelector(
    (state) => state.cartReducer.selectedItems.checkeditems
  );
  const Mealitems = useSelector(
    (state) => state.cartReducer.selectedItems.items
  );
  const quantity = useSelector(
    (state) => state.cartReducer.selectedItems.quantity
  );
  const USER = useSelector((state) => state.LoginedUser.LoginedUser);
  useEffect(() => {}, []);
  const Add_quantity = (id, quantity) => {
    dispatch({
      type: "ADD_QUANTITY",
      payload: {
        quantity: quantity,
        id,
      },
    });
  };

  const RM_quantity = (id) => {
    dispatch({
      type: "REMOVE_QUANTITY",
      payload: {
        id: id,
      },
    });
  };
  const Order_placed = () => {
    dispatch({
      type: "PLACE_ORDER",
    });
  };
  const [totalPrice, setTotalPrice] = useState(
    checkedPref?.map((e) => e.price).reduce((prev, curr) => prev + curr, 0) +
      Mealitems?.map((e) => e.price).reduce((prev, curr) => prev + curr, 0)
  );

  const updateAddress = async () => {
    setloading(true);
    const response = await fetch(
      `http://${BaseUrl}:5000/api/v1/auth/updateDetails`,
      {
        method: "PUT",
        headers: {
          Accept: "apllication/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          lat: state.region.latitude,
          lng: state.region.longitude,
        }),
      }
    );
    const json = await response.json();
    setloading(false);
    console.log(json.data.DeliveryAddress);
  };
  useEffect(() => {
    updateAddress();
    //animation.current.play(0, 95);
  }, [state]);
  const authToken = useSelector((state) => state.authToken.authToken);
  const place_order = async (items, checkeditems, quantity) => {
    for (let i = 0; i < items.length; i++) {
      let ch = checkeditems
        .filter((e) => e.id == items[i].id)
        .map((e) => ({ name: e.name, price: e.price }));
      let qun = quantity
        .filter((e) => e.id == items[i].id)
        .map((e) => e.quantity);
      let res_id = checkeditems[0].restaurantName;
      await fetch(`http://${BaseUrl}:5000/api/v1/res/${res_id}/order`, {
        method: "POST",
        headers: {
          Accept: "apllication/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          productName: items[i].meal,
          productPrice: items[i].price,
          prefernceData: ch,
          quantity: qun,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setModalVisible(false),
              navigation.navigate("Homescreen"),
              ToastAndroid.show("Order Placed Successfuly", 500);
              Order_placed();
          } else {
            ToastAndroid.show(json.error, 1000);
            console.log(items[0])
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    
  };
  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {
          <Payment
            setModalVisible={setModalVisible}
            setpressed={setpressed}
            pressed={pressed}
            onPress={() => {
              place_order(Mealitems, checkedPref, quantity);
              //Order_Delivery_time_Details(),
            }}
          />
        }
      </Modal>
      {Mealitems?.length > 0 ? (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <Header title={"My-Cart"} />
            <View style={{ height: 200 }}>
              <LocationPickerDemo
                state={state}
                onRegionChange={onRegionChange}
                pinching={true}
                marker={false}
              />
            </View>
            <View style={styles.view1}>
              <View>
                <Text
                  style={{ fontSize: 22, fontWeight: "600", marginTop: 10 }}
                >
                  Delivery Details
                </Text>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      padding: 5,
                      borderColor: "#ececec",
                      borderWidth: 1,
                      borderRadius: 100,
                      width: 70,
                    }}
                  >
                    {" "}
                    Delivery
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 5,
                  }}
                >
                  <View style={{ width: "20%", padding: 0 }}>
                    <Icon name="place" type="material" size={20} />
                  </View>
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: "#ececec",
                      width: "80%",
                      padding: 10,
                    }}
                  >
                    <Text> NY ,DC </Text>
                    <Icon name="navigate-next" type="material" size={20} />
                  </View>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 5,
                  }}
                >
                  <View style={{ width: "20%", padding: 0 }}>
                    <Icon name="home" type="material" size={20} />
                  </View>
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: "#ececec",
                      width: "80%",
                      padding: 10,
                    }}
                  >
                    <Text>
                      {" "}
                      {loading ? (
                        <ActivityIndicator size="small" />
                      ) : DeliveryAddress ? (
                        DeliveryAddress
                      ) : (
                        "Choose Delivery Address"
                      )}
                    </Text>

                    <Icon name="navigate-next" type="material" size={20} />
                  </View>
                </View>
              </View>

              {Mealitems.length > 0 &&
                Mealitems?.map((item, index1) => (
                  <View key={index1}>
                    <View style={styles.view2}>
                      <View style={styles.view3}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            {" "}
                            {item.meal}
                          </Text>
                          <Text style={styles.text3}>Rs-{item.price}</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.text2}>
                            {checkedPref.find((e) => e.id == item.id)
                              ? checkedPref
                                  .filter((e) => e.id == item.id)
                                  .map((e) => e.name + ", ")
                              : "No items selected"}
                          </Text>
                        </View>
                      </View>

                      <View style={{ padding: 10 }}>
                        <Image style={styles.image} source={item.image} />
                      </View>
                      <View
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            RM_quantity(item.id);
                            setTotalPrice(totalPrice / 2);
                          }}
                          enable={quantity
                            .filter((e) => e.id == item.id)
                            .map((a) => (a = a.quantity))}
                        >
                          <View style={styles.addrem}>
                            <Icon
                              name="remove"
                              type="material"
                              color="black"
                              size={25}
                            />
                          </View>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, paddingTop: -3 }}>
                          {quantity
                            .filter((e) => e.id == item.id)
                            .map((a) => (a = a.quantity))}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            Add_quantity(item.id, 2);
                            setTotalPrice(totalPrice * 2);
                          }}
                        >
                          <View style={styles.addrem}>
                            <Icon
                              name="add"
                              type="material"
                              color="black"
                              size={25}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
            </View>

            <View
              style={{
                paddingVertical: 10,
                backgroundColor: "white",
                borderTopWidth: 3,
                borderColor: "#ececec",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 5,
                }}
              >
                <Text style={{ color: "grey" }}>
                  {Mealitems.length > 0 && "SubTotal"}{" "}
                </Text>
                <Text style={{ color: "grey" }}>
                  Rs-{totalPrice && totalPrice}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 5,
                }}
              >
                <Text style={{ color: "grey" }}>
                  {Mealitems.length > 0 && "Delivery Charge"}{" "}
                </Text>
                <Text style={{ color: "grey" }}>
                  {Mealitems.length > 0 && "Rs-50"}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {Mealitems.length > 0 && "Total"}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Rs-{totalPrice && totalPrice + 40}
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <View
          style={{
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "600", paddingTop: 10 }}>
            Empty Cart
          </Text>
          <LottieView
            style={styles.Lottie}
            source={require("../../aseets/Lottieview/Empty-cart.json")}
            autoPlay={true}
            loop={true}
          />
        </View>
      )}
      {Mealitems.length > 0 && (
        <Viewcartbutton
          text="Proceed to Payment"
          quantity={Mealitems.length}
          cartpress={() => {
            setModalVisible(true);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  Lottie: {
    height: 500,
    width: 300,
    paddingTop: 20,
    alignSelf: "center",
  },
  view1: {
    backgroundColor: "white",
    borderBottomWidth: 3,
    borderBottomColor: "#fafafa",
    paddingBottom: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },

  view2: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 5,
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },

  view3: { flex: 6, justifyContent: "space-between", paddingBottom: 10 },

  text1: {
    fontSize: 15,
    color: "grey",
    fontWeight: "bold",
  },

  text2: {
    fontSize: 15,
    color: "grey",
    marginRight: 2,
  },

  text3: {
    fontSize: 15,
    color: "black",
  },

  image: {
    flex: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    height: 40,
    width: Dimensions.get("window").width / 5,
  },
  restname: {
    paddingVertical: 5,
    backgroundColor: "#fafafa",
    shadowColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 15,
    paddingLeft: 5,
  },
  addrem: {
    backgroundColor: "transparent",
    borderColor: "#eceeec",
    borderRadius: 3,
    marginLeft: 5,
  },
});
