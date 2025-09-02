import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView, Image } from "react-native";
import { Video } from "expo-av";
import { ResourceDetailStyles } from "./Style";

import Header from "../Home/layout/Header";

const ResourceDetail = ({ route }) => {
    const { resource } = route.params;
    const [codeContent, setCodeContent] = useState(null);
    const [loading, setLoading] = useState(false);

    const openLink = async (url) => {
        if (!url) return;
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                alert("Không thể mở link này!");
            }
        } catch (err) {
            console.error("Lỗi mở link:", err);
        }
    };

    useEffect(() => {
        if (resource.resource_type === "CODE" && resource.file_url) {
            setLoading(true);
            fetch(resource.file_url)
                .then((res) => res.text())
                .then((text) => setCodeContent(text))
                .catch((err) => console.error("Lỗi tải code:", err))
                .finally(() => setLoading(false));
        }
    }, [resource]);

    const renderContent = () => {
        switch (resource.resource_type) {
            case "PDF":
                return (
                    <TouchableOpacity style={ResourceDetailStyles.button} onPress={() => openLink(resource.file_url)}>
                        <Text style={ResourceDetailStyles.buttonText}>Mở PDF</Text>
                    </TouchableOpacity>
                );

            case "SLIDE":
                return (
                    <TouchableOpacity style={ResourceDetailStyles.button} onPress={() => openLink(resource.file_url)}>
                        <Text style={ResourceDetailStyles.buttonText}>Tải / Mở Slide</Text>
                    </TouchableOpacity>
                );
            case "CODE":
                return codeContent ? (
                    <ScrollView style={ResourceDetailStyles.codeBox} horizontal>
                        <Text style={ResourceDetailStyles.codeText}>{codeContent}</Text>
                    </ScrollView>
                ) : (
                    <TouchableOpacity
                        style={ResourceDetailStyles.button}
                        onPress={() => setCodeContent(resource.code_snippet)}
                    >
                        <Text style={ResourceDetailStyles.buttonText}>Xem Code</Text>
                    </TouchableOpacity>
                );
            case "OTHER":
            default:
                if (resource.file_url.match(/\.(jpeg|jpg|png|gif)$/i)) {
                    return (
                        <Image
                            source={{ uri: resource.file_url }}
                            style={{ width: "100%", height: 300, marginVertical: 10 }}
                            resizeMode="contain"
                        />
                    );
                } else if (resource.file_url.match(/\.(mp4|mov)$/i)) {
                    return (
                        <Video
                            source={{ uri: resource.file_url }}
                            useNativeControls
                            resizeMode="contain"
                            style={{ width: "100%", height: 300, marginVertical: 10 }}
                        />
                    );
                } else {
                    return (
                        <TouchableOpacity style={ResourceDetailStyles.button} onPress={() => openLink(resource.file_url)}>
                            <Text style={ResourceDetailStyles.buttonText}>Mở file</Text>
                        </TouchableOpacity>
                    );
                }
        }
    };

    return (
        <ScrollView style={ResourceDetailStyles.container}>
            <Header />

            <View style={ResourceDetailStyles.contentContainer}>
                <Text style={ResourceDetailStyles.title}>{resource.title}</Text>
                {resource.description ? <Text style={ResourceDetailStyles.description}>Description: {resource.description}</Text> : null}
                {renderContent()}
            </View>
        </ScrollView>
    );
};

export default ResourceDetail;
