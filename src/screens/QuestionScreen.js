import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import QuestionImage from '../components/QuestionImage';
import { API_BASE_URL } from '../config/api';
import { pickImageFromLibrary, takePhotoWithCamera } from '../utils/pickImage';
import {
  getCorrectOptionIndex,
  getOptionText,
  normalizeQuestionData,
  normalizeQuestionOptionImages,
  normalizeQuestionOptions,
} from '../utils/questionFormat';

const EMPTY_FORM = {
  questionText: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  explanation: '',
  questionImage: '',
  optionImages: ['', '', '', ''],
  explanationImage: '',
};

function getQuestionTitle(question) {
  return question?.questionText || question?.question || '';
}

function normalizeOptionImages(question) {
  const raw = normalizeQuestionOptionImages(question?.optionImages, question?.options);
  const next = raw.map((uri) => (uri == null ? '' : String(uri)));
  while (next.length < 4) {
    next.push('');
  }
  return next.slice(0, 4);
}

function normalizeOptions(question) {
  const currentOptions = normalizeQuestionOptions(question?.options);
  const optionTexts = currentOptions.map((option) => getOptionText(option));

  while (optionTexts.length < 4) {
    optionTexts.push('');
  }

  return optionTexts.slice(0, 4);
}

function ScreenCard({ title, subtitle, count, onPress, accent = '#2563EB' }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={{ color: '#000000', fontFamily: 'ManropeBold', fontSize: 16 }}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={{
                marginTop: 4,
                color: '#6B7280',
                fontFamily: 'ManropeRegular',
                fontSize: 12,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          {typeof count === 'number' ? (
            <Text style={{ color: accent, fontFamily: 'ManropeExtraBold', fontSize: 16 }}>
              {count}
            </Text>
          ) : null}
          <Text
            style={{
              marginTop: 4,
              color: '#2563EB',
              fontFamily: 'ManropeSemiBold',
              fontSize: 12,
            }}
          >
            Open
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function PillButton({ label, selected, onPress, selectedColor = '#2563EB' }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 10,
        marginRight: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: selected ? selectedColor : '#FFFFFF',
        borderWidth: 1,
        borderColor: selected ? selectedColor : '#D1D5DB',
      }}
    >
      <Text
        style={{
          color: selected ? '#FFFFFF' : '#000000',
          fontFamily: 'ManropeBold',
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function isEmbeddedPhotoValue(str) {
  return typeof str === 'string' && str.startsWith('data:') && str.length > 300;
}

function ImageSlotRow({
  value,
  onChangeText,
  onGallery,
  onCamera,
  onClear,
  busy,
  previewHeight = 200,
}) {
  const largePhoto = isEmbeddedPhotoValue(value);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 8,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={onGallery}
          disabled={busy}
          style={{
            marginRight: 8,
            marginBottom: 8,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
            backgroundColor: '#EFF6FF',
            borderWidth: 1,
            borderColor: '#BFDBFE',
            opacity: busy ? 0.6 : 1,
          }}
        >
          <Text style={{ color: '#1D4ED8', fontFamily: 'ManropeBold', fontSize: 13 }}>
            {busy ? 'Please wait…' : 'Gallery'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCamera}
          disabled={busy}
          style={{
            marginRight: 8,
            marginBottom: 8,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#D1D5DB',
            opacity: busy ? 0.6 : 1,
          }}
        >
          <Text style={{ color: '#111827', fontFamily: 'ManropeBold', fontSize: 13 }}>Camera</Text>
        </TouchableOpacity>
        {value ? (
          <TouchableOpacity
            onPress={onClear}
            style={{
              marginBottom: 8,
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 10,
              backgroundColor: '#FEF2F2',
              borderWidth: 1,
              borderColor: '#FECACA',
            }}
          >
            <Text style={{ color: '#DC2626', fontFamily: 'ManropeBold', fontSize: 13 }}>Remove</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <QuestionImage uri={value} height={previewHeight} />

      {!largePhoto ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Optional: paste https:// image URL"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            marginTop: 10,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 14,
            padding: 12,
            color: '#000000',
            fontFamily: 'ManropeRegular',
          }}
        />
      ) : (
        <Text
          style={{
            marginTop: 10,
            color: '#6B7280',
            fontFamily: 'ManropeRegular',
            fontSize: 12,
          }}
        >
          Photo attached from your device. Tap Remove to replace it or use a link instead.
        </Text>
      )}
    </>
  );
}

function ActionButton({ label, onPress, tone = 'primary', disabled = false }) {
  const colors =
    tone === 'danger'
      ? { backgroundColor: '#FFFFFF', textColor: '#DC2626', borderColor: '#E5E7EB' }
      : tone === 'secondary'
      ? { backgroundColor: '#FFFFFF', textColor: '#000000', borderColor: '#E5E7EB' }
      : { backgroundColor: '#2563EB', textColor: '#FFFFFF', borderColor: '#2563EB' };

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        flex: 1,
        opacity: disabled ? 0.6 : 1,
        backgroundColor: colors.backgroundColor,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderColor,
      }}
    >
      <Text style={{ color: colors.textColor, fontFamily: 'ManropeBold', fontSize: 14 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function QuestionScreen() {
  const [view, setView] = useState('units');
  const [units, setUnits] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchUnits();
  }, []);

  const closeForm = () => {
    setFormVisible(false);
    setEditingQuestion(null);
    setForm(EMPTY_FORM);
  };

  const getScopeLabel = () => {
    const labels = [
      selectedUnit?.name,
      selectedTopic?.name,
      selectedSubtopic?.name,
    ].filter(Boolean);

    return labels.join(' / ');
  };

  const getHeaderTitle = () => {
    if (formVisible) {
      return editingQuestion ? 'Edit Question' : 'Add Question';
    }
    return 'Questions';
  };

  const fetchUnits = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/content/units`);
      setUnits(Array.isArray(res.data) ? res.data : []);
      setView('units');
    } catch (err) {
      console.log('Units fetch error:', err);
      Alert.alert('Error', 'Failed to load units');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchTopics = async (unit, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/content/topics/${unit._id}`);
      setSelectedUnit(unit);
      setSelectedTopic(null);
      setSelectedSubtopic(null);
      setTopics(Array.isArray(res.data) ? res.data : []);
      setSubtopics([]);
      setQuestions([]);
      setView('topics');
    } catch (err) {
      console.log('Topics fetch error:', err);
      Alert.alert('Error', 'Failed to load topics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchQuestions = async ({ topic, subtopic, isRefresh = false }) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const params = subtopic ? { subtopicId: subtopic._id } : { topicId: topic._id };
      const res = await axios.get(`${API_BASE_URL}/api/admin/questions`, { params });
      setQuestions(
        Array.isArray(res.data) ? res.data.map((question) => normalizeQuestionData(question)) : []
      );
      setSelectedTopic(topic);
      setSelectedSubtopic(subtopic || null);
      setView('questions');
    } catch (err) {
      console.log('Questions fetch error:', err);
      Alert.alert('Error', 'Failed to load questions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchSubtopicsOrQuestions = async (topic, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/content/subtopics/${topic._id}`);
      const nextSubtopics = Array.isArray(res.data) ? res.data : [];

      setSelectedTopic(topic);
      setSelectedSubtopic(null);
      setSubtopics(nextSubtopics);
      setQuestions([]);

      if (nextSubtopics.length > 0) {
        setView('subtopics');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      await fetchQuestions({ topic, subtopic: null, isRefresh: true });
    } catch (err) {
      console.log('Subtopics fetch error:', err);
      Alert.alert('Error', 'Failed to load subtopics');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (formVisible) {
      return;
    }

    if (view === 'units') {
      fetchUnits(true);
      return;
    }

    if (view === 'topics' && selectedUnit) {
      fetchTopics(selectedUnit, true);
      return;
    }

    if (view === 'subtopics' && selectedTopic) {
      fetchSubtopicsOrQuestions(selectedTopic, true);
      return;
    }

    if (view === 'questions' && selectedTopic) {
      fetchQuestions({
        topic: selectedTopic,
        subtopic: selectedSubtopic,
        isRefresh: true,
      });
    }
  };

  const handleBack = () => {
    if (formVisible) {
      closeForm();
      return;
    }

    if (view === 'questions') {
      setQuestions([]);

      if (selectedSubtopic) {
        setSelectedSubtopic(null);
        setView('subtopics');
        return;
      }

      setSelectedTopic(null);
      setView('topics');
      return;
    }

    if (view === 'subtopics') {
      setSelectedTopic(null);
      setSelectedSubtopic(null);
      setSubtopics([]);
      setQuestions([]);
      setView('topics');
      return;
    }

    if (view === 'topics') {
      setSelectedUnit(null);
      setSelectedTopic(null);
      setSelectedSubtopic(null);
      setTopics([]);
      setSubtopics([]);
      setQuestions([]);
      setView('units');
    }
  };

  const openAddForm = () => {
    setEditingQuestion(null);
    setForm(EMPTY_FORM);
    setFormVisible(true);
  };

  const openEditForm = (question) => {
    const normalizedQuestion = normalizeQuestionData(question);

    setEditingQuestion(normalizedQuestion);
    setForm({
      questionText: getQuestionTitle(normalizedQuestion),
      options: normalizeOptions(normalizedQuestion),
      correctOptionIndex: getCorrectOptionIndex(normalizedQuestion),
      explanation: normalizedQuestion?.explanation || '',
      questionImage: normalizedQuestion?.questionImage || '',
      optionImages: normalizeOptionImages(normalizedQuestion),
      explanationImage: normalizedQuestion?.explanationImage || '',
    });
    setFormVisible(true);
  };

  const updateOption = (index, value) => {
    setForm((prev) => {
      const nextOptions = [...prev.options];
      nextOptions[index] = value;
      return { ...prev, options: nextOptions };
    });
  };

  const updateOptionImage = (index, value) => {
    setForm((prev) => {
      const next = [...prev.optionImages];
      next[index] = value;
      return { ...prev, optionImages: next };
    });
  };

  const pickQuestionPhoto = async (mode) => {
    setImageBusy('question');
    try {
      const uri = mode === 'camera' ? await takePhotoWithCamera() : await pickImageFromLibrary();
      if (uri) {
        setForm((prev) => ({ ...prev, questionImage: uri }));
      }
    } finally {
      setImageBusy(null);
    }
  };

  const pickExplanationPhoto = async (mode) => {
    setImageBusy('explanation');
    try {
      const uri = mode === 'camera' ? await takePhotoWithCamera() : await pickImageFromLibrary();
      if (uri) {
        setForm((prev) => ({ ...prev, explanationImage: uri }));
      }
    } finally {
      setImageBusy(null);
    }
  };

  const pickOptionPhoto = async (index, mode) => {
    const key = `opt-${index}`;
    setImageBusy(key);
    try {
      const uri = mode === 'camera' ? await takePhotoWithCamera() : await pickImageFromLibrary();
      if (uri) {
        updateOptionImage(index, uri);
      }
    } finally {
      setImageBusy(null);
    }
  };

  const handleDeleteQuestion = (questionId) => {
    Alert.alert('Delete Question', 'Do you want to delete this question?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE_URL}/api/admin/questions/${questionId}`);
            Alert.alert('Deleted', 'Question deleted successfully');
            fetchQuestions({
              topic: selectedTopic,
              subtopic: selectedSubtopic,
              isRefresh: true,
            });
          } catch (err) {
            console.log('Delete question error:', err);
            Alert.alert('Error', 'Failed to delete question');
          }
        },
      },
    ]);
  };

  const handleSaveQuestion = async () => {
    const trimmedQuestion = form.questionText.trim();
    const cleanedOptions = form.options.map((option) => option.trim());
    const validOptions = cleanedOptions.reduce((result, optionText, index) => {
      if (!optionText) {
        return result;
      }

      result.push({
        text: optionText,
        isCorrect: index === form.correctOptionIndex,
      });

      return result;
    }, []);

    if (!trimmedQuestion) {
      Alert.alert('Missing Question', 'Please enter the question text');
      return;
    }

    if (validOptions.length < 2) {
      Alert.alert('Missing Options', 'Please enter at least two options');
      return;
    }

    if (!cleanedOptions[form.correctOptionIndex]) {
      Alert.alert('Correct Answer', 'Select a correct option with text');
      return;
    }

    if (!selectedTopic?._id) {
      Alert.alert('Missing Topic', 'Choose a topic before saving a question');
      return;
    }

    setSaving(true);

    try {
      const optionStrings = cleanedOptions;
      const optionImagePayload = form.optionImages.map((uri) => {
        const trimmed = typeof uri === 'string' ? uri.trim() : '';
        return trimmed || null;
      });

      const qImg = form.questionImage.trim();
      const exImg = form.explanationImage.trim();

      const payload = {
        question: trimmedQuestion,
        questionText: trimmedQuestion,
        options: optionStrings,
        correctAnswer: form.correctOptionIndex,
        correct_answer: String.fromCharCode(97 + form.correctOptionIndex), // 'a', 'b', 'c', 'd'
        topicId: selectedTopic._id,
        subtopicId: selectedSubtopic?._id || null,
        explanation: form.explanation.trim(),
        questionImage: qImg || undefined,
        optionImages: optionImagePayload,
        explanationImage: exImg || undefined,
        status: 'accepted',
      };

      if (editingQuestion?._id) {
        await axios.put(`${API_BASE_URL}/api/admin/questions/${editingQuestion._id}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/questions`, payload);
      }

      Alert.alert('Success', editingQuestion ? 'Question updated' : 'Question added');
      closeForm();
      fetchQuestions({
        topic: selectedTopic,
        subtopic: selectedSubtopic,
        isRefresh: true,
      });
    } catch (err) {
      console.log('Save question error:', err);
      Alert.alert('Error', 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const renderIntroCard = (title, description, helper) => (
    <View
      style={{
        backgroundColor: '#000000',
        borderRadius: 18,
        padding: 18,
      }}
    >
      <Text style={{ color: '#FFFFFF', fontFamily: 'ManropeMedium', fontSize: 12 }}>
        {helper}
      </Text>
      <Text
        style={{
          marginTop: 8,
          color: '#FFFFFF',
          fontFamily: 'ManropeExtraBold',
          fontSize: 22,
        }}
      >
        {title}
      </Text>
      <Text style={{ marginTop: 8, color: '#FFFFFF', fontFamily: 'ManropeRegular' }}>
        {description}
      </Text>
    </View>
  );

  const renderUnits = () => (
    <>
      

      <View style={{ marginTop: 10 }}>
        <Text style={{ color: '#000000', fontFamily: 'ManropeBold', fontSize: 18 }}>
          Units
        </Text>
        {units.length === 0 ? (
          <Text style={{ marginTop: 10, color: '#6B7280', fontFamily: 'ManropeRegular' }}>
            No units found yet.
          </Text>
        ) : (
          units.map((unit) => (
            <ScreenCard
              key={unit._id}
              title={unit.name}
              subtitle="Open topics for this unit"
              count={unit.order}
              onPress={() => fetchTopics(unit)}
            />
          ))
        )}
      </View>
    </>
  );

  const renderTopics = () => (
    <>
      <View style={{ marginTop: 15 }}>
        <Text style={{ color: '#000000', fontFamily: 'ManropeBold', fontSize: 18 }}>
          Topics
        </Text>
        {topics.length === 0 ? (
          <Text style={{ marginTop: 10, color: '#6B7280', fontFamily: 'ManropeRegular' }}>
            No topics found for this unit.
          </Text>
        ) : (
          topics.map((topic) => (
            <ScreenCard
              key={topic._id}
              title={topic.name}
              subtitle="Open subtopics or manage topic questions"
              count={topic.order}
              onPress={() => fetchSubtopicsOrQuestions(topic)}
            />
          ))
        )}
      </View>
    </>
  );

  const renderSubtopics = () => (
    <>

      <View style={{ marginTop: 15 }}>
        <Text style={{ color: '#000000', fontFamily: 'ManropeBold', fontSize: 18 }}>
          Subtopics
        </Text>
        {subtopics.length === 0 ? (
          <Text style={{ marginTop: 10, color: '#6B7280', fontFamily: 'ManropeRegular' }}>
            No subtopics found for this topic.
          </Text>
        ) : (
          subtopics.map((subtopic) => (
            <ScreenCard
              key={subtopic._id}
              title={subtopic.name}
              subtitle="Open question list"
              count={subtopic.order}
              onPress={() =>
                fetchQuestions({
                  topic: selectedTopic,
                  subtopic,
                })
              }
            />
          ))
        )}
      </View>
    </>
  );

  const renderQuestionCard = (question, index) => {
    const normalizedQuestion = normalizeQuestionData(question);
    const options = normalizedQuestion.options;
    const correctIndex = getCorrectOptionIndex(normalizedQuestion);

    return (
      <View
        key={normalizedQuestion._id}
        style={{
          marginTop: 14,
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        <Text style={{ color: '#6B7280', fontFamily: 'ManropeMedium', fontSize: 12 }}>
          Question {index + 1}
        </Text>
        <Text
          style={{
            marginTop: 8,
            color: '#000000',
            fontFamily: 'ManropeBold',
            fontSize: 16,
          }}
        >
          {getQuestionTitle(normalizedQuestion)}
        </Text>

        <QuestionImage uri={normalizedQuestion.questionImage} height={200} />

        {options.map((option, optionIndex) => {
          const optionText = getOptionText(option);
          const isCorrect = optionIndex === correctIndex;
          const optImg = normalizedQuestion.optionImages?.[optionIndex] || null;

          return (
            <View
              key={`${normalizedQuestion._id}-${optionIndex}`}
              style={{
                marginTop: 10,
                borderRadius: 12,
                padding: 12,
                backgroundColor: isCorrect ? '#EFF6FF' : '#FFFFFF',
                borderWidth: 1,
                borderColor: isCorrect ? '#2563EB' : '#E5E7EB',
              }}
            >
              <Text
                style={{
                  color: isCorrect ? '#2563EB' : '#6B7280',
                  fontFamily: isCorrect ? 'ManropeBold' : 'ManropeRegular',
                }}
              >
                {String.fromCharCode(65 + optionIndex)}. {optionText}
              </Text>
              <QuestionImage uri={optImg} height={150} />
            </View>
          );
        })}

        {question?.explanation ? (
          <Text style={{ marginTop: 12, color: '#6B7280', fontFamily: 'ManropeRegular' }}>
            Explanation: {question.explanation}
          </Text>
        ) : null}

        <QuestionImage uri={question.explanationImage} height={180} />

        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <ActionButton label="Edit" tone="secondary" onPress={() => openEditForm(question)} />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <ActionButton
              label="Delete"
              tone="danger"
              onPress={() => handleDeleteQuestion(question._id)}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderQuestions = () => (
    <>
      <View
        style={{
          marginTop: 16,
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        <View>
          <ActionButton label="Add Question" onPress={openAddForm} />
        </View>
      </View>

      <View style={{ marginTop: 22 }}>
        <Text style={{ color: '#000000', fontFamily: 'ManropeBold', fontSize: 18 }}>
          ({questions.length}) Questions
        </Text>
        {questions.length === 0 ? (
          <View
            style={{
              marginTop: 12,
              backgroundColor: '#FFFFFF',
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Text style={{ color: '#000000', fontFamily: 'ManropeBold', fontSize: 16 }}>
              No questions yet
            </Text>
            <Text style={{ marginTop: 6, color: '#6B7280', fontFamily: 'ManropeRegular' }}>
              Add the first question for this topic or subtopic.
            </Text>
          </View>
        ) : (
          questions.map((question, index) => renderQuestionCard(question, index))
        )}
      </View>
    </>
  );

  const renderForm = () => (
    <>
      {renderIntroCard(
        editingQuestion ? 'Update Question' : 'Create Question',
        `Saving in ${getScopeLabel() || 'selected scope'}.`,
        editingQuestion ? 'Edit mode' : 'New question'
      )}

      <View
        style={{
          marginTop: 16,
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        <Text style={{ color: '#000000', fontFamily: 'ManropeBold', fontSize: 16 }}>
          Question Text
        </Text>
        <TextInput
          value={form.questionText}
          onChangeText={(value) => setForm((prev) => ({ ...prev, questionText: value }))}
          placeholder="Enter the question"
          placeholderTextColor="#9CA3AF"
          multiline
          style={{
            marginTop: 10,
            minHeight: 110,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 14,
            padding: 14,
            textAlignVertical: 'top',
            color: '#000000',
            fontFamily: 'ManropeRegular',
          }}
        />

        <Text
          style={{
            marginTop: 18,
            color: '#000000',
            fontFamily: 'ManropeBold',
            fontSize: 16,
          }}
        >
          Question image (optional)
        </Text>
        <Text style={{ marginTop: 8, color: '#6B7280', fontFamily: 'ManropeRegular', fontSize: 12 }}>
          Choose a photo from your gallery or camera. Images are stored with the question.
        </Text>
        <ImageSlotRow
          value={form.questionImage}
          onChangeText={(value) => setForm((prev) => ({ ...prev, questionImage: value }))}
          onGallery={() => pickQuestionPhoto('library')}
          onCamera={() => pickQuestionPhoto('camera')}
          onClear={() => setForm((prev) => ({ ...prev, questionImage: '' }))}
          busy={imageBusy === 'question'}
        />

        <Text
          style={{
            marginTop: 18,
            color: '#000000',
            fontFamily: 'ManropeBold',
            fontSize: 16,
          }}
        >
          Options
        </Text>

        {form.options.map((option, index) => (
          <View key={`option-input-${index}`} style={{ marginTop: 12 }}>
            <Text style={{ color: '#000000', fontFamily: 'ManropeSemiBold', fontSize: 13 }}>
              Option {String.fromCharCode(65 + index)}
            </Text>
            <TextInput
              value={option}
              onChangeText={(value) => updateOption(index, value)}
              placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
              placeholderTextColor="#9CA3AF"
              style={{
                marginTop: 8,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 14,
                padding: 14,
                color: '#000000',
                fontFamily: 'ManropeRegular',
              }}
            />
            <Text
              style={{
                marginTop: 10,
                color: '#6B7280',
                fontFamily: 'ManropeSemiBold',
                fontSize: 12,
              }}
            >
              Option image (optional)
            </Text>
            <ImageSlotRow
              value={form.optionImages[index] || ''}
              onChangeText={(value) => updateOptionImage(index, value)}
              onGallery={() => pickOptionPhoto(index, 'library')}
              onCamera={() => pickOptionPhoto(index, 'camera')}
              onClear={() => updateOptionImage(index, '')}
              busy={imageBusy === `opt-${index}`}
              previewHeight={160}
            />
          </View>
        ))}

        <Text
          style={{
            marginTop: 18,
            color: '#000000',
            fontFamily: 'ManropeBold',
            fontSize: 16,
          }}
        >
          Correct Option
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {form.options.map((option, index) => (
            <PillButton
              key={`correct-${index}`}
              label={`Option ${String.fromCharCode(65 + index)}`}
              selected={form.correctOptionIndex === index}
              onPress={() =>
                setForm((prev) => ({
                  ...prev,
                  correctOptionIndex: index,
                }))
              }
            />
          ))}
        </View>

        <Text
          style={{
            marginTop: 18,
            color: '#000000',
            fontFamily: 'ManropeBold',
            fontSize: 16,
          }}
        >
          Explanation
        </Text>
        <TextInput
          value={form.explanation}
          onChangeText={(value) => setForm((prev) => ({ ...prev, explanation: value }))}
          placeholder="Add an explanation for the answer"
          placeholderTextColor="#9CA3AF"
          multiline
          style={{
            marginTop: 10,
            minHeight: 90,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 14,
            padding: 14,
            textAlignVertical: 'top',
            color: '#000000',
            fontFamily: 'ManropeRegular',
          }}
        />

        <Text
          style={{
            marginTop: 18,
            color: '#000000',
            fontFamily: 'ManropeBold',
            fontSize: 16,
          }}
        >
          Explanation image (optional)
        </Text>
        <ImageSlotRow
          value={form.explanationImage}
          onChangeText={(value) => setForm((prev) => ({ ...prev, explanationImage: value }))}
          onGallery={() => pickExplanationPhoto('library')}
          onCamera={() => pickExplanationPhoto('camera')}
          onClear={() => setForm((prev) => ({ ...prev, explanationImage: '' }))}
          busy={imageBusy === 'explanation'}
          previewHeight={180}
        />

        <View style={{ flexDirection: 'row', marginTop: 22 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <ActionButton label="Cancel" tone="secondary" onPress={closeForm} disabled={saving} />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <ActionButton
              label={saving ? 'Saving...' : editingQuestion ? 'Update' : 'Create'}
              onPress={handleSaveQuestion}
              disabled={saving}
            />
          </View>
        </View>
      </View>
    </>
  );

  const renderContent = () => {
    if (formVisible) {
      return renderForm();
    }

    if (view === 'topics') {
      return renderTopics();
    }

    if (view === 'subtopics') {
      return renderSubtopics();
    }

    if (view === 'questions') {
      return renderQuestions();
    }

    return renderUnits();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header
        title={getHeaderTitle()}
        showBack={formVisible || view !== 'units'}
        onBackPress={handleBack}
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            formVisible ? null : (
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            )
          }
        >
          {renderContent()}
        </ScrollView>
      )}
    </View>
  );
}
