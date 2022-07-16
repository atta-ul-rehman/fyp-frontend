import React, { useState, useEffect, useRef } from "react";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
import { io } from "socket.io-client";
import { Icon } from "react-native-elements";

import {
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
  Keyboard,
  Image,
  StatusBar,
} from "react-native";
import { useSelector } from "react-redux";
import { BaseUrl } from "../../constants/Baseurl";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Chat({ route, navigation }) {
  const { resId, resName, conversation_Id, resPhoto } = route.params;
  const [messages, setMessages] = useState([]);
  const socket = useRef();
  const [arrivalMessage, setArrivalMessage] = useState();
  const USER = useSelector((state) => state.LoginedUser.LoginedUser);

  const [senderId, setsenderId] = useState(USER[0]._id);
  const [recieverId, setrecieverId] = useState(resId);
  const [user, setuser] = useState(USER[0]._id);
  const [conversationId, setConversationId] = useState(
    route.params.conversation_Id ? conversation_Id : recieverId + "-" + senderId
  );
  let date = new Date();
  useEffect(() => {
    //socket.current.emit("Welcome", `Welcome to ${senderId}`);
    socket.current = io(`http://${BaseUrl}:5000`);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        _id: Date.now(),
        senderId: data.senderId,
        text: data.text,
        createdAt: date.toISOString(),
        user: { _id: data.senderId },
      });
    });
    console.log("arrivalMessage ", arrivalMessage);
  }, []);
  useEffect(() => {
    const getMessage = async () => {
      await fetch(`http://${BaseUrl}:5000/api/v1/messages/` + conversationId)
        .then((response) => response.json())
        .then((json) => {
          const data = json.data.reverse();
          setMessages(data);
        })
        .catch((error) => console.error(error));
    };
    if (!route.params.conversationId) {
      const setConversation = async () => {
        await fetch(`http://${BaseUrl}:5000/api/v1/conversation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            members: [USER[0].name, resName],
            conversationId: conversationId,
          }),
        });
      };
      setConversation();
    }
    getMessage();
  }, []);

  useEffect(() => {
    let temp = arrivalMessage;
    temp.concat(messages).sort(
      (a, b) =>
       a.createdAt < b.createdAt ? 1 : -1
    )
    {
      arrivalMessage &&
        setMessages((prev) =>
          [...prev, arrivalMessage].sort((a, b) =>
            a.createdAt < b.createdAt ? 1 : -1
          )
        );
       // setMessages(messages.concat(arrivalMessage))
    }
    //console.log("Message ", messages);
  }, [arrivalMessage]);
  useEffect(() => {
    socket.current.emit("addUser", user);
    socket.current.on("getUsers", (users) => {
     // console.log(users);
    });
  //  console.log(user);
  }, [user]);
  useEffect(() => {
    // setMessages([
    //   {
    //     _id: 1,
    //     text: "Hello developer",
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: "React Native",
    //       avatar: "https://placeimg.com/140/140/any",
    //     },
    //   },
    // ]);
  }, []);

  const onSend = async (messageArray) => {
    socket.current.emit("sendMessage", {
      senderId: senderId,
      recieverId: recieverId,
      text: messageArray[0].text,
    });
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      senderId,
      recieverId,
      conversationId,
    };
    //console.log("mymsg", mymsg);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, mymsg)
    );
    await fetch(`http://${BaseUrl}:5000/api/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: senderId,
        recieverId: recieverId,
        conversationId: conversationId,
        text: messageArray[0].text,
        createdAt: messageArray[0].createdAt,
      }),
    });
  };
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#2e64e5",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
        }}
      />
    );
  };
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <Icon
            name="send-circle"
            type="material-community"
            style={{ marginBottom: 5, marginRight: 5 }}
            size={32}
            color="red"
          />
        </View>
      </Send>
    );
  };
  const scrollToBottomComponent = () => {
    return <Icon name="keyboard-double-arrow-down" size={22} color="#333" />;
  };

  return (
    <>
      <SafeAreaView>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            backgroundColor: "red",
            alignItems: "center",
          }}
        >
          <Icon
            name="arrow-back-ios"
            size={16}
            color="white"
            onPress={() => navigation.goBack()}
          />
          <Image
            source={{
              uri: resPhoto,
            }}
            style={{ height: 35, width: 35, borderRadius: 100 }}
          />
          <Text
            style={{
              fontSize: 18,
              marginLeft: 10,
              color: "white",
              fontWeight: "500",
            }}
          >
            {" "}
            {resName}
          </Text>
        </View>
      </SafeAreaView>
      <GiftedChat
        messages={messages}
        onSend={(text) => onSend(text)}
        user={{
          _id: senderId,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
    </>
  );
}
