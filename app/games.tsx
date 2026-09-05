import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function GamesScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
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

                    <View style={styles.headerText}>
                        <Text style={styles.eyebrow}>MIND30</Text>
                        <Text style={styles.title}>Choose Your Game</Text>
                        <Text style={styles.subtitle}>
                            Challenge your mind every day.
                        </Text>
                    </View>
                </View>

                {/* Game Cards */}
                <View style={styles.gamesContainer}>

                    {/* Math Challenge */}
                    <View style={styles.mathCard}>
                        <LinearGradient
                            colors={['#151B12', '#0E120D']}
                            style={styles.mathGradient}
                        >
                            <View style={styles.cardTopRow}>
                                <View style={styles.iconContainer}>
                                    <Ionicons
                                        name="calculator-outline"
                                        size={28}
                                        color="#B7FF3C"
                                    />
                                </View>

                                <View style={styles.activeBadge}>
                                    <View style={styles.activeDot} />
                                    <Text style={styles.activeText}>AVAILABLE</Text>
                                </View>
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={styles.cardEyebrow}>
                                    DAILY CHALLENGE
                                </Text>

                                <Text style={styles.cardTitle}>
                                    Math Challenge
                                </Text>

                                <Text style={styles.cardDescription}>
                                    Solve 10 correct math questions before
                                    the timer runs out.
                                </Text>
                            </View>

                            {/* Challenge Info */}
                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <Ionicons
                                        name="help-circle-outline"
                                        size={18}
                                        color="#8E9790"
                                    />
                                    <Text style={styles.infoText}>
                                        10 Questions
                                    </Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Ionicons
                                        name="timer-outline"
                                        size={18}
                                        color="#8E9790"
                                    />
                                    <Text style={styles.infoText}>
                                        Timed
                                    </Text>
                                </View>
                            </View>

                            {/* Start Button */}
                            <Pressable
                                style={({ pressed }) => [
                                    styles.playButton,
                                    pressed && styles.buttonPressed,
                                ]}
                                onPress={() => router.push('/challenge')}
                            >
                                <Text style={styles.playButtonText}>
                                    PLAY NOW
                                </Text>

                                <Ionicons
                                    name="arrow-forward"
                                    size={20}
                                    color="#080B0D"
                                />
                            </Pressable>
                        </LinearGradient>
                    </View>

                    {/* Sudoku */}
                    <View style={styles.sudokuCard}>
                        <View style={styles.cardTopRow}>
                            <View style={styles.sudokuIconContainer}>
                                <Ionicons
                                    name="grid-outline"
                                    size={28}
                                    color="#737B75"
                                />
                            </View>

                            <View style={styles.activeBadge}>
                                <View style={styles.activeDot} />
                                <Text style={styles.activeText}>
                                    AVAILABLE
                                </Text>
                            </View>
                        </View>

                        <View style={styles.cardContent}>
                            <Text style={styles.cardEyebrow}>
                                BRAIN PUZZLE
                            </Text>

                            <Text style={styles.sudokuTitle}>
                                Sudoku
                            </Text>

                            <Text style={styles.sudokuDescription}>
                                Sharpen your logic with a daily Sudoku
                                puzzle. This game will be available soon.
                            </Text>
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.sudokuPlayButton,
                                pressed && styles.buttonPressed,
                            ]}
                            onPress={() => router.push('/sudoku')}
                        >
                            <Text style={styles.sudokuPlayButtonText}>
                                PLAY SUDOKU
                            </Text>

                            <Ionicons
                                name="arrow-forward"
                                size={19}
                                color="#FFFFFF"
                            />
                        </Pressable>
                    </View>
                </View>

                {/* Bottom Hint */}
                <View style={styles.footer}>
                    <Ionicons
                        name="sparkles-outline"
                        size={16}
                        color="#68716B"
                    />

                    <Text style={styles.footerText}>
                        New games and challenges are coming soon.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

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

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30,
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

    headerText: {
        flex: 1,
        paddingTop: 2,
    },

    eyebrow: {
        color: '#B7FF3C',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 5,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 27,
        fontWeight: '800',
        letterSpacing: -0.7,
    },

    subtitle: {
        color: '#7E8781',
        fontSize: 14,
        marginTop: 6,
        lineHeight: 20,
    },

    // Cards
    gamesContainer: {
        gap: 18,
    },

    mathCard: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#334029',
    },

    mathGradient: {
        padding: 20,
    },

    sudokuCard: {
        backgroundColor: '#101417',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#20272A',
    },

    // Card Header
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    iconContainer: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: '#202A18',
        borderWidth: 1,
        borderColor: '#39472A',
        alignItems: 'center',
        justifyContent: 'center',
    },

    sudokuIconContainer: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: '#191E21',
        borderWidth: 1,
        borderColor: '#292F32',
        alignItems: 'center',
        justifyContent: 'center',
    },

    activeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#202A18',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#354329',
    },

    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#B7FF3C',
        marginRight: 6,
    },

    activeText: {
        color: '#B7FF3C',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.8,
    },

    comingSoonBadge: {
        backgroundColor: '#191E21',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#292F32',
    },

    comingSoonText: {
        color: '#707872',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.7,
    },

    // Card Content
    cardContent: {
        marginTop: 24,
    },

    cardEyebrow: {
        color: '#69736D',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 7,
    },

    cardTitle: {
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: '800',
        letterSpacing: -0.5,
    },

    sudokuTitle: {
        color: '#C6CCC8',
        fontSize: 25,
        fontWeight: '800',
        letterSpacing: -0.5,
    },

    cardDescription: {
        color: '#8A948D',
        fontSize: 14,
        lineHeight: 21,
        marginTop: 8,
        maxWidth: 330,
    },

    sudokuDescription: {
        color: '#6D7670',
        fontSize: 14,
        lineHeight: 21,
        marginTop: 8,
    },

    // Info
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        gap: 20,
    },

    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    infoText: {
        color: '#858E88',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 7,
    },

    // Buttons
    playButton: {
        height: 54,
        borderRadius: 16,
        backgroundColor: '#B7FF3C',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 18,
    },

    playButtonText: {
        color: '#080B0D',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 1,
        marginRight: 9,
    },

    buttonPressed: {
        opacity: 0.75,
        transform: [{ scale: 0.98 }],
    },

    disabledButton: {
        height: 52,
        borderRadius: 16,
        backgroundColor: '#171C1F',
        borderWidth: 1,
        borderColor: '#252C2F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },

    disabledButtonText: {
        color: '#626A64',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
        marginLeft: 8,
    },

    // Footer
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
        paddingHorizontal: 10,
    },

    footerText: {
        color: '#5E6761',
        fontSize: 11,
        marginLeft: 7,
        textAlign: 'center',
    },
    sudokuPlayButton: {
        height: 52,
        borderRadius: 16,
        backgroundColor: '#1A2023',
        borderWidth: 1,
        borderColor: '#30383B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },

    sudokuPlayButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
        marginRight: 8,
    },
});