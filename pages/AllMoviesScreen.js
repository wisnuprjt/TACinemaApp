import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { fetchMovies } from '../data/api';
import { useNavigation } from '@react-navigation/native';

const AllMoviesScreen = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadMovies();
  }, [page]);

  const loadMovies = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const fetchedMovies = await fetchMovies(page);
      setMovies((prevMovies) => [...prevMovies, ...fetchedMovies]);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleMoviePress = (movie) => {
    // Pastikan 'movie' memiliki 'id' yang valid sebelum navigasi
    if (!movie || !movie.id) {
      console.error('Invalid movie data:', movie);
      return;
    }
    console.log('Navigating to MovieDetail with id:', movie.id, 'and type: movie');
    navigation.navigate('MovieDetail', { id: movie.id, type: 'movie' }); // Pastikan 'id' dan 'type' dikirim dengan benar
  };

  const { width } = Dimensions.get('window');
  const cardWidth = (width - 40) / 2;

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleMoviePress(item)}>
            <View style={[styles.movieCard, { width: cardWidth }]}>
              <Image
                style={styles.image}
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              />
              <Text style={styles.movieTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMoreMovies}
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
  movieCard: {
    marginBottom: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  movieTitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default AllMoviesScreen;
