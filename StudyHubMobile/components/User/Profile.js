import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { MyDispatchContext, MyUserContext } from "../../configs/MyContexts";
import { authApis, endpoints } from "../../configs/Apis";
import HomeStyles from "../Home/Style";
import { ProfileStyles } from "./Style";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";



const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useContext(MyDispatchContext);
  const auth = useContext(MyUserContext);

  const [localAvatar, setLocalAvatar] = useState(null);

  useEffect(() => {
    if (!auth.user && auth.token) {
      const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await authApis(auth.token).get(endpoints["currentUser"]);
          setUser(res.data);
          dispatch({ type: "login", payload: res.data });
        } catch (ex) {
          console.error("Lỗi lấy thông tin user:", ex.response ? ex.response.data : ex.message);
          setError("Không lấy được thông tin user");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setUser(auth.user);
      setLoading(false);
    }
  }, [auth.user, auth.token]);

  const handleSave = async () => {
    try {
      const res = await authApis(auth.token).patch(`${endpoints["users"]}${user.id}/`, user);
      setUser(res.data);
      dispatch({ type: "updateUser", payload: res.data });
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    }
  };
  const handleChooseAvatar = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Quyền truy cập thư viện ảnh bị từ chối!");
      return;
    }

    console.log(auth.token);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // ✅ Update ngay giao diện bằng ảnh local
      setLocalAvatar(uri);
      try {
        let formData = new FormData();
        formData.append("avatar", {
          uri: result.assets[0].uri,
          name: "avatar.jpg",
          type: "image/jpeg",
        });

        const res = await authApis(auth.token).patch(
          `${endpoints["profiles"]}${user.profile.id}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        setUser((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            avatar: res.data.avatar,
          },
        }));
        dispatch({
          type: "updateUser", payload: {
            ...auth.user,
            profile: {
              ...auth.user.profile,
              avatar: res.data.avatar,
            }
          }
        });
        alert("Cập nhật avatar thành công!");
      } catch (err) {
        console.error("Lỗi upload avatar:", err.response.data);
        alert("Tải avatar thất bại!");
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch({ type: "logout" });
    navigation.replace("Login");
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
  if (error) return <Text>{error}</Text>;

  return (

    <ScrollView contentContainerStyle={ProfileStyles.container}>


      <TouchableOpacity onPress={handleChooseAvatar}>
        {user.profile?.avatar ? (
          <Image source={{ uri: localAvatar || user.profile.avatar }} style={ProfileStyles.avatar} />
        ) : (
          <MaterialCommunityIcons
            name="account-circle"
            size={80}
            color="#999"
            style={ProfileStyles.avatarIcon}
          />
        )}
        <Text style={{ textAlign: "center", marginTop: 5, color: "#007AFF" }}>
          Đổi ảnh đại diện
        </Text>
      </TouchableOpacity>

      <View style={ProfileStyles.infoCard}>
        <Text style={ProfileStyles.label}>Username</Text>
        <TextInput
          style={ProfileStyles.input}
          value={user.username}
          onChangeText={(text) => setUser({ ...user, username: text })}
        />

        <Text style={ProfileStyles.label}>Email</Text>
        <TextInput
          style={ProfileStyles.input}
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
        />

        <Text style={ProfileStyles.label}>Phone</Text>
        <TextInput
          style={ProfileStyles.input}
          value={user.phone_number}
          onChangeText={(text) => setUser({ ...user, phone_number: text })}
        />

        <Text style={ProfileStyles.label}>CCCD</Text>
        <TextInput
          style={ProfileStyles.input}
          value={user.citizen_id}
          onChangeText={(text) => setUser({ ...user, citizen_id: text })}
        />

        <Text style={ProfileStyles.label}>Birth Date</Text>
        <TextInput
          style={ProfileStyles.input}
          value={user.birth_date}
          onChangeText={(text) => setUser({ ...user, birth_date: text })}
        />

        <Text style={ProfileStyles.label}>Gender</Text>
        <TextInput
          style={ProfileStyles.input}
          value={user.gender}
          onChangeText={(text) => setUser({ ...user, gender: text })}
        />

        <Text style={ProfileStyles.label}>Bio</Text>
        <TextInput
          style={ProfileStyles.input}
          value={user.profile?.bio}
          onChangeText={(text) => setUser({ ...user, profile: { ...user.profile, bio: text } })}
        />

        <Text style={ProfileStyles.label}>Contact Info</Text>
        <TextInput
          style={ProfileStyles.input}
          value={user.profile?.contact_info}
          onChangeText={(text) => setUser({ ...user, profile: { ...user.profile, contact_info: text } })}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
          <TouchableOpacity style={[ProfileStyles.saveBtn, { flex: 1, marginRight: 5 }]} onPress={handleSave}>
            <Text style={ProfileStyles.saveBtnText}>Lưu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[ProfileStyles.saveBtn, { flex: 1, backgroundColor: "red", marginLeft: 5 }]} onPress={handleLogout}>
            <Text style={ProfileStyles.saveBtnText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={ProfileStyles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={ProfileStyles.backBtnText}>Trở về</Text>
      </TouchableOpacity>
    </ScrollView >

  );
};


export default Profile;
