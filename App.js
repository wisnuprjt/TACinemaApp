import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FavoritesProvider } from './data/FavoritesContext';
import LoginPage from './pages/LoginPage';
import MoviesScreen from './pages/MoviesScreen';
import TVShowsScreen from './pages/TVShowsScreen';
import MyListScreen from './pages/MyListScreen';
import ProfileScreen from './pages/ProfileScreen';
import AllMoviesScreen from './pages/AllMoviesScreen';
import MovieDetailScreen from './pages/MovieDetailScreen';
import TVShowsDetailScreen from './pages/TVShowsDetailScreen'; // Impor TVShowsDetailScreen
import AllTVShowsScreen from './pages/AllTVShowsScreen'; // Import AllTVShowsScreen
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#121212' },
        tabBarLabelStyle: { color: 'white' },
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          let iconColor = focused ? '#E50914' : 'white';

          switch (route.name) {
            case 'Movies':
              iconName = 'film';
              break;
            case 'TV Shows':
              iconName = 'tv';
              break;
            case 'My List':
              iconName = 'heart';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
        tabBarActiveTintColor: '#E50914',
        tabBarInactiveTintColor: 'white',
      })}
    >
      <Tab.Screen name="Movies" component={MoviesScreen} />
      <Tab.Screen name="TV Shows" component={TVShowsScreen} />
      <Tab.Screen name="My List" component={MyListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  const handleLoginSuccess = (navigation) => {
    navigation.navigate('Home');
  };

  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {(props) => (
              <LoginPage
                {...props}
                onLoginSuccess={() => handleLoginSuccess(props.navigation)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AllMovies"
            component={AllMoviesScreen}
            options={{ title: 'All Movies' }}
          />
          <Stack.Screen
            name="MovieDetail"
            component={MovieDetailScreen}
            options={{ title: 'Movie Detail' }}
          />
          <Stack.Screen
            name="TVShowsDetail"
            component={TVShowsDetailScreen} // Tambahkan navigasi untuk TVShowsDetailScreen
            options={{ title: 'TV Shows Detail' }}
          />
          <Stack.Screen
            name="AllTVShows"
            component={AllTVShowsScreen} // AllTVShowsScreen
            options={{ title: 'All TV Shows' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
