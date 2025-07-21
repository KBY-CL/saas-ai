<!--
  [위험성평가 전문가 채팅 레이어 컴포넌트]
  - 이미지 디자인에 맞춰 챗봇 응답 메시지를 파란색 헤더바 카드 형태로 변경
-->
<template>
  <v-dialog
    v-if="!isMinimized"
    :model-value="bShow"
    @update:model-value="onDialogUpdate"
    persistent
    :max-width="dialogWidth"
    :fullscreen="isMax"
    scrollable
    transition="dialog-bottom-transition"
    :content-class="isMax ? '' : 'cs-dialog-bottom-right'"
    :style="{ height: !isMax ? (size === 'mini' ? '1370px' : size === 'mid' ? '1404px' : undefined) : undefined }"
  >
    <v-card :class="['modern-chatbot-window', sizeClass, 'pa-0']" :style="{ opacity: chatbotOpacity }">
      <!-- 헤더 -->
      <v-card-title class="modern-header d-flex justify-space-between align-center px-4" style="padding-top: 19px; padding-bottom: 19px;">
        <div class="modern-header-left d-flex align-center" style="gap: 20px;">
          <span class="modern-header-icon">
            <v-icon color="#1976d2">mdi-robot</v-icon>
          </span>
          <div class="modern-header-title-wrap d-flex flex-column align-start">
            <span class="modern-title">위험성평가 전문가</span>
            <span class="modern-status">온라인 상담 중</span>
          </div>
        </div>
        <div class="d-flex align-center gap-1">
          <v-btn icon size="small" variant="text" class="modern-header-btn" :aria-label="'최소화'" @click="minimizeChat">
            <v-icon size="18">mdi-minus</v-icon>
          </v-btn>
          <v-btn v-if="size !== 'mini'" icon size="small" variant="text" class="modern-header-btn" :aria-label="'작게'" @click="setSize('mini')">
            <v-icon size="18">mdi-arrow-collapse</v-icon>
          </v-btn>
          <v-btn v-if="size !== 'mid'" icon size="small" variant="text" class="modern-header-btn" :aria-label="'중간 크기'" @click="setSize('mid')">
            <v-icon size="18">mdi-arrow-expand-horizontal</v-icon>
          </v-btn>
          <v-btn v-if="!isMax" icon size="small" variant="text" class="modern-header-btn" :aria-label="'최대화'" @click="setSize('max')">
            <v-icon size="18">mdi-arrow-expand-all</v-icon>
          </v-btn>
          <v-btn v-if="isMax" icon size="small" variant="text" class="modern-header-btn" :aria-label="'최소화'" @click="setSize('mini')">
            <v-icon size="18">mdi-arrow-collapse-all</v-icon>
          </v-btn>
          <span class="modern-header-x" role="button" tabindex="0" aria-label="닫기" @click="onClose">
            <svg width="21" height="21" viewBox="0 0 28 28" style="vertical-align: middle;">
              <line x1="6" y1="6" x2="22" y2="22" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="22" y1="6" x2="6" y2="22" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
        </div>
      </v-card-title>
      <v-divider class="modern-divider"></v-divider>
      <!-- 채팅 메시지 영역 -->
      <v-card-text ref="messagesArea" class="modern-messages-area px-3 py-4">
        <div ref="messageList" class="modern-message-list">
          <div v-for="msg in messages" :key="msg.id" :class="['modern-message', msg.isUser ? 'user' : 'bot']">
            <!-- AI 메시지: 왼쪽 배치 -->
            <template v-if="!msg.isUser">
              <div class="modern-bot-card">
                <div class="modern-bot-icon">
                  <v-icon color="#fff">mdi-robot</v-icon>
                </div>
                <div class="modern-bot-content">
                  <div class="modern-bot-text">{{ msg.content }}</div>
                  <div class="modern-bot-divider"></div>
                  <div class="modern-bot-bottom">
                    <span class="modern-bot-time">{{ msg.sentAt }}</span>
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      class="modern-copy-btn bottom-right"
                      :aria-label="'메시지 복사'"
                      @click="copyMessage(msg.content)"
                    >
                      <v-icon size="16">mdi-content-copy</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </template>
            <!-- 사용자 메시지: 오른쪽 배치 -->
            <template v-else>
              <div class="modern-user-card">
                <div class="modern-user-content">
                  <div class="modern-user-text">{{ msg.content }}</div>
                  <div class="modern-user-divider"></div>
                  <div class="modern-user-bottom">
                    <span class="modern-user-time">{{ msg.sentAt }}</span>
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      class="modern-copy-btn bottom-right"
                      :aria-label="'메시지 복사'"
                      @click="copyMessage(msg.content)"
                    >
                      <v-icon size="16">mdi-content-copy</v-icon>
                    </v-btn>
                  </div>
                </div>
                <div class="modern-user-icon">
                  <v-icon color="#fff">mdi-account</v-icon>
                </div>
              </div>
            </template>
          </div>
        </div>
      </v-card-text>
      <div class="modern-bottom-divider"></div>
      <!-- 입력창 -->
      <v-card-actions class="modern-input-wrap px-3 py-2">
        <v-textarea
          v-model="input"
          label="위험성평가, 안전 관리 등 궁금한 것을 물어보세요..."
          hide-details
          auto-grow
          rows="1"
          rounded
          outlined
          class="modern-input flex-grow-1 mr-2"
          @keydown.enter.exact.prevent="onSend"
          @keydown.enter.shift="() => {}"  
          aria-label="메시지 입력"
        />
        <!-- 투명도 조절 슬라이더 -->
        <div class="transparency-control mr-2">
          <v-slider
            v-model="transparency"
            :min="90"
            :max="100"
            :step="1"
            hide-details
            class="transparency-slider"
            color="#1976d2"
            track-color="#e0e0e0"
            thumb-color="#1976d2"
            @update:model-value="updateTransparency"
            aria-label="투명도 조절"
          />
        </div>
        <v-btn
          :color="isListening ? 'blue' : undefined"
          @click="toggleMic"
          :aria-label="isListening ? '음성 인식 중지' : '음성 입력 시작'"
          class="modern-mic-btn mr-2"
        >
          <v-icon size="26">{{ isListening ? 'mdi-microphone' : 'mdi-microphone-outline' }}</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="plain"
          width="44"
          height="44"
          class="modern-send-btn"
          :aria-disabled="!input.trim()"
          :tabindex="input.trim() ? 0 : -1"
          aria-label="전송"
          @click="input.trim() && onSend()"
          @mouseenter="isSendBtnHovered = true"
          @mouseleave="isSendBtnHovered = false"
        >
          <v-icon :color="sendBtnIconColor">mdi-send</v-icon>
        </v-btn>
      </v-card-actions>
      <v-snackbar v-model="bShowCopySnackbar" color="success" :timeout="1500" location="top right">
        메시지가 복사되었습니다.
      </v-snackbar>
      <v-snackbar v-model="bShowMicSnackbar" color="info" :timeout="2000" location="top right">
        {{ micSnackbarText }}
      </v-snackbar>
    </v-card>
  </v-dialog>
  
  <!-- 최소화된 채팅창 -->
  <div v-if="isMinimized" class="minimized-chatbot" @click="restoreChat" :style="minimizedStyle">
    <div class="minimized-content">
      <v-icon color="#fff">mdi-robot</v-icon>
      <span class="minimized-text">위험성평가 전문가</span>
      <v-icon color="#fff" size="20">mdi-chevron-up</v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * <pre>
 * [위험성평가 전문가 채팅 레이어 컴포넌트]
 * </pre>
 * @props bShow: boolean - 레이어 표시 여부 (v-model 대체)
 * @emits close - 레이어 닫기 요청
 * @emits send - 메시지 전송 (content)
 */
