import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, Platform } from "react-native";
import { Image } from "expo-image";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../../configs/Apis";
import HomeStyles from "../Style";
import { MyUserContext } from "../../../configs/MyContexts";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
    const auth = useContext(MyUserContext);
    const { token } = useContext(MyUserContext);
    const navigation = useNavigation();
    const userData = auth?.user;
    const [unreadCount, setUnreadCount] = useState(0);


    const userFirstName = userData?.username || "Khách";

    const userAvatar = userData?.profile?.avatar ? (
        <Image
            source={{ uri: userData.profile.avatar }}
            style={HomeStyles.avatar}
        />
    ) : (
        <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color="#fff"
            style={HomeStyles.avatarIcon}
        />
    );
    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const res = await authApis(token).get(endpoints["notifications"]);
                const notRead = res.data.filter(n => !n.is_read).length;
                setUnreadCount(notRead);
            } catch (err) {
                console.error("Lỗi lấy thông báo:", err.message);
            }
        };

        fetchUnread();
    }, [token]);

    return (
        <View style={[HomeStyles.header, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44 }]}>
            {!userData ? (
                <Text style={HomeStyles.greetingText}>Đang tải...</Text>
            ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {userAvatar}
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Text style={HomeStyles.greetingText}>Chào bạn,</Text>
                        <Text style={HomeStyles.nameText}>{userFirstName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={HomeStyles.notification}
                        onPress={() => navigation.navigate("Notification")}>
                        <MaterialCommunityIcons name="bell" size={24} color="#fff" />
                        {unreadCount > 0 && (
                            <View style={HomeStyles.notificationBadge}>
                                <Text style={HomeStyles.notificationText}>{unreadCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export default Header;