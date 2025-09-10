import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DiscussStyles from "./Style";

export default function Vote({ targetType, targetId, score, votes, onVote }) {
  return (
    <View style={DiscussStyles.voteRow}>
      <TouchableOpacity onPress={() => onVote(targetType, targetId, 1)}>
        <MaterialCommunityIcons
          name="thumb-up"
          size={24}
          color={votes[`${targetType}-${targetId}`] === 1 ? "blue" : "#ccc"}
        />
      </TouchableOpacity>

      <Text style={{ marginHorizontal: 5 }}>{score || 0}</Text>

      <TouchableOpacity onPress={() => onVote(targetType, targetId, -1)}>
        <MaterialCommunityIcons
          name="thumb-down"
          size={24}
          color={votes[`${targetType}-${targetId}`] === -1 ? "red" : "#ccc"}
        />
      </TouchableOpacity>
    </View>
  );
}
