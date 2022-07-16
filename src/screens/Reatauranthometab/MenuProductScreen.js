import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Route1 } from "./MenuTabs";
const SCREEN_WIDTH = Dimensions.get("window").width;
import { TabView, TabBar } from "react-native-tab-view";
import { BaseUrl } from "../../constants/Baseurl";
import { SafeAreaView } from "react-native-safe-area-context";
export default function MenuProductScreen({ navigation, route }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [routes, setroutes] = useState([]);
  const [index, setIndex] = useState(0);
  const { id, deliveryTime } = route.params;

  const getMenudata = async () => {
    try {
      const response = await fetch(
        `http://${BaseUrl}:5000/api/v1/res/${id}/Menu`
      );
      const json = await response.json();
      setData(json.data);
     // console.log("menu tas data", json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMenudata();
    //console.log("id", id);
  }, []);
  let i = 1;
  useEffect(() => {
    for (const { type: t } of data) {
      routes.push({ key: i, title: t });
      i++;
    }
    //console.log("routes", routes);
    let acc = [];
    for (let i = 0; i < data.length - 1; i++) {
      if (routes[i].title === routes[i + 1].title) {
        acc.push(routes[i]);
      }
    }
    setroutes(routes.filter((item) => !acc.includes(item)));
    // console.log("acc", acc);
  }, [data]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white", paddingBottom: 3 }}
      tabStyle={styles.tabStyle}
      scrollEnabled={true}
      style={styles.tab}
      labelStyle={styles.tabLabel}
      contentContainerStyle={styles.tabContainer}
    />
  );

  const renderScene = ({ route }) => {
    {
      return data.filter((data) => data.type === routes[index].title) ? (
        <Route1
          navigation={navigation}
          data={data.filter((data) => data.type === routes[index].title)}
          deliveryTime={deliveryTime}
        />
      ) : (
        <View>
          <Text> loading</Text>{" "}
        </View>
      );
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <Text style={styles.text1}>Menu</Text>
      </View>

      <View
        style={{
          borderBottomColor: "white",
          borderBottomWidth: 1,
        }}
      />
      {routes.length !== 0 && (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={SCREEN_WIDTH}
          renderTabBar={renderTabBar}
          tabBarPosition="top"
          navigation={navigation}
          route={route}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },

  container: { flex: 1, left: 0, right: 0 },

  view1: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    backgroundColor: "red",
    paddingTop: 20,
    paddingBottom: 5,
  },

  text1: {
    fontWeight: "bold",
    marginLeft: 15,
    color: "white",
    fontSize: 18,
    marginTop: -2,
  },

  view2: { marginTop: 5, paddingBottom: 20 },

  tab: {
    paddingTop: 0,
    backgroundColor: "red",
    justifyContent: "space-between",
    // alignItems:"center"
  },

  tabContainer: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },

  tabLabel: { fontWeight: "bold", color: "white" },

  tabStyle: { width: SCREEN_WIDTH / 4, maxHeight: 45 },
  scene2: { backgroundColor: "#673ab7" },
});
