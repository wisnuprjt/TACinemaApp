import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList, RefreshControl, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { fetchTVShows } from '../data/api';

const TVShowsScreen = () => {
  const [tvShows, setTVShows] = useState([]);
  const [filteredTVShows, setFilteredTVShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    loadTVShows();
  }, [page]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, tvShows]);

  const loadTVShows = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const fetchedTVShows = await fetchTVShows(page);
      setTVShows((prevTVShows) => [...prevTVShows, ...fetchedTVShows]);
      setFilteredTVShows((prevTVShows) => [...prevTVShows, ...fetchedTVShows]);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    try {
      const fetchedTVShows = await fetchTVShows(1);
      setTVShows(fetchedTVShows);
      setFilteredTVShows(fetchedTVShows);
    } catch (error) {
      console.error('Error refreshing TV shows:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleTVShowPress = (show) => {
    if (!show || !show.id) {
      console.error('Invalid TV show data:', show);
      return;
    }
    navigation.navigate('TVShowsDetail', { id: show.id });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      // Hanya reset pencarian jika query kosong
      setFilteredTVShows(tvShows);
    } else {
      // Pastikan hanya melakukan filter pada state tanpa mengubah data asli
      const filtered = tvShows.filter((show) =>
        show.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTVShows(filtered);
    }
  };

  const renderTVShowPoster = ({ item }) => (
    <TouchableOpacity onPress={() => handleTVShowPress(item)} style={styles.posterContainer}>
      <Image
        style={styles.posterImage}
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
      />
      <Text style={styles.posterTitle} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#B0B0B0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search TV Shows..."
          placeholderTextColor="#B0B0B0"
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={() => setSearchQuery(searchQuery)} // Pastikan keyboard tetap fokus
          onBlur={() => Keyboard.dismiss()} // Tambahkan ini jika ingin keyboard menutup saat input di-blur
        />
      </View>

      {/* Slider */}
      {searchQuery.trim() === '' && (
        <>
          <FlatList
            horizontal
            data={tvShows.slice(0, 5)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleTVShowPress(item)}>
                <View style={styles.sliderCard}>
                  <Image
                    style={styles.sliderImage}
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}` }}
                  />
                  <Text style={styles.sliderTitle}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.slider}
          />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue Watch</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllTVShows')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={tvShows.slice(5, 10)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleTVShowPress(item)}>
                  <View style={styles.movieCard}>
                    <Image
                      style={styles.image}
                      source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    />
                    <Text style={styles.movieTitle}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Global Trending</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllTVShows')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={tvShows.slice(10, 15)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleTVShowPress(item)}>
                  <View style={styles.movieCard}>
                    <Image
                      style={styles.image}
                      source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    />
                    <Text style={styles.movieTitle}>{item.name}</Text>
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
        data={searchQuery.trim() !== '' ? filteredTVShows : tvShows}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderTVShowPoster}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.gridContainer}
        keyboardShouldPersistTaps="always" // Tambahkan ini agar input tetap aktif
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

export default TVShowsScreen;
