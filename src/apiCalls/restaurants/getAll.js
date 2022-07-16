import axios from "axios";
import { BaseUrl } from "../../constants/Baseurl";
export async function AllRestData() {
  var config = {
    method: "GET",
    url: `http://${BaseUrl}:5000/api/v1/res`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const getResponse = await fetch(config)
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
  return getResponse;
}

export async function LoginForm(data) {
  var config = {
    method: "post",
    url: `${Server}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };

  const GetResponse = await axios(config)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
  return GetResponse;
}
