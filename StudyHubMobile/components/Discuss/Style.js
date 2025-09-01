import { StyleSheet } from "react-native";

const DiscussStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4F2F8" }, // bg-light

    // --- common ---
    row: { flexDirection: "row", alignItems: "flex-start" },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },

    // --- Question / Answer / Comment card ---
    card: {
        backgroundColor: "#E4E0EB", // bg-dark
        borderRadius: 10,
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 12,
        borderWidth: 1,
        borderColor: "#7B68A1", // primary-light
        elevation: 2,
    },

    contentBox: {
        flex: 1,
        backgroundColor: "#F4F2F8", // bg-light
        borderRadius: 8,
        padding: 8,
    },

    nameText: {
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 2,
        color: "#3A2E55", // text-primary
    },
    titleText: { fontSize: 16, color: "#3A2E55" },
    bodyText: { fontSize: 14, color: "#6E6196" }, // text-secondary
    timeText: { fontSize: 11, color: "#999", marginTop: 2 },

    // indent answers
    answerContainer: {
        paddingLeft: 48,
        marginTop: 6,
        borderLeftWidth: 2,
        borderLeftColor: "#7B68A1", // primary-light
    },
    commentContainer: {
        paddingLeft: 48,
        marginTop: 4,
        borderLeftWidth: 1,
        borderLeftColor: "#5C4D7D", // primary
    },

    buttonRow: { flexDirection: "row", marginTop: 8, alignItems: "center", marginLeft: "auto" },
    voteRow: {
    flexDirection: "row",
    alignItems: "center",
  },
    button: {
        marginRight: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
        backgroundColor: "#7B68A1", // primary-light
        borderRadius: 6,
    },
    buttonText: { fontSize: 12, color: "#FFFFFF" }, // text-light

    avatarIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    modalContent: {
        backgroundColor: "#fff",
        width: "85%",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
        color: "#021b42",
    },

    createQuestionContainer: {
        padding: 10,
        marginHorizontal: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        marginBottom: 14,
    },
    modalButtonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },

    buttonSubmit: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginRight: 5,
    },

    buttonCancel: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginLeft: 5,
    },

    buttonTextWhite: {
        color: "#fff",
        fontWeight: "bold",
    },

    inputTitle: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        marginBottom: 5,
        backgroundColor: "#fff",
    },
    inputBody: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        backgroundColor: "#fff",
    },
    submitButton: {
        marginTop: 5,
        padding: 10,
        backgroundColor: "#5C4D7D",
        borderRadius: 5,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },

});

export default DiscussStyles;
