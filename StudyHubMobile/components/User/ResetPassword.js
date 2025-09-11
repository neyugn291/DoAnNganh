import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Linking } from "react-native";
import LoginStyles from "./Style";
import Apis, { endpoints } from "../../configs/Apis";

const ResetPassword = ({ route, navigation }) => {
  // Nếu có token từ route.params thì dùng, nếu không thì sẽ lấy từ deep link
  const [token, setToken] = useState(route.params?.token || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hàm xử lý deep link
    const handleDeepLink = (event) => {
      const url = event.url;
      if (url) {
        const tokenParam = url.split("token=")[1];
        if (tokenParam) setToken(tokenParam);
      }
    };

    // Lắng nghe sự kiện khi app đang mở
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Kiểm tra nếu app được mở từ link (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }
    if (!token) {
      Alert.alert("Lỗi", "Token không hợp lệ. Vui lòng thử lại từ email.");
      return;
    }

    setLoading(true);
    try {
      await Apis.post(endpoints["reset_password"], { token, new_password: password });
      Alert.alert("Thành công", "Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại.");
      navigation.replace("Login");
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert("Lỗi", "Không thể reset mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={LoginStyles.container}>
      <View style={LoginStyles.card}>
        <Text style={LoginStyles.title}>Đặt lại mật khẩu</Text>

        <TextInput
          style={LoginStyles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={LoginStyles.input}
          placeholder="Xác nhận mật khẩu mới"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[LoginStyles.loginBtn, loading && LoginStyles.disabledBtn]}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={LoginStyles.loginText}>
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPassword;
