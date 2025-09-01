import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { MyDispatchContext } from "../../configs/MyContexts";
import { useNavigation } from "@react-navigation/native";
import LoginStyles from "./Style";



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

      dispatch({ type: "login", payload: {
        user: userData.data,
        token: token,
      }
       });

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
    <View style={LoginStyles.container}>
      <View style={LoginStyles.card}>
        <Text style={LoginStyles.title}>Đăng nhập</Text>
        {error && <Text style={LoginStyles.errorText}>{error}</Text>}

        <TextInput
          style={LoginStyles.input}
          placeholder="Tên đăng nhập"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <View style={LoginStyles.passwordContainer}>
          <TextInput
            style={LoginStyles.passwordInput}
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
          style={[LoginStyles.loginBtn, loading && LoginStyles.disabledBtn]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={LoginStyles.loginText}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Text>
        </TouchableOpacity>

        <Text style={LoginStyles.link}>Quên mật khẩu</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={LoginStyles.link}>Tạo tài khoản mới</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const myStyles = StyleSheet.create({
  
});

export default Login;
