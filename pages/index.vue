<template>
  <div>
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="pa-6">
            <v-card-title class="text-center">
              AI 건설안전 전문가 챗봇
            </v-card-title>
            <v-card-text class="text-center">
              <p>플로팅 메뉴가 화면 우측에 표시됩니다.</p>
              <p>각 버튼을 클릭하여 기능을 테스트해보세요.</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 플로팅 메뉴 -->
    <FloatingMenu
      v-if="bShowFloatingMenu"
      @menu-click="handleMenuClick"
      @minimize="handleMinimize"
      @chatbot="handleChatbot"
    />

    <!-- 로봇 아이콘만 보이게 -->
    <v-btn
      v-else
      icon
      color="primary"
      class="floating-robot-btn"
      @click="handleChatbot"
      aria-label="챗봇 열기"
      size="large"
    >
      <v-icon>mdi-robot</v-icon>
    </v-btn>

    <!-- 건설안전 A.I 채팅 레이어 -->
    <ChatLayer
      v-if="bShowChatLayer"
      :bShow="bShowChatLayer"
      @close="handleChatLayerClose"
      @send="handleChatLayerSend"
    />

    <!-- 위험도 평가 A.I 채팅 레이어 -->
    <RiskChatLayer
      v-if="bShowRiskChatLayer"
      :bShow="bShowRiskChatLayer"
      @close="handleRiskChatLayerClose"
      @send="handleRiskChatLayerSend"
    />

    <!-- 세금계산서 A.I 채팅 레이어 -->
    <TaxChatLayer
      v-if="bShowTaxChatLayer"
      :bShow="bShowTaxChatLayer"
      @close="handleTaxChatLayerClose"
      @send="handleTaxChatLayerSend"
    />

    <!-- 현장개통/해지 A.I 채팅 레이어 -->
    <SiteChatLayer
      v-if="bShowSiteChatLayer"
      :bShow="bShowSiteChatLayer"
      @close="handleSiteChatLayerClose"
      @send="handleSiteChatLayerSend"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FloatingMenu from '~/components/common/FloatingMenu.vue'
import ChatLayer from '~/components/chat/ChatLayer.vue'
import RiskChatLayer from '~/components/chat/RiskChatLayer.vue'
import TaxChatLayer from '~/components/chat/TaxChatLayer.vue'
import SiteChatLayer from '~/components/chat/SiteChatLayer.vue'

// 플로팅 메뉴 표시 여부 상태
const bShowFloatingMenu = ref(true)
// 채팅 레이어 표시 여부 상태
const bShowChatLayer = ref(false)
// 위험도 평가 채팅 레이어 표시 여부 상태
const bShowRiskChatLayer = ref(false)
// 세금계산서 A.I 채팅 레이어 표시 여부 상태
const bShowTaxChatLayer = ref(false)
// 현장개통/해지 A.I 채팅 레이어 표시 여부 상태
const bShowSiteChatLayer = ref(false)

/**
 * <pre>
 * [메뉴 클릭 핸들러]
 * </pre>
 * 
 * @param action 클릭된 메뉴 액션
 */
const handleMenuClick = (action: string) => {
  console.log('메뉴 클릭:', action)
  if (action === 'construction-ai') {
    bShowChatLayer.value = true
    console.log('건설안전 채팅창 열림:', bShowChatLayer.value)
  } else if (action === 'risk-ai') {
    bShowRiskChatLayer.value = true
    console.log('위험성평가 채팅창 열림:', bShowRiskChatLayer.value)
  } else if (action === 'tax-ai') {
    bShowTaxChatLayer.value = true
    console.log('세금계산서 채팅창 열림:', bShowTaxChatLayer.value)
  } else if (action === 'site-ai') {
    bShowSiteChatLayer.value = true
    console.log('현장개통/해지 채팅창 열림:', bShowSiteChatLayer.value)
  }
  // TODO: 각 메뉴 액션에 따른 처리 로직 구현
}

/**
 * <pre>
 * [채팅 레이어 닫기 핸들러]
 * </pre>
 */
const handleChatLayerClose = () => {
  bShowChatLayer.value = false
}

/**
 * <pre>
 * [채팅 레이어 메시지 전송 핸들러]
 * </pre>
 */
const handleChatLayerSend = (content: string) => {
  // TODO: 실제 메시지 송수신 로직 연결 예정
  console.log('채팅 전송:', content)
}

