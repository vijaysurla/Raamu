import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck as CheckCircle, Calendar, MapPin, Clock, TrendingUp, Target, Award } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const insights = {
    totalExtracted: 28,
    thisWeek: {
      tasks: 12,
      appointments: 8,
      locations: 6,
      deadlines: 4,
    },
    completionRate: 85,
    mostActiveDay: 'Tuesday',
    topLocations: ['Safeway', 'Community Pool', 'Downtown Office'],
    upcomingDeadlines: [
      { task: 'History essay', daysLeft: 0, urgent: true },
      { task: 'Finance numbers', daysLeft: 3, urgent: false },
      { task: 'Annual review', daysLeft: 5, urgent: false },
    ],
    productivity: {
      tasksCompleted: 17,
      appointmentsKept: 12,
      onTimeRate: 92,
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>Your Insights</Text>
        <Text style={styles.headerSubtitle}>Track your productivity and patterns</Text>
      </LinearGradient>

      {/* Overview Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week's Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <CheckCircle size={24} color="#10B981" />
            <Text style={styles.statNumber}>{insights.thisWeek.tasks}</Text>
            <Text style={styles.statLabel}>Tasks Identified</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={24} color="#3B82F6" />
            <Text style={styles.statNumber}>{insights.thisWeek.appointments}</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>
          <View style={styles.statCard}>
            <MapPin size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>{insights.thisWeek.locations}</Text>
            <Text style={styles.statLabel}>Locations</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#EF4444" />
            <Text style={styles.statNumber}>{insights.thisWeek.deadlines}</Text>
            <Text style={styles.statLabel}>Deadlines</Text>
          </View>
        </View>
      </View>

      {/* Productivity Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Productivity Metrics</Text>
        
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Target size={20} color="#10B981" />
            <Text style={styles.metricTitle}>Task Completion Rate</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${insights.completionRate}%` }]} />
          </View>
          <Text style={styles.metricValue}>{insights.completionRate}%</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Award size={20} color="#3B82F6" />
            <Text style={styles.metricTitle}>On-Time Rate</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFillBlue, { width: `${insights.productivity.onTimeRate}%` }]} />
          </View>
          <Text style={styles.metricValue}>{insights.productivity.onTimeRate}%</Text>
        </View>

        <View style={styles.achievementGrid}>
          <View style={styles.achievementCard}>
            <TrendingUp size={20} color="#F59E0B" />
            <Text style={styles.achievementNumber}>{insights.productivity.tasksCompleted}</Text>
            <Text style={styles.achievementLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.achievementCard}>
            <Calendar size={20} color="#8B5CF6" />
            <Text style={styles.achievementNumber}>{insights.productivity.appointmentsKept}</Text>
            <Text style={styles.achievementLabel}>Appointments Kept</Text>
          </View>
        </View>
      </View>

      {/* Urgent Deadlines */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
        {insights.upcomingDeadlines.map((deadline, index) => (
          <View key={index} style={[
            styles.deadlineCard,
            deadline.urgent && styles.urgentDeadline
          ]}>
            <Clock size={16} color={deadline.urgent ? '#EF4444' : '#64748B'} />
            <View style={styles.deadlineContent}>
              <Text style={styles.deadlineTask}>{deadline.task}</Text>
              <Text style={[
                styles.deadlineDays,
                deadline.urgent && styles.urgentText
              ]}>
                {deadline.daysLeft === 0 ? 'Due today!' : `${deadline.daysLeft} days left`}
              </Text>
            </View>
            {deadline.urgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentBadgeText}>URGENT</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Top Locations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most Mentioned Locations</Text>
        {insights.topLocations.map((location, index) => (
          <View key={index} style={styles.locationCard}>
            <MapPin size={16} color="#8B5CF6" />
            <Text style={styles.locationName}>{location}</Text>
            <View style={styles.locationRank}>
              <Text style={styles.locationRankText}>#{index + 1}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Insights Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Summary</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            You've been most productive on <Text style={styles.summaryHighlight}>{insights.mostActiveDay}</Text>, 
            with a total of <Text style={styles.summaryHighlight}>{insights.totalExtracted} items</Text> extracted 
            from your conversations this week. Keep up the great work!
          </Text>
        </View>
      </View>
    </ScrollView>
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
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
  },
  metricCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressFillBlue: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  metricValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    textAlign: 'right',
  },
  achievementGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  achievementCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  achievementNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  achievementLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
  },
  deadlineCard: {
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
  urgentDeadline: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  deadlineContent: {
    flex: 1,
  },
  deadlineTask: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
    marginBottom: 4,
  },
  deadlineDays: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  urgentText: {
    color: '#DC2626',
    fontFamily: 'Inter-SemiBold',
  },
  urgentBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  locationCard: {
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
  locationName: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  locationRank: {
    backgroundColor: '#8B5CF6',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRankText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    lineHeight: 24,
  },
  summaryHighlight: {
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
  },
});