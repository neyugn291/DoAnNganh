import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, Modal, TextInput, Button, } from "react-native";
import Apis, { authApis, endpoints } from "../../configs/Apis";

import Header from "../Home/layout/Header";
import BottomNav from "../Home/layout/BottomNav";
import DiscussStyles from "./Style";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { MyUserContext } from "../../configs/MyContexts";
dayjs.extend(relativeTime);



export default function Discuss({ navigation, route }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [contentTypes, setContentTypes] = useState([]);

    const [questionTitle, setQuestionTitle] = useState("");

    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);

    const [answerBody, setAnswerBody] = useState("");
    const [commentBody, setCommentBody] = useState("");
    const [questionBody, setQuestionBody] = useState("");

    const [targetQuestionId, setTargetQuestionId] = useState(null);
    const [targetType, setTargetType] = useState(null);
    const [targetId, setTargetId] = useState(null);

    const [votes, setVotes] = useState({});


    const auth = useContext(MyUserContext);

    useEffect(() => {
        const fetchContentTypes = async () => {
            try {
                const res = await Apis.get(endpoints["content_types"]);
                setContentTypes(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchContentTypes();
    }, []);

    const createVote = async (targetType, targetId, value) => {
        try {
            const contentType = contentTypes.find(
                ct => ct.app_label === "discussions" && ct.model === targetType
            );
            if (!contentType) return;
            console.log(contentType.id, targetId, value);

            const res = await authApis(auth.token).post(endpoints["votes"], {
                content_type: contentType.id,
                object_id: targetId,
                value: value
            });


            // Cập nhật state votes
            setVotes(prev => ({
                ...prev,
                [`${targetType}-${targetId}`]: res.data.value
            }));

            // Cập nhật score trên question/answer
            setQuestions(prev =>
                prev.map(q => {
                    if (targetType === "question" && q.id === targetId) {
                        return { ...q, score: res.data.score };
                    }
                    if (targetType === "answer") {
                        return {
                            ...q,
                            answers: q.answers.map(a =>
                                a.id === targetId ? { ...a, score: res.data.score } : a
                            )
                        };
                    }
                    return q;
                })
            );
            return res;
        } catch (err) {
            console.error("Error voting", err);
        }
    };
    const handleVote = async (targetType, targetId, value) => {
        const key = `${targetType}-${targetId}`;
        const currentValue = votes[key];

        try {
            if (currentValue === value) {
                // Người dùng nhấn lại cùng value → xóa vote
                await authApis(auth.token).delete(`${endpoints["votes"]}${key}/`);
                setVotes(prev => ({ ...prev, [key]: null }));
                setQuestions(prev =>
                    prev.map(q => {
                        if (targetType === "question" && q.id === targetId) {
                            return { ...q, score: q.score - value };
                        }
                        if (targetType === "answer") {
                            return {
                                ...q,
                                answers: q.answers.map(a =>
                                    a.id === targetId ? { ...a, score: a.score - value } : a
                                )
                            };
                        }
                        return q;
                    })
                );
            } else {
                // Vote mới hoặc update value → chỉ gọi createVote
                await createVote(targetType, targetId, value);
                // Không cần setVotes ở đây nữa vì createVote đã update state rồi
            }
        } catch (err) {
            console.error("Error handling vote", err);
        }
    };


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await Apis.get(endpoints["questions"]);
                setQuestions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    const createAnswer = async (questionId, body) => {
        try {
            const res = await authApis(auth.token).post(endpoints["answers"], {
                body: body,
                question: questionId,
            });
            console.log("Answer created:", res.data);
            setQuestions(prev =>
                prev.map(q =>
                    q.id === questionId
                        ? { ...q, answers: [...q.answers, res.data] }
                        : q
                )
            );
        } catch (err) {
            console.error("Error creating answer", err);
        }
    };

    const createComment = async (targetType, targetId, body) => {
        try {
            const contentType = contentTypes.find(
                (ct) => ct.app_label === "discussions" && ct.model === targetType
            );
            if (!contentType) {
                console.error("Không tìm thấy content type:", targetType);
                return;
            }

            const res = await authApis(auth.token).post(endpoints["comments"], {
                body: body,
                content_type: contentType.id,
                object_id: targetId,
            });
            console.log("Comment created:", res.data);
            // Cập nhật state trực tiếp
            setQuestions(prev =>
                prev.map(q => {
                    // Nếu comment trên question
                    if (targetType === "question" && q.id === targetId) {
                        return { ...q, comments: [...(q.comments || []), res.data] };
                    }
                    // Nếu comment trên answer
                    if (targetType === "answer") {
                        return {
                            ...q,
                            answers: q.answers.map(a =>
                                a.id === targetId ? { ...a, comments: [...(a.comments || []), res.data] } : a
                            ),
                        };
                    }
                    return q;
                })
            );

        } catch (err) {
            console.error("Error creating comment", err);
        }
    };
    const createQuestion = async () => {
        if (!questionBody.trim()) return;
        try {
            const res = await authApis(auth.token).post(endpoints["questions"], {
                body: questionBody,

            });
            console.log("Question created:", res.data);
            setQuestionBody("");
            setShowQuestionModal(false);
        } catch (err) {
            console.error("Error creating question", err);
        }
    };

    // --- Render Comment ---
    const renderComment = (comment) => (
        <View key={comment.id} style={DiscussStyles.commentContainer}>
            <View style={DiscussStyles.row}>
                {comment.author.profile?.avatar ? (
                    <Image source={{ uri: comment.author.profile?.avatar }} style={DiscussStyles.avatar}
                    />) : (
                    <MaterialCommunityIcons
                        name="account-circle"
                        size={40}
                        color="#ccc"
                        style={DiscussStyles.avatarIcon}
                    />)}
                <View style={DiscussStyles.contentBox}>
                    <Text style={DiscussStyles.nameText}>{comment.author.username}</Text>
                    <Text style={DiscussStyles.bodyText}>Comment: {comment.body}</Text>
                    <Text style={DiscussStyles.timeText}>{dayjs(comment.created_at).fromNow()}</Text>
                </View>
            </View>
        </View>
    );

    // --- Render Answer ---
    const renderAnswer = (answer) => (
        <View key={answer.id} style={DiscussStyles.answerContainer}>
            <View style={DiscussStyles.row}>
                {answer.author.profile?.avatar ? (
                    <Image source={{ uri: answer.author.profile?.avatar }} style={DiscussStyles.avatar}
                    />) : (
                    <MaterialCommunityIcons
                        name="account-circle"
                        size={40}
                        color="#ccc"
                        style={DiscussStyles.avatarIcon}
                    />)}
                <View style={DiscussStyles.contentBox}>
                    <Text style={DiscussStyles.nameText}>{answer.author.username}</Text>
                    <Text style={DiscussStyles.bodyText}>Answer: {answer.body}</Text>
                    <Text style={DiscussStyles.timeText}>{dayjs(answer.created_at).fromNow()}</Text>
                    <View style={DiscussStyles.voteRow}>
                        <TouchableOpacity onPress={() => handleVote("answer", answer.id, 1)}>
                            <MaterialCommunityIcons
                                name="thumb-up"
                                size={24}
                                color={votes[`answer-${answer.id}`] === 1 ? "blue" : "#ccc"}
                            />
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 5 }}>{answer.score || 0}</Text>
                        <TouchableOpacity onPress={() => handleVote("answer", answer.id, -1)}>
                            <MaterialCommunityIcons
                                name="thumb-down"
                                size={24}
                                color={votes[`answer-${answer.id}`] === -1 ? "red" : "#ccc"}
                            />
                        </TouchableOpacity>
                        <View style={DiscussStyles.buttonRow}>
                            <TouchableOpacity
                                onPress={() => {
                                    setTargetType("answer");
                                    setTargetId(answer.id);
                                    setShowCommentModal(true);
                                }}
                                style={DiscussStyles.button}>
                                <Text style={DiscussStyles.buttonText}>Comment</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* Render comments của answer */}
                    {answer.comments?.length > 0 &&
                        answer.comments.map((comment) => renderComment(comment))}

                </View>
            </View>
        </View>
    );

    // --- Render Question ---
    const renderQuestion = ({ item }) => (
        <View style={DiscussStyles.card}>
            <View style={DiscussStyles.row}>
                {item.author.profile?.avatar ? (
                    <Image source={{ uri: item.author.profile?.avatar }} style={DiscussStyles.avatar}
                    />) : (
                    <MaterialCommunityIcons
                        name="account-circle"
                        size={40}
                        color="#ccc"
                        style={DiscussStyles.avatarIcon}
                    />
                )}
                <View style={DiscussStyles.contentBox}>
                    <Text style={DiscussStyles.nameText}>{item.author.username}</Text>
                    <Text style={DiscussStyles.titleText}>Question: {item.title}</Text>
                    <Text style={DiscussStyles.bodyText}>Content: {item.body}</Text>
                    <Text style={DiscussStyles.timeText}>{dayjs(item.created_at).fromNow()}</Text>
                </View>
            </View>
            <View style={DiscussStyles.voteRow}>
                <TouchableOpacity onPress={() => handleVote("question", item.id, 1)}>
                    <MaterialCommunityIcons
                        name="thumb-up"
                        size={24}
                        color={votes[`question-${item.id}`] === 1 ? "blue" : "#ccc"}
                    />
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 5 }}>{item.score}</Text>
                <TouchableOpacity onPress={() => handleVote("question", item.id, -1)}>
                    <MaterialCommunityIcons
                        name="thumb-down"
                        size={24}
                        color={votes[`question-${item.id}`] === -1 ? "red" : "#ccc"}
                    />
                </TouchableOpacity>
                <View style={DiscussStyles.buttonRow}>
                    <TouchableOpacity
                        onPress={() => {
                            setTargetQuestionId(item.id);
                            setShowAnswerModal(true);
                        }}
                        style={DiscussStyles.button}>
                        <Text style={DiscussStyles.buttonText}>Answer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setTargetType("question");
                            setTargetId(item.id);
                            setShowCommentModal(true);
                        }}
                        style={DiscussStyles.button}>
                        <Text style={DiscussStyles.buttonText}>Comment</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* Render answers của question */}
            {item.answers?.length > 0 &&
                item.answers.map((answer) => renderAnswer(answer))}


        </View>
    );

    return (
        <View style={DiscussStyles.container}>
            <Header />
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.id.toString()}
                    style={{ marginBottom: 60 }}
                    renderItem={renderQuestion} // chỉ gọi renderQuestion thôi
                    ListHeaderComponent={
                        <View style={DiscussStyles.createQuestionContainer} >
                            <TextInput
                                style={DiscussStyles.inputTitle}
                                placeholder="Tiêu đề"
                                value={questionTitle}
                                onChangeText={setQuestionTitle}
                            />
                            <TextInput
                                style={DiscussStyles.inputBody}
                                placeholder="Nội dung"
                                value={questionBody}
                                onChangeText={setQuestionBody}
                            />
                            <TouchableOpacity
                                style={DiscussStyles.submitButton}
                                onPress={async () => {
                                    if (!questionBody.trim()) return;
                                    try {
                                        const res = await authApis(auth.token).post(endpoints["questions"], {
                                            title: questionTitle,
                                            body: questionBody,
                                        });
                                        setQuestions(prev => [res.data, ...prev]);
                                        setQuestionTitle("");
                                        setQuestionBody("");
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                            >
                                <Text style={DiscussStyles.submitButtonText}>Đăng câu hỏi</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </SafeAreaView>
            <BottomNav navigation={navigation} route={route} />
            {/* --- Modal Answer --- */}
            <Modal visible={showAnswerModal} animationType="slide" transparent={true}>
                <View style={DiscussStyles.modalContainer}>
                    <View style={DiscussStyles.modalContent}>
                        <Text style={DiscussStyles.modalTitle}>Create Answer</Text>
                        <TextInput
                            style={DiscussStyles.input}
                            placeholder="Enter answer..."
                            value={answerBody}
                            onChangeText={setAnswerBody}
                        />
                        <View style={DiscussStyles.modalButtonRow}>
                            <TouchableOpacity
                                style={[DiscussStyles.buttonSubmit, { backgroundColor: "#5C4D7D" }]}
                                onPress={() => {
                                    createAnswer(targetQuestionId, answerBody);
                                    setShowAnswerModal(false);
                                    setAnswerBody("");
                                }}
                            >
                                <Text style={DiscussStyles.buttonTextWhite}>Submit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[DiscussStyles.buttonCancel, { backgroundColor: "#aaa" }]}
                                onPress={() => setShowAnswerModal(false)}
                            >
                                <Text style={DiscussStyles.buttonTextWhite}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* --- Modal Comment --- */}
            <Modal visible={showCommentModal} animationType="slide" transparent={true}>
                <View style={DiscussStyles.modalContainer}>
                    <View style={DiscussStyles.modalContent}>
                        <Text style={DiscussStyles.modalTitle}>Create Comment</Text>
                        <TextInput
                            style={DiscussStyles.input}
                            placeholder="Enter comment..."
                            value={commentBody}
                            onChangeText={setCommentBody}
                        />
                        <View style={DiscussStyles.modalButtonRow}>
                            <TouchableOpacity
                                style={[DiscussStyles.buttonSubmit, { backgroundColor: "#5C4D7D" }]}
                                onPress={() => {
                                    createComment(targetType, targetId, commentBody);
                                    setShowCommentModal(false);
                                    setCommentBody("");
                                }}
                            >
                                <Text style={DiscussStyles.buttonTextWhite}>Submit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[DiscussStyles.buttonCancel, { backgroundColor: "#aaa" }]}
                                onPress={() => setShowCommentModal(false)}
                            >
                                <Text style={DiscussStyles.buttonTextWhite}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}


