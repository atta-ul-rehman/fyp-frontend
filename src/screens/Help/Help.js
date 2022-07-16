import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from 'react-native-elements';
import Slider from '@react-native-community/slider';

export default function Help() {
  const [checked, setchecked] = useState(null);
  const [orderReport, setorderReport] = useState('');
  const [sliderValue, setsliderValue] = useState(4);
  const delivery_price = [0, 2, 4, 6, 8, 10];
  const helpz = [
    'Account and Payment',
    'Delivery and pickUp',
    'Safety',
    'MemberShip',
  ];
  return (
    <View style={{ felx: 1 }}>
      {helpz.map((item, index) => (
        <View  key={index}>
          <TouchableOpacity
           
            style={styles.view1}
            onPress={() => { 
              if (checked===index) {
                  setchecked(null);
                } else {
                  setchecked(index);
                }}}>
            <Text>{item}</Text>
            <Icon
              name="arrow-drop-down"
              type="material"
              color={'grey'}
              size={22}
            />
          </TouchableOpacity>
          <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
            {(checked===index && index===0)&& <Account />}
            {(checked===index && index===1)&& <Delivey />}
            {(checked===index && index===2)&& <Safety text={orderReport} onChangeText={setorderReport} sliderValue={sliderValue} setsliderValue={setsliderValue}/>}
            {(checked===index && index===3)&& <Membership />}
          </View>
        </View>
      ))}
    </View>
    
  );
}

const Safety = (props) => (
  <View>
    <Text style={{ fontWeight: 500, padding: 5, fontSize: 18 }}>
      Report food safety issue
    </Text>
    <TextInput
      style={{padding:5 ,borderWidth: 1, borderColor: '#ececec' }}
      onChangeText={props.onChangeText}
      value={props.text}
      multiline={true}
      numberOfLines={props.sliderValue}
      onContentSizeChange={()=>props.setsliderValue(6)}
    />
    <Text style={{ fontWeight: 500, padding: 5, fontSize: 18 }}>
      Report delivery incident
    </Text>
  </View>
);

const Delivey = () => (
  <View>
    <Text style={{ fontWeight: 500, padding: 5, fontSize: 18 }}>
      How to add Tip
    </Text>
    <Text style={{ padding: 5 }}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry’s standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
    </Text>
    <Text style={{ fontWeight: 500, padding: 5, fontSize: 18 }}>Poloicies</Text>
    <Text style={{ padding: 5 }}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry’s standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
    </Text>
  </View>
);

const Membership = () => (
  <View>
    <Text style={{ fontWeight: 500, padding: 5, fontSize: 18 }}>
      Uber Eats Pass
    </Text>
    <Text style={{ padding: 5 }}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry’s standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
    </Text>
  </View>
);

const Account = () => (
  <View>
    <Text style={{ fontWeight: 500, padding: 5, fontSize: 18, fontSize: 18 }}>
      How to update delete payment method
    </Text>
    <Text style={{ padding: 5 }}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry’s standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
    </Text>
    <Text style={{ fontWeight: 500, padding: 5, fontSize: 18 }}>
      Gift Card and Voucherz
    </Text>
    <Text style={{ padding: 5 }}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry’s standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
    </Text>
  </View>
);
const styles = StyleSheet.create({
  view1: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    marginHorizontal: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 5,
  },
});
