import { StyleSheet } from "react-native";

const QuizStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F5F5" },
    contentContainer: {margin:16},
    h1Text:{fontSize: 20, fontWeight: "bold", textAlign:"center", marginBottom:8,backgroundColor: "#E0E0E0", padding: 8, borderRadius: 12,},
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    quizItem: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 10 },
    quizTitle: { fontSize: 18, fontWeight: "bold", color: "#6A1B9A" },
    quizDesc: { fontSize: 14, color: "#333" },
    submitBtn: { backgroundColor: "#6A1B9A", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 12 },
    submitBtnText: { color: "#fff", fontWeight: "bold" },
    submissionItem: {
        padding: 12,
        backgroundColor: "#eee",
        borderRadius: 10,
        marginBottom: 8,
    },
});

export default QuizStyles;