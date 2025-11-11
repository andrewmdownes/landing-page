// components/PrivacyPolicyScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from '../styles/mainPolicyStyles';
import privacy from '../policies/privacy';
import PolicyRenderer from './PolicyRenderer';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#5DBE62' }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>
      </SafeAreaView>
      <View style={[styles.content, { marginBottom: 15, borderRadius: 20 }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.documentTitle}>Ribit Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: October 30, 2025</Text>
          <PolicyRenderer content={privacy} />
        </ScrollView>
      </View>
    </View>
  );
}
