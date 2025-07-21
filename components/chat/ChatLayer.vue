<!--
  [채팅 입력 레이어 컴포넌트]
  - 이미지 디자인에 맞춰 챗봇 응답 메시지를 빨간색 헤더바 카드 형태로 변경
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
            <v-icon color="#c53030" size="26">mdi-robot</v-icon>
          </span>
          <div class="modern-header-title-wrap d-flex flex-column align-start">
            <span class="modern-title">건설안전 전문가</span>
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
                  <v-icon color="#fff" size="20">mdi-robot</v-icon>
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
                  <v-icon color="#fff" size="20">mdi-account</v-icon>
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
          label="건설안전, 건설법 등 궁금한 것을 물어보세요..."
          hide-details
          auto-grow
          rows="1"
          rounded
          outlined
          class="modern-input flex-grow-1 mr-2"
          @keydown.enter.exact.prevent="handleEnterKey"
          @keydown.enter.shift="handleShiftEnter"  
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
            color="#c53030"
            track-color="#e0e0e0"
            thumb-color="#c53030"
            @update:model-value="updateTransparency"
            aria-label="투명도 조절"
          />
        </div>
        <v-btn
          :color="isListening ? 'deep-orange' : undefined"
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
      <v-icon color="#fff" size="24">mdi-robot</v-icon>
      <span class="minimized-text">건설안전 전문가</span>
      <v-icon color="#fff" size="20">mdi-chevron-up</v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * <pre>
 * [채팅 입력 레이어 컴포넌트]
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
  localStorage.setItem('chatbotTransparency', value.toString())
}

// 창 크기 상태: mini, mid, max
const size = ref<'mini' | 'mid' | 'max'>('mini')
const isMax = computed(() => size.value === 'max')

// 최소화 상태
const isMinimized = ref(false)
const dialogWidth = computed(() => {
  if (size.value === 'mini') return 400
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
  localStorage.setItem('chatbotMinimized', 'true')
  
  // 최소화된 채팅창 목록에 추가
  const minimizedChatbots = JSON.parse(localStorage.getItem('minimizedChatbots') || '[]')
  
  // 기존에 있으면 제거
  const existingIndex = minimizedChatbots.indexOf('construction-safety')
  if (existingIndex > -1) {
    minimizedChatbots.splice(existingIndex, 1)
  }
  
  // 건설안전을 배열 끝에 추가 (다른 채팅창과 동일하게)
  minimizedChatbots.push('construction-safety')
  localStorage.setItem('minimizedChatbots', JSON.stringify(minimizedChatbots))
  updateMinimizedChatbotsState()
}

// 복원 함수
function restoreChat() {
  isMinimized.value = false
  // 최소화 상태를 로컬 스토리지에서 제거
  localStorage.removeItem('chatbotMinimized')
  
  // 최소화된 채팅창 목록에서 제거
  const minimizedChatbots = JSON.parse(localStorage.getItem('minimizedChatbots') || '[]')
  const index = minimizedChatbots.indexOf('construction-safety')
  if (index > -1) {
    minimizedChatbots.splice(index, 1)
    localStorage.setItem('minimizedChatbots', JSON.stringify(minimizedChatbots))
  }
  updateMinimizedChatbotsState()
}

// 스크롤을 맨 아래로 이동하는 함수
function scrollToBottom() {
  nextTick(() => {
    if (messageList.value) {
      // 스크롤을 맨 아래로 강제 이동
      messageList.value.scrollTop = messageList.value.scrollHeight
      
      // DOM 업데이트 후 다시 한번 시도
      setTimeout(() => {
        if (messageList.value) {
          messageList.value.scrollTop = messageList.value.scrollHeight
        }
      }, 100)
      
      // 추가로 한번 더 시도
      setTimeout(() => {
        if (messageList.value) {
          messageList.value.scrollTop = messageList.value.scrollHeight
        }
      }, 300)
      
      // 마지막으로 한번 더 시도
      setTimeout(() => {
        if (messageList.value) {
          messageList.value.scrollTop = messageList.value.scrollHeight
        }
      }, 500)
    }
  })
}

// 챗봇 헤더 텍스트 생성 함수
function getBotHeaderText(content: string): string {
  // 내용에 따라 적절한 헤더 텍스트 반환
  if (content.includes('서울') && content.includes('지하 3층') && content.includes('지상 7층')) {
    return '서울 지하 3층: 방수 및 타설공사, 지상 7층: 철근콘크리트 거푸집 설치, 철근 배근, 전선관 배관공사 (타워크레인 활용)'
  }
  if (content.includes('오늘 작업장소와 작업공종을 알려주시면')) {
    return '서울 지하 3층: 방수 및 타설공사, 지상 7층: 철근콘크리트 거푸집 설치, 철근 배근, 전선관 배관공사 (타워크레인 활용)'
  }
  return '건설안전 전문가 답변'
}

// 초기 챗봇 메시지 추가 함수
function addInitialBotMessage() {
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
      id: 'initial',
      content: `안녕하세요? 저는 건설안전 전문가입니다.

오늘 작업장소와 작업공종을 알려주시면 위험요인과 안전대책을 알려드리겠습니다.

(예시: 서울에서 지하 3층: 방수 및 미장 작업, 지상 7층: 철근콘크리트를 위한 형틀설치, 철근배근, 전선관배관 작업을 타워크레인을 이용해서 진행합니다)`,
      isUser: false,
      sentAt
    })
  }
}

