import React, { useState, useContext, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, FlatList, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/MyContexts";

import Header from "../Home/layout/Header";
import BottomNav from "../Home/layout/BottomNav";
import ResourceStyles from "./Style";
const Resource = ({ navigation, route }) => {
    const auth = useContext(MyUserContext);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);

    // Các trường search riêng
    const [title, setTitle] = useState("");
    const [types, setTypes] = useState([]);
    const [typeFilter, setTypeFilter] = useState("");

    const [subject, setSubject] = useState("");
    const [tag, setTag] = useState("");

    useEffect(() => {
  const fetchTypes = async () => {
    try {
      const res = await authApis(auth.token).get(`${endpoints["resources"]}types/`);
      setTypes(res.data); // res.data = [{ key: "PDF", label: "PDF Document" }, ...]
    } catch (err) {
      console.error("Lỗi lấy type:", err);
    }
  };
  fetchTypes();
}, []);


    const fetchResources = async (params = {}) => {
    setLoading(true);
    try {
        // Dùng URLSearchParams tự build query string
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
            if (params[key]) searchParams.append(key, params[key]);
        });

        const res = await authApis(auth.token).get(
            `${endpoints["resources"]}?${searchParams.toString()}`
        );
        setResources(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchResources();
    }, []);

    const handleSearch = () => {
        fetchResources({
            search: title,
            resource_type: typeFilter,
            subject_name: subject,
            tags_name: tag,
        });
    };
    const renderItem = ({ item }) => (
        <View style={ResourceStyles.card}>
            <Text style={ResourceStyles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{item.resource_type}</Text>
        </View>
    );

    return (
        <>
            <ScrollView style={ResourceStyles.container}>
                <Header />
                {/* 5 ô input */}
                <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={ResourceStyles.input} />
                <TextInput placeholder="Subject" value={subject} onChangeText={setSubject} style={ResourceStyles.input} />
                <TextInput placeholder="Tag" value={tag} onChangeText={setTag} style={ResourceStyles.input} />

                {/* Type filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                    {types.map((t) => (
                        <TouchableOpacity
                            key={t.key}
                            style={[
                                ResourceStyles.typeBtn,
                                typeFilter === t.key && ResourceStyles.typeBtnActive,
                            ]}
                            onPress={() => setTypeFilter(t.key)}
                        >
                            <Text
                                style={{
                                    color: typeFilter === t.key ? "#fff" : "#007bff",
                                    fontWeight: "bold",
                                }}
                            >
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Nút tìm kiếm */}
                <TouchableOpacity style={ResourceStyles.searchBtn} onPress={handleSearch}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Tìm kiếm</Text>
                </TouchableOpacity>

                {loading && <ActivityIndicator size="large" color="#007bff" />}

                {/* Kết quả */}
                <FlatList
                    data={resources}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    scrollEnabled={false} // FlatList không scroll vì ScrollView bao ngoài
                />

            </ScrollView>
            <BottomNav navigation={navigation} route={route} />
        </>
    );
};

const searchBtnStyle = {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
};

export default Resource;
