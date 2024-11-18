import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { data as localData } from '../data/datalogin'; // Import data lokal dari datalogin.js

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    // Log input pengguna
    console.log("Email:", email);
    console.log("Password:", password);

    // Cek data di datalogin.js
    const localUser = localData.find(
      (user) => user.email === email && user.namaDepan.toLowerCase() === password.toLowerCase()
    );

    if (localUser) {
      Alert.alert('Success', `Selamat Datang, ${localUser.namaDepan}!`);
      onLoginSuccess();
      return;
    }

    // Jika tidak ada di datalogin.js, lanjutkan dengan API eksternal
    try {
      const response = await axios.get('https://reqres.in/api/users');
      const user = response.data.data.find(
        (user) => user.email === email && user.first_name.toLowerCase() === password.toLowerCase()
      );

      if (user) {
        Alert.alert('Success', `Selamat Datang, ${user.first_name}!`);
        onLoginSuccess();
      } else {
        Alert.alert('Error', 'Email atau password salah.');
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengakses data pengguna.');
      console.error("Error saat mengakses API:", error);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.stockcake.com/public/c/c/5/cc5edf3c-a609-4322-9002-78dc9dddcf74_large/cinematic-filming-process-stockcake.jpg' }} // URL gambar latar belakang
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Login to Your Account</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#B0B0B0"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#B0B0B0"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rememberContainer}>
          <Text style={styles.rememberText}>Remember me</Text>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>Or Continue With</Text>
        <View style={styles.socialIcons}>
          <FontAwesome name="google" size={30} color="#DB4437" style={styles.socialIcon} />
          <FontAwesome name="facebook" size={30} color="#4267B2" style={styles.socialIcon} />
          <FontAwesome name="apple" size={30} color="#000000" style={styles.socialIcon} />
        </View>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don’t have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 25,
    borderRadius: 10,
    width: '90%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: 'white',
    padding: 12,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberText: {
    color: 'white',
  },
  loginButton: {
    backgroundColor: '#E50914',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 18,
  },
  orText: {
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 15,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialIcon: {
    marginHorizontal: 12,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#B0B0B0',
  },
  signupLink: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LoginPage;
