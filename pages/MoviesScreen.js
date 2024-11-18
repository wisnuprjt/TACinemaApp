import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { fetchMovies } from '../data/api';

const MoviesScreen = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    loadMovies();
  }, [page]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, movies]);

  const loadMovies = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const fetchedMovies = await fetchMovies(page);
      setMovies((prevMovies) => [...prevMovies, ...fetchedMovies]);
      setFilteredMovies((prevMovies) => [...prevMovies, ...fetchedMovies]);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    try {
      const fetchedMovies = await fetchMovies(1);
      setMovies(fetchedMovies);
      setFilteredMovies(fetchedMovies);
    } catch (error) {
      console.error('Error refreshing movies:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMoviePress = (movie) => {
    if (!movie || !movie.id) {
      console.error('Invalid movie data:', movie);
      return;
    }
    navigation.navigate('MovieDetail', { id: movie.id, type: 'movie' });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  };

  const renderMoviePoster = ({ item }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item)} style={styles.posterContainer}>
      <Image
        style={styles.posterImage}
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
      />
      <Text style={styles.posterTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#B0B0B0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Movies, Dramas and other"
          placeholderTextColor="#B0B0B0"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Slider */}
      {searchQuery.trim() === '' && (
        <>
          <FlatList
            horizontal
            data={movies.slice(0, 5)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleMoviePress(item)}>
                <View style={styles.sliderCard}>
                  <Image
                    style={styles.sliderImage}
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}` }}
                  />
                  <Text style={styles.sliderTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.slider}
          />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue Watch</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllMovies')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={movies.slice(5, 10)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleMoviePress(item)}>
                  <View style={styles.movieCard}>
                    <Image
                      style={styles.image}
                      source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    />
                    <Text style={styles.movieTitle}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Global Trending</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllMovies')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={movies.slice(10, 15)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleMoviePress(item)}>
                  <View style={styles.movieCard}>
                    <Image
                      style={styles.image}
                      source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    />
                    <Text style={styles.movieTitle}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="white" />
        <Text style={styles.headerTitle}>
          <Text style={{ color: 'white' }}>Cinema</Text>
          <Text style={{ color: '#E50914' }}>App</Text>
          <Text style={{ color: 'white' }}>+</Text>
        </Text>
        <Ionicons name="search" size={24} color="white" />
      </View>

      {/* Main Content */}
      <FlatList
        data={searchQuery.trim() !== '' ? filteredMovies : movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderMoviePoster}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.gridContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E50914']} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 10,
    marginTop: 35,
    marginBottom: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  slider: {
    marginBottom: 20,
  },
  sliderCard: {
    marginRight: 15,
  },
  sliderImage: {
    width: 300,
    height: 150,
    borderRadius: 10,
  },
  sliderTitle: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#E50914',
    fontSize: 14,
  },
  movieCard: {
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },
  movieTitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  gridContainer: {
    paddingBottom: 10,
  },
  posterContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  posterImage: {
    width: 150,
    height: 225,
    borderRadius: 10,
  },
  posterTitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default MoviesScreen;