import { ref, watch, defineProps, defineEmits, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps<{ bShow: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'send', content: string): void }>()

const input = ref('')
// 메시지 타입에 sentAt 추가
const messages = ref<{ id: string; content: string; isUser: boolean; sentAt?: string }[]>([])
const bShowCopySnackbar = ref(false)
const messagesArea = ref<HTMLElement | null>(null)
const messageList = ref<HTMLElement | null>(null)

// 투명도 관련 상태
const transparency = ref(100) // 100% = 완전 불투명 (1.0), 90% = 최대 투명 (0.1)

// 투명도 업데이트 함수
function updateTransparency(value: number) {
  transparency.value = value
  // 로컬 스토리지에 투명도 저장
  localStorage.setItem('riskChatbotTransparency', value.toString())
}

// 창 크기 상태: mini, mid, max
const size = ref<'mini' | 'mid' | 'max'>('mini')
const isMax = computed(() => size.value === 'max')

// 최소화 상태
const isMinimized = ref(false)
const dialogWidth = computed(() => {
  if (size.value === 'mini') return 780
  if (size.value === 'mid') return 1200
  return undefined // max는 fullscreen
})
const sizeClass = computed(() => {
  if (size.value === 'mini') return 'mini'
  if (size.value === 'mid') return 'mid'
  if (size.value === 'max') return 'max'
  return ''
})
function setSize(val: 'mini' | 'mid' | 'max') {
  size.value = val
}

