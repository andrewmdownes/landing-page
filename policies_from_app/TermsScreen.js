// components/TermsScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from '../styles/mainPolicyStyles';
import terms from '../policies/terms';
import PolicyRenderer from './PolicyRenderer';

export default function TermsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#5DBE62' }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms of Service</Text>
        </View>
      </SafeAreaView>
      <View style={[styles.content, { marginBottom: 15, borderRadius: 20 }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.documentTitle}>Ribit Terms of Service</Text>
          <Text style={styles.lastUpdated}>Last Updated: October 30, 2025</Text>
          <PolicyRenderer content={terms} />
        </ScrollView>
      </View>
    </View>
  );
}
