import React, {useEffect} from 'react';

// import all the components we are going to use
import {SafeAreaView, StyleSheet} from 'react-native';
import {restaurantsData} from '../../global/Data';
import PhotosGridView from './PhotoGridView';
export default function Food({navigation, id}) {
  return (
    <SafeAreaView style={styles.container}>
      <PhotosGridView
        imageData={restaurantsData[id].photos.filter(
          item => item.type == 'Food',
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
});