// 임시 AI 챗봇 응답 함수
function generateBotResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()
  
  // 서울 지하 3층, 지상 7층 작업 관련 응답
  if (lowerMessage.includes('서울') && (lowerMessage.includes('지하 3층') || lowerMessage.includes('지상 7층'))) {
    return `오늘 서울에서 진행되는 작업에 대한 안전 점검을 시작합니다.

1. 작업장소 및 작업공종 확인
• 지하 3층: 방수 및 타설공사
• 지상 7층: 철근콘크리트 거푸집 설치, 철근 배근, 전선관 배관공사
• 사용장비: 타워크레인

2. 오늘 날씨 정보
• 서울 오늘 날씨: 흐림, 오후 비 예상
• 기온: 약 27도
• 습도: 87% (습도 높음)

3. 위험요인 및 안전대책

【지하 3층 (방수 및 타설공사)】
위험요인:
• 밀폐공간 유해물질로 인한 호흡기 질환
• 미끄러운 바닥으로 인한 미끄러짐/넘어짐
• 전기설비 사용 시 감전
• 충돌/낙하물 사고
• 환기부족으로 인한 질식

안전대책:
• 분진마스크, 안전안경 필수 착용
• 지속적인 환기 실시
• 미끄럼방지 신발 착용
• 안전통로 확보
• 전기안전 점검
• 누전차단기 사용
• 절연장갑 착용
• 안전한 자재 취급
• 밀폐공간 산소/가스 측정

【지상 7층 (거푸집, 철근, 전선관 배관)】
위험요인:
• 고소작업 시 추락
• 낙하/비래물
• 타워크레인 충돌/전도
• 철근 작업 시 찔림/절단
• 전선관 작업 시 감전

안전대책:
• 안전띠, 안전모 필수 착용
• 안전난간, 안전망 설치
• 작업발판 확보
• 자재 취급 시 안전관리자 감독
• 출입통제
• 타워크레인 사전 점검/교육
• 신호수 배치
• 강풍 시 작업 중단
• 안전장갑 착용
• 습도 높은 환경에서 전기안전 강화

4. 추가 안내사항

【폭염 대비】
• 수분 섭취 및 휴식
• 시원한 음료 제공
• 습도 높음으로 인한 작업시간 조정

【비 오는 날 안전】
• 미끄러짐, 감전 위험 증가
• 방수 작업복 착용
• 전기설비 점검
• 작업 중단 고려
• 타워크레인은 강풍 및 비 오는 날 반드시 중단

【작업 중 안전수칙】
• 개인보호구(안전모, 안전화, 안전띠) 지속 착용
• 작업 전 안전점검 및 교육 철저

추가로 궁금한 점이 있으시면 언제든 물어보세요.`
  }
  
  // 일반적인 안전 관련 질문
  if (lowerMessage.includes('안전') || lowerMessage.includes('위험') || lowerMessage.includes('보호구')) {
    return `건설현장 안전에 대해 궁금하신 점이 있으시군요.

일반적인 건설현장 안전수칙:

1. 개인보호구 필수 착용
• 안전모: 머리 보호
• 안전화: 미끄럼방지, 발 보호
• 안전띠: 고소작업 시 필수
• 안전장갑: 손 보호
• 분진마스크: 호흡기 보호

2. 작업 전 안전점검
• 작업장소 안전상태 확인
• 사용장비 점검
• 안전교육 실시

3. 작업 중 주의사항
• 안전수칙 준수
• 주변 상황 파악
• 신호수와의 협조

구체적인 작업공종이나 장소를 알려주시면 더 자세한 안전대책을 안내해드릴 수 있습니다.`
  }
  
  // 기본 응답
  return `안녕하세요! 건설안전 전문가입니다.

작업장소와 작업공종을 구체적으로 알려주시면 해당 작업에 맞는 위험요인과 안전대책을 상세히 안내해드리겠습니다.

예시:
"서울에서 지하 3층: 방수 및 미장 작업, 지상 7층: 철근콘크리트를 위한 형틀설치, 철근배근, 전선관배관 작업을 타워크레인을 이용해서 진행합니다"

이런 식으로 구체적으로 알려주시면 더 정확한 안전 정보를 제공할 수 있습니다.`
}

