import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, CircleCheck as CheckCircle, Calendar, MapPin, Clock, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

// Define a type for the data structure after processing
type Insights = {
  tasks: { id: number; text: string; priority: 'low' | 'medium' | 'high' }[];
  appointments: { id: number; title: string; time: string; date: string }[];
  locations: { id: number; name: string; type: string }[];
  deadlines: { id: number; task: string; date: string; urgent: boolean }[];
};

// Define a type for the raw data from the API
type ApiResponse = {
  tasks: { text: string; priority: 'low' | 'medium' | 'high' }[];
  appointments: { title: string; time: string; date: string }[];
  locations: { name: string }[];
  deadlines: { item: string; date: string; urgency: 'low' | 'medium' | 'high' }[];
};

export default function HomeScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);

  useEffect(() => {
    // Request permission when the component mounts
    requestPermission();
  }, []);

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant microphone permissions in your settings.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
         Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
      setError('Failed to start recording.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); 
      if (!uri) {
        setError('Could not get recording URI.');
        return;
      }
      console.log('Recording stopped and stored at', uri);
      setRecording(null);
      
      setIsLoading(true);
      setError(null);
      
      try {
        const formData = new FormData();
        // The `as any` is needed because the type definition for FormData.append is strict
        formData.append('audio', {
          uri: uri,
          name: `recording-${Date.now()}.m4a`,
          type: 'audio/m4a',
        } as any);

        const response = await fetch('https://raamu.in/api/transcribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Transcription failed');
        }

        const { transcription } = await response.json();

        if (transcription) {
          // Now that we have the text, fetch the insights
          await fetchInsights(transcription);
        } else {
          throw new Error('Transcription result was empty.');
        }

      } catch (err) {
        console.error('Failed to transcribe or fetch insights', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setError('Failed to stop recording.');
      setIsLoading(false);
    }
  };

  const fetchInsights = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the production backend URL
      const response = await fetch('https://raamu.in/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationText: text }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      
      // Add mock IDs for rendering, as the API doesn't provide them
      const dataWithIds: Insights = {
        tasks: data.tasks.map((t, i) => ({ ...t, id: i + 1 })),
        appointments: data.appointments.map((a, i) => ({ ...a, id: i + 1 })),
        locations: data.locations.map((l, i) => ({ ...l, id: i + 1, type: 'service' })), // Add mock type
        deadlines: data.deadlines.map((d, i) => ({ ...d, task: d.item, id: i + 1, urgent: d.urgency === 'high' })), // Convert urgency and map item->task
      };

      setInsights(dataWithIds);

    } catch (e) {
      console.error(e);
      setError('Failed to fetch insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTalkButtonPress = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const displayData = insights; // Use insights if available, otherwise fallback to demo

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        style={styles.heroSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.heroContent}>
          <Text style={styles.headline}>Never forget anything again</Text>
          <Text style={styles.subheadline}>
            Just talk naturally - Raamu extracts tasks, appointments, and important details from your conversations
          </Text>
          
          <TouchableOpacity 
            style={styles.talkButton} 
            onPress={handleTalkButtonPress}
            disabled={isLoading}
          >
            <LinearGradient
              colors={recording || isLoading ? ['#4B5563', '#6B7280'] : ['#F59E0B', '#EF4444']}
              style={styles.talkButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Mic size={24} color="#FFFFFF" />
              )}
              <Text style={styles.talkButtonText}>
                {isLoading ? 'Loading...' : recording ? 'Stop' : 'Talk to me'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <AlertTriangle size={20} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Demo Section */}
      <View style={styles.demoSection}>
        <View style={styles.demoHeader}>
          <Sparkles size={24} color="#8B5CF6" />
          <Text style={styles.demoTitle}>Your Insights</Text>
        </View>

        {!displayData && !isLoading && (
          <Text style={styles.demoSubtitle}>
            Press "Talk to me" and start a conversation. Your extracted insights will appear here.
          </Text>
        )}
        
        {displayData && (
          <React.Fragment>
            {/* Stats Cards */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <CheckCircle size={20} color="#10B981" />
                <Text style={styles.statNumber}>{displayData.tasks.length}</Text>
                <Text style={styles.statLabel}>Tasks</Text>
              </View>
              <View style={styles.statCard}>
                <Calendar size={20} color="#3B82F6" />
                <Text style={styles.statNumber}>{displayData.appointments.length}</Text>
                <Text style={styles.statLabel}>Appointments</Text>
              </View>
              <View style={styles.statCard}>
                <MapPin size={20} color="#8B5CF6" />
                <Text style={styles.statNumber}>{displayData.locations.length}</Text>
                <Text style={styles.statLabel}>Locations</Text>
              </View>
              <View style={styles.statCard}>
                <Clock size={20} color="#EF4444" />
                <Text style={styles.statNumber}>{displayData.deadlines.length}</Text>
                <Text style={styles.statLabel}>Deadlines</Text>
              </View>
            </View>

            {/* Extracted Data Preview */}
            <View style={styles.extractedData}>
              <Text style={styles.sectionTitle}>📝 Extracted Tasks</Text>
              {displayData.tasks.slice(0, 3).map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={styles.taskText}>{task.text}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: task.priority === 'high' ? '#FEE2E2' : task.priority === 'medium' ? '#FEF3C7' : '#F0F9FF' }]}>
                    <Text style={[styles.priorityText, { color: task.priority === 'high' ? '#DC2626' : task.priority === 'medium' ? '#D97706' : '#2563EB' }]}>
                      {task.priority}
                    </Text>
                  </View>
                </View>
              ))}

              <Text style={styles.sectionTitle}>📅 Upcoming Appointments</Text>
              {displayData.appointments.slice(0, 3).map((appointment) => (
                <View key={appointment.id} style={styles.appointmentItem}>
                  <Calendar size={16} color="#3B82F6" />
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                    <Text style={styles.appointmentTime}>{appointment.time} • {appointment.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </React.Fragment>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroContent: {
    alignItems: 'center',
  },
  headline: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subheadline: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  talkButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  talkButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 12,
  },
  talkButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    padding: 16,
    marginHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  demoSection: {
    padding: 24,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  demoTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  demoSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 24,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 60) / 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 4,
  },
  extractedData: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#334155',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
});