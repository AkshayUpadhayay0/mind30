import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useUser } from '../src/context/UserContext';
import { logoutUser } from '../src/services/auth';

export default function ProfileScreen() {
  const router = useRouter();

  const { profile } = useUser();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
            } catch (error) {
              console.error('Logout failed:', error);

              Alert.alert(
                'Error',
                'Unable to log out. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const currentStreak = profile?.currentStreak ?? 0;
  const longestStreak = profile?.longestStreak ?? 0;
  const currentLevel = profile?.currentLevel ?? 1;

  const rewardProgress = Math.min(currentStreak, 30);
  const rewardPercentage =
    (rewardProgress / 30) * 100;

  const daysRemaining = Math.max(
    30 - currentStreak,
    0
  );

  const rewardUnlocked =
    profile?.rewardEligible ?? false;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#FFFFFF"
            />
          </Pressable>

          <View>
            <Text style={styles.eyebrow}>
              MIND30
            </Text>

            <Text style={styles.title}>
              Player Profile
            </Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(
                profile?.displayName || 'Player'
              )}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.playerName}>
              {profile?.displayName || 'Player'}
            </Text>

            <Text style={styles.email}>
              {profile?.email || ''}
            </Text>

            <View style={styles.levelBadge}>
              <Ionicons
                name="trophy-outline"
                size={14}
                color="#B7FF3C"
              />

              <Text style={styles.levelBadgeText}>
                LEVEL {currentLevel}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>
          GAME STATS
        </Text>

        <View style={styles.statsGrid}>
          <StatCard
            icon="flame-outline"
            label="Current Streak"
            value={`${currentStreak}`}
            suffix="days"
          />

          <StatCard
            icon="trophy-outline"
            label="Longest Streak"
            value={`${longestStreak}`}
            suffix="days"
          />

          <StatCard
            icon="bar-chart-outline"
            label="Current Level"
            value={`${currentLevel}`}
            suffix="/ 10"
          />

          <StatCard
            icon="calendar-outline"
            label="Reward Goal"
            value={`${rewardProgress}`}
            suffix="/ 30"
          />
        </View>

        {/* Reward */}
        <Text style={styles.sectionTitle}>
          T-SHIRT REWARD
        </Text>

        <View style={styles.rewardCard}>
          <View style={styles.rewardHeader}>
            <View style={styles.rewardIcon}>
              <Ionicons
                name="shirt-outline"
                size={25}
                color="#B7FF3C"
              />
            </View>

            <View style={styles.rewardHeaderText}>
              <Text style={styles.rewardTitle}>
                {rewardUnlocked
                  ? 'Reward Unlocked!'
                  : 'Earn Your Mind30 T-Shirt'}
              </Text>

              <Text style={styles.rewardSubtitle}>
                {rewardUnlocked
                  ? 'You completed 30 consecutive days.'
                  : 'Complete 30 consecutive days to unlock.'}
              </Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>
              {currentStreak} / 30 DAYS
            </Text>

            <Text style={styles.progressRemaining}>
              {rewardUnlocked
                ? 'COMPLETED'
                : `${daysRemaining} DAYS LEFT`}
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${rewardPercentage}%`,
                },
              ]}
            />
          </View>

          {!rewardUnlocked && (
            <Text style={styles.rewardHint}>
              Keep your streak alive to claim your
              free T-shirt.
            </Text>
          )}
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>
          ACCOUNT
        </Text>

        <View style={styles.accountCard}>
          <Pressable
            style={({ pressed }) => [
              styles.accountRow,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.accountIcon}>
              <Ionicons
                name="person-outline"
                size={19}
                color="#8E9790"
              />
            </View>

            <Text style={styles.accountText}>
              Account Information
            </Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#4E5651"
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={({ pressed }) => [
              styles.accountRow,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.accountIcon}>
              <Ionicons
                name="settings-outline"
                size={19}
                color="#8E9790"
              />
            </View>

            <Text style={styles.accountText}>
              Settings
            </Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#4E5651"
            />
          </Pressable>
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutPressed,
          ]}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#FF6B6B"
          />

          <Text style={styles.logoutText}>
            LOG OUT
          </Text>
        </Pressable>

        <Text style={styles.version}>
          Mind30 • Keep Your Mind Sharp
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------- */
/* Stat Card                        */
/* -------------------------------- */

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  suffix: string;
};

function StatCard({
  icon,
  label,
  value,
  suffix,
}: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons
          name={icon}
          size={19}
          color="#B7FF3C"
        />
      </View>

      <Text style={styles.statLabel}>
        {label}
      </Text>

      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>
          {value}
        </Text>

        <Text style={styles.statSuffix}>
          {suffix}
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

function getInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return 'P';
  }

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();
}

/* -------------------------------- */
/* Styles                           */
/* -------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B0D',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 40,
  },

  /* Header */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#111519',
    borderWidth: 1,
    borderColor: '#20272A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  eyebrow: {
    color: '#B7FF3C',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },

  /* Profile */

  profileCard: {
    backgroundColor: '#101417',
    borderWidth: 1,
    borderColor: '#20272A',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#202A18',
    borderWidth: 1,
    borderColor: '#39472A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#B7FF3C',
    fontSize: 23,
    fontWeight: '900',
  },

  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },

  playerName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  email: {
    color: '#707A74',
    fontSize: 12,
    marginTop: 4,
  },

  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#1B2117',
    borderWidth: 1,
    borderColor: '#303B27',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 10,
  },

  levelBadgeText: {
    color: '#B7FF3C',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginLeft: 5,
  },

  /* Sections */

  sectionTitle: {
    color: '#59625D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.7,
    marginTop: 28,
    marginBottom: 12,
  },

  /* Stats */

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#101417',
    borderWidth: 1,
    borderColor: '#20272A',
    borderRadius: 18,
    padding: 15,
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#1A2116',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  statLabel: {
    color: '#727B75',
    fontSize: 11,
    fontWeight: '600',
  },

  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 5,
  },

  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },

  statSuffix: {
    color: '#59625D',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 5,
  },

  /* Reward */

  rewardCard: {
    backgroundColor: '#101417',
    borderWidth: 1,
    borderColor: '#303A29',
    borderRadius: 22,
    padding: 18,
  },

  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rewardIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#1C2417',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rewardHeaderText: {
    flex: 1,
    marginLeft: 13,
  },

  rewardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  rewardSubtitle: {
    color: '#6E7872',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 8,
  },

  progressLabel: {
    color: '#B7FF3C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  progressRemaining: {
    color: '#646D67',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  progressTrack: {
    height: 8,
    borderRadius: 10,
    backgroundColor: '#252C2A',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#B7FF3C',
  },

  rewardHint: {
    color: '#626B65',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 10,
  },

  /* Account */

  accountCard: {
    backgroundColor: '#101417',
    borderWidth: 1,
    borderColor: '#20272A',
    borderRadius: 20,
    overflow: 'hidden',
  },

  accountRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  accountIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#181D20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  accountText: {
    flex: 1,
    color: '#A3AAA5',
    fontSize: 13,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#20272A',
    marginLeft: 63,
  },

  rowPressed: {
    backgroundColor: '#151A1D',
  },

  /* Logout */

  logoutButton: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3A2527',
    backgroundColor: '#171214',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  logoutText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 8,
  },

  logoutPressed: {
    opacity: 0.7,
  },

  version: {
    color: '#3F4742',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 25,
  },
});