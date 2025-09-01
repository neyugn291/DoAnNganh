import { StyleSheet } from "react-native";

const LoginStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center" },
  card: { width: "80%", backgroundColor: "#FFFFFF", borderRadius: 20, padding: 30, alignItems: "center", shadowColor: "#6A1B9A", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.7, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 20, fontWeight: "bold", color: "#6A1B9A", marginBottom: 20 },
  input: { width: "100%", height: 45, borderWidth: 1, borderColor: "#9C27B0", borderRadius: 8, paddingHorizontal: 12, marginBottom: 15, backgroundColor: "#FAF8FD" },
  passwordContainer: { width: "100%", height: 45, borderWidth: 1, borderColor: "#9C27B0", borderRadius: 8, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, marginBottom: 15, backgroundColor: "#FAF8FD" },
  passwordInput: { flex: 1, height: "100%", color: "#2C2C2C" },
  loginBtn: { width: "100%", height: 45, backgroundColor: "#6A1B9A", borderRadius: 8, justifyContent: "center", alignItems: "center", margin: 10 },
  disabledBtn: { backgroundColor: "#a0a0a0" },
  loginText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
  link: { color: "#7E57C2", fontSize: 15, margin: 4 },
  errorText: { color: "red", fontSize: 14, marginBottom: 10 },
});
export const NotifiStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  notification: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: "#EDE7F6",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#9C27B0",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9C27B0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#6A1B9A",

  },
  message: {
    color: "#333",
    marginVertical: 2,
  },
  meta: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  actorContainer: {
    margin: 12,
    backgroundColor: "#EDE7F6",
    padding: 8,
    borderRadius: 8,
    borderColor: "#6A1B9A",
    borderWidth: 1,
  },

  actorTitle: {
    fontSize: 12,
    color: "#555",
  },
  actorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  backBtn: {
    width: "90%",
    height: 45,
    backgroundColor: "#6A1B9A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 8,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export const ProfileStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F2F8",  // nền sáng
    paddingTop: 40,
    paddingBottom: 50
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#5C4D7D", // viền tím đậm
  },
  avatarIcon: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#FFFFFF", // box trắng
    borderRadius: 20,           // bo tròn
    padding: 20,
    marginBottom: 15,
    shadowColor: "#3A2E55",     // tím đậm
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#3A2E55", // text chính
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#9C27B0",  // tím nhạt
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#FAF8FD",
    color: "#3A2E55",
  },
  value: {
    fontWeight: "400",
    fontSize: 15,
    color: "#6E6196", // text phụ
  },
  saveBtn: {
    width: "100%",
    height: 45,
    backgroundColor: "#5C4D7D", // primary-color
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  backBtn: {
    width: "90%",
    height: 45,
    backgroundColor: "#2C2C2C",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 8,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default LoginStyles;
