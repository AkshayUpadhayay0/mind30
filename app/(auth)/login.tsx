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
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { loginUser } from '../../src/services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      Alert.alert('Missing details', 'Enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      await loginUser(cleanEmail, password);

      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('Login error:', error);

      let message = 'Unable to sign in. Please try again.';

      switch (error?.code) {
        case 'auth/invalid-email':
          message = 'Enter a valid email address.';
          break;

        case 'auth/invalid-credential':
          message = 'Incorrect email or password.';
          break;

        case 'auth/too-many-requests':
          message = 'Too many attempts. Please try again later.';
          break;
      }

      Alert.alert('Login failed', message);
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
          <View style={styles.container}>
            <View style={styles.topSection}>
              <View style={styles.brandRow}>
                <View style={styles.logo}>
                  <Ionicons name="flash" size={22} color="#0B0E10" />
                </View>

                <Text style={styles.brand}>
                  MIND<Text style={styles.brandAccent}>30</Text>
                </Text>
              </View>

              <View style={styles.badge}>
                <Ionicons name="flame" size={14} color="#B7FF3C" />
                <Text style={styles.badgeText}>
                  30 DAY BRAIN CHALLENGE
                </Text>
              </View>

              <Text style={styles.title}>
                Welcome{'\n'}
                <Text style={styles.highlight}>back.</Text>
              </Text>

              <Text style={styles.subtitle}>
                Continue your streak. Beat today's challenge.
              </Text>
            </View>

            <View style={styles.form}>
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
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
                  placeholder="Enter your password"
                  placeholderTextColor="#5F676D"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />

                <Pressable
                  hitSlop={12}
                  onPress={() => setShowPassword((value) => !value)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={21}
                    color="#798187"
                  />
                </Pressable>
              </View>

              <Pressable style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0A0D10" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>
                      ENTER MIND30
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color="#0A0D10"
                    />
                  </>
                )}
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                New to Mind30?
              </Text>

              <Pressable
                onPress={() => router.push('./(auth)/register')}
              >
                <Text style={styles.footerLink}>
                  Start the challenge
                </Text>
              </Pressable>
            </View>
          </View>
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

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 24,
  },

  topSection: {
    marginBottom: 42,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
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

  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#151C18',
    borderWidth: 1,
    borderColor: '#293429',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 22,
  },

  badgeText: {
    color: '#B7FF3C',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '900',
    letterSpacing: -1.5,
  },

  highlight: {
    color: '#B7FF3C',
  },

  subtitle: {
    color: '#929A9F',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
    maxWidth: 320,
  },

  form: {
    flex: 1,
  },

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

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -7,
    marginBottom: 26,
  },

  forgotText: {
    color: '#A5ADB2',
    fontWeight: '600',
    fontSize: 13,
  },

  primaryButton: {
    height: 60,
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

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 28,
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