// 최소화 함수
function minimizeChat() {
  isMinimized.value = true
  // 최소화 상태를 로컬 스토리지에 저장
  localStorage.setItem('riskChatbotMinimized', 'true')
  
  // 최소화된 채팅창 목록에 추가
  const minimizedChatbots = JSON.parse(localStorage.getItem('minimizedChatbots') || '[]')
  
  // 기존에 있으면 제거
  const existingIndex = minimizedChatbots.indexOf('risk-assessment')
  if (existingIndex > -1) {
    minimizedChatbots.splice(existingIndex, 1)
  }
  
  // 위험성평가를 배열 끝에 추가 (동적 위치)
  minimizedChatbots.push('risk-assessment')
  localStorage.setItem('minimizedChatbots', JSON.stringify(minimizedChatbots))
  updateMinimizedChatbotsState()
}

// 복원 함수
function restoreChat() {
  isMinimized.value = false
  // 최소화 상태를 로컬 스토리지에서 제거
  localStorage.removeItem('riskChatbotMinimized')
  
  // 최소화된 채팅창 목록에서 제거
  const minimizedChatbots = JSON.parse(localStorage.getItem('minimizedChatbots') || '[]')
  const index = minimizedChatbots.indexOf('risk-assessment')
  if (index > -1) {
    minimizedChatbots.splice(index, 1)
    localStorage.setItem('minimizedChatbots', JSON.stringify(minimizedChatbots))
  }
  updateMinimizedChatbotsState()
}

// 최소화된 채팅창들의 상태를 추적하는 ref
const minimizedChatbotsState = ref<string[]>([])

// 로컬 스토리지에서 최소화된 채팅창 목록을 가져오는 함수
function updateMinimizedChatbotsState() {
  minimizedChatbotsState.value = JSON.parse(localStorage.getItem('minimizedChatbots') || '[]')
}

// 다른 채팅창의 상태 변경을 감지하기 위한 interval
let stateCheckInterval: NodeJS.Timeout | null = null

// 슬롯 위치 상수 (한 번만 계산)
const SLOT_POSITIONS = {
  buttonWidth: 200,
  buttonHeight: 60,
  buttonSpacing: 16,
  rightMargin: 200, // 전체 컨테이너 시작 위치를 왼쪽으로 이동
  bottomMargin: 24,
  slot1: 200, // 200px에서 시작
  slot2: 416, // 200 + 200 + 16
  slot3: 632, // 200 + (200 + 16) * 2
  slot4: 848  // 200 + (200 + 16) * 3
}

// 현재 슬롯 위치 상태
const currentSlot = ref(0)

// 슬롯 위치 업데이트 함수
function updateSlotPosition() {
  const slotIndex = minimizedChatbotsState.value.indexOf('risk-assessment')
  // 최근에 최소화한 것이 1번 슬롯(가장 오른쪽)에 오도록 역순으로 계산
  // 배열의 마지막 요소가 1번 슬롯, 첫 번째 요소가 4번 슬롯
  const totalMinimized = minimizedChatbotsState.value.length
  currentSlot.value = totalMinimized - slotIndex
  
  console.log('위험성평가 인덱스:', slotIndex)
  console.log('위험성평가 슬롯:', currentSlot.value)
  console.log('전체 배열:', minimizedChatbotsState.value)
  console.log('배열 길이:', minimizedChatbotsState.value.length)
  console.log('총 최소화된 수:', totalMinimized)
}

