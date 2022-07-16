import React, { useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { BaseUrl } from "../constants/Baseurl";
import { useToast } from "react-native-fast-toast";
import Clarifai from "clarifai";
import { ActivityIndicator } from "react-native-web";
const app = new Clarifai.App({
  apiKey: "9db1df2f31064c2f8a2f51411245fa1f",
});
const ReviewModal = ({
  image,
  setImage,
  review,
  setreview,
  rating,
  setrating,
  id,
  onReviewClose,
  reviewAdded,
  setreviewAdded,
  resName,
}) => {
  const toast = useToast();
  useEffect(() => {
    checkForCameraRollPermission();
  }, []);
  const checkForCameraRollPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Please grant camera roll permissions inside your system's settings"
      );
    } else {
      console.log("Media Permissions are granted");
    }
  };
  const [ImageCheck, setImageCheck] = useState([]);

  // To set the max number of Stars
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const authToken = useSelector((state) => state.authToken.authToken);
  const starImageFilled =
    "https://res.cloudinary.com/dugdmyq5b/image/upload/v1653097852/samples/Star%20filled%20and%20not%20filled/220px-Red_star.svg_ef6pbc.png";
  // Empty Star. You can also give the path from local
  const starImageCorner =
    "https://res.cloudinary.com/dugdmyq5b/image/upload/v1653097876/samples/Star%20filled%20and%20not%20filled/94656fa26471542ef5af4bfae1732ebd_sgug3l.jpg";
  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      base64: true,
    });
    // console.log(JSON.stringify(_image));
    if (!_image.cancelled) {
      app.models
        .predict(Clarifai.MODERATION_MODEL, _image.base64)
        .then((res) => {
          if (
            res.outputs[0].data.concepts.filter((e) => e.name == "safe")[0]
              .value > 0.9
          ) {
            setImage(_image.uri);
          } else {
            // toast.show("Explicit Content not Allowed", {
            //   duration: 500,
            //   style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
            // });
            setreview("");
    setImage(null);
    setrating(0);
            Alert.alert("Explicit Content not Allowed");
          }
        })
        .catch((err) => console.error(err));
    }

  };
  const reviewAddition = () => {
    let form = new FormData();
    if (image) {
      form.append("text", review);
      form.append("rating", rating);
      form.append("title", "review Added");
      form.append("image", {
        uri: image,
        name: "image.png",
        fileName: "image",
        type: "image/png",
      });
      addReview(form);
    }
    if (!image) {
      form.append("text", review);
      form.append("rating", rating);
      form.append("title", "Review Added");
      addReview(form);
    }
    setreview("");
    setImage(null);
    setrating(0);
  };

  const addReview = async (form) => {
    await fetch(`http://${BaseUrl}:5000/api/v1/res/${id.toString()}/review`, {
      method: "POST",
      headers: {
        Accept: "apllication/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
      body: form,
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success == true) {
          toast.show(json.data, {
            duration: 500,
            style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
          });
          setreviewAdded(!reviewAdded);
        } else if (json.success == false) {
          toast.show("You have already added review", {
            duration: 1000,
            style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
          });
          setreviewAdded(!reviewAdded);
        }
      })
      .catch((error) => {
        toast.show("Error" + error, {
          duration: 500,
          style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
        });
      });
  };

  const CustomRatingBar = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setrating(item)}
            >
              <Image
                style={styles.starImageStyle}
                source={
                  item <= rating
                    ? { uri: starImageFilled }
                    : { uri: starImageCorner }
                }
              />
            </TouchableOpacity>
          );
        })}
        <Text> {rating}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "white",
          height: "100%",
          padding: 10,
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>{resName}</Text>
          <Icon
            name="close"
            type="material"
            color={"grey"}
            size={22}
            onPress={onReviewClose}
          />
        </View>
        <CustomRatingBar />
        <View style={{ marginTop: 10 }}>
          <TextInput
            style={{
              width: "100%",
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
            placeholder="leave a review"
            keyboardType="default"
            value={review}
            onChangeText={(text) => setreview(text)}
          />
        </View>
        <View
          style={{
            paddingVertical: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
         {
          image && (
            <Image
              source={{ uri: image }}
              style={{ height: 200, width: 200 }}
            />
          )
        }
        </View>
        <View style={{ position: "absolute", bottom: 20, left: 10, right: 10 }}>
          <Text
            style={{
              padding: 5,
              fontSize: 14,
              fontWeight: "500",
              color: "grey",
            }}
          >
            Thanks for Posting Review
          </Text>
          <TouchableOpacity
            style={{
              padding: 10,
              borderWidth: 1,
              borderStyle: "dotted",
              justifyContent: "center",
            }}
            onPress={addImage}
          >
            <Icon name="add-a-photo" type="material" color={"grey"} size={22} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={{
                padding: 5,
                fontSize: 16,
                fontWeight: "600",
                color: "grey",
                alignSelf: "flex-end",
              }}
              onPress={() => {
                reviewAddition(), onReviewClose();
              }}
            >
              Post Review
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  customRatingBarStyle: {
    flexDirection: "row",
    marginTop: 5,
  },
  starImageStyle: {
    width: 20,
    height: 20,
    resizeMode: "cover",
  },
});

export default ReviewModal;