// 음성 인식 관련 상태 및 로직
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

// 컴포넌트가 마운트될 때 초기 메시지 추가
onMounted(() => {
  addInitialBotMessage()
  
  // 최소화 상태 복원
  const minimized = localStorage.getItem('chatbotMinimized')
  if (minimized === 'true') {
    isMinimized.value = true
  }
  
  // 투명도 상태 복원
  const savedTransparency = localStorage.getItem('chatbotTransparency')
  if (savedTransparency !== null) {
    transparency.value = parseInt(savedTransparency)
  }
  
  // 최소화된 채팅창 상태 초기화
  updateMinimizedChatbotsState()
  
  // 다른 채팅창의 상태 변경을 주기적으로 감지
  stateCheckInterval = setInterval(() => {
    if (isMinimized.value) {
      updateMinimizedChatbotsState()
    }
  }, 100) // 100ms마다 체크
  
  // 초기 슬롯 위치 업데이트
  updateSlotPosition()
  
  // 초기 메시지 로드 후 스크롤
  scrollToBottom()
})

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  if (stateCheckInterval) {
    clearInterval(stateCheckInterval)
    stateCheckInterval = null
  }
})

watch(() => props.bShow, (val) => {
  if (val) {
    input.value = ''
    // 채팅창이 열릴 때마다 초기 메시지 확인
    addInitialBotMessage()
  }
})

// 메시지 배열이 변경될 때마다 스크롤을 맨 아래로 이동
watch(() => messages.value, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })



function onDialogUpdate(val: boolean) {
  if (!val) emit('close')
}

function onClose() {
  // 채팅창이 닫힐 때 최소화 상태도 함께 해제
  isMinimized.value = false
  localStorage.removeItem('chatbotMinimized')
  
  // 채팅창이 닫힐 때 최소화된 채팅창 목록에서도 제거
  const minimizedChatbots = JSON.parse(localStorage.getItem('minimizedChatbots') || '[]')
  const index = minimizedChatbots.indexOf('construction-safety')
  if (index > -1) {
    minimizedChatbots.splice(index, 1)
    localStorage.setItem('minimizedChatbots', JSON.stringify(minimizedChatbots))
  }
  updateMinimizedChatbotsState()
  
  emit('close')
}

// 엔터 키 처리 함수
function handleEnterKey(event: KeyboardEvent) {
  // 입력이 비어있으면 전송하지 않음
  if (!input.value.trim()) {
    return
  }
  
  // 기본 동작 방지
  event.preventDefault()
  
  // 메시지 전송
  onSend()
}

