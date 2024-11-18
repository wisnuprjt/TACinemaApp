import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { fetchTVShows } from '../data/api';
import { useNavigation } from '@react-navigation/native';

const AllTVShowsScreen = () => {
  const [tvShows, setTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadTVShows();
  }, [page]);

  const loadTVShows = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const fetchedTVShows = await fetchTVShows(page);
      setTvShows((prevTVShows) => [...prevTVShows, ...fetchedTVShows]);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTVShows = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleShowPress = (show) => {
    // Pastikan 'show' memiliki 'id' yang valid sebelum navigasi
    if (!show || !show.id) {
      console.error('Invalid TV show data:', show);
      return;
    }
    console.log('Navigating to TVShowsDetail with id:', show.id);
    navigation.navigate('TVShowsDetail', { id: show.id }); // Pastikan 'id' dikirim dengan benar
  };

  const { width } = Dimensions.get('window');
  const cardWidth = (width - 40) / 2;

  return (
    <View style={styles.container}>
      <FlatList
        data={tvShows}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleShowPress(item)}>
            <View style={[styles.showCard, { width: cardWidth }]}>
              <Image
                style={styles.image}
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                resizeMode="cover"
              />
              <Text style={styles.showTitle}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMoreTVShows}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#E50914" /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  showCard: {
    marginBottom: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  showTitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default AllTVShowsScreen;