// 최소화된 채팅창 스타일 계산
const minimizedStyle = computed(() => {
  // 현재 채팅창이 최소화되어 있지 않으면 스타일 적용하지 않음
  if (currentSlot.value === 0) {
    return {}
  }
  
  // 슬롯에 따른 위치 결정
  let rightPosition
  switch (currentSlot.value) {
    case 1:
      rightPosition = SLOT_POSITIONS.slot1
      break
    case 2:
      rightPosition = SLOT_POSITIONS.slot2
      break
    case 3:
      rightPosition = SLOT_POSITIONS.slot3
      break
    case 4:
      rightPosition = SLOT_POSITIONS.slot4
      break
    default:
      rightPosition = SLOT_POSITIONS.slot1
  }
  
  console.log('위험성평가 슬롯:', currentSlot.value)
  console.log('위험성평가 위치:', rightPosition)
  console.log('슬롯1 위치:', SLOT_POSITIONS.slot1)
  console.log('슬롯2 위치:', SLOT_POSITIONS.slot2)
  console.log('슬롯3 위치:', SLOT_POSITIONS.slot3)
  console.log('슬롯4 위치:', SLOT_POSITIONS.slot4)
  
  return {
    right: `${rightPosition}px`,
    bottom: `${SLOT_POSITIONS.bottomMargin}px`,
    width: `${SLOT_POSITIONS.buttonWidth}px`,
    height: `${SLOT_POSITIONS.buttonHeight}px`
  }
})

// 투명도 계산 (왼쪽 = 90% 투명, 오른쪽 = 0% 투명)
const chatbotOpacity = computed(() => {
  // 90% = 0.1 (거의 투명), 100% = 1.0 (완전 불투명)
  const opacity = (transparency.value - 90) / 10
  return Math.max(0.1, Math.min(1.0, opacity)) // 0.1 ~ 1.0 범위로 제한
})

// 최소화된 채팅창 상태 변경 감지 (이벤트 기반 슬롯 업데이트)
watch(minimizedChatbotsState, () => {
  updateSlotPosition()
}, { deep: true })

// 음성 인식 관련 상태
const isListening = ref(false)
const bShowMicSnackbar = ref(false)
const micSnackbarText = ref('')
let recognition: any = null

function toggleMic() {
  if (isListening.value) {
    stopListening()
  } else {
    startListening()
  }
}

function startListening() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    micSnackbarText.value = '이 브라우저는 음성 인식을 지원하지 않습니다.'
    bShowMicSnackbar.value = true
    return
  }
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  recognition = new SpeechRecognition()
  recognition.lang = 'ko-KR'
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.onstart = () => {
    isListening.value = true
    micSnackbarText.value = '음성 인식이 시작되었습니다.'
    bShowMicSnackbar.value = true
  }
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript
    input.value += (input.value ? ' ' : '') + transcript
  }
  recognition.onerror = (event: any) => {
    micSnackbarText.value = '음성 인식 오류: ' + event.error
    bShowMicSnackbar.value = true
    isListening.value = false
  }
  recognition.onend = () => {
    isListening.value = false
  }
  recognition.start()
}

function stopListening() {
  if (recognition) {
    recognition.stop()
    isListening.value = false
  }
}

// 전송 버튼 관련 상태
const isSendBtnHovered = ref(false)
const sendBtnIconColor = computed(() => {
  if (!input.value.trim()) return '#ccc'
  if (isSendBtnHovered.value) return '#1976d2'
  return '#666'
})

// 메시지 복사 함수
function copyMessage(content: string) {
  navigator.clipboard.writeText(content).then(() => {
    bShowCopySnackbar.value = true
  }).catch(err => {
    console.error('복사 실패:', err)
  })
}

