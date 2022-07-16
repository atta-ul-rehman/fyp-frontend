import React, {useEffect} from 'react';

// import all the components we are going to use
import {SafeAreaView, StyleSheet} from 'react-native';
import {restaurantsData} from '../../global/Data';
import PhotosGridView from './PhotoGridView';

export default function Outdoor({navigation, route, id}) {
  return (
    <SafeAreaView style={styles.container}>
      <PhotosGridView
        imageData={restaurantsData[id].photos.filter(
          item => item.type == 'Outdoor',
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
  imageThumbnail: {
    height: 100,
    width: 100,
  },
});
