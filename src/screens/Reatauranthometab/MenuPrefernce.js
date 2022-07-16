import React, { Component, useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { colors } from "../../global/styles";
import Viewcartbutton from "../../components/Viewcartbutton";
import { Icon, CheckBox } from "react-native-elements";
import { BaseUrl } from "../../constants/Baseurl";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useToast } from "react-native-fast-toast";

export default function MenuPrefernce({ navigation, route }) {
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const index = 0;
  const toast = useToast();
  const { id, deliveryTime } = route.params;
  const [preferenceData2, setpreferenceData2] = useState([]);
  const [minimum_quatity, setminimum_quatity] = useState([]);
  const [meal, setmeal] = useState([]);
  const [price, setprice] = useState([]);
  const [restaurantName, setrestaurantName] = useState();
  const [data, setData] = useState([]);

  const getMenudata = async () => {
    try {
      const response = await fetch(`http://${BaseUrl}:5000/api/v1/menu/${id}`);
      const json = await response.json();
      setData(json.data);
      setpreferenceData2(json.data.pereferencedata);
      setminimum_quatity(json.data.minimumQuantity);
      setmeal(json.data.meal);
      setprice(json.data.price);
      setrestaurantName(json.data.Restaurant);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMenudata();
    // console.log('id', id);
  }, []);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [ranid, setranid] = useState(Math.floor(Math.random() * 1000) + 1);

  const selectItem = (checkeditems, checkboxValue, id, name) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...checkeditems,
        checkboxValue: checkboxValue,
        restaurantName: restaurantName,
        id: id,
        name: name,
      },
    });
  };
  const meals = {
    meal,
    price,
  };
  const CartPressed = (items, id) => {
    dispatch({
      type: "CART_PRESSED",
      payload: {
        ...items,
        restaurantName: restaurantName,
        id: id,
        deliveryTime: deliveryTime,
        quantity: 1,
      },
    });
  };

  const checkedPref = useSelector(
    (state) => state.cartReducer.selectedItems.checkeditems
  );
  const totalcheckeditems = checkedPref.length + 1;

  const total =
    checkedPref !== null &&
    checkedPref
      .map((item) => item.price)
      .reduce((prev, curr) => prev + curr, 0);
  // const totalUSD = total.toLocaleString("en", {
  //     style: "currency",
  //     currency: "USD",
  //   });

  const isFoodInCart = (food, cartItems) =>
    Boolean(cartItems.find((item) => item.name === food.name));

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={{ marginBottom: 80 }}
      >
        <View style={styles.header}>
          <Image style={styles.backgroundImage} source={{ uri: data?.image }} />
        </View>
        <View style={styles.bar}>
          <Text style={styles.title}>Choose a preference</Text>
        </View>
        <View style={styles.view12}>
          <Icon
            name="arrow-left"
            type="meterial-community"
            color={colors.cardbackground}
            size={35}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={styles.view1}>
          <Text style={styles.text1}>{data.meal}</Text>
          <Text style={styles.text2}>{data.details}</Text>
          <Text style={styles.text2}> {index}</Text>
        </View>
        <View style={styles.view2}>
          <Text style={styles.text3}>Choose a meal type</Text>
          <View style={styles.view3}>
            <Text style={styles.text4}>REQUIRED</Text>
          </View>
        </View>
        <View style={styles.view4}>
          <View style={styles.view5}>
            <View style={styles.view6}>
              <CheckBox
                center
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={true}
                checkedColor={colors.buttons}
              />
              <Text style={styles.text5}>- - - - -</Text>
            </View>
            <Text style={styles.text6}>Rs-{price}</Text>
          </View>
        </View>
        <View>
          {preferenceData2.map((item,index) => (
            <View key={index}>
              <View style={styles.view7}>
                <Text style={styles.text8}>
                  {data.preferenceTitle[preferenceData2.indexOf(item)]}
                </Text>
                {data.required[preferenceData2.indexOf(item)] && (
                  <View style={styles.view9}>
                    <Text style={styles.text7}>
                      {minimum_quatity[preferenceData2.indexOf(item)]} REQUIRED
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.view10}>
                {item.map((items, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      const id = preferenceData2.indexOf(item);
                      console.log("id=", id);
                      // console.log("itemsID",items.checked)
                      if (minimum_quatity[id] !== null) {
                        //console.log(" 1st loop enter")
                        preferenceData2[id].forEach((i) => {
                          const check = item.filter((items) =>
                            items.checked ? items : null
                          );

                          if (i._id === items._id) {
                            console.log("checked", check);
                            // console.log("condition",(check.length < minimum_quatity[id]))
                            if (check.length < minimum_quatity[id]) {
                              //  console.log("before" ,i.checked)
                              i.checked = !i.checked;
                              console.log("after", i.checked);
                              selectItem(i, i.checked, ranid, i.name);
                            } else {
                              i.checked = false;
                              selectItem(i, i.checked, ranid, i.name);
                            }
                          }
                          setpreferenceData2([...preferenceData2]);
                        });
                      } else {
                        preferenceData2[id].forEach((i) => {
                          if (i.id === items.id) {
                            i.checked = !i.checked;
                            selectItem(i, i.checked, ranid, i.name);
                            console.log("null");
                          }
                        });
                        setpreferenceData2([...preferenceData2]);
                      }
                    }}
                    style={{ margin: -5 }}
                  >
                    <View style={styles.view4}>
                      <View style={styles.view19}>
                        <View style={styles.view6}>
                          <CheckBox
                            iconStyle={{
                              borderColor: "lightgray",
                              borderRadius: 0,
                            }}
                            fillColor={colors.buttons}
                            checked={items.checked}
                          />
                          <Text
                            style={{ color: colors.grey2, marginLeft: -10 }}
                          >
                            {items.name}
                          </Text>
                        </View>
                        <Text style={styles.text6}>Rs-{items.price}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {totalcheckeditems && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            backgroundColor: "white",
            zIndex: 3,
          }}
        >
          <Viewcartbutton
            text="ADD TO CART"
            totalUSD={total}
            quantity={totalcheckeditems}
            cartpress={() => {
              CartPressed(meals, ranid);
              navigation.navigate("Homescreen");
              toast.show("Added to Cart SuccessFully", {
                duration: 1000,
                style: {
                  padding: 0,
                  backgroundColor: "rgba(120,120,120,0.9)",
                },
              });
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    width: "100%",
    backgroundColor: colors.buttons,
    overflow: "hidden",
    height: 180, //HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    width: "100%", //null,
    height: 180, //HEADER_MAX_HEIGHT,
    resizeMode: "cover",
  },
  bar: {
    backgroundColor: "transparent",
    marginTop: Platform.OS === "ios" ? 28 : 38,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 40,
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    //paddingTop: Platform.OS !== 'ios' ?
    //HEADER_MAX_HEIGHT : 0,
  },

  view1: { backgroundColor: "white", padding: 10, marginBottom: 10 },

  text1: { fontSize: 15, color: colors.grey1, fontWeight: "bold" },

  view6: { flexDirection: "row", alignItems: "center" },
  view19: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  text2: { fontSize: 14, color: colors.grey2, marginTop: 5 },
  view2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  text3: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.grey1,
    marginLeft: 10,
  },

  view3: {
    borderWidth: 3,
    borderColor: colors.grey5,
    borderRadius: 5,
    marginRight: 10,
  },

  text4: { fontWeight: "bold", color: colors.grey3, padding: 5 },

  view4: { backgroundColor: "white", marginBottom: 10 },
  view5: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  text5: { fontWeight: "bold", marginLeft: -10 },
  text6: { fontSize: 16, fontWeight: "bold" },

  view7: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  text8: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.grey1,
    marginLeft: 10,
  },

  view9: {
    borderWidth: 3,
    borderColor: colors.grey5,
    borderRadius: 5,
    marginRight: 10,
  },

  text7: { fontWeight: "bold", color: colors.lightgreen, padding: 5 },

  view10: { backgroundColor: "white", marginBottom: 10 },

  view12: { position: "absolute", marginTop: 40, left: 15 },
});