/**
 * <pre>
 * [위험도 평가 채팅 레이어 닫기 핸들러]
 * </pre>
 */
const handleRiskChatLayerClose = () => {
  bShowRiskChatLayer.value = false
}

/**
 * <pre>
 * [위험도 평가 채팅 레이어 메시지 전송 핸들러]
 * </pre>
 */
const handleRiskChatLayerSend = (content: string) => {
  // TODO: 실제 메시지 송수신 로직 연결 예정
  console.log('위험도 평가 채팅 전송:', content)
}

/**
 * <pre>
 * [세금계산서 A.I 채팅 레이어 닫기 핸들러]
 * </pre>
 */
const handleTaxChatLayerClose = () => {
  bShowTaxChatLayer.value = false
}

/**
 * <pre>
 * [세금계산서 A.I 채팅 레이어 메시지 전송 핸들러]
 * </pre>
 */
const handleTaxChatLayerSend = (content: string) => {
  // TODO: 실제 메시지 송수신 로직 연결 예정
  console.log('세금계산서 A.I 채팅 전송:', content)
}

/**
 * <pre>
 * [현장개통/해지 A.I 채팅 레이어 닫기 핸들러]
 * </pre>
 */
const handleSiteChatLayerClose = () => {
  console.log('현장개통/해지 채팅창 닫기 전:', bShowSiteChatLayer.value)
  bShowSiteChatLayer.value = false
  console.log('현장개통/해지 채팅창 닫기 후:', bShowSiteChatLayer.value)
}

/**
 * <pre>
 * [현장개통/해지 A.I 채팅 레이어 메시지 전송 핸들러]
 * </pre>
 */
const handleSiteChatLayerSend = (content: string) => {
  // TODO: 실제 메시지 송수신 로직 연결 예정
  console.log('현장개통/해지 A.I 채팅 전송:', content)
}

/**
 * <pre>
 * [최소화 핸들러]
 * </pre>
 */
const handleMinimize = () => {
  // 모든 최소화된 채팅창 닫기
  closeAllMinimizedChatbots()
  
  // 플로팅 메뉴 숨기기
  bShowFloatingMenu.value = false
}

/**
 * <pre>
 * [모든 최소화된 채팅창 닫기]
 * </pre>
 */
const closeAllMinimizedChatbots = () => {
  // 로컬 스토리지에서 최소화된 채팅창 목록 가져오기
  const minimizedChatbots = JSON.parse(localStorage.getItem('minimizedChatbots') || '[]')
  
  // 각 최소화된 채팅창을 완전히 닫기
  minimizedChatbots.forEach((chatbotId: string) => {
    if (chatbotId === 'construction-safety') {
      // 건설안전 채팅창 완전히 닫기
      bShowChatLayer.value = false
      localStorage.removeItem('chatbotMinimized')
    } else if (chatbotId === 'risk-assessment') {
      // 위험성평가 채팅창 완전히 닫기
      bShowRiskChatLayer.value = false
      localStorage.removeItem('riskChatbotMinimized')
    } else if (chatbotId === 'tax-ai') {
      // 세금계산서 채팅창 완전히 닫기
      bShowTaxChatLayer.value = false
      localStorage.removeItem('taxChatbotMinimized')
    } else if (chatbotId === 'site-ai') {
      // 현장개통/해지 채팅창 완전히 닫기
      bShowSiteChatLayer.value = false
      localStorage.removeItem('siteChatbotMinimized')
    }
  })
  
  // 최소화된 채팅창 목록 초기화
  localStorage.setItem('minimizedChatbots', '[]')
  
  console.log('모든 최소화된 채팅창이 완전히 닫혔습니다.')
}

/**
 * <pre>
 * [챗봇 핸들러]
 * </pre>
 */
const handleChatbot = () => {
  bShowFloatingMenu.value = true
}
</script>
<style>
.grid-stack-item-content {
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.floating-robot-btn {
  position: fixed;
  right: 32px;
  bottom: 32px;
  top: auto;
  transform: none;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #38404a;
  color: #fff;
  padding: 0;
  border: none;
  box-shadow: none;
  transition: background 0.18s, color 0.18s;
}
.floating-robot-btn:hover, .floating-robot-btn:focus {
  background: #495263;
  color: #fff;
}
.floating-robot-btn .v-icon {
  color: #fff;
  font-size: 2rem;
}
@media (max-width: 768px) {
  .floating-robot-btn {
    right: 10px;
    bottom: 10px;
  }
}
</style>
