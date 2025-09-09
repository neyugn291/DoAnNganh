import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Linking } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import WebView from "react-native-webview";
import { Video } from "expo-av";

import { Dimensions } from "react-native";
import { ModuleStyles } from "./Style";

const { height } = Dimensions.get("window");

export default function Lesson({ route }) {
    const { lessonId } = route.params;
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const res = await Apis.get(`${endpoints["lessons"]}${lessonId}/`);
                const data = res.data;

                // Chuyển thẳng document_url sang https
                data.document_url = data.document_url.replace("http://", "https://");
                setLesson(data);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [lessonId]);


    if (loading) return <ActivityIndicator size="large" />;

    const googleViewer = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(lesson.document_url)}`;
    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <Text style={styles.title}>{lesson.title}</Text>
                <Text style={styles.description}>{lesson.content}</Text>
                {lesson.document_url && (
                        <TouchableOpacity style={ModuleStyles.buttonLinking} onPress={() => Linking.openURL(lesson.document_url)}>
                            <Text style={ModuleStyles.textLinking}>Tải / Mở PDF</Text>
                        </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        margin: 16,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    content: { padding: 10 },
    title: { fontSize: 18, fontWeight: "bold", color: "#6A1B9A", marginBottom: 8 },
    description: { fontSize: 15, color: "#333" },
    document: { fontSize: 14, color: "#E91E63", marginTop: 6, textDecorationLine: "underline" },
});
