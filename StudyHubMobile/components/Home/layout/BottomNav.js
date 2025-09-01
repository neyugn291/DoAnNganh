import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomeStyles from "../Style";

export default function BottomNav({ navigation, route }) {
    const [navItems] = useState([
        { icon: 'home', label: 'Trang chủ', screen: 'Home' },
        { icon: 'book-open-page-variant', label: 'Khóa học', screen: 'Course' },
        { icon: 'forum', label: 'Diễn đàn', screen: 'Discuss' },
        { icon: 'folder', label: 'Tài liệu', screen: 'Resource' },
        { icon: 'clipboard-list', label: 'Trắc nghiệm', screen: 'Quiz' },
    ]);

    return (
        <View style={HomeStyles.bottomNav}>
            {navItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={HomeStyles.navItem}
                    onPress={() => navigation.navigate(item.screen, { navItems })}
                >
                    <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color={route?.name === item.screen ? '#5C4D7D' : '#7B68A1'}
                    />
                    <Text style={[HomeStyles.navLabel, route?.name === item.screen && HomeStyles.activeNav]}>
                        {item.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