// 메시지 전송 함수
function onSend() {
  if (!input.value.trim()) return
  
  // 한국시간으로 YYYY.MM.DD HH:mm 포맷
  const now = new Date()
  const sentAt = now.toLocaleString('ko-KR', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  })
  
  const userMessage = {
    id: Date.now().toString(),
    content: input.value.trim(),
    isUser: true,
    sentAt
  }
  
  messages.value.push(userMessage)
  
  // AI 응답 시뮬레이션
  setTimeout(() => {
    const botSentAt = new Date().toLocaleString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    })
    
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      content: '위험성평가에 대한 질문을 해주셨네요. 구체적인 상황을 알려주시면 더 정확한 평가를 도와드릴 수 있습니다.',
      isUser: false,
      sentAt: botSentAt
    }
    messages.value.push(aiMessage)
    scrollToBottom()
  }, 1000)
  
  input.value = ''
  emit('send', userMessage.content)
  scrollToBottom()
}

// 스크롤 함수
function scrollToBottom() {
  nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  })
}

// 다이얼로그 업데이트 함수
function onDialogUpdate(value: boolean) {
  if (!value) {
    // 채팅창이 닫힐 때 최소화 상태도 초기화
    isMinimized.value = false
    localStorage.removeItem('riskChatbotMinimized')
    
    // 최소화된 채팅창 목록에서 제거
    const minimizedChatbots = JSON.parse(localStorage.getItem('minimizedChatbots') || '[]')
    const index = minimizedChatbots.indexOf('risk-assessment')
    if (index > -1) {
      minimizedChatbots.splice(index, 1)
      localStorage.setItem('minimizedChatbots', JSON.stringify(minimizedChatbots))
    }
    updateMinimizedChatbotsState()
    
    emit('close')
  }
}

// 닫기 함수
function onClose() {
  // 채팅창이 닫힐 때 최소화 상태도 함께 해제
  isMinimized.value = false
  localStorage.removeItem('riskChatbotMinimized')
  
  // 채팅창이 닫힐 때 최소화된 채팅창 목록에서도 제거
  const minimizedChatbots = JSON.parse(localStorage.getItem('minimizedChatbots') || '[]')
  const index = minimizedChatbots.indexOf('risk-assessment')
  if (index > -1) {
    minimizedChatbots.splice(index, 1)
    localStorage.setItem('minimizedChatbots', JSON.stringify(minimizedChatbots))
  }
  updateMinimizedChatbotsState()
  
  emit('close')
}

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  // 투명도 복원
  const savedTransparency = localStorage.getItem('riskChatbotTransparency')
  if (savedTransparency !== null) {
    transparency.value = parseInt(savedTransparency)
  }
  
  // 최소화 상태 복원
  const savedMinimized = localStorage.getItem('riskChatbotMinimized')
  if (savedMinimized === 'true') {
    isMinimized.value = true
  }
  
  // 최소화된 채팅창 상태 초기화
  updateMinimizedChatbotsState()
  
  // 다른 채팅창의 상태 변경을 주기적으로 감지
  stateCheckInterval = setInterval(() => {
    if (isMinimized.value) {
      updateMinimizedChatbotsState()
    }
  }, 100) // 100ms마다 체크
  
  // 초기 메시지 추가
  if (messages.value.length === 0) {
    const now = new Date()
    const sentAt = now.toLocaleString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    })
    
    messages.value.push({
      id: '1',
      content: '안녕하세요!\n저는 위험성평가 시스템 사용방법을 안내해드리는\n위험성평가 전문가 A.I 입니다.\n궁금한것이 있거나 도움이 필요하시면 말씀해주세요.\n\n( 예시: 추가위험발굴 메뉴에서 조치하는 방법 알려줘 )',
      isUser: false,
      sentAt
    })
  }
  
  // 메시지 변경 시 스크롤
  watch(messages, () => {
    scrollToBottom()
  }, { deep: true })
})

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  if (stateCheckInterval) {
    clearInterval(stateCheckInterval)
    stateCheckInterval = null
  }
})
</script>

<style scoped>
/* 위험성평가 챗봇 스타일 - ChatLayer와 동일한 디자인, 파란색 테마 */
.modern-chatbot-window {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.10);
  overflow: hidden;
  min-width: 560px;
  max-width: 1200px;
  transition: width 0.2s, height 0.2s, opacity 0.3s;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
}

