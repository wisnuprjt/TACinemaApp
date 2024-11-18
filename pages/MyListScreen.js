import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FavoritesContext } from '../data/FavoritesContext';

const MyListScreen = () => {
  const { favorites, removeFavorite } = useContext(FavoritesContext); // Pastikan fungsi removeFavorite tersedia di FavoritesContext

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="white" />
        <Text style={styles.headerTitle}>
          <Text style={{ color: 'white' }}>Cinema</Text>
          <Text style={{ color: '#E50914' }}>App</Text>
          <Text style={{ color: 'white' }}>+</Text>
        </Text>
        <Ionicons name="search" size={24} color="white" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#B0B0B0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search in My List"
          placeholderTextColor="#B0B0B0"
        />
      </View>

      {/* Favorites List */}
      <FlatList
        data={favorites}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
            <Image
              style={styles.image}
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
            />
            <Text style={styles.movieTitle}>{item.title || item.name}</Text>
            <TouchableOpacity
              style={styles.loveButton}
              onPress={() => removeFavorite(item.id)} // Menghapus dari favorit jika diinginkan
            >
              <Ionicons name="heart" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListEmptyComponent={<Text style={styles.emptyText}>No items in your list.</Text>}
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
    paddingVertical: 10,
    paddingHorizontal: 15,
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
  contentContainer: {
    padding: 10,
  },
  movieCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginBottom: 15,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
    maxWidth: '48%',
    overflow: 'hidden',
    aspectRatio: 0.67,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 0.67,
    borderRadius: 10,
  },
  movieTitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  loveButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 20,
  },
});

export default MyListScreen;
