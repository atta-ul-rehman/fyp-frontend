import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Button,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { colors } from "../global/styles";

import { BaseUrl } from "../constants/Baseurl";

export default function SearchComponent() {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [textInputFossued, setTextInputFossued] = useState(true);
  const textInput = useRef(0);
  const [searchValue, setsearchValue] = useState("");
  const navigation = useNavigation();
  const [searchData, setSearchData] = useState();
  const [loading, setLoading] = useState(false);
  const [web_URL, setWeb_url] = useState(
    `http://${BaseUrl}:5000/api/v1/res?select=foodtype`
  );
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await fetch(web_URL)
        .then((response) => response.json())
        .then((json) => {
          setSearchData(
            json.data
              .map((e) => e.foodtype)
              .filter((e) => e != null)
              .map((e, i) => ({ name: e }))
          ),
            setData(
              json.data
                .map((e) => e.foodtype)
                .filter((e) => e != null)
                .map((e, i) => ({ name: e }))
            );
        })
        .catch((error) => console.error(error))
        .finally(()=>setLoading(false));
    };
    getData();
  }, [modalVisible]);

  const contains = ({ name }, query) => {
    if (name.includes(query)) {
      return true;
    }
    return false;
  };
  const handleSearch = (text) => {
    const dataS = data.filter((e) => e.name.includes(text));
    if (dataS == null) {
      setSearchData([...dataS]);
    }
    console.log(text);
    setSearchData([...dataS]);
  };

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      {/* <TouchableWithoutFeedback
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <View style={styles.SearchArea}>
          <Icon
            name="search"
            style={styles.searchIcon}
            type="material"
            iconStyle={{ marginLeft: 5 }}
            size={32}
          />
          <Text style={{ fontSize: 15 }}>What are you looking for ?</Text>
        </View>
      </TouchableWithoutFeedback> */}
        <View style={[styles.modal, {marginTop: 30 },]}>
          <Text>{searchValue}</Text>
          <Button
            title="go"
            onPress={() => {
              console.log(
                searchData.filter((e) => e.name.includes(searchValue))
              );
            }}
          />
          <View style={styles.view1}>
            <View style={styles.TextInput}>
              <Animatable.View
                animation={textInputFossued ? "fadeIn" : "fadeIn"}
                duration={400}
              >
                <Icon
                  name={textInputFossued ? "arrow-back" : "search"}
                  onPress={() => {
                    if (textInputFossued) setModalVisible(false);
                    setTextInputFossued(true);
                    textInput.current.clear();
                    setsearchValue("");
                  }}
                  style={styles.icon2}
                  type="material"
                  iconStyle={{ marginRight: 5 }}
                />
              </Animatable.View>

              <TextInput
                style={{ width: "90%", padding: 5 }}
                placeholder=" enter"
                ref={textInput}
                onFocus={() => {
                  setTextInputFossued(true);
                }}
                value={searchValue}
                onChangeText={(text) => {
                  setsearchValue(text), handleSearch(text);
                }}
                returnKeyType="go"
                onSubmitEditing={() => {
                  Keyboard.dismiss;
                  navigation.navigate("SearchResultScreen", {
                    item: searchValue,
                  });
                }}
              />

              <Animatable.View
                animation={textInputFossued ? "fadeIn" : ""}
                duration={400}
              >
                <Icon
                  name={textInputFossued ? "cancel" : null}
                  iconStyle={{ color: colors.grey3 }}
                  type="material"
                  style={{ marginRight: -0 }}
                  onPress={() => {
                    // textInput.current.clear();
                    // setTextInputFossued(false);
                    // setsearchValue("");
                    console.log(searchData)
                    // handleSearch()
                  }}
                />
              </Animatable.View>
            </View>
          </View>
{searchData!=null ?
          <FlatList
            data={searchData}
            style={{flex:1}}
            renderItem={({ item, index }) => {
              return(
              <TouchableOpacity
                keyExtractor={index.toString()}
                onPress={() => {
                  Keyboard.dismiss;
                  navigation.navigate("SearchResultScreen", {
                    item: item.name,
                  });
                  setModalVisible(false);
                  setTextInputFossued(false);
                }}
              >
                <View style={styles.view2}>
                  <Text style={{ color: colors.grey2, fontSize: 15 }}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
               )}
            }
          />
 :<Text>No data</Text>}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  text1: {
    color: colors.grey3,
    fontSize: 16,
  },

  TextInput: {
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 0,
    borderColor: "#86939e",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },

  SearchArea: {
    marginTop: 10,
    width: "94%",
    height: 50,
    backgroundColor: colors.grey5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey4,
    flexDirection: "row",
    alignItems: "center",
  },

  searchIcon: { fontSize: 24, padding: 5, color: colors.grey2 },

  view1: {
    height: 70,
    justifyContent: "center",

    paddingHorizontal: 10,
  },

  view2: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },

  icon2: { fontSize: 24, padding: 5, color: colors.grey2 },
  modal: {
    flex: 1,
  },
});
