import { StyleSheet } from "react-native";

const HomeStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
    header: {
        height: 120,
        paddingBottom: 5,
        paddingHorizontal: 30,
        backgroundColor: "#0c5776",
        justifyContent: "center",
    },
    greetingText: {
        color: "#fff",
        fontSize: 16,
    },
    nameText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        elevation: 5,
    },
    navItem: {
        flexDirection: "column",    // icon + label xếp theo cột
        alignItems: "center",       // căn giữa icon và label
        justifyContent: "center",
    },
    navLabel: { fontSize: 12, color: "#174171", textAlign: "center" },
    activeNav: { color: "#021b42", fontWeight: "bold" },
});

export default HomeStyles;
