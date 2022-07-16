import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  Button,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import { BaseUrl } from "../../constants/Baseurl";
import { Icon } from "react-native-elements";
import Header from "../../components/Header";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
const AllChats = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [createdAt, setCreatedAt] = useState([]);
  const USER = useSelector((state) => state.LoginedUser.LoginedUser);
  let userId = USER[0]._id;
  const isFocusd = useIsFocused();
  useEffect(() => {
    const getMessage = async () => {
      await fetch(
        `http://${BaseUrl}:5000/api/v1/conversation?canView.user=true`
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(
            json.data.filter((e) => e.conversationId.includes(userId))
          );
          if (route.params) {
            if (
              json.count == 0 ||
              json.data.find((e) =>
                e.conversationId.includes(route.params.resId + "-" + userId)
              ) == null
            ) {
              navigation.navigate("Chat", {
                resName: route.params.resName,
                resId: route.params.resId,
              });
            }
          } else {
            setCreatedAt(
              json.data.filter((e) => e.conversationId.includes(userId))
            );
            const data = json.data.filter((e) =>
              e.conversationId.includes(userId)
            );
            setMessages(
              data
                ?.map((e) => e.members)
                ?.reduce((n, p) => {
                  return n?.concat(p);
                })
                .filter((e) => e != USER[0].name)
                .map((NotificationItem, index) => ({
                  conversationId: `${data[index]?.conversationId}`,
                  id: `${data[index]?._id}`,
                  key: `${index}`,
                  avatar:
                    "https://res.cloudinary.com/dugdmyq5b/image/upload/v1652664295/steak-meat-1200x628-facebook-1200x628_gh2ul1.jpg",
                  title: `${NotificationItem}`,
                  details: data[index]?.createdAt
                    .split(/[T]+/)
                    .splice(0, 1)
                    .join(),
                }))
            );
          }
        })
        .catch((error) => console.error(error));
    };
    getMessage();
  }, [isFocusd]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = async (rowMap, rowKey, id) => {
    closeRow(rowMap, rowKey);
    console.log(id);
    const newData = [...messages];
    const prevIndex = messages.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setMessages(newData);
    await fetch(`http://${BaseUrl}:5000/api/v1/conversation/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        canView: {
          Restaurant: true,
          user: false,
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
        <TouchableHighlight
          style={styles.rowFrontVisible}
          onPress={() => {
            navigation.navigate("Chat", {
              conversation_Id: data.item.conversationId,
            });
          }}
          underlayColor={"#aaa"}
        >
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: data.item.avatar }}
                style={{ height: 35, width: 35, borderRadius: 100 }}
              />
              <Text style={styles.title} numberOfLines={1}>
                {data.item.title}
              </Text>
            </View>
            <Text style={styles.details} numberOfLines={1}>
              {data.item.details}
            </Text>
          </View>
        </TouchableHighlight>
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
      <Header title={"All-Chats"} />
      {messages.length <= 0 && (
        <TouchableOpacity
          style={{
            paddingHorizontal: 5,
            paddingVertical: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            console.log(createdAt, "created DATA");
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "700" }}>
            {"No Chats Yet"}
          </Text>
        </TouchableOpacity>
      )}
      <View
        style={{
          borderTopWidth: 1,
          marginBottom: 5,
          backgroundColor: "#ececec",
        }}
      />
      <SwipeListView
        data={messages}
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
};

export default AllChats;

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
    right: 0,
    bottom: -9,
  },
});
