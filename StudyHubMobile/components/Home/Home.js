import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Platform,
    Text,
    TouchableOpacity,
    View,StatusBar,ScrollView, Image
} from "react-native";

import { Chip } from "react-native-paper";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStyles from "./Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./layout/Header";
import BottomNav from "./layout/BottomNav";


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

    const userAvatar = userData?.profile?.avatar ? (
        <Image
            source={{ uri: userData.profile.avatar }}
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

    

    return (
        <View style={HomeStyles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ScrollView>
                <Header />
                <Text>HELLO</Text>
                <View>
                    {categories.map(c => <Chip key={c.id}>{c.name}</Chip>)}
                </View>
            </ScrollView>
            <BottomNav navigation={navigation} route={route} />
        </View> 
    );
}
