import { StyleSheet } from "react-native";

const CourseStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9fafb" },
    card: { backgroundColor: "#fff", borderRadius: 12, margin: 12, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
    courseImage: { width: "100%", height: 120 },
    cardContent: { padding: 8 },
    courseTitle: { fontSize: 16, fontWeight: "bold", color: "#6A1B9A", marginBottom: 4 },
    courseDescription: { fontSize: 14, color: "#333" },
    coursePrice: { fontSize: 14, fontWeight: "bold", color: "#E91E63", marginTop: 4 },
    footFlatList: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: "center",
    },
    buttonText: { fontSize: 14, fontWeight: "bold", },
    disabled: { color: "#aaa" },
    pageInfo: { fontSize: 14, fontWeight: "bold", },
    footerText: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "bold",
        color: "#6A1B9A",
        marginBottom: 10,
        textDecorationStyle: "solid",
        textDecorationLine: "underline",
        textDecorationColor: "#fff",
    },
    footerTextPosition: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        position: "absolute",
        bottom: 125,
        left: 40,
        right: 40,
        height: 60,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderRadius: 12,
        borderTopColor: "#ddd",
        elevation: 3,
    },
});

export const ModuleStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9fafb" },
    containerModule: { flex: 1, backgroundColor: "#f9fafb", margin:12 },
    modulePageTitle: {
        fontSize: 24,           // chữ lớn hơn
        fontWeight: "700",      // đậm vừa phải
        color: "#1a1a1a",       // màu tối, dễ đọc
        marginBottom: 8,
        textAlign: "center",    
    },
    modulePageDescription: {
        fontSize: 16,            // chữ vừa phải, không quá lớn
        color: "#555555",        // màu xám vừa phải, dễ nhìn
        lineHeight: 20,          // khoảng cách giữa các dòng
        marginBottom: 12,        // khoảng cách dưới mô tả
        textAlign: "center",    

    },
    moduleCard: {
        backgroundColor: "#ffffff",
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // cho Android
    },
    moduleTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1a1a1a",
        marginBottom: 5,
    },
    moduleLessonsDropdown: {
        paddingLeft: 20,
        paddingTop: 5,
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
        marginTop: 5,
    },
    lessonItem: {
        fontSize: 16,
        color: "#333",
        paddingVertical: 6,
        paddingLeft: 10,
    },
    toggleIcon: { marginLeft: 10 },
    buttonLinking: {
    backgroundColor: "#6A1B9A", // màu tím đậm
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
  textLinking: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CourseStyles;



