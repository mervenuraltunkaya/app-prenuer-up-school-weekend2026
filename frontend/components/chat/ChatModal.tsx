import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Send, Sparkles, X } from 'lucide-react-native'

import { sendTravelChatMessage } from '@/lib/ai-service'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { fontFamilies, typography } from '@/theme/typography'

import type { ChatMessage, GroqChatTurn, TravelChatContext } from './types'

type ChatModalProps = {
  visible: boolean
  onClose: () => void
  context: TravelChatContext
}

function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Merhaba! Nomad seyahat asistanıyım. Mekan önerileri, rota planı veya şehir ipuçları için sorabilirsin.',
  createdAt: Date.now(),
}

export function ChatModal({ visible, onClose, context }: ChatModalProps) {
  const insets = useSafeAreaInsets()
  const listRef = useRef<FlatList<ChatMessage>>(null)
  const inputRef = useRef<TextInput>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!visible) return

    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 320)

    return () => clearTimeout(timer)
  }, [visible])

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true })
    })
  }, [])

  useEffect(() => {
    if (visible) scrollToEnd()
  }, [messages, loading, visible, scrollToEnd])

  const handleClose = useCallback(() => {
    Keyboard.dismiss()
    onClose()
  }, [onClose])

  const handleSend = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: trimmed,
      createdAt: Date.now(),
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setError(null)
    setLoading(true)

    const history: GroqChatTurn[] = nextMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role as GroqChatTurn['role'],
        content: m.content,
      }))

    try {
      const reply = await sendTravelChatMessage(history, context)
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: 'assistant',
          content: reply,
          createdAt: Date.now(),
        },
      ])
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [context, input, loading, messages])

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isUser = item.role === 'user'
      return (
        <View
          style={[
            styles.messageRow,
            isUser ? styles.messageRowUser : styles.messageRowAssistant,
          ]}>
          <View
            style={[
              styles.bubble,
              isUser ? styles.bubbleUser : styles.bubbleAssistant,
            ]}>
            <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
              {item.content}
            </Text>
          </View>
        </View>
      )
    },
    [],
  )

  const cityLabel = context.cityName
    ? `${context.cityName}${context.cityCountry ? `, ${context.cityCountry}` : ''}`
    : 'Keşif'

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <KeyboardAvoidingView
          style={styles.sheet}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
          <View
            style={[
              styles.panel,
              {
                paddingBottom: Math.max(insets.bottom, spacing.sm),
              },
            ]}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <Sparkles size={18} color={colors.white} />
              </View>
              <View style={styles.headerTextWrap}>
                <Text style={styles.headerTitle}>Seyahat Asistanı</Text>
                <Text style={styles.headerSubtitle}>{cityLabel}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sohbeti kapat"
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.closeBtn,
                  pressed && styles.closeBtnPressed,
                ]}>
                <X size={18} color={colors.inkMuted} />
              </Pressable>
            </View>

            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                loading ? (
                  <View style={styles.typingRow}>
                    <View style={styles.typingBubble}>
                      <ActivityIndicator size="small" color={colors.crimson} />
                      <Text style={styles.typingText}>Yanıt hazırlanıyor…</Text>
                    </View>
                  </View>
                ) : null
              }
            />

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Mekan, rota veya ipucu sor…"
                placeholderTextColor={colors.brown}
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={800}
                editable={!loading}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Mesaj gönder"
                onPress={handleSend}
                disabled={loading || !input.trim()}
                style={({ pressed }) => [
                  styles.sendBtn,
                  (loading || !input.trim()) && styles.sendBtnDisabled,
                  pressed && !loading && input.trim() && styles.sendBtnPressed,
                ]}>
                {loading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Send size={18} color={colors.white} />
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 20, 16, 0.45)',
  },
  sheet: {
    flex: 1,
    justifyContent: 'flex-end',
    maxHeight: '92%',
  },
  panel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    minHeight: 420,
    maxHeight: '100%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderMedium,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 20,
    lineHeight: 24,
    color: colors.ink,
  },
  headerSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  closeBtnPressed: {
    backgroundColor: colors.cream,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAssistant: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleUser: {
    backgroundColor: colors.crimson,
    borderBottomRightRadius: spacing.xs,
  },
  bubbleAssistant: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderBottomLeftRadius: spacing.xs,
  },
  bubbleText: {
    ...typography.body,
    color: colors.ink,
  },
  bubbleTextUser: {
    color: colors.white,
  },
  typingRow: {
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  typingText: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  errorBanner: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 0.5,
    borderColor: 'rgba(166, 3, 33, 0.2)',
  },
  errorText: {
    ...typography.caption,
    color: colors.crimsonDark,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    fontFamily: fontFamilies.dmRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnPressed: {
    backgroundColor: colors.crimsonDark,
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
})
