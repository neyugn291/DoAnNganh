import React, { useEffect, useRef, useState } from "react";
import {
    Animated, Platform,
    Text, TouchableOpacity,
    View, StatusBar,
    ScrollView, Image,
    Dimensions, Modal
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Chip } from "react-native-paper";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStyles from "./Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./layout/Header";
import BottomNav from "./layout/BottomNav";

const screenWidth = Dimensions.get("window").width;


export default function Home({ navigation, route }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [showAllCoursesModal, setShowAllCoursesModal] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại!");
                }

                const response = await authApis(token).get(endpoints["currentUser"]);
                setUserData(response.data);

                const statsRes = await authApis(token).get(endpoints["userDashboard"]);
                setDashboardStats(statsRes.data);

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


    const chartData = dashboardStats
        ? {
            labels: dashboardStats.monthly_stats.map((m) => `${m.month}/${m.year}`),
            datasets: [
                {
                    data: dashboardStats.monthly_stats.map((m) => m.count),
                    color: () => `rgba(75,192,192,1)`,
                    strokeWidth: 2
                }
            ]
        }
        : null;

    return (
        <View style={HomeStyles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ScrollView>
                <Header />
                {/* Tổng số khóa học đã đăng ký */}
                {dashboardStats && (
                    <View style={[HomeStyles.card, { padding: 15, marginVertical: 10 }]}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Tổng số khóa học đã đăng ký</Text>
                        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#4BC0C0", marginTop: 5 }}>
                            {dashboardStats.total_enrolled}
                        </Text>
                    </View>
                )}

                {/* Khóa học đang theo dõi */}
                {dashboardStats && (
                    <View style={[HomeStyles.card, { padding: 15, marginVertical: 10 }]}>
                        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>Khóa học đang theo dõi</Text>
                        {dashboardStats.enrolled_courses.slice(0, 2).map((c) => (
                            <View key={c.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                {c.thumbnail ? (
                                    <Image source={{ uri: c.thumbnail_url }} style={{ width: 50, height: 50, borderRadius: 5, marginRight: 10 }} />
                                ) : (
                                    <MaterialCommunityIcons name="book" size={40} style={{ marginRight: 10 }} />
                                )}
                                <View>
                                    <Text style={{ fontWeight: "bold" }}>{c.title}</Text>
                                    <Text style={{ color: "#666" }}>
                                        Đăng ký: {new Date(c.enrolled_at).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        {dashboardStats.enrolled_courses.length > 2 && (
                            <TouchableOpacity
                                style={HomeStyles.viewMoreBtn}
                                onPress={() => setShowAllCoursesModal(true)}
                            >
                                <Text style={HomeStyles.viewMoreBtnText}>Xem thêm</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                <Modal
                    visible={showAllCoursesModal}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={HomeStyles.allCoursesModalOverlay}>
                        <View style={HomeStyles.allCoursesModalContainer}>
                            <Text style={HomeStyles.allCoursesModalTitle}>Tất cả khóa học</Text>
                            <ScrollView>
                                {dashboardStats?.enrolled_courses?.map(c => (
                                    <View key={c.id} style={HomeStyles.allCoursesItem}>
                                        {c.thumbnail ? (
                                            <Image source={{ uri: c.thumbnail }} style={HomeStyles.courseThumb} />
                                        ) : (
                                            <MaterialCommunityIcons name="book" size={40} style={HomeStyles.courseThumbIcon} />
                                        )}
                                        <View style={HomeStyles.courseInfo}>
                                            <Text style={HomeStyles.courseTitle}>{c.title}</Text>
                                            <Text style={HomeStyles.courseDate}>
                                                Đăng ký: {new Date(c.enrolled_at).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                            <TouchableOpacity
                                style={HomeStyles.closeModalBtn}
                                onPress={() => setShowAllCoursesModal(false)}
                            >
                                <Text style={HomeStyles.closeModalBtnText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                {/* Thống kê 5 tháng gần nhất */}
                {dashboardStats && chartData && (
                    <View style={[HomeStyles.card, { padding: 15, marginVertical: 10 }]}>
                        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
                            Thống kê đăng ký 5 tháng gần nhất
                        </Text>
                        <LineChart
                            data={chartData}
                            width={screenWidth}
                            height={220}
                            chartConfig={{
                                backgroundGradientFrom: "#fff",
                                backgroundGradientTo: "#fff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(75,192,192,${opacity})`,
                                labelColor: () => "#333",
                                style: { borderRadius: 16 },
                                propsForDots: { r: "4", strokeWidth: "2", stroke: "#4BC0C0" }
                            }}
                            style={{ borderRadius: 16 }}
                        />
                        {dashboardStats.top_course.title && (
                            <Text style={{ marginTop: 10, fontWeight: "bold" }}>
                                Khóa học được đăng ký nhiều nhất: {dashboardStats.top_course.title} ({dashboardStats.top_course.count} lượt)
                            </Text>
                        )}
                    </View>
                )}

            </ScrollView>
            <BottomNav navigation={navigation} route={route} />
        </View>
    );
}
