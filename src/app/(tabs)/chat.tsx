import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { askQuestion } from '../../api/chat';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const sendQuestion = async () => {
    const q = input.trim();
    if (!q) return;

    const userMsg: Message = { id: Date.now().toString() + '-u', role: 'user', text: q };
    const botMsgId = Date.now().toString() + '-b';
    const botMsg: Message = { id: botMsgId, role: 'bot', text: 'Searching...' };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');

    try {
      const result = await askQuestion(q);
      setMessages((prev) =>
        prev.map((m) => (m.id === botMsgId ? { ...m, text: result } : m))
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId ? { ...m, text: 'Something went wrong' } : m
        )
      );
    }

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <Text style={styles.title}>Ask your documents</Text>
      <Text style={styles.subtitle}>Type a question — AI will search your PDFs</Text>

      <View style={styles.messagesBox}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Ask a question to get started</Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.msgBubble,
                  item.role === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={[
                    styles.msgText,
                    item.role === 'user' ? styles.userText : styles.botText,
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask something from uploaded PDF..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendQuestion}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.askButton} onPress={sendQuestion}>
          <Text style={styles.askButtonText}>Ask</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  messagesBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 14,
  },
  msgBubble: {
    maxWidth: '85%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a1a1a',
    borderBottomRightRadius: 2,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 2,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#1a1a1a',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  askButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  askButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});