.modern-chatbot-window.mini {
  width: 780px;
  /* height: 1370px;  // v-dialog에만 적용 */
}

.modern-chatbot-window.mid {
  width: 1200px;
  /* height: 1404px;  // v-dialog에만 적용 */
}

.modern-chatbot-window.max {
  width: 100% !important;
  height: 100vh !important;
  border-radius: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}

.modern-chatbot-window.max .modern-messages-area {
  height: calc(100vh - 200px); /* 헤더와 입력창 높이를 제외한 나머지 */
  max-height: calc(100vh - 200px);
  overflow-x: hidden !important;
}

/* 전체화면 모드에서 v-dialog 스크롤 방지 */
:deep(.v-dialog--fullscreen) {
  overflow-x: hidden !important;
}

:deep(.v-dialog--fullscreen .v-card) {
  overflow-x: hidden !important;
}

.modern-header {
  background: #1976d2;
  color: #fff;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 1.1rem;
  min-height: 68px;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
}

.modern-header-icon {
  background: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  position: relative;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.08);
}

.modern-header-icon .v-icon {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  font-size: 26px !important;
  line-height: 1 !important;
  width: 26px !important;
  height: 26px !important;
  margin: 0 !important;
  padding: 0 !important;
}

.modern-header-left {
  gap: 20px;
}

.modern-header-title-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
}

.modern-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.modern-status {
  font-size: 0.92rem;
  color: #e3f2fd;
  font-weight: 400;
  margin-top: 2px;
  line-height: 1.1;
  letter-spacing: 0.01em;
}

.modern-header-btn {
  color: #e3f2fd;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.modern-header-btn:hover {
  background: #e3f2fd;
  color: #1976d2;
}

.modern-header-x {
  color: #fff;
  font-size: 2.2rem;
  font-weight: 100;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 0;
  line-height: 1;
  transition: color 0.2s, background 0.2s;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -2px; /* 0.1cm 위로 올림 */
}

.modern-header-x:hover, .modern-header-x:focus {
  background: #e3f2fd;
  border-radius: 4px;
}

.modern-header-x:hover svg line,
.modern-header-x:focus svg line {
  stroke: #1976d2;
  transition: stroke 0.2s;
}

.modern-divider {
  margin: 0;
  border-color: #bbdefb;
}

.modern-messages-area {
  flex: 1 1 auto;
  height: 500px; /* 고정 높이 설정 */
  max-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 상단에서 시작하도록 변경 */
  position: relative;
  overflow: hidden; /* 스크롤을 message-list에서 처리 */
  width: 100%; /* 가로 스크롤 방지 */
}

.modern-message-list:empty::before {
  content: '';
  display: block;
  min-height: 200px; /* 메시지 없을 때도 공간 확보 */
}

.modern-message-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 12px; /* 상단 패딩 추가 */
  padding-bottom: 12px;
  justify-content: flex-start; /* 상단에서 시작 */
  height: 100%;
  overflow-y: auto; /* 세로 스크롤만 허용 */
  overflow-x: hidden; /* 가로 스크롤 방지 */
  scroll-behavior: auto; /* 즉시 스크롤 */
  min-height: 100%; /* 최소 높이 보장 */
  max-height: 100%; /* 최대 높이 제한 */
}

.modern-message {
  display: flex;
  align-items: flex-start; /* 상단 정렬로 변경 */
  gap: 10px;
}

.modern-message.user {
  justify-content: flex-end;
}

.modern-message.bot {
  justify-content: flex-start;
}

/* AI 메시지 카드 스타일 - 왼쪽 배치 */
.modern-bot-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: transparent;
  border: none;
  max-width: 80%;
  min-width: 200px;
  box-shadow: none;
  overflow: hidden; /* 가로 스크롤 방지 */
  justify-content: flex-start;
}

.modern-bot-icon {
  background: #1976d2;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  position: relative;
}

.modern-bot-icon .v-icon {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  font-size: 20px !important;
  line-height: 1 !important;
  width: 20px !important;
  height: 20px !important;
  margin: 0 !important;
  padding: 0 !important;
}

