import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bell, Shield, Mic, Download, CircleHelp as HelpCircle, Star, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceProcessing, setVoiceProcessing] = useState(true);
  const [autoExtract, setAutoExtract] = useState(true);
  const [dataSync, setDataSync] = useState(false);

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', action: 'navigate' },
        { icon: Shield, label: 'Privacy & Security', action: 'navigate' },
        { icon: Download, label: 'Export Data', action: 'navigate' },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { 
          icon: Bell, 
          label: 'Push Notifications', 
          action: 'toggle',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled
        },
      ]
    },
    {
      title: 'AI Processing',
      items: [
        { 
          icon: Mic, 
          label: 'Voice Processing', 
          action: 'toggle',
          value: voiceProcessing,
          onToggle: setVoiceProcessing,
          subtitle: 'Enable real-time voice transcription'
        },
        { 
          icon: Star, 
          label: 'Auto-Extract', 
          action: 'toggle',
          value: autoExtract,
          onToggle: setAutoExtract,
          subtitle: 'Automatically extract tasks and appointments'
        },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', action: 'navigate' },
        { icon: Star, label: 'Rate EchoNote', action: 'navigate' },
      ]
    }
  ];

  const handleItemPress = (item: any) => {
    if (item.action === 'navigate') {
      // Handle navigation
      console.log('Navigate to:', item.label);
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
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your EchoNote experience</Text>
      </LinearGradient>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <User size={32} color="#8B5CF6" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
            <Text style={styles.profileStats}>28 conversations processed this week</Text>
          </View>
        </View>
      </View>

      {/* Settings Groups */}
      {settingsGroups.map((group, groupIndex) => (
        <View key={groupIndex} style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              style={styles.settingsItem}
              onPress={() => handleItemPress(item)}
              disabled={item.action === 'toggle'}>
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <item.icon size={20} color="#64748B" />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  {item.subtitle && (
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              <View style={styles.itemRight}>
                {item.action === 'toggle' ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#E2E8F0', true: '#8B5CF6' }}
                    thumbColor="#FFFFFF"
                  />
                ) : (
                  <ChevronRight size={20} color="#CBD5E1" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoTitle}>EchoNote</Text>
        <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
        <Text style={styles.appInfoCopyright}>© 2025 EchoNote. All rights reserved.</Text>
      </View>

      {/* Footer Space */}
      <View style={styles.footer} />
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
  profileSection: {
    padding: 24,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 8,
  },
  profileStats: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  settingsGroup: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  groupTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  itemRight: {
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  appInfoTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  appInfoVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 4,
  },
  appInfoCopyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
  footer: {
    height: 32,
  },
});