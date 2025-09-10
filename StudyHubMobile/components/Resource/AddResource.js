import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { ResourceDetailStyles } from "./Style";
import Header from "../Home/layout/Header";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import * as DocumentPicker from "expo-document-picker";
import { MyUserContext } from "../../configs/MyContexts";

const AddResource = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [resourceType, setResourceType] = useState("PDF");
    const [file, setFile] = useState(null);
    const [codeSnippet, setCodeSnippet] = useState("");
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const auth = useContext(MyUserContext);

    useEffect(() => {
        const loadData = async () => {
            try {
                let [subRes, tagRes] = await Promise.all([
                    authApis(auth.token).get(endpoints["subjects"]),
                    authApis(auth.token).get(endpoints["tags"]),
                ]);
                setSubjects(subRes.data);
                setTags(tagRes.data);
            } catch (err) {
                console.error("Lỗi load subject/tag:", err);
            }
        };
        loadData();
    }, []);



    // 📂 Chọn file
    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled && result.assets.length > 0) {
                const asset = result.assets[0];
                setFile(asset);
                console.log("File đã chọn:", asset);
            }
        } catch (err) {
            console.error("Lỗi chọn file:", err);
        }
    };

    const handleSubmit = async () => {
        if (!title || !resourceType || !selectedSubject) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập tiêu đề, chọn môn học và loại tài nguyên");
            return;
        }

        try {
            setLoading(true);

            let formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("resource_type", resourceType);
            formData.append("subject_id", selectedSubject);

            selectedTags.forEach((tagId) => formData.append("tag_ids", tagId));

            if (resourceType === "CODE") {
                if (!codeSnippet) {
                    Alert.alert("Thiếu code", "Vui lòng nhập code trước khi lưu");
                    return;
                }
                formData.append("code_snippet", codeSnippet);
            } else {
                if (!file) {
                    Alert.alert("Thiếu file", "Vui lòng chọn file trước khi lưu");
                    return;
                }
                formData.append("file", {
                    uri: file.uri,
                    name: file.name || "upload.file",
                    type: file.mimeType || "application/octet-stream",
                });
            }

            let res = await authApis(auth.token).post(endpoints["resources"], formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 201 || res.status === 200) {
                Alert.alert("Thành công", "Đã thêm tài nguyên!");
                navigation.goBack();
            } else {
                Alert.alert("Lỗi", "Không thể thêm tài nguyên");
            }
        } catch (err) {
            console.error("Lỗi thêm tài nguyên:", err);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi thêm tài nguyên");
        } finally {
            setLoading(false);
        }
    };


    return (
        <ScrollView style={ResourceDetailStyles.container}>
            <Header />
            <View style={ResourceDetailStyles.contentContainer}>
                <Text style={ResourceDetailStyles.title}>Thêm tài nguyên</Text>

                <TextInput
                    placeholder="Tiêu đề"
                    value={title}
                    onChangeText={setTitle}
                    style={ResourceDetailStyles.input}
                />

                <TextInput
                    placeholder="Mô tả"
                    value={description}
                    onChangeText={setDescription}
                    style={ResourceDetailStyles.input}
                />

                {/* Chọn Subject */}
                {/* Chọn Subject */}
                <Text style={{ marginVertical: 8, fontWeight: "bold" }}>Chọn môn học:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {subjects.map((sub) => (
                        <TouchableOpacity
                            key={sub.id}
                            style={[
                                ResourceDetailStyles.button,
                                { marginRight: 8 },
                                selectedSubject === sub.id && { backgroundColor: "#28a745" },
                            ]}
                            onPress={() => setSelectedSubject(sub.id)}
                        >
                            <Text style={ResourceDetailStyles.buttonText}>{sub.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Chọn Resource Type */}
                <Text style={{ marginVertical: 8, fontWeight: "bold" }}>Chọn loại tài nguyên:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {["PDF", "SLIDE", "CODE", "OTHER"].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                ResourceDetailStyles.button,
                                { marginRight: 8 },
                                resourceType === type && { backgroundColor: "#007bff" },
                            ]}
                            onPress={() => {
                                setResourceType(type);
                                setFile(null);
                                setCodeSnippet("");
                            }}
                        >
                            <Text style={ResourceDetailStyles.buttonText}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Chọn Tags */}
                <Text style={{ marginVertical: 8, fontWeight: "bold" }}>Chọn Tags:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tags.map((tag) => (
                        <TouchableOpacity
                            key={tag.id}
                            style={[
                                ResourceDetailStyles.button,
                                { marginRight: 8 },
                                selectedTags.includes(tag.id) && { backgroundColor: "#6f42c1" },
                            ]}
                            onPress={() => toggleTag(tag.id)}
                        >
                            <Text style={ResourceDetailStyles.buttonText}>{tag.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>


                {/* CODE thì hiển thị input nhập code */}
                {resourceType === "CODE" ? (
                    <TextInput
                        placeholder="Nhập code snippet"
                        value={codeSnippet}
                        onChangeText={setCodeSnippet}
                        style={[ResourceDetailStyles.input, { height: 120 }]}
                        multiline
                    />
                ) : (
                    // Các loại khác thì chọn file
                    <TouchableOpacity style={ResourceDetailStyles.button} onPress={pickFile}>
                        <Text style={ResourceDetailStyles.buttonText}>
                            {file ? `Đã chọn: ${file.name}` : "Chọn file"}
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[ResourceDetailStyles.button, loading && { opacity: 0.5 }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={ResourceDetailStyles.buttonText}>
                        {loading ? "Đang lưu..." : "Lưu tài nguyên"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddResource;