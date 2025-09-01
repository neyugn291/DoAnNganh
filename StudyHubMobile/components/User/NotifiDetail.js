import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/MyContexts";
import Header from "../Home/layout/Header";
import BottomNav from "../Home/layout/BottomNav";
import { NotifiStyles } from "./Style";
import { TouchableOpacity } from "react-native";

const NotifiDetail = ({ route, navigation }) => {
    const { id } = route.params;
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(MyUserContext);

    useEffect(() => {


        const fetchNotification = async () => {
            try {
                const res = await authApis(token).get(`${endpoints["notifications"]}${id}/get_detail/`);
                setNotification(res.data);
            } catch (error) {
                console.error("Failed to fetch notification detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotification();
    }, [id]);

    if (loading) {
        return (
            <View style={NotifiStyles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!notification) {
        return (
            <View style={NotifiStyles.center}>
                <Text>Không tìm thấy thông báo</Text>
            </View>
        );
    }

    return (
        <View style={NotifiStyles.container}>
            <Header />
            <View style={NotifiStyles.actorContainer}>
                <Text style={NotifiStyles.actorTitle}>Người gửi:</Text>
                <Text style={NotifiStyles.actorName}>{notification.actor.username || "Hệ thống"}</Text>
            </View>
            <View style={NotifiStyles.actorContainer}>
                {/* Tiêu đề và ngày */}
                <Text style={NotifiStyles.title}>{notification.notification_type}: {notification.title}</Text>


                {/* Nội dung thông báo */}
                <Text style={NotifiStyles.body}>{notification.message}</Text>

                <Text style={NotifiStyles.date}>{notification.created_at}</Text>
            </View>

            <TouchableOpacity
                style={NotifiStyles.backBtn}
                onPress={() => navigation.goBack()}
            >
                <Text style={NotifiStyles.backBtnText}>Trở về</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NotifiDetail;

