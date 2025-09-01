import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/MyContexts";

const QuizDetail = ({ route, navigation }) => {
    const { quizId } = route.params;
    const { token } = useContext(MyUserContext);

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedChoices, setSelectedChoices] = useState({});

    const [showSubmissions, setShowSubmissions] = useState(false);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await authApis(token).get(`${endpoints["quizzes"]}${quizId}/`);
                setQuiz(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const selectChoice = (questionId, choiceId) => {
        setSelectedChoices({ ...selectedChoices, [questionId]: choiceId });
    };

    const submitQuiz = async () => {
        try {
            const payload = {
                quiz: quiz.id,
                answers: Object.entries(selectedChoices).map(([qId, cId]) => ({
                    question: parseInt(qId),
                    choice: cId,
                })),
            };

            const res = await authApis(token).post(endpoints["submissions"], payload);
            alert(`Bài làm xong! Điểm của bạn: ${res.data.score}`);
            navigation.goBack();
        } catch (error) {
            console.error(error);
            alert("Nộp bài thất bại!");
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

    if (!quiz) return <Text>Không tìm thấy bài quiz</Text>;

    const fetchSubmissions = async () => {
        try {
            const res = await authApis(token).get(`${endpoints["submissions"]}?quiz=${quiz.id}`);
            setSubmissions(res.data);
            setShowSubmissions(true);
        } catch (error) {
            console.error(error);
            alert("Không thể tải lịch sử làm bài");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{quiz.title}</Text>
            {quiz.questions.map((q) => (
                <View key={q.id} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{q.text}</Text>
                    {q.choices.map((c) => (
                        <TouchableOpacity
                            key={c.id}
                            style={[
                                styles.choiceBtn,
                                selectedChoices[q.id] === c.id && styles.choiceSelected,
                            ]}
                            onPress={() => selectChoice(q.id, c.id)}
                        >
                            <Text style={styles.choiceText}>{c.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}

            <TouchableOpacity style={styles.submitBtn} onPress={submitQuiz}>
                <Text style={styles.submitBtnText}>Nộp bài</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: "#009688", marginTop: 8 }]}
                onPress={fetchSubmissions}
            >
                <Text style={styles.submitBtnText}>Xem lịch sử làm bài</Text>
            </TouchableOpacity>
            {showSubmissions && (
                <View style={{ marginTop: 16 }}>
                    {submissions.map((s) => (
                        <View key={s.id} style={styles.submissionItem}>
                            <Text>Bài làm của: {s.user.username}</Text>
                            <Text>Điểm: {s.score}</Text>
                            <Text>Thời gian: {new Date(s.submitted_at).toLocaleString()}</Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
    questionContainer: { marginBottom: 16, padding: 12, backgroundColor: "#fff", borderRadius: 12 },
    questionText: { fontWeight: "600", marginBottom: 8 },
    choiceBtn: { padding: 10, borderWidth: 1, borderRadius: 8, marginBottom: 6 },
    choiceSelected: { backgroundColor: "#EDE7F6" },
    choiceText: {},
    submitBtn: { backgroundColor: "#6A1B9A", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 12 },
    submitBtnText: { color: "#fff", fontWeight: "bold" },
    submissionItem: {
        padding: 12,
        backgroundColor: "#eee",
        borderRadius: 10,
        marginBottom: 8,
    },
});

export default QuizDetail;