// Shift + Enter 처리 함수 (줄바꿈)
function handleShiftEnter(event: KeyboardEvent) {
  // Shift + Enter는 줄바꿈을 허용
  // 기본 동작을 방지하지 않음
  return
}

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
  
  // 사용자 메시지 추가
  messages.value.push({ id: Date.now() + '', content: input.value, isUser: true, sentAt })
  
  // 메시지 추가 후 즉시 스크롤
  scrollToBottom()
  
  // 임시 AI 응답 생성 (실제 API 연동 전까지)
  setTimeout(() => {
    const botResponse = generateBotResponse(input.value)
    const botSentAt = new Date().toLocaleString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    })
    messages.value.push({ 
      id: (Date.now() + 1) + '', 
      content: botResponse, 
      isUser: false, 
      sentAt: botSentAt 
    })
    
    // AI 응답 후에도 즉시 스크롤
    scrollToBottom()
  }, 1000) // 1초 후 응답
  
  emit('send', input.value)
  input.value = ''
}

async function copyMessage(content: string) {
  try {
    await navigator.clipboard.writeText(content)
    bShowCopySnackbar.value = true
  } catch (e) {
    alert('복사에 실패했습니다.')
  }
}

const isSendBtnHovered = ref(false)
const sendBtnIconColor = computed(() => {
  if (isSendBtnHovered.value) return 'white'
  return '#c53030'
})
const sendBtnBgColor = computed(() => {
  if (isSendBtnHovered.value) return '#c53030'
  return '#fff'
})

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
  const slotIndex = minimizedChatbotsState.value.indexOf('construction-safety')
  // 최근에 최소화한 것이 1번 슬롯(가장 오른쪽)에 오도록 역순으로 계산
  // 배열의 마지막 요소가 1번 슬롯, 첫 번째 요소가 4번 슬롯
  const totalMinimized = minimizedChatbotsState.value.length
  currentSlot.value = totalMinimized - slotIndex
  
  console.log('건설안전 인덱스:', slotIndex)
  console.log('건설안전 슬롯:', currentSlot.value)
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
  
  console.log('건설안전 슬롯:', currentSlot.value)
  console.log('건설안전 위치:', rightPosition)
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
</script>

