import { StyleSheet } from "react-native";

const HomeStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9fafb" },
    header: {
        height: 120,
        paddingBottom: 5,
        paddingHorizontal: 30,
        backgroundColor: "#3A2E55",
        justifyContent: "center",
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 20,
        marginRight: 10,
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    navLabel: { fontSize: 12, color: "#174171", textAlign: "center" },
    activeNav: { color: "#021b42", fontWeight: "bold" },
    notification: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    notificationBadge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "#f08486",
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    notificationText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
    },
    avatarIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    allCoursesModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    allCoursesModalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
    },
    allCoursesModalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    allCoursesItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    allCoursesItemTextContainer: {
        flex: 1,
    },
    courseTitle: {
        fontWeight: 'bold',
    },
    courseDate: {
        color: '#666',
    },
  closeModalBtn: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#4BC0C0",
    borderRadius: 8,
    alignItems: "center",
  },
  closeModalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
    viewMoreBtnText: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#4BC0C0",
        borderRadius: 8,
        alignSelf: "flex-start",
    }
});

export default HomeStyles;
