import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { MyDispatchContext } from "../../configs/MyContexts";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useContext(MyDispatchContext);
  const navigation = useNavigation();

  const validate = () => {
    if (!username) { setError("Vui lòng nhập tên đăng nhập!"); return false; }
    if (!password) { setError("Vui lòng nhập mật khẩu!"); return false; }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      // Gửi request tới endpoint Simple JWT
      const res = await Apis.post(endpoints["login"], { username, password });
      const token = res.data.access; // lấy access token
      await AsyncStorage.setItem("token", token);

      // Lấy thông tin user với token
      const userData = await authApis(token).get(endpoints["currentUser"]);

      dispatch({ type: "login", payload: userData.data });

      // Điều hướng tùy quyền
    //   if (userData.data.is_superuser) navigation.replace("AdminHome");
    //   else if (userData.data.is_staff) navigation.replace("StaffHome");
    //   else 
        navigation.replace("Home");

    } catch (ex) {
      console.error("Lỗi chi tiết:", ex.response ? ex.response.data : ex.message);
      if (ex.response && ex.response.data.detail) {
        setError(ex.response.data.detail);
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra thông tin!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={myStyles.container}>
      <View style={myStyles.card}>
        <Text style={myStyles.title}>Đăng nhập</Text>
        {error && <Text style={myStyles.errorText}>{error}</Text>}

        <TextInput
          style={myStyles.input}
          placeholder="Tên đăng nhập"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <View style={myStyles.passwordContainer}>
          <TextInput
            style={myStyles.passwordInput}
            placeholder="Mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry={showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[myStyles.loginBtn, loading && myStyles.disabledBtn]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={myStyles.loginText}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Text>
        </TouchableOpacity>

        <Text style={myStyles.link}>Quên mật khẩu</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={myStyles.link}>Tạo tài khoản mới</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const myStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#6a97a4", justifyContent: "center", alignItems: "center" },
  card: { width: "80%", backgroundColor: "#f8dad0", borderRadius: 20, padding: 30, alignItems: "center", shadowColor: "#021b42", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.7, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 20, fontWeight: "bold", color: "#174171", marginBottom: 20 },
  input: { width: "100%", height: 45, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12, marginBottom: 15, backgroundColor: "#fff" },
  passwordContainer: { width: "100%", height: 45, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, marginBottom: 15, backgroundColor: "#fff" },
  passwordInput: { flex: 1, height: "100%", color: "#000" },
  loginBtn: { width: "100%", height: 45, backgroundColor: "#6a87a4", borderRadius: 8, justifyContent: "center", alignItems: "center", margin: 10 },
  disabledBtn: { backgroundColor: "#a0a0a0" },
  loginText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  link: { color: "#174171", fontSize: 15, margin: 4 },
  errorText: { color: "red", fontSize: 14, marginBottom: 10 },
});

export default Login;