.modern-bot-content {
  background: #1976d2;
  border-radius: 12px;
  padding: 16px 18px;
  position: relative;
  flex: 1;
  min-width: 150px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-x: hidden;
}

.modern-bot-content::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 12px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid #1976d2;
}

.modern-bot-text {
  color: #fff;
  font-size: 1rem;
  line-height: 1.6;
  text-align: left;
  white-space: pre-line;
  margin-bottom: 8px;
  word-break: break-word;
  overflow-wrap: break-word;
}

.modern-bot-divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 8px 0;
}

.modern-bot-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.modern-bot-time {
  font-size: 0.85rem;
  color: #fff;
  font-weight: 400;
}

.modern-copy-btn.bottom-right {
  position: static;
  background: transparent;
  border-radius: 50%;
  padding: 2px;
  color: #fff;
}

.modern-copy-btn.bottom-right:hover {
  background: rgba(255,255,255,0.1);
}

/* 사용자 메시지(오른쪽) 파란색 말풍선 디자인 */
.modern-user-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: transparent;
  border: none;
  max-width: 80%;
  min-width: 200px;
  box-shadow: none;
  overflow: hidden; /* 가로 스크롤 방지 */
  justify-content: flex-end;
  flex-direction: row-reverse;
  margin-left: auto;
}

.modern-user-icon {
  background: #2196f3;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  position: relative;
}

.modern-user-icon .v-icon {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  font-size: 20px !important;
  line-height: 1 !important;
  width: 20px !important;
  height: 20px !important;
  margin: 0 !important;
  padding: 0 !important;
}

.modern-user-content {
  background: #2196f3;
  border-radius: 12px;
  padding: 16px 18px;
  position: relative;
  flex: 1;
  min-width: 150px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-x: hidden;
}

.modern-user-content::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 12px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid #2196f3;
}

.modern-user-text {
  color: #fff;
  font-size: 1rem;
  line-height: 1.6;
  text-align: left;
  white-space: pre-line;
  margin-bottom: 8px;
  word-break: break-word;
  overflow-wrap: break-word;
}

.modern-user-divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 8px 0;
}

.modern-user-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.modern-user-time {
  font-size: 0.85rem;
  color: #fff;
  font-weight: 400;
}

.modern-copy-btn {
  color: #1976d2;
  transition: color 0.2s;
}

.modern-copy-btn:hover {
  color: #1565c0;
}

.modern-bottom-divider {
  width: 100%;
  height: 0.1px;
  background: #1976d2;
  margin: 0;
  padding: 0;
  opacity: 0.8;
}

/* 현대적 메시지 하단 divider/시간 디자인 - 더 아래로 */
.modern-user-content {
  position: relative;
  padding-bottom: 8px;
  min-width: 120px;
}

.modern-user-divider {
  margin: 8px 0;
  width: 100%;
  height: 1px;
  background: rgba(255,255,255,0.3);
  border: none;
  position: static;
  border-radius: 0;
}

/* 메시지 하단 시간+복사 버튼 정렬 */
.modern-user-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin-top: 6px;
  width: 100%;
}

.modern-user-time {
  font-size: 0.85rem;
  color: #fff;
  font-weight: 400;
  letter-spacing: 0.01em;
}

.modern-copy-btn.bottom {
  background: transparent;
  color: #fff;
  border-radius: 4px;
  padding: 1.5px 2.5px 1px 2.5px;
  min-width: 22px;
  min-height: 22px;
  width: 22px;
  height: 22px;
  margin-left: 1.5px;
  box-shadow: none;
  transition: background 0.18s, color 0.18s;
}

.modern-copy-btn.bottom:hover {
  background: rgba(255,255,255,0.35);
  color: #1976d2;
}

