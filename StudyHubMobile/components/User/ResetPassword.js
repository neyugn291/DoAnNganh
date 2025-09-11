import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import LoginStyles from "./Style";

const ResetPassword = ({ route, navigation }) => {
  const { token } = route.params || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }
    setLoading(true);
    try {
      await Apis.post(endpoints["resetPassword"], { token, new_password: password });
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
          <Text style={LoginStyles.loginText}>{loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPassword;
