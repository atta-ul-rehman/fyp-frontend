import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Icon, Avatar, colors } from "react-native-elements";
import ReviewModal from "./reviewModal";
import StarRating from "../components/StarRating";
import { useSelector } from "react-redux";
import { BaseUrl } from "../constants/Baseurl";
import { useToast } from "react-native-fast-toast";

export default function Reviews({
  navigation,
  id,
  resName,
  averageRating,
  reviewAdded,
  setreviewAdded,
}) {
  const toast = useToast();
  const [image, setImage] = useState(null);
  const [reactChanged, setreactionChanged] = useState(false);
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [modal2Visible, setmodal2Visible] = useState(false);
  const [report, setReport] = useState();
  const [maxRating, setMaxRating] = useState(0);
  const [review_value, setreview_value] = useState("");
  const [description, setDescription] = useState("");
  const [ReviewReportData, setReviewReportData] = useState();
  const Logined_USER = useSelector((state) => state.LoginedUser.LoginedUser);
  const fetchMoreData = () => {
    if (articles?.length >= 3) {
      return;
    }
  };
  const authToken = useSelector((state) => state.authToken.authToken);

  useEffect(() => {
    const getreviewdata = async () => {
      try {
        const response = await fetch(
          `http://${BaseUrl}:5000/api/v1/res/${id}/review?sort=likes.length`
        );
        const json = await response.json();
        setArticles(json.data);

        setUser(json.data.user);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };
    getreviewdata();
  }, [reviewAdded, reactChanged]);
  const reaction_added = async (id, lastValue, report) => {
    if (!report) {
      try {
        await fetch(`http://${BaseUrl}:5000/api/v1/review/${id}`, {
          method: "PUT",
          headers: {
            Accept: "apllication/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            like: lastValue,
          }),
        });
        setreactionChanged(!reactChanged);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        toast.show("Reporting...", {
          duration: 1000,
          style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
        });
        await fetch(`http://${BaseUrl}:5000/api/v1/review/${id}`, {
          method: "PUT",
          headers: {
            Accept: "apllication/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            report: true,
            des: description,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.success) {
              setmodal2Visible(false);
              toast.show("Review Reported", {
                duration: 500,
                style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
              });
            } else {
              toast.show(json.error, {
                duration: 500,
                style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
              });
            }
          })
          .catch((err) => {
            toast.show(err, {
              duration: 500,
              style: { padding: 0, backgroundColor: "rgba(120,120,120,0.9)" },
            });
          });
        setreactionChanged(!reactChanged);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const reportData = [
    "Irrelevent",
    "spam",
    "inappropraite",
    "i dont like it",
    "Bullying Harrament",
  ];
  const ReportReviewModal = ({ pressed }) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
        behavior="padding"
      >
        <View
          style={{
            backgroundColor: "white",
            height: "30%",
            padding: 5,
            marginTop: 5,
            alignSelf: "center",
            width: "70%",
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              padding: 5,
              flexDirection: "row",
              borderBottomWidth: 1,
              borderColor: "red",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
              }}
            >
              Report
            </Text>
            <Icon
              name="close"
              type="material"
              color="black"
              size={20}
              onPress={() => setmodal2Visible(false)}
            />
          </View>
          {reportData.map((e, i) => {
            return (
              <Pressable
                key={i}
                style={{
                  padding: 5,
                  alignItems: "flex-start",
                  borderBottomWidth: 1,
                  borderColor: "#ececec",
                }}
                onPress={() => {
                  setDescription(e)
                }}
                onPressOut={pressed}
              >
                <Text>{e}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };
  return (
    <>
      <Modal
        animationType="fade"
        visible={modal2Visible}
        transparent={true}
        onRequestClose={() => setmodal2Visible(false)}
        transparent={true}
      >
        <ReportReviewModal
          pressed={() => {
            reaction_added(
              ReviewReportData,
              articles?.ReportReview?.some((e) => e == Logined_USER[0]._id)
                ? false
                : true,
              true
            );
          }}
        />
      </Modal>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setmodalVisible(false)}
      >
        {
          <ReviewModal
            onReviewClose={() => {
              setmodalVisible(false);
            }}
            image={image}
            setImage={setImage}
            rating={maxRating}
            setrating={setMaxRating}
            review={review_value}
            setreview={setreview_value}
            id={id}
            reviewAdded={reviewAdded}
            setreviewAdded={setreviewAdded}
            resName={resName}
          />
        }
      </Modal>

      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ paddingVertical: 5, fontSize: 18, fontWeight: "700" }}>
          Leave a Review
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}
          onPress={() => {
            setmodalVisible(true);
          }}
        >
          <Text style={{ color: "grey" }}> leave a review</Text>
        </TouchableOpacity>
        <View style={{ paddingVertical: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "700" }}>
            Reccomeneded Reviews
          </Text>
        </View>
        <View
          style={{ borderWidth: 4, marginVertical: 5, borderColor: "#ececec" }}
        />
        <View style={{ flexDirection: "row" }}>
          <View style={{ paddingVertical: 10, marginTop: 5 }}>
            <View style={{ flexDirection: "row", paddingVertical: 2 }}>
              <StarRating ratings={averageRating} size={30} />
            </View>
            <Text style={{ color: "grey" }}> {articles?.length} Reviews</Text>
          </View>
          {articles.length > 0 && (
            <View style={{ paddingHorizontal: 30 }}>
              <Reviewbar
                articles={articles}
                total={articles?.length}
                text={1}
                color="#e30000"
              />
              <Reviewbar
                articles={articles}
                total={articles?.length}
                text={2}
                color="#ff4800"
              />
              <Reviewbar
                articles={articles}
                total={articles?.length}
                text={3}
                color="#ff6600"
              />
              <Reviewbar
                articles={articles}
                total={articles?.length}
                text={4}
                color="#ff9100"
              />
              <Reviewbar
                articles={articles}
                total={articles?.length}
                text={5}
                color="#ffb300"
              />
            </View>
          )}
        </View>
        <TouchableOpacity
          style={{
            borderRadius: 100,
            borderWidth: 1,
            paddingVertical: 5,
            marginVertical: 10,
            width: 85,
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() =>
            console.log(articles[1].likes.some((e) => e == Logined_USER._id))
          }
        >
          <Icon
            name="arrow-drop-down"
            type="material"
            color="black"
            size={20}
          />
          <Text>Filter</Text>
        </TouchableOpacity>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={articles}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Review_user_data
              key={item._id}
              _id={item._id}
              image={item.user?.image}
              user_name={item.user?.name}
              user_email={item.user?.email}
              review={item.text}
              rating={item.rating}
              like={item.likes != [] ? item?.likes.length : 0}
              isliked={item.likes.some((e) => e == Logined_USER[0]._id)}
              report={report}
              reported={item.ReportReview.some((e) => e == Logined_USER[0]._id)}
              reportOpen={() => {
                report == item._id ? setReport("") : setReport(item._id);
              }}
              length={articles?.length}
              pressed={() => {
                reaction_added(
                  item._id,
                  item.likes.some((e) => e == Logined_USER[0]._id)
                    ? "dislike"
                    : "like",
                  false
                );
              }}
              reportReview={() => {
                setReport("");
                 // console.log(item.ReportReview.some((e)=>e.user==Logined_USER[0]._id))
                if (
                  item.ReportReview.length > 0 &&
                  item.ReportReview.some((e) => e.user == Logined_USER[0]._id)
                ) {
                  toast.show("Already reported this Review", {
                    duration: 1000,
                    style: {
                      padding: 0,
                      backgroundColor: "rgba(120,120,120,0.9)",
                    },
                  });
                } else {
                  setmodal2Visible(true);
                  setReviewReportData(item._id);
                }
              }}
              reviewImage={item.image}
            />
          )}
          onEndReached={fetchMoreData}
          onEndReachedThreshold={0.2}
        />
      </View>
    </>
  );
}
const Reviewbar = (props) => (
  <View style={{ flexDirection: "row" }}>
    <Text>{props.text}</Text>
    <View
      style={{
        width: 100,
        backgroundColor: "#ececec",
        height: 5,
        marginTop: 10,
        marginLeft: 5,
        borderRadius: 100,
      }}
    >
      <View
        style={{
          width:
            props.articles?.filter((e) => e.rating == props.text) && props.total
              ? (100 / props.total) *
                props.articles?.filter((e) => e.rating == props.text).length
              : 0,
          borderWidth: 1,
          height: 5,
          borderColor: props.color,
          backgroundColor: props.color,
          position: "absolute",
          left: 0,
          borderRadius: 100,
        }}
      ></View>
    </View>
  </View>
);

const Review_user_data = ({
  image,
  user_name,
  user_email,
  review,
  like,
  month_ago,
  length,
  _id,
  pressed,
  reviewImage,
  rating,
  isliked,
  report,
  reportOpen,
  reportReview,
  reported,
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        {image ? (
          <Avatar rounded avatarStyle={{}} size={35} source={{ uri: image }} />
        ) : (
          <Avatar
            rounded
            avatarStyle={{}}
            size={35}
            source={require("../../aseets/wifi.png")}
          />
        )}
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 14 }}>{user_name}</Text>
          <Text style={{ fontSize: 10 }}>{user_email}</Text>
        </View>

        <View
          style={{ paddingHorizontal: 10, position: "absolute", right: 100 }}
        >
          <Icon
            name={"more-vert"}
            size={20}
            onPress={() => {
              reportOpen();
            }}
          />
        </View>
        {report === _id && (
          <TouchableOpacity
            style={{
              padding: 8,
              borderWidth: 1,
              borderColor: "grey",
              position: "absolute",
              right: 130,
              top: 20,
              zIndex: 3,
              backgroundColor: "white",
            }}
            onPress={() => {
              reportReview();
            }}
          >
            <Text>{reported ? "UnReport" : "Report"}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <StarRating ratings={rating} review={length} size={15} />
        <Text style={{ fontSize: 11, color: "grey" }}>{month_ago}</Text>
      </View>
      <View style={{ paddingVertical: 4 }}>
        <Text>{review}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "70%",
        }}
      >
        <TouchableOpacity
          style={styles.actions}
          onPress={() => {
            pressed(_id);
          }}
        >
          <Icon
            name={isliked ? "thumb-up" : "thumb-up-off-alt"}
            color="#1b74e4"
            size={20}
            style={{ paddingHorizontal: 5 }}
          />
        </TouchableOpacity>

        <Text>{like}</Text>
      </View>
      <View style={{ paddingVertical: 5 }}>
        {reviewImage != null && (
          <Image
            source={{ uri: reviewImage }}
            style={{ width: 100, height: 70 }}
          />
        )}
      </View>
      <View
        style={{ borderWidth: 1, marginVertical: 5, borderColor: "#ececec" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heartLottie: {
    width: 50,
    height: 50,
    marginLeft: -5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 20,
  },
});
