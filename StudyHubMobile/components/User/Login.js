import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { MyDispatchContext } from "../../configs/MyContexts";
import { useNavigation } from "@react-navigation/native";
import LoginStyles from "./Style";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();
const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useContext(MyDispatchContext);
  const navigation = useNavigation();

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [email, setEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "954414019449-itomk5offlnuengqf2qe2fuog8l0klhp.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@neyugn/StudyHubMobile",
  });
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken) => {
    try {
      setLoading(true);
      setError(null);

      // Gửi idToken lên backend Django để nhận JWT
      const res = await Apis.post(endpoints["loginGoogle"], { token: idToken });
      const token = res.data.access;
      await AsyncStorage.setItem("token", token);

      const userData = await authApis(token).get(endpoints["currentUser"]);
      dispatch({ type: "login", payload: { user: userData.data, token } });

      navigation.replace("Home");
    } catch (ex) {
      console.error(ex.response ? ex.response.data : ex.message);
      setError("Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };


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

      dispatch({
        type: "login", payload: {
          user: userData.data,
          token: token,
        }
      });

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

  const handleSendForgotEmail = async () => {
    if (!email) { Alert.alert("Lỗi", "Vui lòng nhập email"); return; }
    setForgotLoading(true);
    try {
      await Apis.post(endpoints["forgot_password"], { email });
      Alert.alert("Thành công", "Email reset mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.");
      setEmail("");
      setShowForgotModal(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert("Lỗi", "Gửi email thất bại. Vui lòng thử lại.");
    } finally {
      setForgotLoading(false);
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

        {/* --- Nút Google Sign-In --- */}
        <TouchableOpacity
          style={LoginStyles.googleBtn}
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          <Text style={LoginStyles.googleText}>Đăng nhập với Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowForgotModal(true)}>
          <Text style={LoginStyles.link}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={LoginStyles.link}>Tạo tài khoản mới</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showForgotModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <Text style={modalStyles.title}>Quên mật khẩu</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="Nhập email của bạn"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={[modalStyles.btn, forgotLoading && modalStyles.disabledBtn]}
              onPress={handleSendForgotEmail}
              disabled={forgotLoading}
            >
              <Text style={modalStyles.btnText}>{forgotLoading ? "Đang gửi..." : "Gửi email"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowForgotModal(false)}>
              <Text style={modalStyles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
  container: { backgroundColor: "#fff", borderRadius: 8, padding: 20 },
  title: { fontSize: 20, marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
  btn: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, alignItems: "center" },
  disabledBtn: { backgroundColor: "#aaa" },
  btnText: { color: "#fff", fontWeight: "bold" },
  cancelText: { color: "#007bff", marginTop: 10, textAlign: "center" },
});


export default Login;
