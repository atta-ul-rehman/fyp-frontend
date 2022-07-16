import { StyleSheet, Text, View,TextInput,TouchableOpacity,ScrollView,FlatList,Image,Dimensions} from 'react-native';
import React,{useState,useRef} from 'react';
import {Icon} from 'react-native-elements'
import {colors,parameters} from '../../global/styles'
import HomeHeader from '../../components/HomeHeader'

export default function Favorites({navigation})
{
  return(
    <View>
     <HomeHeader navigation={navigation}/>
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

    <Text> Favorites </Text>







    </View>
    </View>
  )
}