.modern-input-wrap {
  background: #fff;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  box-shadow: 0 -2px 8px rgba(25, 118, 210, 0.04);
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modern-input {
  background: transparent;
  border-radius: 20px;
  font-size: 1.08rem;
  min-height: 48px;
  box-shadow: none;
}

:deep(.modern-input .v-field__outline),
:deep(.modern-input .v-field__outline__start),
:deep(.modern-input .v-field__outline__end),
:deep(.modern-input .v-field__outline__notch),
:deep(.modern-input .v-field__line),
:deep(.modern-input .v-field__underlay) {
  border-color: #1976d2 !important;
  background: transparent !important;
  --v-field-border-color: #1976d2 !important;
}

:deep(.modern-input .v-field--variant-underlined .v-field__underlined) {
  border-bottom: 2px solid #1976d2 !important;
}

:deep(.modern-input .v-field__overlay) {
  background: transparent !important;
}

:deep(.modern-input .v-field--focused .v-label) {
  opacity: 0 !important;
}

.modern-mic-btn {
  border-radius: 50%;
  width: 44px;
  height: 44px;
  min-width: 44px;
}

.modern-send-btn {
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modern-send-btn:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

/* 투명도 컨트롤 스타일 */
.transparency-control {
  display: flex;
  align-items: center;
  width: 60px;
}

.transparency-slider {
  width: 100%;
}

.transparency-slider :deep(.v-slider__track) {
  height: 4px;
}

.transparency-slider :deep(.v-slider__thumb) {
  width: 12px;
  height: 12px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .modern-bot-card,
  .modern-user-card {
    max-width: 90%;
  }
  
  .transparency-control {
    width: 48px;
  }
  
  .modern-mic-btn {
    width: 40px;
    height: 40px;
    min-width: 40px;
  }
  
  .modern-send-btn {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 900px) {
  .modern-chatbot-window,
  .modern-chatbot-window.mini,
  .modern-chatbot-window.mid {
    min-width: 0;
    width: 100vw !important;
    max-width: 100vw !important;
    height: 100dvh !important;
    border-radius: 0 !important;
  }
  .modern-header, .modern-input-wrap {
    border-radius: 0 !important;
  }
  .modern-messages-area {
    max-height: 400px;
    min-height: 200px;
  }
  
  .modern-chatbot-window.max .modern-messages-area {
    height: calc(100vh - 180px);
    max-height: calc(100vh - 180px);
  }
  .modern-bot-card, .modern-user-card {
    max-width: 80vw;
    padding: 12px 6px;
  }
  .modern-bubble {
    max-width: 96vw;
    font-size: 1rem;
    padding: 12px 10px;
  }
  .modern-send-btn {
    width: 54px;
    height: 54px;
    min-width: 54px;
    min-height: 54px;
  }
  
  /* 모바일에서 투명도 슬라이더 크기 조정 */
  .transparency-control {
    min-width: 80px; /* 100px * 0.8 */
    max-width: 96px; /* 120px * 0.8 */
  }
}

/* 최소화된 챗봇 스타일 */
.minimized-chatbot {
  position: fixed;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border-radius: 12px;
  padding: 0;
  cursor: pointer;
  z-index: 1003;
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
}

.minimized-chatbot:hover {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 10px 28px rgba(25, 118, 210, 0.3);
  border-color: rgba(255, 255, 255, 0.25);
}

.minimized-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  color: #fff;
  height: 100%;
  box-sizing: border-box;
  gap: 8px;
}

.minimized-text {
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.minimized-content .v-icon:first-child {
  font-size: 24px;
  width: 24px;
  height: 24px;
}

@media (max-width: 900px) {
  .minimized-chatbot {
    bottom: 16px;
    min-width: 140px;
  }
  
  .minimized-content {
    padding: 10px 12px;
  }
  
  .minimized-text {
    font-size: 0.8rem;
  }
}
</style>
<style>
.v-overlay__content.cs-dialog-bottom-right {
  position: fixed;
  right: 32px;
  bottom: 32px;
  left: auto;
  top: auto;
  margin: 0;
  z-index: 1002;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  pointer-events: none;
  /* height 제한 해제 */
  height: auto;
  min-height: 0;
  max-height: none;
}
.v-overlay__content.cs-dialog-bottom-right > * {
  pointer-events: auto;
}
@media (max-width: 900px) {
  .v-overlay__content.cs-dialog-bottom-right {
    right: 0;
    bottom: 0;
  }
}
</style>