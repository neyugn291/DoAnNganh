import { StyleSheet } from "react-native";

const ResourceStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4F2F8" }, // bg-light
    input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 12,
  },
  searchBtn: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 12,
  },
  typeBtn: {
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  typeBtnActive: {
    backgroundColor: "#007bff",
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
    });

export default ResourceStyles;