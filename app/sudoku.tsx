import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Alert,
    Dimensions,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    generateSudoku,
    SudokuGrid,
} from '../src/game/sudokuGenerator';

type SelectedCell = {
    row: number;
    col: number;
} | null;

const { width } = Dimensions.get('window');

const BOARD_SIZE = Math.min(
    width - 32,
    390
);

const CELL_SIZE = BOARD_SIZE / 9;

export default function SudokuScreen() {
    const router = useRouter();

    const initialGame = useMemo(
        () => generateSudoku(),
        []
    );

    const [puzzle, setPuzzle] =
        useState<SudokuGrid>(
            initialGame.puzzle.map(row => [...row])
        );

    const [solution, setSolution] =
        useState<SudokuGrid>(
            initialGame.solution.map(row => [...row])
        );

    const [originalPuzzle, setOriginalPuzzle] =
        useState<SudokuGrid>(
            initialGame.puzzle.map(row => [...row])
        );

    const [selectedCell, setSelectedCell] =
        useState<SelectedCell>(null);

    const [wrongCells, setWrongCells] =
        useState<string[]>([]);

    const [seconds, setSeconds] = useState(0);

    const [completed, setCompleted] =
        useState(false);

    useEffect(() => {
        if (completed) {
            return;
        }

        const interval = setInterval(() => {
            setSeconds(previous => previous + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [completed]);

    const formatTime = (
        totalSeconds: number
    ) => {
        const minutes = Math.floor(
            totalSeconds / 60
        );

        const remainingSeconds =
            totalSeconds % 60;

        return `${String(minutes).padStart(
            2,
            '0'
        )}:${String(
            remainingSeconds
        ).padStart(2, '0')}`;
    };

    const isOriginalCell = (
        row: number,
        col: number
    ) => {
        return originalPuzzle[row][col] !== 0;
    };

    const isSelected = (
        row: number,
        col: number
    ) => {
        return (
            selectedCell?.row === row &&
            selectedCell?.col === col
        );
    };

    const isSameRowOrColumn = (
        row: number,
        col: number
    ) => {
        if (!selectedCell) {
            return false;
        }

        return (
            selectedCell.row === row ||
            selectedCell.col === col
        );
    };

    const isSameBox = (
        row: number,
        col: number
    ) => {
        if (!selectedCell) {
            return false;
        }

        const selectedBoxRow =
            Math.floor(selectedCell.row / 3);

        const selectedBoxCol =
            Math.floor(selectedCell.col / 3);

        const cellBoxRow =
            Math.floor(row / 3);

        const cellBoxCol =
            Math.floor(col / 3);

        return (
            selectedBoxRow === cellBoxRow &&
            selectedBoxCol === cellBoxCol
        );
    };

    const isWrongCell = (
        row: number,
        col: number
    ) => {
        return wrongCells.includes(
            `${row}-${col}`
        );
    };

    const handleCellPress = (
        row: number,
        col: number
    ) => {
        if (completed) {
            return;
        }

        setSelectedCell({
            row,
            col,
        });
    };

    const handleNumberPress = (
        number: number
    ) => {
        if (!selectedCell || completed) {
            return;
        }

        const {
            row,
            col,
        } = selectedCell;

        if (isOriginalCell(row, col)) {
            return;
        }

        const cellKey = `${row}-${col}`;

        const correctAnswer =
            solution[row][col];

        if (number === correctAnswer) {
            const updatedPuzzle =
                puzzle.map(currentRow => [
                    ...currentRow,
                ]);

            updatedPuzzle[row][col] =
                number;

            setPuzzle(updatedPuzzle);

            setWrongCells(previous =>
                previous.filter(
                    key => key !== cellKey
                )
            );

            checkCompletion(
                updatedPuzzle
            );
        } else {
            setWrongCells(previous => {
                if (
                    previous.includes(cellKey)
                ) {
                    return previous;
                }

                return [
                    ...previous,
                    cellKey,
                ];
            });
        }
    };

    const handleErase = () => {
        if (!selectedCell || completed) {
            return;
        }

        const {
            row,
            col,
        } = selectedCell;

        if (isOriginalCell(row, col)) {
            return;
        }

        const updatedPuzzle =
            puzzle.map(currentRow => [
                ...currentRow,
            ]);

        updatedPuzzle[row][col] = 0;

        setPuzzle(updatedPuzzle);

        setWrongCells(previous =>
            previous.filter(
                key => key !== `${row}-${col}`
            )
        );
    };

    const checkCompletion = (
        currentGrid: SudokuGrid
    ) => {
        for (let row = 0; row < 9; row++) {
            for (
                let col = 0;
                col < 9;
                col++
            ) {
                if (
                    currentGrid[row][col] !==
                    solution[row][col]
                ) {
                    return;
                }
            }
        }

        setCompleted(true);
    };

    const startNewPuzzle = () => {
        Alert.alert(
            'New Puzzle',
            'Start a new Sudoku puzzle?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'New Puzzle',
                    onPress: () => {
                        const newGame =
                            generateSudoku();

                        setPuzzle(
                            newGame.puzzle.map(
                                row => [...row]
                            )
                        );

                        setSolution(
                            newGame.solution.map(
                                row => [...row]
                            )
                        );

                        setOriginalPuzzle(
                            newGame.puzzle.map(
                                row => [...row]
                            )
                        );

                        setSelectedCell(null);

                        setWrongCells([]);

                        setSeconds(0);

                        setCompleted(false);
                    },
                },
            ]
        );
    };

    if (completed) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View
                    style={
                        styles.completionContainer
                    }
                >
                    <View
                        style={
                            styles.successIcon
                        }
                    >
                        <Ionicons
                            name="checkmark"
                            size={34}
                            color="#080B0D"
                        />
                    </View>

                    <Text
                        style={
                            styles.completeEyebrow
                        }
                    >
                        PUZZLE COMPLETE
                    </Text>

                    <Text
                        style={
                            styles.completeTitle
                        }
                    >
                        Nice work!
                    </Text>

                    <Text
                        style={
                            styles.completeDescription
                        }
                    >
                        You completed today's Sudoku
                        challenge.
                    </Text>

                    <View
                        style={
                            styles.completeStat
                        }
                    >
                        <Ionicons
                            name="time-outline"
                            size={20}
                            color="#B7FF3C"
                        />

                        <Text
                            style={
                                styles.completeStatLabel
                            }
                        >
                            Time
                        </Text>

                        <Text
                            style={
                                styles.completeStatValue
                            }
                        >
                            {formatTime(seconds)}
                        </Text>
                    </View>

                    <Pressable
                        style={
                            styles.primaryButton
                        }
                        onPress={startNewPuzzle}
                    >
                        <Text
                            style={
                                styles.primaryButtonText
                            }
                        >
                            NEW PUZZLE
                        </Text>
                    </Pressable>

                    <Pressable
                        style={
                            styles.secondaryButton
                        }
                        onPress={() =>
                            router.back()
                        }
                    >
                        <Text
                            style={
                                styles.secondaryButtonText
                            }
                        >
                            BACK TO GAMES
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={styles.container}
        >
            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.content
                }
            >
                {/* Header */}

                <View style={styles.header}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() =>
                            router.back()
                        }
                    >
                        <Ionicons
                            name="arrow-back"
                            size={22}
                            color="#FFFFFF"
                        />
                    </Pressable>

                    <View style={styles.headerText}>
                        <Text
                            style={styles.eyebrow}
                        >
                            MIND30
                        </Text>

                        <Text
                            style={styles.title}
                        >
                            Sudoku
                        </Text>

                        <Text
                            style={styles.subtitle}
                        >
                            Complete the grid using
                            numbers 1–9.
                        </Text>
                    </View>
                </View>

                {/* Top Info */}

                <View style={styles.infoRow}>
                    <View style={styles.infoCard}>
                        <Ionicons
                            name="time-outline"
                            size={18}
                            color="#B7FF3C"
                        />

                        <View>
                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                TIME
                            </Text>

                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {formatTime(seconds)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <Ionicons
                            name="grid-outline"
                            size={18}
                            color="#B7FF3C"
                        />

                        <View>
                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                MODE
                            </Text>

                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                CLASSIC
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Board */}

                <View style={styles.board}>
                    {puzzle.map(
                        (row, rowIndex) => (
                            <View
                                key={rowIndex}
                                style={styles.boardRow}
                            >
                                {row.map(
                                    (
                                        value,
                                        colIndex
                                    ) => {
                                        const original =
                                            isOriginalCell(
                                                rowIndex,
                                                colIndex
                                            );

                                        const selected =
                                            isSelected(
                                                rowIndex,
                                                colIndex
                                            );

                                        const related =
                                            isSameRowOrColumn(
                                                rowIndex,
                                                colIndex
                                            ) ||
                                            isSameBox(
                                                rowIndex,
                                                colIndex
                                            );

                                        const wrong =
                                            isWrongCell(
                                                rowIndex,
                                                colIndex
                                            );

                                        return (
                                            <Pressable
                                                key={
                                                    colIndex
                                                }
                                                style={[
                                                    styles.cell,

                                                    colIndex ===
                                                        2 ||
                                                        colIndex ===
                                                        5
                                                        ? styles.boxRight
                                                        : null,

                                                    rowIndex ===
                                                        2 ||
                                                        rowIndex ===
                                                        5
                                                        ? styles.boxBottom
                                                        : null,

                                                    related &&
                                                    styles.relatedCell,

                                                    selected &&
                                                    styles.selectedCell,

                                                    wrong &&
                                                    styles.wrongCell,
                                                ]}
                                                onPress={() =>
                                                    handleCellPress(
                                                        rowIndex,
                                                        colIndex
                                                    )
                                                }
                                            >
                                                {value !== 0 && (
                                                    <Text
                                                        style={[
                                                            styles.cellText,

                                                            original
                                                                ? styles.originalNumber
                                                                : styles.userNumber,
                                                        ]}
                                                    >
                                                        {value}
                                                    </Text>
                                                )}

                                                {wrong && (
                                                    <Ionicons
                                                        name="close"
                                                        size={18}
                                                        color="#FF6B6B"
                                                    />
                                                )}
                                            </Pressable>
                                        );
                                    }
                                )}
                            </View>
                        )
                    )}
                </View>

                {/* Number Pad */}

                <Text style={styles.sectionTitle} >
                    SELECT NUMBER
                </Text>

                <View style={styles.numberPad}>
                    {[ 1, 2, 3, 4, 5, 6, 7, 8, 9, ].map(number => (
                        <Pressable
                            key={number}
                            style={({
                                pressed,
                            }) => [
                                    styles.numberButton,

                                    pressed &&
                                    styles.numberPressed,
                                ]}
                            onPress={() =>
                                handleNumberPress(
                                    number
                                )
                            }
                        >
                            <Text
                                style={
                                    styles.numberText
                                }
                            >
                                {number}
                            </Text>
                        </Pressable>
                    ))}

                    <Pressable
                        style={({
                            pressed,
                        }) => [
                                styles.eraseButton,

                                pressed &&
                                styles.numberPressed,
                            ]}
                        onPress={handleErase}
                    >
                        <Ionicons
                            name="backspace-outline"
                            size={22}
                            color="#FFFFFF"
                        />
                    </Pressable>
                </View>

                {/* Actions */}

                <Pressable
                    style={styles.newPuzzleButton}
                    onPress={startNewPuzzle}
                >
                    <Ionicons
                        name="refresh-outline"
                        size={19}
                        color="#B7FF3C"
                    />

                    <Text
                        style={
                            styles.newPuzzleText
                        }
                    >
                        NEW PUZZLE
                    </Text>
                </Pressable>

                <Text style={styles.hint}>
                    Sudoku is optional and does not
                    affect your Mind30 streak.
                </Text>
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
        paddingHorizontal: 16,
        paddingTop: 35,
        paddingBottom: 40,
        alignItems: 'center',
    },

    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
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
    },

    eyebrow: {
        color: '#B7FF3C',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 4,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 27,
        fontWeight: '800',
    },

    subtitle: {
        color: '#717A74',
        fontSize: 12,
        marginTop: 4,
    },

    infoRow: {
        width: '100%',
        flexDirection: 'row',
        gap: 10,
        marginBottom: 18,
    },

    infoCard: {
        flex: 1,
        height: 62,
        backgroundColor: '#101417',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#20272A',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        gap: 10,
    },

    infoLabel: {
        color: '#59625D',
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1,
    },

    infoValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
        marginTop: 2,
    },

    board: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        borderWidth: 2,
        borderColor: '#59625D',
        backgroundColor: '#101417',
    },

    boardRow: {
        flexDirection: 'row',
    },

    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#303739',
        alignItems: 'center',
        justifyContent: 'center',
    },

    boxRight: {
        borderRightWidth: 2,
        borderRightColor: '#59625D',
    },

    boxBottom: {
        borderBottomWidth: 2,
        borderBottomColor: '#59625D',
    },

    relatedCell: {
        backgroundColor: '#151A17',
    },

    selectedCell: {
        backgroundColor: '#25301B',
    },

    wrongCell: {
        backgroundColor: '#2C1719',
    },

    cellText: {
        fontSize: CELL_SIZE * 0.45,
        fontWeight: '700',
    },

    originalNumber: {
        color: '#FFFFFF',
    },

    userNumber: {
        color: '#B7FF3C',
    },

    sectionTitle: {
        width: '100%',
        color: '#59625D',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginTop: 24,
        marginBottom: 10,
    },

    numberPad: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    numberButton: {
        width: '17.5%',
        aspectRatio: 1,
        borderRadius: 14,
        backgroundColor: '#111619',
        borderWidth: 1,
        borderColor: '#252C2F',
        alignItems: 'center',
        justifyContent: 'center',
    },

    numberPressed: {
        opacity: 0.65,
        transform: [
            {
                scale: 0.96,
            },
        ],
    },

    numberText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
    },

    eraseButton: {
        width: '17.5%',
        aspectRatio: 1,
        borderRadius: 14,
        backgroundColor: '#181D20',
        borderWidth: 1,
        borderColor: '#2B3235',
        alignItems: 'center',
        justifyContent: 'center',
    },

    newPuzzleButton: {
        width: '100%',
        height: 52,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#334029',
        backgroundColor: '#131911',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 8,
    },

    newPuzzleText: {
        color: '#B7FF3C',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },

    hint: {
        color: '#59625D',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 14,
    },

    completionContainer: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },

    successIcon: {
        width: 74,
        height: 74,
        borderRadius: 24,
        backgroundColor: '#B7FF3C',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },

    completeEyebrow: {
        color: '#B7FF3C',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
    },

    completeTitle: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: '800',
        marginTop: 8,
    },

    completeDescription: {
        color: '#757E78',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 8,
    },

    completeStat: {
        width: '100%',
        height: 60,
        borderRadius: 16,
        backgroundColor: '#101417',
        borderWidth: 1,
        borderColor: '#20272A',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 28,
    },

    completeStatLabel: {
        flex: 1,
        color: '#858E88',
        fontSize: 12,
        marginLeft: 10,
    },

    completeStatValue: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '800',
    },

    primaryButton: {
        width: '100%',
        height: 54,
        borderRadius: 16,
        backgroundColor: '#B7FF3C',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 22,
    },

    primaryButtonText: {
        color: '#080B0D',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },

    secondaryButton: {
        width: '100%',
        height: 52,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#252C2F',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },

    secondaryButtonText: {
        color: '#8A938D',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.8,
    },
});