import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/MyContexts";

import Header from "../Home/layout/Header";
import BottomNav from "../Home/layout/BottomNav";
import QuizStyles from "./Style";

const Quiz = ({ navigation, route }) => {
  const { token } = useContext(MyUserContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await authApis(token).get(endpoints['quizzes']);
        setQuizzes(res.data);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) return (
    <View style={QuizStyles.center}>
      <ActivityIndicator size="large" />
    </View>
  );

  if (quizzes.length === 0) return (
    <View style={QuizStyles.center}>
      <Text>Không có bài quiz nào</Text>
    </View>
  );
  const fetchSubmissions = async () => {
    try {
      const res = await authApis(token).get(`${endpoints["submissions"]}my_submissions`);
      setSubmissions(res.data);
      setShowSubmissions(true);
    } catch (error) {
      console.error(error);
      alert("Không thể tải lịch sử làm bài");
    }
  };

  return (
    <>
      <ScrollView style={QuizStyles.container}>
        <Header />
        <View style={QuizStyles.contentContainer}>
        <Text style={QuizStyles.h1Text}>List Quizzes</Text>
        {quizzes.map((quiz) => (
          <TouchableOpacity
            key={quiz.id}
            style={QuizStyles.quizItem}
            onPress={() => navigation.navigate("QuizDetail", { quizId: quiz.id })}
          >
            <Text style={QuizStyles.quizTitle}>{quiz.title}</Text>
            {quiz.description && <Text style={QuizStyles.quizDesc}>{quiz.description}</Text>}
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[QuizStyles.submitBtn, { backgroundColor: "#009688", marginTop: 8 }]}
          onPress={fetchSubmissions}
        >
          <Text style={QuizStyles.submitBtnText}>Xem lịch sử làm bài</Text>
        </TouchableOpacity>
        {showSubmissions && (
          <View style={{ marginTop: 16 }}>
            {submissions.map((s) => (
              <View key={s.id} style={QuizStyles.submissionItem}>
                <Text>Bài làm của: {s.user.username}</Text>
                <Text>Bài làm: {s.quiz.title}</Text>
                <Text>Điểm: {s.score}</Text>
                <Text>Thời gian: {new Date(s.submitted_at).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        )}
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} route={route} />
    </>
  );
};

export default Quiz;

