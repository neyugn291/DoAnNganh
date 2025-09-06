import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet, Alert
} from "react-native";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/MyContexts";
import Header from "../Home/layout/Header";
import BottomNav from "../Home/layout/BottomNav";
import { NotifiStyles } from "./Style";

import messaging from '@react-native-firebase/messaging';



const Notification = ({ navigation, route }) => {
  const { token, user } = useContext(MyUserContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách thông báo
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await authApis(token).get(endpoints["notifications"]);
        console.log(res.data);
        setNotifications(res.data);
      } catch (err) {
        console.error("Lỗi lấy thông báo:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await authApis(token).patch(`${endpoints["notifications"]}/${id}/mark_read/`, {
        is_read: true,
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Lỗi cập nhật:", err.message);
    }
  };

  const handlePressNotification = async (notificationId, params = {}) => {
    try {
      await authApis(token).patch(`${endpoints["notifications"]}${notificationId}/mark_read/`);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, read: true } : item
        )
      );

      navigation.navigate('NotifiDetail', params);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePressNotification(item.id, { id: item.id })}

      style={[
        NotifiStyles.notification,
        !item.is_read && NotifiStyles.unreadNotification,
      ]}

    >
      {item.actor?.profile?.avatar ? (
        <Image
          source={{ uri: item.actor.profile.avatar }}
          style={NotifiStyles.avatar}
        />
      ) : (
        <View style={NotifiStyles.avatarPlaceholder}>
          <Text style={NotifiStyles.avatarText}>
            {item.actor?.username?.charAt(0).toUpperCase() || "?"}
          </Text>
        </View>
      )}

      <View style={NotifiStyles.textContainer}>
        <Text style={NotifiStyles.title}>{item.title}</Text>
        <Text style={NotifiStyles.meta}>
          {item.notification_type} • {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );


  useEffect(() => {
  if (!user?.id || !token) return;

  const setupFcm = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) return;

    const fcmToken = await messaging().getToken();
    console.log("FCM Token:", fcmToken);

    // Gửi token lên backend nếu cần
    if (user.fcm_token !== fcmToken) {
      try {
        await authApis(token).patch(`${endpoints["users"]}${user.id}/`, { fcm_token: fcmToken });
        console.log("FCM token sent to backend");
      } catch (err) {
        console.error(err);
      }
    }
  };

  setupFcm();

  // Chỉ để hiển thị popup realtime
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    const title = remoteMessage.notification?.title || remoteMessage.data?.title || "Thông báo mới";
    const body = remoteMessage.notification?.body || remoteMessage.data?.body || "";

    Alert.alert("Co thong bao moi");

    // Nếu muốn cập nhật state notifications luôn
    setNotifications(prev => [
      {
        id: Date.now(),
        title,
        message: body,
        is_read: false,
        notification_type: "INFO",
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  });

  return unsubscribe;
}, [user, token]);



  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }
  return (
    <View style={NotifiStyles.container}>
      <Header />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <BottomNav navigation={navigation} route={route} />
    </View>
  );
};
export default Notification;
