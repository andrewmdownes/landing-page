// components/CostSharingPolicyScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from '../styles/mainPolicyStyles';
import costSharing from '../policies/costSharing';
import PolicyRenderer from './PolicyRenderer';

export default function CostSharingPolicyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cost-Sharing Policy</Text>
        </View>
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.documentTitle}>Ribit Cost-Sharing Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: October 30, 2025</Text>
          <PolicyRenderer content={costSharing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
