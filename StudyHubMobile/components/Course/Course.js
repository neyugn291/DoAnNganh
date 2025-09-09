import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Apis, { authApis,endpoints } from "../../configs/Apis";
import Header from "../Home/layout/Header";
import BottomNav from "../Home/layout/BottomNav";
import CourseStyles from "./Style";
import { MyUserContext } from "../../configs/MyContexts";

const PAGE_SIZE = 2;

const Course = ({ navigation, route }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const auth = useContext(MyUserContext);

    const handleRegister = async (courseId) => {
        try {
            const res = await authApis(auth.token).post(endpoints["enrollments"], {
                course: courseId
            });
            console.log("Đăng ký thành công:", res.data);

            setCourses(prev =>
                prev.map(c =>
                    c.id === courseId ? { ...c, is_enrolled: true } : c
                )
            );
        } catch (error) {
            console.error("Lỗi đăng ký khóa học:", error.message);
        }
    };

    useEffect(() => {
        const fetchCourses = async (pageNumber = 1) => {
            try {
                const res = await Apis.get(endpoints["courses"], {
                    params: { page: pageNumber, page_size: PAGE_SIZE }
                });
                setCourses(res.data);
                const allCourses = res.data;

                const enrollRes = await authApis(auth.token).get(endpoints["enrollments"]);

                const myUserName = auth.user.username;
                const enrolledCourseIds = enrollRes.data
                    .filter(e => e.user === myUserName) // lọc enroll của user hiện tại
                    .map(e => e.course);

                // Gắn is_enrolled vào danh sách khóa học
                const updatedCourses = allCourses.map(c => ({
                    ...c,
                    is_enrolled: enrolledCourseIds.includes(c.id),
                }));

                const start = (pageNumber - 1) * PAGE_SIZE;
                const end = start + PAGE_SIZE;
                setCourses(updatedCourses.slice(start, end));
                setTotalPages(Math.ceil(allCourses.length / PAGE_SIZE));
            } catch (error) {
                console.error("Lỗi lấy danh sách khóa học:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses(page);
    }, [page]);

    const renderCourse = ({ item }) => (

        <TouchableOpacity style={CourseStyles.card} onPress={() => {
            if (item.is_enrolled) {
                navigation.navigate("Module", { courseId: item.id });
            } else {
                alert("Bạn phải đăng ký khóa học trước!");
            }
        }}>
            <Image
                source={{ uri: item.thumbnail_url || item.thumbnail }}
                style={CourseStyles.courseImage}
                resizeMode="cover"
            />
            <View style={CourseStyles.cardContent}>
                <Text style={CourseStyles.courseTitle}>{item.title}</Text>
                <Text style={CourseStyles.courseDescription} numberOfLines={2}>{item.description}</Text>
                <Text style={CourseStyles.coursePrice}>
                    {item.is_free ? "Miễn phí" : `${item.price} VND`}
                </Text>
                {item.is_enrolled ? (
                    <View>
                        <Text style={CourseStyles.registerButtonText}>Đã đăng ký</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={CourseStyles.registerButton}
                        onPress={() => handleRegister(item.id)}
                    >
                        <Text style={CourseStyles.registerButtonText}>Đăng ký</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>


    );

    if (loading) return <ActivityIndicator size="large" color="#6A1B9A" style={{ flex: 1, justifyContent: "center" }} />;


    return (
        <View style={CourseStyles.container}>
            <Header />

            <FlatList
                data={courses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCourse}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListFooterComponent={() => (
                    <View style={CourseStyles.footFlatList}>
                        <TouchableOpacity
                            disabled={page <= 1}
                            onPress={() => setPage(page - 1)}>
                            <Text style={[CourseStyles.buttonText, page <= 1 && CourseStyles.disabled]}>
                                Trước
                            </Text>
                        </TouchableOpacity>
                        <Text style={CourseStyles.pageInfo}>
                            Trang {page} / {totalPages}
                        </Text>
                        <TouchableOpacity
                            disabled={page >= totalPages}
                            onPress={() => setPage(page + 1)}>
                            <Text style={[CourseStyles.buttonText, page >= totalPages && CourseStyles.disabled]}>
                                Sau
                            </Text>
                        </TouchableOpacity>
                    </View>
                )} />

            <View style={CourseStyles.footerTextPosition}>
                <TouchableOpacity onPress={() => navigation.navigate('MyCoursesScreen')}>
                    <Text style={CourseStyles.footerText}>
                        Xem khóa học của tôi
                    </Text>
                </TouchableOpacity>
            </View>
            <BottomNav navigation={navigation} route={route} />
        </View>
    );
}

export default Course;