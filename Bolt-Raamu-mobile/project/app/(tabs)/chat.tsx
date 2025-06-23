import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, Send, MicOff, User, Bot } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  extracted?: {
    tasks: string[];
    appointments: string[];
    locations: string[];
    deadlines: string[];
  };
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm EchoNote, your conversational memory assistant. Just talk to me naturally about your day, plans, or anything on your mind, and I'll help extract and organize the important details for you.",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        false
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
      pulseOpacity.value = withTiming(0.3, { duration: 300 });
    }
  }, [isRecording]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleVoiceRecording = () => {
    if (Platform.OS === 'web') {
      // Web simulation
      setIsRecording(!isRecording);
      if (!isRecording) {
        // Simulate recording
        setTimeout(() => {
          setIsRecording(false);
          const simulatedTranscript = "I need to pick up groceries at Safeway tomorrow and don't forget my dentist appointment at 2 PM on Friday. Also, I should call mom about the family dinner this weekend.";
          setInputText(simulatedTranscript);
        }, 3000);
      }
    } else {
      // Real implementation would use expo-speech or similar
      setIsRecording(!isRecording);
    }
  };

  const generateAIResponse = (userInput: string): Message => {
    // Simple keyword extraction simulation
    const tasks = [];
    const appointments = [];
    const locations = [];
    const deadlines = [];

    // Extract tasks
    if (userInput.includes('pick up') || userInput.includes('buy') || userInput.includes('get')) {
      tasks.push('Pick up groceries');
    }
    if (userInput.includes('call')) {
      tasks.push('Call mom about family dinner');
    }

    // Extract appointments
    if (userInput.includes('dentist') || userInput.includes('appointment')) {
      appointments.push('Dentist appointment - Friday 2 PM');
    }
    if (userInput.includes('dinner') || userInput.includes('family')) {
      appointments.push('Family dinner - This weekend');
    }

    // Extract locations
    if (userInput.includes('Safeway') || userInput.includes('grocery')) {
      locations.push('Safeway');
    }

    // Extract deadlines
    if (userInput.includes('tomorrow')) {
      deadlines.push('Grocery shopping - Tomorrow');
    }
    if (userInput.includes('Friday')) {
      deadlines.push('Dentist appointment - Friday');
    }

    let response = "I've processed your message and extracted the following information:\n\n";
    
    if (tasks.length > 0) {
      response += `📝 Tasks (${tasks.length}):\n${tasks.map(task => `• ${task}`).join('\n')}\n\n`;
    }
    
    if (appointments.length > 0) {
      response += `📅 Appointments (${appointments.length}):\n${appointments.map(apt => `• ${apt}`).join('\n')}\n\n`;
    }
    
    if (locations.length > 0) {
      response += `📍 Locations (${locations.length}):\n${locations.map(loc => `• ${loc}`).join('\n')}\n\n`;
    }
    
    if (deadlines.length > 0) {
      response += `⏰ Deadlines (${deadlines.length}):\n${deadlines.map(deadline => `• ${deadline}`).join('\n')}\n\n`;
    }

    if (tasks.length === 0 && appointments.length === 0 && locations.length === 0 && deadlines.length === 0) {
      response = "I understand what you're saying, but I didn't detect any specific tasks, appointments, locations, or deadlines in this message. Feel free to share more details about your plans or things you need to remember!";
    } else {
      response += "Is there anything else you'd like to add or clarify about these items?";
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      extracted: {
        tasks,
        appointments,
        locations,
        deadlines,
      },
    };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>EchoNote Chat</Text>
        <Text style={styles.headerSubtitle}>Your conversational memory assistant</Text>
      </LinearGradient>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
        
        {messages.map((message) => (
          <View key={message.id} style={[
            styles.messageContainer,
            message.type === 'user' ? styles.userMessage : styles.assistantMessage
          ]}>
            <View style={styles.messageHeader}>
              <View style={styles.messageIcon}>
                {message.type === 'user' ? (
                  <User size={16} color={message.type === 'user' ? '#FFFFFF' : '#8B5CF6'} />
                ) : (
                  <Bot size={16} color="#8B5CF6" />
                )}
              </View>
              <Text style={styles.messageAuthor}>
                {message.type === 'user' ? 'You' : 'EchoNote'}
              </Text>
            </View>
            <Text style={[
              styles.messageText,
              message.type === 'user' ? styles.userMessageText : styles.assistantMessageText
            ]}>
              {message.content}
            </Text>
          </View>
        ))}

        {isProcessing && (
          <View style={[styles.messageContainer, styles.assistantMessage]}>
            <View style={styles.messageHeader}>
              <View style={styles.messageIcon}>
                <Bot size={16} color="#8B5CF6" />
              </View>
              <Text style={styles.messageAuthor}>EchoNote</Text>
            </View>
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>Processing your message...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Voice Recording UI */}
      {isRecording && (
        <View style={styles.recordingOverlay}>
          <Animated.View style={[styles.recordingPulse, animatedPulseStyle]} />
          <View style={styles.recordingContent}>
            <Mic size={32} color="#FFFFFF" />
            <Text style={styles.recordingText}>Listening...</Text>
            <Text style={styles.recordingSubtext}>Tap to stop recording</Text>
          </View>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message or tap the mic to speak..."
            placeholderTextColor="#94A3B8"
            multiline
            maxLength={500}
          />
          
          <View style={styles.inputButtons}>
            <TouchableOpacity 
              style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
              onPress={handleVoiceRecording}>
              {isRecording ? (
                <MicOff size={20} color="#FFFFFF" />
              ) : (
                <Mic size={20} color="#8B5CF6" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}>
              <Send size={20} color={inputText.trim() ? "#FFFFFF" : "#94A3B8"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  messageIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageAuthor: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  userMessageText: {
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderBottomRightRadius: 4,
  },
  assistantMessageText: {
    backgroundColor: '#F8FAFC',
    color: '#1E293B',
    padding: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typingIndicator: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    fontStyle: 'italic',
  },
  recordingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 92, 246, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  recordingPulse: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
  },
  recordingContent: {
    alignItems: 'center',
    zIndex: 1001,
  },
  recordingText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  recordingSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    marginTop: 8,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 34,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    maxHeight: 100,
  },
  inputButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
});