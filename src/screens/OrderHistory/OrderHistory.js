import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";

import { SwipeListView } from "react-native-swipe-list-view";
import { Icon } from "react-native-elements";
import { useToast } from "react-native-fast-toast";
import { useSelector } from "react-redux";
import { BaseUrl } from "../../constants/Baseurl";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";

export default function OrderHistory({ navigation }) {
  const isFocused=useIsFocused()
  const toast = useToast();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState();
  const [messages2, setmessages2] = useState([]);
  const USER = useSelector((state) => state.LoginedUser.LoginedUser);
  let userId = USER[0]._id;
  const getOrders = async () => {
    try {
      const response = await fetch(
        `http://${BaseUrl}:5000/api/v1/user/${USER[0]._id}/order`
      );
      const json = await response.json();
      //console.log("sdsdsd",json.data)
      const data = json?.data?.filter((e) => e.canView.user = true);
     // console.log(data)
      setUser(json.data.map((e) => e.user));
      setmessages2(
        data.map((NotificationItem, index) => ({
          id: `${NotificationItem._id}`,
          key: `${index}`,
          title: NotificationItem?.Restaurant
            ? `${NotificationItem.Restaurant.restaurantName}`
            : `${NotificationItem?.Saloon?.restaurantName}`,
          details: NotificationItem.createdAt.split(/[T]+/).splice(0, 1).join(),
          Status: NotificationItem?.Status,
          user: NotificationItem.user,
          IsRes: NotificationItem?.Restaurant ? true : false,
          reservation:NotificationItem?.Reservation?"Reservation":null
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const infoMessage = (msg) => {
    toast.show(msg, {
      duration: 1000,
      style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
    });
  };
  useEffect(() => {
    getOrders();
  }, [isFocused]);
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = async (rowMap, rowKey, id) => {
    closeRow(rowMap, rowKey);
    console.log(id);
    const newData = [...messages2];
    const prevIndex = messages2.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setmessages2(newData);
    await fetch(`http://${BaseUrl}:5000/api/v1/order${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        canView: {
          user: false,
          Restaurant: true,
          Saloon: true,
        },
      }),
    });
  };

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const onLeftActionStatusChange = (rowKey) => {
    console.log("onLeftActionStatusChange", rowKey);
  };

  const onRightActionStatusChange = (rowKey) => {
    console.log("onRightActionStatusChange", rowKey);
  };

  const onRightAction = (rowKey) => {
    console.log("onRightAction", rowKey);
  };

  const onLeftAction = (rowKey) => {
    console.log("onLeftAction", rowKey);
  };

  const VisibleItem = (props) => {
    const {
      data,
      rowHeightAnimatedValue,
      removeRow,
      leftActionState,
      rightActionState,
    } = props;

    if (rightActionState) {
      Animated.timing(rowHeightAnimatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        removeRow();
      });
    }

    return (
      <Animated.View
        style={[styles.rowFront, { height: rowHeightAnimatedValue }]}
      >
        <TouchableOpacity
          style={styles.rowFrontVisible}
          onPress={() => {
data.item.reservation==null?
            data.item.Status !== "canceled" && data.item.Status !== "completed"
              ? data.item.IsRes
                ? navigation.navigate("OrderStatus", {
                    id: data.item.id,
                    user_id: data.item.user,
                  })
                : navigation.navigate("SaloonOrder", {
                    id: data.item.id,
                    user_id: data.item.user,
                  })
              : infoMessage(data.item.Status)
              :infoMessage("Be Patient Resevation is "+data.item.Status)
          }}
          underlayColor={"#aaa"}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 20 }}> {data.item.title} </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: data?.item?.Status == "canceled" ? "red" : "green",
              }}
            >
              {" "}
              {data?.item?.Status}
            </Text>
          </View>
          <Icon name="navigate-next" size={20} />
        </TouchableOpacity>
        <Text style={[styles.details, {}]} numberOfLines={1}>
          {data.item.details}
        </Text>
        <Text style={{position:'absolute',top:2,right:4}}>
{data.item.reservation}
        </Text>
      </Animated.View>
    );
  };

  const renderItem = (data, rowMap) => {
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <VisibleItem
        data={data}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        removeRow={() => deleteRow(rowMap, data.item.key, data.item.id)}
      />
    );
  };

  const HiddenItemWithActions = (props) => {
    const {
      swipeAnimatedValue,
      leftActionActivated,
      rightActionActivated,
      rowActionAnimatedValue,
      rowHeightAnimatedValue,
      onClose,
      onDelete,
    } = props;

    if (rightActionActivated) {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 75,
        useNativeDriver: false,
      }).start();
    }

    return (
      <Animated.View
        style={[styles.rowBack, { height: rowHeightAnimatedValue }]}
      >
        <Text>Left</Text>
        {!leftActionActivated && (
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            onPress={onClose}
          >
            <Icon
              name="highlight-off"
              size={25}
              style={styles.trash}
              color="#fff"
            />
          </TouchableOpacity>
        )}
        {!leftActionActivated && (
          <Animated.View
            style={[
              styles.backRightBtn,
              styles.backRightBtnRight,
              {
                flex: 1,
                width: rowActionAnimatedValue,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={onDelete}
            >
              <Animated.View
                style={[
                  styles.trash,
                  {
                    transform: [
                      {
                        scale: swipeAnimatedValue.interpolate({
                          inputRange: [-90, -45],
                          outputRange: [1, 0],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Icon name="delete-outline" size={25} color="#fff" />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onClose={() => closeRow(rowMap, data.item.key)}
        onDelete={() => deleteRow(rowMap, data.item.key, data.item.id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={"My-orders"} />

      <View
        style={{
          borderTopWidth: 1,
          marginBottom: 5,
          backgroundColor: "white",
        }}
      />
      <SwipeListView
        data={messages2}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-150}
        disableRightSwipe
        onRowDidOpen={onRowDidOpen}
        leftActivationValue={100}
        rightActivationValue={-200}
        leftActionValue={0}
        rightActionValue={-500}
        onLeftAction={onLeftAction}
        onRightAction={onRightAction}
        onLeftActionStatusChange={onLeftActionStatusChange}
        onRightActionStatusChange={onRightActionStatusChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f4f4",
    flex: 1,
  },
  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 10,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: "flex-end",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: "#1f65ff",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#666",
    paddingHorizontal: 7,
  },
  details: {
    fontSize: 12,
    color: "#999",
    position: "absolute",
    right: 4,
    bottom: 2,
  },
});