<style scoped>
.modern-chatbot-window {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(197,48,48,0.10);
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
  background: #c53030;
  color: #fff;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 1.1rem;
  min-height: 68px;
  box-shadow: 0 2px 8px rgba(197,48,48,0.08);
}
.modern-header-icon {
  background: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(197,48,48,0.08);
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
  color: #ffe5ea;
  font-weight: 400;
  margin-top: 2px;
  line-height: 1.1;
  letter-spacing: 0.01em;
}
.modern-header-btn {
  color: #ffe5ea;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
.modern-header-btn:hover {
  background: #ffe5ea;
  color: #c53030;
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
  background: #ffe5ea;
  border-radius: 4px;
}
.modern-header-x:hover svg line,
.modern-header-x:focus svg line {
  stroke: #c53030;
  transition: stroke 0.2s;
}
.modern-divider {
  margin: 0;
  border-color: #ffd6de;
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
  background: #c53030;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  flex-shrink: 0;
  position: relative;
}
.modern-bot-icon .v-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.modern-bot-content {
  background: #dc2626;
  border-radius: 12px;
  padding: 16px 18px;
  position: relative;
  flex: 1;
  min-width: 150px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-x: hidden; /* 가로 스크롤 방지 */
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
  border-right: 8px solid #dc2626;
}
.modern-bot-text {
  color: #fff;
  font-size: 1rem;
  line-height: 1.6;
  text-align: left;
  white-space: pre-line;
  margin-bottom: 8px;
  word-break: break-word; /* 긴 텍스트 줄바꿈 강제 */
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
/* 복사 버튼 위치 조정 - 오른쪽 하단 */
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
/* 사용자 메시지(오른쪽) 주황색 말풍선 디자인 */
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
  background: #ff6b35;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  flex-shrink: 0;
  position: relative;
}
.modern-user-icon .v-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.modern-user-content {
  background: #ff6b35;
  border-radius: 12px;
  padding: 16px 18px;
  position: relative;
  flex: 1;
  min-width: 150px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-x: hidden; /* 가로 스크롤 방지 */
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
  border-left: 8px solid #ff6b35;
}
.modern-user-text {
  color: #fff;
  font-size: 1rem;
  line-height: 1.6;
  text-align: left;
  white-space: pre-line;
  margin-bottom: 8px;
  word-break: break-word; /* 긴 텍스트 줄바꿈 강제 */
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
  color: #c53030;
  transition: color 0.2s;
}
.modern-copy-btn:hover {
  color: #a81c1c;
}
/* 말풍선 내부 복사 버튼 위치 조정 */
.modern-bot-content, .modern-user-content {
  position: relative;
}
.modern-copy-btn.inside-bubble {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  padding: 2px;
}
.modern-input-wrap {
  background: #fff;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  box-shadow: 0 -2px 8px rgba(197,48,48,0.04);
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
/* Vuetify v-text-field 밑줄(underline) 색상 오버라이드 */
:deep(.modern-input .v-field__outline),
:deep(.modern-input .v-field__outline__start),
:deep(.modern-input .v-field__outline__end),
:deep(.modern-input .v-field__outline__notch),
:deep(.modern-input .v-field__line),
:deep(.modern-input .v-field__underlay) {
  border-color: #c53030 !important;
  background: transparent !important;
  --v-field-border-color: #c53030 !important;
}
/* underlined variant일 때 밑줄만 빨간색 */
:deep(.modern-input .v-field--variant-underlined .v-field__underlined) {
  border-bottom: 2px solid #c53030 !important;
}
:deep(.modern-input .v-field__overlay) {
  background: transparent !important;
}
:deep(.modern-input .v-field--focused .v-label) {
  opacity: 0 !important;
}
.modern-mic-btn {
  color: #c53030;
  background: #fff;
  border-radius: 4px;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.modern-mic-btn:hover, .modern-mic-btn:focus {
  background: #c53030;
  color: #fff;
}

:deep(.modern-send-btn) {
  background: #fff !important;
  border-radius: 4px;
  min-width: 44px;
  min-height: 44px;
  width: 44px;
  height: 44px;
  transition: background 0.2s, color 0.2s;
}
.modern-send-btn:disabled {
  background: #fff;
  color: #c53030;
  border: none;
}
.modern-send-btn:hover:not(:disabled), .modern-send-btn:focus:not(:disabled) {
  background: #c53030;
  color: #fff;
}

/* 투명도 조절 슬라이더 스타일 */
.transparency-control {
  display: flex;
  align-items: center;
  min-width: 96px; /* 120px * 0.8 */
  max-width: 120px; /* 150px * 0.8 */
}

.transparency-slider {
  width: 100%;
}

:deep(.transparency-slider .v-slider__track) {
  height: 3px; /* 4px * 0.8 */
}

:deep(.transparency-slider .v-slider__thumb) {
  width: 13px; /* 16px * 0.8 */
  height: 13px; /* 16px * 0.8 */
}

:deep(.transparency-slider .v-slider__thumb-container) {
  width: 13px; /* 16px * 0.8 */
  height: 13px; /* 16px * 0.8 */
}
:deep(.modern-send-btn.v-btn--disabled),
:deep(.modern-send-btn.v-btn--disabled .v-btn__content),
:deep(.modern-send-btn.v-btn--disabled .v-icon) {
  opacity: 1 !important;
  color: #c53030 !important;
}
:deep(.modern-send-btn:hover),
:deep(.modern-send-btn:focus) {
  background: #c53030 !important;
}
:deep(.modern-send-btn:hover .v-icon),
:deep(.modern-send-btn:focus .v-icon) {
  color: #fff !important;
}
.modern-bottom-divider {
  width: 100%;
  height: 0.1px;
  background: #c53030;
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
  color: #c53030;
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

/* 최소화된 채팅창 스타일 */
.minimized-chatbot {
  position: fixed;
  background: linear-gradient(135deg, #c53030 0%, #a81c1c 100%);
  border-radius: 12px;
  padding: 0;
  cursor: pointer;
  z-index: 1003;
  box-shadow: 0 6px 20px rgba(197,48,48,0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
}

.minimized-chatbot:hover {
  background: linear-gradient(135deg, #a81c1c 0%, #8b1a1a 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 10px 28px rgba(197,48,48,0.3);
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