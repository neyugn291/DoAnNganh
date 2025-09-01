import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { ModuleStyles } from "./Style";
import Header from "../Home/layout/Header";
import BottomNav from "../Home/layout/BottomNav";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Lesson from "./Lesson";


const PAGE_SIZE = 4;

export default function Module({ navigation, route }) {
    const { courseId } = route.params;
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [expandedModuleIds, setExpandedModuleIds] = useState([]);

    const [selectedLessonId, setSelectedLessonId] = useState(null);


    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await Apis.get(`${endpoints["courses"]}${courseId}/`);
                setCourse(res.data);
                setTotalPages(Math.ceil(res.data.modules.length / PAGE_SIZE));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) return <ActivityIndicator size="large" />;

    const currentModules = course.modules.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const toggleModule = (moduleId) => {
        setExpandedModuleIds((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId) // đóng module
                : [...prev, moduleId] // mở module
        );
    };

    const renderModule = ({ item }) => {
        const isExpanded = expandedModuleIds.includes(item.id);
        return (
            <TouchableOpacity style={ModuleStyles.moduleCard} onPress={() => toggleModule(item.id)}>
                <Text style={ModuleStyles.moduleTitle}>
                    {item.order}. {item.title}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <MaterialCommunityIcons
                        name={isExpanded ? "minus-circle-outline" : "plus-circle-outline"}
                        size={24}
                        color="#6A1B9A"
                        style={{ marginLeft: 8 }}
                    />
                    <Text style={ModuleStyles.moduleLessons}>{item.lessons.length} bài học</Text>
                </View>
                {isExpanded && (
                    <View style={ModuleStyles.moduleLessonsDropdown}>
                        {item.lessons.map((lesson) => (
                            <View key={lesson.id} style={ModuleStyles.lessonItem}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}
                                    onPress={() => navigation.navigate('Lesson', { lessonId: lesson.id })}>
                                    <MaterialCommunityIcons
                                        name="plus-circle-outline"
                                        size={16}
                                        color="#6A1B9A"
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text style={ModuleStyles.lessonItem}>
                                        {lesson.order}. {lesson.title}
                                    </Text>
                                </TouchableOpacity>
                                {selectedLessonId === lesson.id && (
                                    <Lesson lesson={lesson} />
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={ModuleStyles.container}>
            <Header />
            <View style={ModuleStyles.containerModule}>
                <Text style={ModuleStyles.modulePageTitle}>Khóa học: {course.title}</Text>
                <Text style={ModuleStyles.modulePageDescription}>{course.description}</Text>
                <FlatList
                    data={currentModules}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderModule}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListFooterComponent={() => (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
                            <TouchableOpacity
                                disabled={page <= 1}
                                onPress={() => setPage(page - 1)}
                                style={{ opacity: page <= 1 ? 0.5 : 1 }}
                            >
                                <Text>Trước</Text>
                            </TouchableOpacity>

                            <Text>Trang {page} / {totalPages}</Text>

                            <TouchableOpacity
                                disabled={page >= totalPages}
                                onPress={() => setPage(page + 1)}
                                style={{ opacity: page >= totalPages ? 0.5 : 1 }}
                            >
                                <Text>Sau</Text>
                            </TouchableOpacity>
                        </View>
                    )} />
            </View>

            <BottomNav navigation={navigation} route={route} />
        </View>
    );
}
