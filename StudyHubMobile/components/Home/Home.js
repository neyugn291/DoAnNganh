import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MyStyles from "../../styles/MyStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip } from "react-native-paper";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStyles from "./Style";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Home({ navigation, route }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại!");
                }

                const response = await authApis(token).get(endpoints["currentUser"]);
                console.log("Thông tin người dùng:", response.data);

                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu người dùng:", error.message);
                setUserData({ firstName: "Khách" });
                setLoading(false);
            }
        };
        fetchUserData();

        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.5,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    const userFirstName = userData?.username || "Khách";

    const userAvatar = userData?.avatar ? (
        <Image
            source={{ uri: userData.avatar }}
            style={HomeStyles.avatar}
            onError={(e) => console.log("Lỗi tải avatar:", e.nativeEvent.error)}
        />
    ) : (
        <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color="#fff"
            style={HomeStyles.avatarIcon}
        />
    );

    const [categories, setCategories] = useState([]);
    const loadCates = async () => {
        let res = await Apis.get(endpoints['categories']);
        setCategories(res.data);
    }
    useEffect(() => {
        loadCates();
    }, []);

    const navItems = [
        { icon: 'home', label: 'Trang chủ', screen: 'Home' },
        { icon: 'book-open-page-variant', label: 'Khóa học', screen: 'Courses' },
        { icon: 'bell-badge', label: 'Thông báo', screen: 'Notifications' },
        { icon: 'account-circle', label: 'Cá nhân', screen: 'Profile' },
    ];

    return (
        <SafeAreaView style={MyStyles.container}>
            <Text>
                HELLO
            </Text>
            <View>
                {categories.map(c => <Chip key={c.id}>{c.name}</Chip>)}
            </View>
            <View
                style={[
                    HomeStyles.header,
                    { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44 },
                ]}
            >
                {loading ? (
                    <Text style={HomeStyles.greetingText}>Đang tải...</Text>
                ) : (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {userAvatar}
                        <View>
                            <Text style={HomeStyles.greetingText}>Chào bạn,</Text>
                            <Text style={HomeStyles.nameText}>{userFirstName}</Text>
                        </View>
                        <TouchableOpacity style={HomeStyles.notification}>
                            <MaterialCommunityIcons name="bell" size={24} color="#fff" />
                            <View style={HomeStyles.notificationBadge}>
                                <Text style={HomeStyles.notificationText}>1</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
            <View style={HomeStyles.bottomNav}>
                {navItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={HomeStyles.navItem}
                        onPress={() => {
                            navigation.navigate(item.screen, { navItems });
                        }}
                    >
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={24}
                            color={route?.name === item.screen ? '#5C4D7D' : '#7B68A1'} />
                        <Text
                            style={[
                                HomeStyles.navLabel,
                                route?.name === item.screen && HomeStyles.activeNav,
                            ]}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}
