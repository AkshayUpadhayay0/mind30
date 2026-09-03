import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useUser } from '../../src/context/UserContext';

import { useCallback, } from 'react';

import { useFocusEffect, } from 'expo-router';

export default function HomeScreen() {

  const { profile, loading, refreshProfile } = useUser();


  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [refreshProfile])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#B7FF3C"
        />

        <Text style={styles.loadingText}>
          Loading Mind30...
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorTitle}>
          Profile not found
        </Text>

        <Text style={styles.errorText}>
          We couldn't load your Mind30 profile.
        </Text>
      </View>
    );
  }

  const firstName =
    profile.displayName?.split(' ')[0] || 'Player';

  const streakProgress = Math.min(
    profile.currentStreak / 30,
    1
  );

  const remainingDays = Math.max(
    30 - profile.currentStreak,
    0
  );

  return (
    <LinearGradient
      colors={['#080B0D', '#0D1215', '#080A0C']}
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greetingLabel}>
                WELCOME BACK
              </Text>

              <Text style={styles.greeting}>
                Hey, {firstName}
              </Text>
            </View>

            <Pressable style={styles.profileButton} onPress={() => router.push('/profile')}>
              <Text style={styles.profileInitial}>
                {firstName.charAt(0).toUpperCase()}
              </Text>
            </Pressable>
          </View>

          {/* BRAND */}
          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <Ionicons
                name="flash"
                size={18}
                color="#0A0D10"
              />
            </View>

            <Text style={styles.brand}>
              MIND
              <Text style={styles.brandAccent}>
                30
              </Text>
            </Text>
          </View>

          {/* MAIN STREAK CARD */}
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroLabel}>
                  CURRENT STREAK
                </Text>

                <View style={styles.streakRow}>
                  <Ionicons
                    name="flame"
                    size={34}
                    color="#B7FF3C"
                  />

                  <Text style={styles.streakNumber}>
                    {profile.currentStreak}
                  </Text>

                  <Text style={styles.streakDays}>
                    DAYS
                  </Text>
                </View>
              </View>

              <View style={styles.levelBadge}>
                <Text style={styles.levelSmall}>
                  LEVEL
                </Text>

                <Text style={styles.levelNumber}>
                  {profile.currentLevel}
                </Text>
              </View>
            </View>

            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                T-SHIRT PROGRESS
              </Text>

              <Text style={styles.progressCount}>
                {profile.currentStreak}/30
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${streakProgress * 100}%`,
                  },
                ]}
              />
            </View>

            {profile.rewardEligible ? (
              <View style={styles.rewardUnlocked}>
                <Ionicons
                  name="shirt-outline"
                  size={18}
                  color="#B7FF3C"
                />

                <Text style={styles.rewardUnlockedText}>
                  T-shirt unlocked!
                </Text>
              </View>
            ) : (
              <Text style={styles.progressDescription}>
                {remainingDays} consecutive{' '}
                {remainingDays === 1 ? 'day' : 'days'} to
                unlock your Mind30 T-shirt.
              </Text>
            )}
          </View>

          {/* STATS */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons
                name="trophy-outline"
                size={21}
                color="#B7FF3C"
              />

              <Text style={styles.statValue}>
                {profile.longestStreak}
              </Text>

              <Text style={styles.statLabel}>
                BEST STREAK
              </Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons
                name="layers-outline"
                size={21}
                color="#B7FF3C"
              />

              <Text style={styles.statValue}>
                {profile.currentLevel}
              </Text>

              <Text style={styles.statLabel}>
                CURRENT LEVEL
              </Text>
            </View>
          </View>

          {/* TODAY'S CHALLENGE */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              TODAY'S CHALLENGE
            </Text>

            <View style={styles.requiredBadge}>
              <Text style={styles.requiredText}>
                REQUIRED
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.startButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              router.push('/games');
            }}
          >
            <Text style={styles.startButtonText}>
              START CHALLENGE
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#090C0E"
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.startButton2,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              router.push('/profile');
            }}
          >
            <Text style={styles.startButton2Text}>
              PLAYER PROFILE
            </Text>

            <Ionicons
              name="person-circle-outline"
              size={26}
              color="#B7FF3C"
            />
          </Pressable>


        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}



const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#080B0D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#8B9499',
    marginTop: 14,
    fontSize: 14,
  },

  errorTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  errorText: {
    color: '#818A90',
    marginTop: 8,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greetingLabel: {
    color: '#6F787D',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  greeting: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 3,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#171D20',
    borderWidth: 1,
    borderColor: '#293034',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileInitial: {
    color: '#B7FF3C',
    fontSize: 18,
    fontWeight: '900',
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 17,
    gap: 8,
  },

  logo: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#B7FF3C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brand: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },

  brandAccent: {
    color: '#B7FF3C',
  },

  heroCard: {
    borderRadius: 25,
    backgroundColor: '#13191C',
    borderWidth: 1,
    borderColor: '#252D30',
    padding: 21,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  heroLabel: {
    color: '#778086',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  streakRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 7,
  },

  streakNumber: {
    color: '#FFFFFF',
    fontSize: 49,
    lineHeight: 52,
    fontWeight: '900',
    marginLeft: 6,
  },

  streakDays: {
    color: '#828B90',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
    marginLeft: 5,
  },

  levelBadge: {
    width: 70,
    height: 70,
    borderRadius: 21,
    backgroundColor: '#B7FF3C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  levelSmall: {
    color: '#222A16',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  levelNumber: {
    color: '#080B0D',
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 32,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 26,
    marginBottom: 9,
  },

  progressText: {
    color: '#778086',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },

  progressCount: {
    color: '#B7FF3C',
    fontSize: 11,
    fontWeight: '900',
  },

  progressTrack: {
    height: 8,
    backgroundColor: '#252C30',
    borderRadius: 20,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#B7FF3C',
    borderRadius: 20,
  },

  progressDescription: {
    color: '#788187',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },

  rewardUnlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 12,
  },

  rewardUnlockedText: {
    color: '#B7FF3C',
    fontWeight: '800',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#11171A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222A2E',
    padding: 17,
  },

  statValue: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 15,
  },

  statLabel: {
    color: '#6F787D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 12,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },

  requiredBadge: {
    backgroundColor: '#1A221A',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },

  requiredText: {
    color: '#B7FF3C',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  optionalText: {
    color: '#687176',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  challengeCard: {
    minHeight: 88,
    borderRadius: 21,
    backgroundColor: '#12181B',
    borderWidth: 1,
    borderColor: '#252C30',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  challengeIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: '#1B231B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  challengeContent: {
    flex: 1,
    paddingHorizontal: 14,
  },

  challengeTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  challengeDescription: {
    color: '#747D82',
    fontSize: 12,
    marginTop: 5,
  },

  challengeLevel: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#20272A',
    borderRadius: 9,
  },

  challengeLevelText: {
    color: '#AAB2B6',
    fontSize: 10,
    fontWeight: '900',
  },

  startButton: {
    height: 60,
    backgroundColor: '#B7FF3C',
    borderRadius: 19,
    marginTop: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
  },

  startButtonText: {
    color: '#080B0D',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  buttonPressed: {
    opacity: 0.85,
  },

  startButton2: {
    height: 60,
    backgroundColor: '#171D20',
    borderRadius: 19,
    marginTop: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    borderWidth: 1,
    borderColor: '#2A3235',
  },

  startButton2Text: {
    color: '#B7FF3C',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

});