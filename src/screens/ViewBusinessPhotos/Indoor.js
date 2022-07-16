import React, {useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
} from 'react-native';
import {restaurantsData} from '../../global/Data';
import PhotosGridView from './PhotoGridView';
export default function Indoor({navigation, id}) {
  return (
    <SafeAreaView style={styles.container}>
      <PhotosGridView
        imageData={restaurantsData[id].photos.filter(
          item => item.type == 'Indoor',
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
});
