import React from "react";
// import all the components we are going to use
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ViewBusinessPhotos({ navigation, route }) {
  const { data } = route.params;

  const [photos, setPhotos] = React.useState(data);
  return (
    <SafeAreaView style={styles.container}>
      <Header title={"Photo Gallarey"} type={"arrow-back-ios"} />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 5,
          marginTop: 5,
        }}
      >
        <TouchableOpacity
          style={{
            paddingHorizontal: 80,
            paddingVertical: 20,
            borderWidth: 1,
            borderStyle: "dotted",
            justifyContent: "center",
          }}
        >
          <Icon name="add-a-photo" type="material" color={"grey"} size={22} />
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={photos}
          showsHorizontalScrollIndicator={true}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                margin: 5,
              }}
            >
              <View style={{ borderWidth: 2 }}>
                <Image
                  style={styles.imageThumbnail}
                  source={{ uri: item.image }}
                />
              </View>
            </View>
          )}
          //Setting the number of column
          numColumns={3}
          keyExtractor={(item, index) => index}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  imageThumbnail: {
    justifyContent: "center",
    height: 120,
    width: 120,
  },
});
