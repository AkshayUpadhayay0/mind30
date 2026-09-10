import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { registerUser } from '../../src/services/auth';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail || !password) {
      Alert.alert(
        'Missing details',
        'Please complete all fields.'
      );
      return;
    }

    if (cleanName.length < 2) {
      Alert.alert(
        'Invalid name',
        'Please enter your name.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Weak password',
        'Password must contain at least 6 characters.'
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser(
        cleanName,
        cleanEmail,
        password
      );

      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('Registration error:', error);

      let message =
        'Unable to create your account. Please try again.';

      switch (error?.code) {
        case 'auth/email-already-in-use':
          message =
            'An account already exists with this email.';
          break;

        case 'auth/invalid-email':
          message = 'Enter a valid email address.';
          break;

        case 'auth/weak-password':
          message = 'Please choose a stronger password.';
          break;
      }

      Alert.alert('Registration failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0A0D10', '#11161A', '#080A0C']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color="#FFFFFF"
              />
            </Pressable>

            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <Ionicons
                  name="flash"
                  size={22}
                  color="#0B0E10"
                />
              </View>

              <Text style={styles.brand}>
                MIND<Text style={styles.brandAccent}>30</Text>
              </Text>
            </View>

            <Text style={styles.title}>
              Start your{'\n'}
              <Text style={styles.highlight}>30-day run.</Text>
            </Text>

            <Text style={styles.subtitle}>
              One challenge every day. Keep the streak alive and
              earn your reward.
            </Text>

            <View style={styles.progressPreview}>
              <View style={styles.progressTop}>
                <Text style={styles.progressLabel}>
                  YOUR JOURNEY
                </Text>

                <Text style={styles.progressNumber}>
                  0 / 30
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>YOUR NAME</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#798187"
                />

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="What should we call you?"
                  placeholderTextColor="#5F676D"
                  style={styles.input}
                />
              </View>

              <Text style={styles.label}>EMAIL</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#798187"
                />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#5F676D"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>

              <Text style={styles.label}>PASSWORD</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#798187"
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#5F676D"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />

                <Pressable
                  hitSlop={12}
                  onPress={() =>
                    setShowPassword((value) => !value)
                  }
                >
                  <Ionicons
                    name={
                      showPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={21}
                    color="#798187"
                  />
                </Pressable>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0A0D10" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>
                      START DAY 1
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color="#0A0D10"
                    />
                  </>
                )}
              </Pressable>

              <Text style={styles.terms}>
                By continuing, you agree to the Mind30 Terms and
                Privacy Policy.
              </Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already playing?
              </Text>

              <Pressable
                onPress={() => router.replace('/(auth)/login')}
              >
                <Text style={styles.footerLink}>
                  Sign in
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 36,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#262C31',
    backgroundColor: '#12171B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 25,
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#B7FF3C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brand: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  brandAccent: {
    color: '#B7FF3C',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 44,
    lineHeight: 49,
    fontWeight: '900',
    letterSpacing: -1.4,
  },

  highlight: {
    color: '#B7FF3C',
  },

  subtitle: {
    color: '#929A9F',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
    marginBottom: 25,
  },

  progressPreview: {
    backgroundColor: '#12171B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#242B2F',
    padding: 17,
    marginBottom: 30,
  },

  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  progressLabel: {
    color: '#7F888D',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },

  progressNumber: {
    color: '#B7FF3C',
    fontSize: 12,
    fontWeight: '900',
  },

  progressTrack: {
    height: 7,
    backgroundColor: '#242A2E',
    borderRadius: 20,
    overflow: 'hidden',
  },

  progressFill: {
    width: '4%',
    height: '100%',
    backgroundColor: '#B7FF3C',
    borderRadius: 20,
  },

  form: {},

  label: {
    color: '#8A9298',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginBottom: 9,
  },

  inputContainer: {
    height: 58,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#252B30',
    backgroundColor: '#12171B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    gap: 12,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },

  primaryButton: {
    height: 60,
    marginTop: 4,
    borderRadius: 18,
    backgroundColor: '#B7FF3C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  primaryButtonText: {
    color: '#0A0D10',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  terms: {
    textAlign: 'center',
    color: '#60686D',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 16,
    paddingHorizontal: 14,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 28,
    marginBottom: 28,
  },

  footerText: {
    color: '#767F84',
    fontSize: 14,
  },

  footerLink: {
    color: '#B7FF3C',
    fontSize: 14,
    fontWeight: '800',
  },
});