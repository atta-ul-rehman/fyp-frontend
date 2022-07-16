import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {Icon} from 'react-native-elements';
import Slider from '@react-native-community/slider';

export default function Filter({
  setModalVisible,
  setchecked,
  checked,
  filtered_price1,
  setchecked2,
  checked2,
  delivery_price1,
  categories1,
  sliderValue,
  setsliderValue,
  FilterApplied,
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.7)',
      }}>
      <View style={{padding: 5, backgroundColor: 'white', height: 500}}>
        <View style={styles.view12}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setModalVisible(false)}>
            <Icon name="remove" type="material" size={30} />
          </TouchableOpacity>
        </View>
        <View style={{padding: 5}}>
          <Text style={{fontSize: 18, fontWeight: '500'}}>Sort</Text>
          {categories1.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
              }}
              onPress={() => {
                setchecked2(
                  checked2.concat(item.name).filter(i => i == item.name),
                );
              }}>
              {item.icon}
              <Text style={{fontSize: 12, color: 'grey', paddingLeft: 5}}>
                {item.name}
              </Text>
              <View style={{right: 5, position: 'absolute'}}>
                {checked2.includes(item.name) && item.check}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{padding: 5}}>
          <Text style={{fontSize: 18, fontWeight: '500'}}>Price Range</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              paddingTop: 10,
            }}>
            {filtered_price1.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.fitered_price,
                  {
                    borderColor: checked.includes(item.name) ? 'black' : 'grey',
                    backgroundColor: checked.includes(item.name)
                      ? 'black'
                      : 'white',
                  },
                ]}
                onPress={() => {
                  if (checked.includes(item.name)) {
                    setchecked(checked.filter(i => i != item.name));
                  } else {
                    setchecked(checked.concat(item.name));
                    console.log(checked);
                  }
                }}>
                <Text
                  style={{
                    color: checked.includes(item.name) ? 'white' : 'grey',
                  }}>
                  {item.type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{padding: 5}}>
          <Text style={{fontSize: 18, fontWeight: '500'}}>
            Delivery Price Range
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 5,
            }}>
            {delivery_price1.map((item, index) => (
              <View
                key={index}
                style={{marginTop: sliderValue >= item ? -5 : 0}}>
                <Text
                  style={{
                    color: sliderValue >= item ? 'black' : 'grey',
                    fontSize: sliderValue >= item ? 16 : 10,
                  }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
          <Slider
            maximumValue={40}
            minimumValue={0}
            step={10}
            value={sliderValue}
            onValueChange={sliderValue => setsliderValue(sliderValue)}
          />
        </View>
        <TouchableOpacity style={styles.apply_filter} onPress={FilterApplied}>
          <Text style={{color: 'white'}}>Apply Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: '#eceeec',
    padding: 5,
    paddingHorizontal: 0,
    borderRadius: 2,
  },

  fitered_price: {
    borderWidth: 1,
    borderRadius: 100,
    height: 50,
    width: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  apply_filter: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 10,
  },
});
