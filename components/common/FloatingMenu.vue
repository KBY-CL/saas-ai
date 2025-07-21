<template>
  <div class="floating-menu pill-menu">
    <div
      v-for="item in menuItems"
      :key="item.id"
      class="pill-menu-btn"
      @click="onMenuClick(item.action)"
      tabindex="0"
      role="button"
      :aria-label="item.label"
    >
      <span class="pill-menu-label">{{ item.label }}</span>
      <v-icon class="pill-menu-icon" size="24">{{ item.icon }}</v-icon>
    </div>
    <div class="d-flex justify-center align-center mt-4">
      <v-btn
        icon
        variant="flat"
        class="pill-minimize-btn"
        color="white"
        size="large"
        @click="onMinimize"
        aria-label="최소화"
      >
        <v-icon size="28">mdi-minus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * <pre>
 * [메뉴 아이템 인터페이스]
 * </pre>
 */
interface MenuItem {
  id: string
  label: string
  subLabel?: string
  icon: string
  action: string
  isActive?: boolean
}

/**
 * <pre>
 * [메뉴 아이템 데이터]
 * </pre>
 */
const menuItems: MenuItem[] = [
  {
    id: 'construction-ai',
    label: '건설안전 A.I',
    icon: 'mdi-shield',
    action: 'construction-ai'
  },
  {
    id: 'risk-ai',
    label: '위험성평가 A.I',
    icon: 'mdi-alert',
    action: 'risk-ai'
  },
  {
    id: 'tax-ai',
    label: '세금계산서 A.I',
    icon: 'mdi-file-document-outline',
    action: 'tax-ai'
  },
  {
    id: 'site-ai',
    label: '현장개통/해지 A.I',
    icon: 'mdi-domain',
    action: 'site-ai'
  }
]

/**
 * <pre>
 * [메뉴 클릭 이벤트]
 * </pre>
 * 
 * @param action 클릭된 메뉴 액션
 */
const emit = defineEmits<{
  menuClick: [action: string]
  minimize: []
  chatbot: []
}>()

const onMenuClick = (action: string) => {
  emit('menuClick', action)
}

/**
 * <pre>
 * [최소화 버튼 클릭]
 * </pre>
 */
const onMinimize = () => {
  emit('minimize')
}

/**
 * <pre>
 * [챗봇 버튼 클릭]
 * </pre>
 */
const onChatbot = () => {
  emit('chatbot')
}
</script>

<style scoped>
.floating-menu.pill-menu {
  position: fixed;
  right: 32px;
  bottom: 32px;
  top: auto;
  transform: none;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: none;
  box-shadow: none;
  border: none;
  min-width: 220px;
}
@media (max-width: 768px) {
  .floating-menu.pill-menu {
    right: 10px;
    bottom: 10px;
    min-width: 0;
    width: 95vw;
    max-width: 95vw;
  }
}
.pill-menu-btn {
  width: 220px;
  min-height: 48px;
  background: #38404a;
  color: #fff;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.08rem;
  font-weight: 600;
  margin-bottom: 18px;
  padding: 0 22px 0 22px;
  cursor: pointer;
  outline: none;
  border: none;
  box-shadow: none;
  transition: background 0.18s, color 0.18s;
}
.pill-menu-btn:last-child {
  margin-bottom: 0;
}
.pill-menu-btn:hover, .pill-menu-btn:focus {
  background: #495263;
  color: #fff;
}
.pill-menu-label {
  flex: 1;
  text-align: left;
  font-size: 1.08rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.pill-menu-icon {
  color: #fff;
  margin-left: 16px;
}
.pill-minimize-btn {
  background: #38404a !important;
  color: #fff !important;
  border-radius: 50%;
  box-shadow: none;
  margin-top: 10px;
  transition: background 0.18s, color 0.18s;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
}
.pill-minimize-btn:hover, .pill-minimize-btn:focus {
  background: #495263 !important;
  color: #fff !important;
}
.pill-minimize-btn .v-icon {
  color: #fff !important;
  font-size: 2rem;
}
</style> 