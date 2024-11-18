// TVShowsDetailScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../data/api';
import { FavoritesContext } from '../data/FavoritesContext'; // Import context
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

const TVShowsDetailScreen = ({ route }) => {
  const { id } = route.params || {};
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addFavorite, favorites } = useContext(FavoritesContext); // Access context function and state

  // Check if the TV show is already a favorite
  const isFavorite = favorites.some(fav => fav.id === id);

  useEffect(() => {
    if (!id) {
      console.error('Missing id parameter');
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tv/${id}`, {
          params: {
            api_key: API_KEY,
            append_to_response: 'credits',
            language: 'en-US',
          },
        });
        setDetails(response.data);
      } catch (error) {
        if (error.response) {
          console.error('Error fetching details (response):', error.response.data);
        } else if (error.request) {
          console.error('Error fetching details (no response):', error.request);
        } else {
          console.error('Error fetching details (setup):', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load details.</Text>
      </View>
    );
  }

  // Extract genre names
  const genres = details.genres?.map(genre => genre.name).join(', ') || 'N/A';

  // Handler to mark as favorite
  const handleMarkAsFavorite = () => {
    addFavorite(details);
  };

  return (
    <ScrollView style={styles.container}>
      {details.poster_path ? (
        <Image
          style={styles.poster}
          source={{ uri: `https://image.tmdb.org/t/p/w500${details.poster_path}` }}
        />
      ) : (
        <View style={styles.placeholderPoster}>
          <Text style={styles.placeholderText}>No Image Available</Text>
        </View>
      )}
      <View style={styles.favoriteContainer}>
        <TouchableOpacity onPress={handleMarkAsFavorite} style={styles.favoriteButton}>
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{details.name}</Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Rating: {details.vote_average || 'N/A'} / 10</Text>
        <Text style={styles.voteCountText}>({details.vote_count || '0'} votes)</Text>
      </View>
      <View style={styles.genreContainer}>
        <Text style={styles.genreText}>Genre: {genres}</Text>
      </View>
      {details.overview ? (
        <Text style={styles.overview}>{details.overview}</Text>
      ) : (
        <Text style={styles.noOverview}>No overview available.</Text>
      )}
      {details.credits && details.credits.cast && details.credits.cast.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Actors:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actorScroll}>
            {details.credits.cast.slice(0, 5).map((actor) => (
              <View key={actor.id} style={styles.actorContainer}>
                {actor.profile_path ? (
                  <Image
                    style={styles.actorImage}
                    source={{ uri: `https://image.tmdb.org/t/p/w500${actor.profile_path}` }}
                  />
                ) : (
                  <View style={styles.placeholderActorImage}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}
                <Text style={styles.actorName}>{actor.name}</Text>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.noActors}>No actors information available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#121212',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121212',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121212',
    },
    poster: {
      width: '100%',
      height: 300,
      borderRadius: 12,
      marginBottom: 16,
    },
    placeholderPoster: {
      width: '100%',
      height: 300,
      borderRadius: 12,
      backgroundColor: '#2A2A2A',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    placeholderText: {
      color: '#B0B0B0',
      fontSize: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 10,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    ratingText: {
      color: 'yellow',
      fontSize: 16,
      marginRight: 10,
    },
    voteCountText: {
      color: '#B0B0B0',
      fontSize: 14,
    },
    genreContainer: {
      marginBottom: 10,
    },
    genreText: {
      color: '#B0B0B0',
      fontSize: 16,
    },
    overview: {
      color: '#B0B0B0',
      fontSize: 16,
      marginBottom: 20,
    },
    noOverview: {
      color: '#B0B0B0',
      fontSize: 16,
      fontStyle: 'italic',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 10,
    },
    actorScroll: {
      marginBottom: 20,
    },
    actorContainer: {
      alignItems: 'center',
      marginRight: 15,
    },
    actorImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 5,
    },
    placeholderActorImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#2A2A2A',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
    actorName: {
      color: '#B0B0B0',
      fontSize: 12,
      textAlign: 'center',
    },
    noActors: {
      color: '#B0B0B0',
      fontSize: 16,
      fontStyle: 'italic',
    },
    favoriteContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 25,
      padding: 8,
    },
    favoriteButton: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default TVShowsDetailScreen;
