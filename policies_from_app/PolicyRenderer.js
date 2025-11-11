// components/PolicyRenderer.js
import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/mainPolicyStyles';

export default function PolicyRenderer({ content }) {
  const renderPolicyContent = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let key = 0;
    let hasSeenFirstHeader = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Skip empty lines
      if (trimmedLine === '') {
        elements.push(<View key={`space-${key++}`} style={{ height: 8 }} />);
        continue;
      }

      // Skip the first H1 header and "Last modified" line since they're displayed in the screen component
      if (trimmedLine.startsWith('# ') && !hasSeenFirstHeader) {
        hasSeenFirstHeader = true;
        continue;
      }

      if (trimmedLine.startsWith('Last modified:') || trimmedLine.startsWith('Last Updated:')) {
        continue;
      }

      if (trimmedLine.startsWith('Contact:') || trimmedLine.startsWith('Company:') || trimmedLine.startsWith('**Effective Date:**')) {
        elements.push(
          <Text key={`meta-${key++}`} style={[styles.bodyText, { fontSize: 12, color: '#777', marginBottom: 4 }]}>
            {parseBoldText(trimmedLine)}
          </Text>
        );
        continue;
      }

      // H1 headers (# ) - after the first one
      if (trimmedLine.startsWith('# ')) {
        const text = trimmedLine.substring(2);
        elements.push(
          <Text key={`h1-${key++}`} style={[styles.sectionTitle, { fontSize: 18, marginTop: 16, marginBottom: 10 }]}>
            {text}
          </Text>
        );
        continue;
      }

      // H2 headers (## )
      if (trimmedLine.startsWith('## ')) {
        const text = trimmedLine.substring(3);
        elements.push(
          <Text key={`h2-${key++}`} style={[styles.sectionTitle, { marginTop: 20, marginBottom: 8 }]}>
            {text}
          </Text>
        );
        continue;
      }

      // H3 headers (### )
      if (trimmedLine.startsWith('### ')) {
        const text = trimmedLine.substring(4);
        elements.push(
          <Text key={`h3-${key++}`} style={[styles.subsectionTitle, { marginTop: 12, marginBottom: 6 }]}>
            {text}
          </Text>
        );
        continue;
      }

      // Bullet points (- or •)
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        const text = trimmedLine.substring(2);
        elements.push(
          <View key={`bullet-${key++}`} style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Text style={[styles.bodyText, { marginRight: 8 }]}>•</Text>
            <Text style={[styles.bodyText, { flex: 1 }]}>{parseBoldText(text)}</Text>
          </View>
        );
        continue;
      }

      // Special markers (checkmark or X)
      if (trimmedLine.startsWith('✅ ') || trimmedLine.startsWith('❌ ')) {
        const emoji = trimmedLine.substring(0, 2);
        const text = trimmedLine.substring(3);
        elements.push(
          <View key={`marker-${key++}`} style={{ flexDirection: 'row', marginBottom: 8, marginTop: 8 }}>
            <Text style={{ marginRight: 8, fontSize: 16 }}>{emoji}</Text>
            <Text style={[styles.bodyText, { flex: 1, fontWeight: '600' }]}>{parseBoldText(text)}</Text>
          </View>
        );
        continue;
      }

      // Numbered list items (1. 2. 3. etc.)
      const numberedMatch = trimmedLine.match(/^(\d+\.)\s+(.+)$/);
      if (numberedMatch) {
        const number = numberedMatch[1];
        const text = numberedMatch[2];
        elements.push(
          <View key={`numbered-${key++}`} style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Text style={[styles.bodyText, { marginRight: 8, fontWeight: '600' }]}>{number}</Text>
            <Text style={[styles.bodyText, { flex: 1 }]}>{parseBoldText(text)}</Text>
          </View>
        );
        continue;
      }

      // Horizontal rule (---)
      if (trimmedLine === '---') {
        elements.push(
          <View
            key={`hr-${key++}`}
            style={{
              height: 1,
              backgroundColor: '#e0e0e0',
              marginVertical: 16,
            }}
          />
        );
        continue;
      }

      // Regular paragraph
      elements.push(
        <Text key={`text-${key++}`} style={[styles.bodyText, { marginBottom: 8 }]}>
          {parseBoldText(trimmedLine)}
        </Text>
      );
    }

    return elements;
  };

  // Helper function to parse bold text (**text**)
  const parseBoldText = (text) => {
    const parts = [];
    let currentIndex = 0;
    let key = 0;

    // Find all bold text patterns
    const boldPattern = /\*\*(.+?)\*\*/g;
    let match;

    while ((match = boldPattern.exec(text)) !== null) {
      // Add text before the bold part
      if (match.index > currentIndex) {
        parts.push(
          <Text key={`normal-${key++}`}>
            {text.substring(currentIndex, match.index)}
          </Text>
        );
      }

      // Add the bold part
      parts.push(
        <Text key={`bold-${key++}`} style={{ fontWeight: '700' }}>
          {match[1]}
        </Text>
      );

      currentIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(
        <Text key={`normal-${key++}`}>
          {text.substring(currentIndex)}
        </Text>
      );
    }

    return parts.length > 0 ? parts : text;
  };

  return <View>{renderPolicyContent(content)}</View>;
}
