import { StyleSheet } from "react-native";

const ResourceStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F2F8", marginBottom:110 }, // bg-light
  contentContainer: {
    backgroundColor: "#fff",
    paddingTop:0,
    paddingBottom:0,
    padding: 15,
    borderRadius: 12,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 12,
  },
  searchBtn: {
    backgroundColor: "#3A2E55",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 12,
  },
  typeBtn: {
    borderWidth: 1,
    borderColor: "#3A2E55",
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  typeBtnActive: {
    backgroundColor: "#3A2E55",
  },
  card: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
  },
  buttonLinking: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#3A2E55", // tím đậm
    borderRadius: 8,
    alignSelf: "flex-start", // chỉ gọn theo nội dung
  },

  textLinking: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  addBtn: {
  backgroundColor: "#28a745", // xanh lá
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignItems: "center",
  marginBottom: 12,
},

addBtnText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},
});

export const ResourceDetailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
  description: { fontSize: 14, color: "#555", marginBottom: 16 },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  codeBox: {
    backgroundColor: "#f4f4f4",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#333",
  },
});
export default ResourceStyles;