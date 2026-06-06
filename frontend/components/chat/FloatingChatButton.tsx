import { useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { MessageCircle } from 'lucide-react-native'

import { colors } from '@/theme/colors'

import { ChatModal } from './ChatModal'
import type { TravelChatContext } from './types'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type FloatingChatButtonProps = {
  context: TravelChatContext
  bottom?: number
  right?: number
}

export function FloatingChatButton({
  context,
  bottom = 20,
  right = 20,
}: FloatingChatButtonProps) {
  const [open, setOpen] = useState(false)
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel="Seyahat asistanını aç"
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 16, stiffness: 320 })
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 280 })
        }}
        onPress={() => setOpen(true)}
        style={[
          styles.fab,
          { bottom, right },
          animatedStyle,
        ]}>
        <MessageCircle size={24} color={colors.white} strokeWidth={2.2} />
      </AnimatedPressable>

      <ChatModal
        visible={open}
        onClose={() => setOpen(false)}
        context={context}
      />
    </>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    shadowColor: colors.crimsonDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
})
