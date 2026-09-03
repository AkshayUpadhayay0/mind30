import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
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

import { useUser } from '../src/context/UserContext';
import {
  generateMathQuestion,
  getChallengeTimeSeconds,
  MathQuestion,
} from '../src/game/mathGenerator';

import { auth } from '../src/services/auth';
import { completeDailyChallenge } from '../src/services/firestore';


const TOTAL_QUESTIONS = 10;

export default function ChallengeScreen() {
  const { profile } = useUser();

  const level = profile?.currentLevel ?? 1;

  const [question, setQuestion] =
    useState<MathQuestion | null>(null);

  const [completed, setCompleted] =
    useState(0);

  const [answer, setAnswer] = useState('');

  const [timeLeft, setTimeLeft] =
    useState(getChallengeTimeSeconds(level));

  const [started, setStarted] =
    useState(false);

  const [timeUp, setTimeUp] =
    useState(false);

  const [checking, setChecking] =
    useState(false);

  const [wrongCount, setWrongCount] =
    useState(0);

  const startChallenge = useCallback(() => {
    setQuestion(
      generateMathQuestion(level)
    );

    setCompleted(0);
    setAnswer('');
    setTimeLeft(
      getChallengeTimeSeconds(level)
    );
    setTimeUp(false);
    setStarted(true);
    setWrongCount(0);
  }, [level]);

  useEffect(() => {
    startChallenge();
  }, [startChallenge]);

  useEffect(() => {
    if (!started || timeUp || completed >= TOTAL_QUESTIONS) {
      return;
    }

    if (timeLeft <= 0) {
      setTimeUp(true);
      setStarted(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(previous => {
        if (previous <= 1) {
          clearInterval(timer);

          setTimeUp(true);
          setStarted(false);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    started,
    timeLeft,
    timeUp,
    completed,
  ]);

  const finishChallenge = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert(
        'Session expired',
        'Please log in again.'
      );

      router.replace('/login');
      return;
    }

    try {
      const result =
        await completeDailyChallenge(
          user.uid
        );

      if (result.alreadyCompletedToday) {
        Alert.alert(
          'Already completed',
          'You have already completed today\'s challenge.'
        );

        router.replace('/(tabs)');
        return;
      }

      setCompleted(TOTAL_QUESTIONS);
      setStarted(false);
      console.log(
        '🔥 Challenge completed',
        result
      );
    } catch (error) {
      console.error(
        '❌ Challenge completion error:',
        error
      );

      Alert.alert(
        'Something went wrong',
        'Your challenge was completed, but we could not update your streak. Please try again.'
      );
    }
  };

  const handleSubmit = async () => {
    if (
      !question ||
      !answer.trim() ||
      checking ||
      timeUp
    ) {
      return;
    }

    setChecking(true);

    const userAnswer = Number(
      answer.trim()
    );

    if (
      Number.isFinite(userAnswer) &&
      userAnswer === question.answer
    ) {
      const newCompleted =
        completed + 1;

      setAnswer('');

      if (newCompleted >= TOTAL_QUESTIONS) {
        await finishChallenge();
      } else {
        setCompleted(newCompleted);

        setQuestion(
          generateMathQuestion(level)
        );
      }
    } else {
      setWrongCount(
        previous => previous + 1
      );

      setAnswer('');

      setQuestion(
        generateMathQuestion(level)
      );
    }

    setChecking(false);
  };

  const handleRetry = () => {
    startChallenge();
  };

  const handleBack = () => {
    Alert.alert(
      'Leave challenge?',
      'Your current progress will be lost.',
      [
        {
          text: 'Stay',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const challengeCompleted =
    completed >= TOTAL_QUESTIONS;

  if (challengeCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons
              name="checkmark"
              size={42}
              color="#080B0D"
            />
          </View>

          <Text style={styles.successTitle}>
            Challenge Complete
          </Text>

          <Text style={styles.successSubtitle}>
            Excellent work.
          </Text>

          <View style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>
                LEVEL
              </Text>

              <Text style={styles.resultValue}>
                {level}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>
                CORRECT
              </Text>

              <Text style={styles.resultValue}>
                {completed}/{TOTAL_QUESTIONS}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>
                WRONG ATTEMPTS
              </Text>

              <Text style={styles.resultValue}>
                {wrongCount}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>
                TIME LEFT
              </Text>

              <Text style={styles.resultValue}>
                {formatTime(timeLeft)}
              </Text>
            </View>
          </View>

          <Text style={styles.nextStepText}>
            Your streak has been updated.
            Come back tomorrow to continue it.
          </Text>

          <Pressable
            style={styles.homeButton}
            onPress={() =>
              router.replace('/(tabs)')
            }
          >
            <Text style={styles.homeButtonText}>
              BACK TO HOME
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (timeUp) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.timeUpContainer}>
          <View style={styles.timeUpIcon}>
            <Ionicons
              name="time-outline"
              size={38}
              color="#B7FF3C"
            />
          </View>

          <Text style={styles.timeUpTitle}>
            Time's Up
          </Text>

          <Text style={styles.timeUpSubtitle}>
            You haven't completed the challenge.
          </Text>

          <View style={styles.failureCard}>
            <Text style={styles.failureBig}>
              {completed}/{TOTAL_QUESTIONS}
            </Text>

            <Text style={styles.failureSmall}>
              questions completed
            </Text>
          </View>

          <Text style={styles.retryDescription}>
            Don't worry. You can try again with
            5 completely new questions.
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Ionicons
              name="refresh"
              size={20}
              color="#080B0D"
            />

            <Text style={styles.retryButtonText}>
              TRY AGAIN
            </Text>
          </Pressable>

          <Pressable
            style={styles.exitButton}
            onPress={() =>
              router.replace('/(tabs)')
            }
          >
            <Text style={styles.exitButtonText}>
              BACK TO HOME
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* HEADER */}

          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
            >
              <Ionicons
                name="arrow-back"
                size={21}
                color="#FFFFFF"
              />
            </Pressable>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>
                MATH CHALLENGE
              </Text>

              <Text style={styles.headerLevel}>
                LEVEL {level}
              </Text>
            </View>

            <View style={styles.timerContainer}>
              <Ionicons
                name="timer-outline"
                size={18}
                color={
                  timeLeft <= 30
                    ? '#FF6B6B'
                    : '#B7FF3C'
                }
              />

              <Text
                style={[
                  styles.timerText,
                  timeLeft <= 30 &&
                  styles.timerDanger,
                ]}
              >
                {formatTime(timeLeft)}
              </Text>
            </View>
          </View>

          {/* PROGRESS */}

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                CORRECT ANSWERS
              </Text>

              <Text style={styles.progressCount}>
                {completed}/{TOTAL_QUESTIONS}
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(completed /
                      TOTAL_QUESTIONS) *
                      100
                      }%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* QUESTION */}

          <View style={styles.questionArea}>
            <Text style={styles.questionLabel}>
              SOLVE
            </Text>

            <Text style={styles.question}>
              {question?.text ?? '...'}
            </Text>

            <Text style={styles.questionHint}>
              Enter your answer
            </Text>

            <TextInput
              value={answer}
              onChangeText={setAnswer}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="#4E585D"
              style={styles.answerInput}
              autoFocus
              editable={!checking}
              onSubmitEditing={
                handleSubmit
              }
              returnKeyType="done"
            />

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed &&
                styles.submitButtonPressed,
                (!answer.trim() ||
                  checking) &&
                styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={
                !answer.trim() || checking
              }
            >
              <Text style={styles.submitButtonText}>
                SUBMIT ANSWER
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#080B0D"
              />
            </Pressable>
          </View>

          {/* INFO */}

          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#747E83"
            />

            <Text style={styles.infoText}>
              Wrong answer? No problem. You'll
              receive a new question and the timer
              keeps running.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B0D',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 40,
  },

  header: {
    minHeight: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#151B1E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },

  headerLevel: {
    color: '#B7FF3C',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 3,
  },

  timerContainer: {
    minWidth: 72,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#151B1E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  timerText: {
    color: '#B7FF3C',
    fontSize: 15,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },

  timerDanger: {
    color: '#FF6B6B',
  },

  progressSection: {
    marginTop: 12,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },

  progressLabel: {
    color: '#687277',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  progressCount: {
    color: '#B7FF3C',
    fontSize: 11,
    fontWeight: '900',
  },

  progressTrack: {
    height: 7,
    borderRadius: 10,
    backgroundColor: '#22292D',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#B7FF3C',
    borderRadius: 10,
  },

  questionArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  questionLabel: {
    color: '#6E797E',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },

  question: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
    marginTop: 14,
    letterSpacing: 1,
  },

  questionHint: {
    color: '#697378',
    fontSize: 13,
    marginTop: 12,
  },

  answerInput: {
    width: '100%',
    maxWidth: 330,
    height: 67,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#30393D',
    backgroundColor: '#11171A',
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 27,
  },

  submitButton: {
    width: '100%',
    maxWidth: 330,
    height: 59,
    borderRadius: 18,
    backgroundColor: '#B7FF3C',
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  submitButtonPressed: {
    opacity: 0.82,
  },

  submitButtonDisabled: {
    opacity: 0.35,
  },

  submitButtonText: {
    color: '#080B0D',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#11171A',
    borderWidth: 1,
    borderColor: '#20282C',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },

  infoText: {
    flex: 1,
    color: '#727D82',
    fontSize: 11,
    lineHeight: 16,
  },

  successContainer: {
    flex: 1,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  successIcon: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: '#B7FF3C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  successTitle: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '900',
    marginTop: 24,
  },

  successSubtitle: {
    color: '#778187',
    fontSize: 14,
    marginTop: 7,
  },

  resultCard: {
    width: '100%',
    backgroundColor: '#12181B',
    borderWidth: 1,
    borderColor: '#252D31',
    borderRadius: 21,
    paddingHorizontal: 19,
    marginTop: 30,
  },

  resultRow: {
    minHeight: 54,
    borderBottomWidth: 1,
    borderBottomColor: '#242C30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  resultLabel: {
    color: '#707A7F',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  resultValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  nextStepText: {
    color: '#687278',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 18,
    maxWidth: 320,
  },

  homeButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: '#B7FF3C',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 23,
  },

  homeButtonText: {
    color: '#080B0D',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  timeUpContainer: {
    flex: 1,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  timeUpIcon: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: '#151D19',
    borderWidth: 1,
    borderColor: '#29352A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timeUpTitle: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '900',
    marginTop: 22,
  },

  timeUpSubtitle: {
    color: '#747E83',
    fontSize: 13,
    marginTop: 7,
    textAlign: 'center',
  },

  failureCard: {
    width: '100%',
    borderRadius: 21,
    backgroundColor: '#12181B',
    borderWidth: 1,
    borderColor: '#252D31',
    alignItems: 'center',
    paddingVertical: 25,
    marginTop: 28,
  },

  failureBig: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '900',
  },

  failureSmall: {
    color: '#6E797E',
    fontSize: 11,
    marginTop: 5,
  },

  retryDescription: {
    color: '#707A80',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 310,
    marginTop: 18,
  },

  retryButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: '#B7FF3C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 23,
  },

  retryButtonText: {
    color: '#080B0D',
    fontSize: 13,
    fontWeight: '900',
  },

  exitButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  exitButtonText: {
    color: '#697378',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});