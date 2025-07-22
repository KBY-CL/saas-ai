// AI 건설안전 전문가 챗봇 - 순수 JavaScript 마이그레이션
// 원본 Vue.js + Vuetify 3 프로젝트를 순수 JavaScript로 완전 이전

(function() {
    'use strict';

    // 중복 로드 방지
    if (window.ConstructionSafetyChatbot) {
        return;
    }

    /**
     * <pre>
     * [챗봇 애플리케이션 메인 클래스]
     * </pre>
     */
    class ChatbotApp {
        constructor() {
            // 상태 관리
            this.bShowFloatingMenu = true;
            this.chatLayers = {
                'construction-safety': { bShow: false, isMinimized: false, size: 'mini' },
                'risk-assessment': { bShow: false, isMinimized: false, size: 'mini' },
                'tax-ai': { bShow: false, isMinimized: false, size: 'mini' },
                'site-ai': { bShow: false, isMinimized: false, size: 'mini' }
            };
            this.minimizedChatbots = [];
            this.transparency = {
                'construction-safety': 100,
                'risk-assessment': 100,
                'tax-ai': 100,
                'site-ai': 100
            };
            // 채팅별 메시지 최대 30개 보관
            this.messages = {
                'construction-safety': [],
                'risk-assessment': [],
                'tax-ai': [],
                'site-ai': []
            };

            // Event handler binding for proper 'this' context and cleanup
            this.handleInputChange = this.handleInputChange.bind(this);
            this.handleKeydown = this.handleKeydown.bind(this);
            this.handleSendClick = this.handleSendClick.bind(this);
            this.handleHeaderClick = this.handleHeaderClick.bind(this);

            this.init();
        }

        /**
         * <pre>
         * [초기화]
         * </pre>
         */
        init() {
            this.loadState();
            
            // 마이크 권한 상태 로드
            const savedPermission = localStorage.getItem('micPermissionGranted');
            if (savedPermission === 'true') {
                this.micPermissionGranted = true;
            }
            
            // CSS 스타일 동적 생성
            this.createStyles();
            
            // 필요한 HTML 요소들 동적 생성
            this.createRequiredElements();
            
            // Material Design Icons 동적 로드
            this.loadMaterialDesignIcons();
            
            // 이벤트 리스너 설정 (아이콘 로드와 무관)
            this.setupEventListeners();
        }

        /**
         * <pre>
         * [Material Design Icons 동적 로드]
         * </pre>
         */
        loadMaterialDesignIcons() {
            // 이미 로드된 경우 중복 로드 방지
            if (document.querySelector('link[href*="materialdesignicons"]')) {
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css';
            link.crossOrigin = 'anonymous';
            
            // 로드 완료 후 콜백 실행
            link.onload = () => {
                console.log('Material Design Icons 로드 완료');
                // 아이콘 로드 완료 후 UI 렌더링
                this.renderFloatingMenu();
                this.updateMinimizedChatbots();
            };
            
            link.onerror = () => {
                console.error('Material Design Icons 로드 실패');
                // 로드 실패해도 기본 기능은 동작하도록
                this.renderFloatingMenu();
                this.updateMinimizedChatbots();
            };
            
            document.head.appendChild(link);
        }

        /**
         * <pre>
         * [CSS 스타일 동적 생성]
         * </pre>
         */
        createStyles() {
            if (document.getElementById('chatbot-styles')) {
                return; // 이미 생성된 경우 중복 생성 방지
            }

            const style = document.createElement('style');
            style.id = 'chatbot-styles';
            style.textContent = `
                /* AI 건설안전 전문가 챗봇 - 동적 CSS 스타일 */

                /* 기본 리셋 및 폰트 */
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                body {
                    font-family: 'Malgun Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #212121;
                    background-color: #f5f5f5;
                    overflow-x: hidden;
                }

                /* 메인 컨테이너 */
                .main-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .content-area {
                    width: 100%;
                    max-width: 600px;
                }

                .welcome-card {
                    background: white;
                    border-radius: 16px;
                    padding: 48px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .welcome-title {
                    font-size: 28px;
                    font-weight: 600;
                    color: #212121;
                    margin-bottom: 24px;
                }

                .welcome-text {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 12px;
                }

                /* 플로팅 메뉴 */
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
                    width: 240px;
                    min-width: 240px;
                    max-width: 240px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    min-height: 48px;
                    background: #fff;
                    color: #222;
                    border-radius: 999px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 1.08rem;
                    font-weight: 600;
                    margin-bottom: 18px;
                    padding: 0 22px;
                    cursor: pointer;
                    outline: none;
                    border: 2px solid #222; /* 기본값, 동적으로 border-color 오버라이드 */
                    box-shadow: none;
                    transition: background 0.18s, color 0.18s, border 0.18s;
                }

                .pill-menu-btn:last-child {
                    margin-bottom: 0;
                }

                .pill-menu-btn:hover, .pill-menu-btn:focus {
                    background: #f5f5f5;
                    color: #111;
                    /* 테두리 색상은 인라인 스타일 유지 */
                }

                .pill-menu-label {
                    flex: 1;
                    text-align: left;
                    font-size: 1.08rem;
                    font-weight: 600;
                    letter-spacing: 0.01em;
                }

                .pill-menu-icon {
                    color: #222;
                    margin-left: 16px;
                    font-size: 24px;
                }

                .pill-minimize-btn {
                    background: #fff !important;
                    color: #222 !important;
                    border-radius: 50%;
                    box-shadow: none;
                    margin-top: 10px;
                    transition: background 0.18s, color 0.18s, border 0.18s;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    border: 2px solid #222 !important;
                    cursor: pointer;
                }

                .pill-minimize-btn:hover, .pill-minimize-btn:focus {
                    background: #f5f5f5 !important;
                    color: #111 !important;
                    border: 2px solid #111 !important;
                }

                .pill-minimize-btn .mdi {
                    color: #222 !important;
                    font-size: 28px;
                }

                /* 로봇 아이콘 버튼 */
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
                    background: #fff;
                    color: #222;
                    padding: 0;
                    border: 2px solid #222;
                    box-shadow: none;
                    transition: background 0.18s, color 0.18s, border 0.18s;
                    cursor: pointer;
                }

                .floating-robot-btn:hover, .floating-robot-btn:focus {
                    background: #f5f5f5;
                    color: #111;
                    border: 2px solid #111;
                }

                .floating-robot-btn .mdi {
                    color: #222;
                    font-size: 2rem;
                }

                @media (max-width: 768px) {
                    .floating-robot-btn {
                        right: 10px;
                        bottom: 10px;
                    }
                }

                /* 채팅 레이어 */
                .chat-layer {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    overflow: hidden;
                    z-index: 2000;
                    display: none;
                    flex-direction: column;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .chat-layer.show {
                    display: flex;
                }

                .chat-layer.mini {
                    width: 780px;
                    height: 650px;
                }

                .chat-layer.mid {
                    width: 1200px;
                    height: 650px;
                }

                .chat-layer.max {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100vw;
                    height: 100vh;
                    border-radius: 0;
                }

                /* 채팅 헤더 */
                .chat-header {
                    padding: 16px;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-height: 68px;
                }

                .chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .chat-avatar {
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                }

                .chat-title {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0;
                }

                .chat-status {
                    font-size: 14px;
                    opacity: 0.8;
                    margin: 0;
                }

                .chat-header-controls {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .chat-header-btn {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 4px;
                    transition: background 0.2s;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chat-header-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .chat-close-btn {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 4px;
                    transition: background 0.2s;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chat-close-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                /* 채팅 메시지 영역 */
                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    height: 500px;
                    max-height: 500px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                /* 메시지 스타일 */
                .message {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    max-width: 100%;
                }

                .message.bot {
                    justify-content: flex-start;
                }

                .message.user {
                    justify-content: flex-end;
                    flex-direction: row-reverse;
                }

                /* 봇 메시지 */
                .modern-bot-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    background: transparent;
                    border: none;
                    max-width: 80%;
                    min-width: 200px;
                    box-shadow: none;
                    overflow: hidden;
                    justify-content: flex-start;
                }

                .modern-bot-icon {
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

                .modern-bot-icon .mdi {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .modern-bot-content {
                    border-radius: 12px;
                    padding: 16px 18px;
                    position: relative;
                    flex: 1;
                    min-width: 150px;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    overflow-x: hidden;
                    max-width: 80%;
                }

                .modern-bot-content::after {
                    content: '';
                    position: absolute;
                    left: -8px;
                    top: 12px;
                    width: 0;
                    height: 0;
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-right: 8px solid;
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
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                }

                .modern-copy-btn.bottom-right:hover {
                    background: rgba(255,255,255,0.1);
                }

                /* 사용자 메시지 */
                .modern-user-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    background: transparent;
                    border: none;
                    max-width: 80%;
                    min-width: 250px;
                    box-shadow: none;
                    overflow: hidden;
                    justify-content: flex-end;
                    flex-direction: row-reverse;
                    margin-left: auto;
                }

                .modern-user-icon {
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

                .modern-user-icon .mdi {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .modern-user-content {
                    border-radius: 12px;
                    padding: 16px 18px;
                    position: relative;
                    flex: 1;
                    min-width: 200px;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    overflow-x: hidden;
                    max-width: 80%;
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
                    border-left: 8px solid;
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

                /* 하단 구분선 */
                .modern-bottom-divider {
                    width: 100%;
                    height: 1px;
                    background: #e0e0e0;
                    margin: 0;
                }

                /* 채팅 입력 영역 */
                .chat-input-area {
                    padding: 8px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-height: 36px;
                    background: white;
                }

                .chat-input {
                    flex: 1;
                    border: 1px solid #e0e0e0;
                    border-radius: 24px;
                    padding: 16px 16px;
                    font-size: 14px;
                    resize: none;
                    outline: none;
                    font-family: inherit;
                    line-height: 1.4;
                    min-height: 44px;
                    max-height: 120px;
                    overflow-y: auto;
                }

                .chat-input:focus {
                    border-color: #1976d2;
                    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
                }

                /* 투명도 조절 */
                .transparency-control {
                    display: flex;
                    align-items: center;
                    margin-right: 8px;
                }

                .transparency-slider {
                    width: 80px;
                    height: 4px;
                    border-radius: 2px;
                    background: #e0e0e0;
                    outline: none;
                    -webkit-appearance: none;
                    appearance: none;
                    cursor: pointer;
                }

                .transparency-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--slider-thumb-color, #1976d2);
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .transparency-slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--slider-thumb-color, #1976d2);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .transparency-slider:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
                }

                /* 마이크 버튼 */
                .chat-mic-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    transition: background 0.2s;
                }

                .chat-mic-btn:hover {
                    background: rgba(0, 0, 0, 0.05);
                }

                /* 전송 버튼 */
                .chat-send-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    transition: background 0.2s;
                }

                .chat-send-btn:hover {
                    background: rgba(0, 0, 0, 0.05);
                }

                .chat-send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* 최소화된 채팅창 */
                .minimized-chatbot {
                    position: fixed;
                    width: 240px;
                    min-width: 240px;
                    max-width: 240px;
                    height: 50px;
                    right: 24px;
                    bottom: 24px;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    z-index: 1000;
                }

                .minimized-chatbot:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
                }

                .minimized-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 16px;
                    height: 100%;
                }

                .minimized-text {
                    color: white;
                    font-size: 14px;
                    font-weight: 500;
                    margin: 0 8px;
                    flex: 1;
                    text-align: center;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* 알림 스타일 */
                .chatbot-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #323232;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 4px;
                    font-size: 14px;
                    z-index: 9999;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                /* 반응형 디자인 */
                @media (max-width: 768px) {
                    .chat-layer.mini {
                        width: calc(100vw - 32px);
                        height: calc(100vh - 100px);
                        right: 16px;
                        bottom: 16px;
                    }
                    
                    .chat-layer.mid {
                        width: calc(100vw - 32px);
                        height: calc(100vh - 100px);
                        right: 16px;
                        bottom: 16px;
                    }
                    
                    .chat-layer.max {
                        width: 100vw;
                        height: 100vh;
                        right: 0;
                        bottom: 0;
                    }
                    
                    .minimized-chatbot {
                        width: 240px;
                        min-width: 240px;
                        max-width: 240px;
                        height: 50px;
                        right: 16px;
                        bottom: 16px;
                    }
                    
                    .minimized-content {
                        padding: 8px 12px;
                    }
                    
                    .minimized-text {
                        font-size: 12px;
                    }
                    
                    .chat-input-area {
                        padding: 4px 12px;
                        gap: 8px;
                    }
                    
                    .transparency-slider {
                        width: 60px;
                    }
                }

                /* 접근성 개선 */
                @media (prefers-reduced-motion: reduce) {
                    .chat-layer,
                    .minimized-chatbot,
                    .chatbot-notification {
                        transition: none;
                        animation: none;
                    }
                }

                /* 고대비 모드 지원 */
                @media (prefers-contrast: high) {
                    .chat-input {
                        border-width: 2px;
                    }
                    
                    .modern-bot-divider,
                    .modern-user-divider,
                    .modern-bottom-divider {
                        height: 2px;
                    }
                }

                /* 다크 모드 지원 */
                @media (prefers-color-scheme: dark) {
                    body {
                        background-color: #121212;
                        color: #ffffff;
                    }
                    
                    .welcome-card {
                        background: #1e1e1e;
                        color: #ffffff;
                    }
                    
                    .chat-input {
                        background: #2d2d2d;
                        color: #ffffff;
                        border-color: #404040;
                    }
                    
                    .chat-input:focus {
                        border-color: #64b5f6;
                        box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.2);
                    }
                }

                /* 최대화 시 입력창/메시지 영역 개선 */
                .chat-layer.max .chat-input-area {
                    padding: 4px 8px;
                    min-height: 32px;
                }
                .chat-layer.max .chat-messages {
                    height: auto;
                    max-height: none;
                    flex: 1 1 0%;
                    min-height: 0;
                }

                .minimized-close-btn {
                    background: transparent;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    margin-left: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2px;
                    border-radius: 50%;
                    transition: background 0.15s;
                }
                .minimized-close-btn .mdi {
                    color: #fff;
                    font-size: 16px;
                    transition: color 0.15s;
                }
                .minimized-close-btn:hover, .minimized-close-btn:focus {
                    background: rgba(255,0,0,0.08);
                }
                .minimized-close-btn:hover .mdi, .minimized-close-btn:focus .mdi {
                    color: #e53935;
                }
            `;
            document.head.appendChild(style);
        }

        /**
         * <pre>
         * [필요한 HTML 요소들 동적 생성]
         * </pre>
         */
        createRequiredElements() {
            // 메인 컨테이너 생성
            if (!document.querySelector('.main-container')) {
                const mainContainer = document.createElement('div');
                mainContainer.className = 'main-container';
                mainContainer.innerHTML = `
                    <div class="content-area">
                        <div class="welcome-card">
                            <h1 class="welcome-title">AI 건설안전 전문가 챗봇</h1>
                            <p class="welcome-text">플로팅 메뉴가 화면 우측에 표시됩니다.</p>
                            <p class="welcome-text">각 버튼을 클릭하여 기능을 테스트해보세요.</p>
                        </div>
                    </div>
                `;
                document.body.appendChild(mainContainer);
            }

            // 플로팅 메뉴 컨테이너 생성
            if (!document.getElementById('floating-menu')) {
                const floatingMenu = document.createElement('div');
                floatingMenu.id = 'floating-menu';
                floatingMenu.className = 'floating-menu pill-menu';
                document.body.appendChild(floatingMenu);
            }

            // 로봇 아이콘 버튼 생성
            if (!document.getElementById('floating-robot-btn')) {
                const robotBtn = document.createElement('button');
                robotBtn.id = 'floating-robot-btn';
                robotBtn.className = 'floating-robot-btn';
                robotBtn.style.display = 'none';
                robotBtn.innerHTML = '<i class="mdi mdi-menu"></i>';
                document.body.appendChild(robotBtn);
            }

            // 채팅 레이어 컨테이너 생성
            if (!document.getElementById('chat-layers-container')) {
                const chatLayersContainer = document.createElement('div');
                chatLayersContainer.id = 'chat-layers-container';
                document.body.appendChild(chatLayersContainer);
            }

            // 최소화된 채팅창 컨테이너 생성
            if (!document.getElementById('minimized-chatbots-container')) {
                const minimizedChatbotsContainer = document.createElement('div');
                minimizedChatbotsContainer.id = 'minimized-chatbots-container';
                document.body.appendChild(minimizedChatbotsContainer);
            }
        }

        /**
         * <pre>
         * [플로팅 메뉴 렌더링]
         * </pre>
         */
        renderFloatingMenu() {
            const menuContainer = document.getElementById('floating-menu');
            const robotBtn = document.getElementById('floating-robot-btn');

            if (this.bShowFloatingMenu) {
                menuContainer.style.display = 'flex';
                robotBtn.style.display = 'none';

                const menuItems = [
                    { id: 'construction-ai', label: '건설안전', icon: 'mdi-robot', action: 'construction-ai', theme: 'construction-safety' },
                    { id: 'risk-ai', label: '위험성평가', icon: 'mdi-shield-check', action: 'risk-ai', theme: 'risk-assessment' },
                    { id: 'tax-ai', label: '세금계산서', icon: 'mdi-calculator', action: 'tax-ai', theme: 'tax-ai' },
                    { id: 'site-ai', label: '현장개통/해지', icon: 'mdi-office-building', action: 'site-ai', theme: 'site-ai' }
                ];

                menuContainer.innerHTML = `
                    ${menuItems.map(item => {
                        const config = this.getChatConfig(item.theme);
                        return `
                        <div class="pill-menu-btn" onclick="window.chatbotApp.handleMenuClick('${item.action}')" tabindex="0" role="button" aria-label="${item.label}" style="border-color: ${config.headerColor};">
                            <span class="pill-menu-label">${item.label}</span>
                            <i class="mdi ${item.icon} pill-menu-icon"></i>
                        </div>
                        `;
                    }).join('')}
                    <div class="d-flex justify-center align-center mt-4">
                        <button class="pill-minimize-btn" onclick="window.chatbotApp.handleMinimize()" aria-label="최소화">
                            <i class="mdi mdi-minus" style="font-size: 28px;"></i>
                        </button>
                    </div>
                `;
            } else {
                menuContainer.style.display = 'none';
                robotBtn.style.display = 'flex';
            }
        }

        /**
         * <pre>
         * [메뉴 클릭 핸들러]
         * </pre>
         * 
         * @param {string} action 클릭된 메뉴 액션
         */
        handleMenuClick(action) {
            console.log('메뉴 클릭:', action);
            const chatTypeMap = {
                'construction-ai': 'construction-safety',
                'risk-ai': 'risk-assessment',
                'tax-ai': 'tax-ai',
                'site-ai': 'site-ai'
            };
            
            const chatType = chatTypeMap[action];
            if (chatType) {
                this.openChatLayer(chatType);
            }
        }

        /**
         * <pre>
         * [채팅 레이어 열기]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         */
        openChatLayer(type) {
            // 최소화된 상태라면 복구만 하고 새로 만들지 않음
            if (this.chatLayers[type].isMinimized) {
                this.restoreChatLayer(type);
                return;
            }
            this.chatLayers[type].bShow = true;
            this.chatLayers[type].isMinimized = false;
            this.createChatLayer(type);
            this.saveState();
        }

        /**
         * <pre>
         * [채팅 레이어 생성 - 메시지 복원 지원]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         */
        createChatLayer(type) {
            const container = document.getElementById('chat-layers-container');
            const existingLayer = container.querySelector(`[data-chat-type="${type}"]`);
            
            if (existingLayer) {
                existingLayer.remove();
            }

            const config = this.getChatConfig(type);
            const chatLayer = document.createElement('div');
            chatLayer.className = `chat-layer ${this.chatLayers[type].size}`;
            chatLayer.setAttribute('data-chat-type', type);
            chatLayer.style.display = 'flex';
            chatLayer.style.zIndex = '2000'; // 항상 최상위

            // 투명도 슬라이더 thumb 색상 동적 적용
            const sliderThumbColor = config.headerColor;
            const sliderStyle = `--slider-thumb-color: ${sliderThumbColor};`;

            // 메시지 복원
            let messagesHTML = '';
            if (this.messages[type] && this.messages[type].length > 0) {
                for (const msg of this.messages[type]) {
                    if (msg.role === 'user') {
                        messagesHTML += `
                        <div class="message user">
                            <div class="modern-user-card">
                                <div class="modern-user-content" style="background: ${config.userMessageColor};">
                                    <div class="modern-user-text">${msg.text}</div>
                                    <div class="modern-user-divider"></div>
                                    <div class="modern-user-bottom">
                                        <span class="modern-user-time">${msg.time}</span>
                                        <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${msg.text.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                                            <i class="mdi mdi-content-copy" style="font-size: 16px; color: white;"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="modern-user-icon" style="background: ${config.userMessageColor};">
                                    <i class="mdi mdi-account" style="color: white; font-size: 20px;"></i>
                                </div>
                            </div>
                        </div>
                        `;
                    } else {
                        messagesHTML += `
                        <div class="message bot">
                            <div class="modern-bot-icon" style="background: ${config.botMessageColor};">
                                <i class="mdi mdi-robot" style="color: white; font-size: 20px;"></i>
                            </div>
                            <div class="modern-bot-content" style="background: ${config.botMessageColor};">
                                <div class="modern-bot-text">${msg.text}</div>
                                <div class="modern-bot-divider"></div>
                                <div class="modern-bot-bottom">
                                    <span class="modern-bot-time">${msg.time}</span>
                                    <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${msg.text.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                                        <i class="mdi mdi-content-copy" style="font-size: 16px; color: white;"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                }
            } else {
                // welcome message만 표시
                messagesHTML = `
                    <div class="message bot">
                        <div class="modern-bot-icon" style="background: ${config.botMessageColor};">
                            <i class="mdi mdi-robot" style="color: white; font-size: 20px;"></i>
                        </div>
                        <div class="modern-bot-content" style="background: ${config.botMessageColor};">
                            <div class="modern-bot-text">${config.welcomeMessage}</div>
                            <div class="modern-bot-divider"></div>
                            <div class="modern-bot-bottom">
                                <span class="modern-bot-time">${this.getCurrentTime()}</span>
                                <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${config.welcomeMessage.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                                    <i class="mdi mdi-content-copy" style="font-size: 16px; color: white;"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            chatLayer.innerHTML = `
                <div class="chat-header" style="background: ${config.headerColor};">
                    <div class="chat-header-info">
                        <div class="chat-avatar" style="background: ${config.headerColor};">
                            <i class="mdi mdi-robot" style="color: white; font-size: 20px;"></i>
                        </div>
                        <div>
                            <h3 class="chat-title" style="color: white; margin: 0; font-size: 20px; font-weight: 600;">${config.title}</h3>
                            <p class="chat-status" style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">온라인 상담 중</p>
                        </div>
                    </div>
                    <div class="chat-header-controls">
                        <button class="chat-header-btn" onclick="window.chatbotApp.minimizeChatLayer('${type}')" aria-label="최소화">
                            <i class="mdi mdi-minus" style="color: white; font-size: 18px;"></i>
                        </button>
                        <button class="chat-header-btn" onclick="window.chatbotApp.resizeChatLayer('${type}', 'mini')" aria-label="작게">
                            <i class="mdi mdi-arrow-collapse" style="color: white; font-size: 18px;"></i>
                        </button>
                        <button class="chat-header-btn" onclick="window.chatbotApp.resizeChatLayer('${type}', 'mid')" aria-label="중간 크기">
                            <i class="mdi mdi-arrow-expand-horizontal" style="color: white; font-size: 18px;"></i>
                        </button>
                        <button class="chat-header-btn" onclick="window.chatbotApp.resizeChatLayer('${type}', 'max')" aria-label="최대화">
                            <i class="mdi mdi-arrow-expand-all" style="color: white; font-size: 18px;"></i>
                        </button>
                        <button class="chat-close-btn" onclick="window.chatbotApp.closeChatLayer('${type}')" aria-label="닫기">
                            <i class="mdi mdi-close" style="color: white; font-size: 18px;"></i>
                        </button>
                    </div>
                </div>
                <div class="chat-messages">
                    ${messagesHTML}
                </div>
                <div class="modern-bottom-divider"></div>
                <div class="chat-input-area">
                    <textarea class="chat-input" placeholder="${config.placeholder}" rows="1"></textarea>
                    <div class="transparency-control">
                        <input type="range" min="90" max="100" value="${this.transparency[type]}" 
                               class="transparency-slider" 
                               onchange="window.chatbotApp.updateTransparency('${type}', this.value)"
                               oninput="window.chatbotApp.updateTransparency('${type}', this.value)"
                               style="width: 80px; ${sliderStyle}">
                    </div>
                    <button class="chat-mic-btn" onclick="window.chatbotApp.toggleMic('${type}')" aria-label="음성 입력">
                        <i class="mdi mdi-microphone-outline" style="font-size: 26px; color: ${config.headerColor};"></i>
                    </button>
                    <button class="chat-send-btn" onclick="window.chatbotApp.sendMessage('${type}')" aria-label="전송">
                        <i class="mdi mdi-send" style="font-size: 20px; color: ${config.headerColor};"></i>
                    </button>
                </div>
            `;

            container.appendChild(chatLayer);
            this.setupChatLayerEvents(chatLayer, type);
            
            // 초기 투명도 적용
            this.updateTransparency(type, this.transparency[type]);
            
            // 오디오 장치 선택기 추가 (권한이 있는 경우)
            if (this.micPermissionGranted) {
                // this.createAudioDeviceSelector(type); // 삭제됨
            }
        }

        /**
         * <pre>
         * [채팅 설정 가져오기]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         * @returns {Object} 채팅 설정
         */
        getChatConfig(type) {
            const configs = {
                'construction-safety': {
                    title: '건설안전 전문가',
                    headerColor: '#c53030',
                    botMessageColor: '#dc2626',
                    userMessageColor: '#ff6b35',
                    placeholder: '건설안전, 건설법 등 궁금한 것을 물어보세요...',
                    welcomeMessage: '안녕하세요? 저는 건설안전 전문가입니다.\n\n오늘 작업장소와 작업공종을 알려주시면 위험요인과 안전대책을 알려드리겠습니다.\n\n(예시: 서울에서 지하 3층: 방수 및 미장 작업, 지상 7층: 철근콘크리트를 위한 형틀설치, 철근배근, 전선관배관 작업을 타워크레인을 이용해서 진행합니다)'
                },
                'risk-assessment': {
                    title: '위험성평가 전문가',
                    headerColor: '#1976d2',
                    botMessageColor: '#2196f3',
                    userMessageColor: '#ff9800',
                    placeholder: '위험성평가에 대해 궁금한 것을 물어보세요...',
                    welcomeMessage: '안녕하세요? 저는 위험성평가 전문가입니다.\n\n작업장소와 작업공종을 알려주시면 해당 작업의 위험요인을 분석하고 평가 방법을 안내해드리겠습니다.\n\n위험성평가는 작업 전 필수 절차로, 안전한 작업 환경을 조성하는 데 중요한 역할을 합니다.'
                },
                'tax-ai': {
                    title: '세금계산서 A.I',
                    headerColor: '#ff9800',
                    botMessageColor: '#ff8f00',
                    userMessageColor: '#4caf50',
                    placeholder: '세금계산서에 대해 궁금한 것을 물어보세요...',
                    welcomeMessage: '안녕하세요? 저는 세금계산서 A.I입니다.\n\n세금계산서 작성과 관련된 질문을 해주세요. 부가가치세, 소득세, 법인세 등 다양한 세무 업무를 도와드릴 수 있습니다.\n\n구체적인 상황을 알려주시면 더 정확한 안내를 제공해드리겠습니다.'
                },
                'site-ai': {
                    title: '현장개통/해지 전문가',
                    headerColor: '#4caf50',
                    botMessageColor: '#45a049',
                    userMessageColor: '#2196f3',
                    placeholder: '현장개통/해지에 대해 궁금한 것을 물어보세요...',
                    welcomeMessage: '안녕하세요? 저는 현장개통/해지 전문가입니다.\n\n현장개통과 해지 절차에 대해 안내해드리겠습니다.\n\n현장개통은 새로운 건설현장을 시작할 때 필요한 절차이며, 해지는 작업 완료 후 현장을 정리하는 절차입니다.\n\n어떤 부분에 대해 궁금하신가요?'
                }
            };
            return configs[type] || configs['construction-safety'];
        }

        /**
         * <pre>
         * [채팅 레이어 이벤트 설정]
         * </pre>
         * 
         * @param {HTMLElement} chatLayer 채팅 레이어 요소
         * @param {string} type 채팅 타입
         */
        setupChatLayerEvents(chatLayer, type) {
            const input = chatLayer.querySelector('.chat-input');
            const sendBtn = chatLayer.querySelector('.chat-send-btn');
            const messagesContainer = chatLayer.querySelector('.chat-messages');

            // Input events using bound handlers
            input.addEventListener('input', this.handleInputChange);
            input.addEventListener('keydown', this.handleKeydown);

            // Send button click using bound handler
            sendBtn.addEventListener('click', this.handleSendClick);

            // Message copy functionality
            messagesContainer.addEventListener('click', (e) => {
                const copyBtn = e.target.closest('.modern-copy-btn');
                if (copyBtn) {
                    const messageContent = copyBtn.closest('.message').querySelector('.modern-bot-text, .modern-user-text').textContent;
                    this.copyToClipboard(messageContent);
                    this.showNotification('메시지가 복사되었습니다.');
                }
            });
        }

        /**
         * <pre>
         * [메시지 전송]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         */
        sendMessage(type) {
            const chatLayer = document.querySelector(`[data-chat-type="${type}"]`);
            if (!chatLayer) return;

            const input = chatLayer.querySelector('.chat-input');
            const messagesContainer = chatLayer.querySelector('.chat-messages');
            const message = input.value.trim();
            
            if (!message) return;

            const config = this.getChatConfig(type);
            // 메시지 배열에 추가 (최대 30개 유지)
            if (!this.messages[type]) this.messages[type] = [];
            this.messages[type].push({ role: 'user', text: message, time: this.getCurrentTime() });
            if (this.messages[type].length > 30) this.messages[type].shift();

            // User message (오른쪽 정렬, modern-user-card 구조)
            const userMessage = document.createElement('div');
            userMessage.className = 'message user';
            userMessage.innerHTML = `
                <div class="modern-user-card">
                    <div class="modern-user-content" style="background: ${config.userMessageColor};">
                        <div class="modern-user-text">${message}</div>
                        <div class="modern-user-divider"></div>
                        <div class="modern-user-bottom">
                            <span class="modern-user-time">${this.getCurrentTime()}</span>
                            <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${message.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                                <i class="mdi mdi-content-copy" style="font-size: 16px; color: white;"></i>
                            </button>
                        </div>
                    </div>
                    <div class="modern-user-icon" style="background: ${config.userMessageColor};">
                        <i class="mdi mdi-account" style="color: white; font-size: 20px;"></i>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(userMessage);

            // Clear input
            input.value = '';

            // Simulate AI response
            setTimeout(() => {
                this.simulateAIResponse(chatLayer, type, message);
            }, 1000);

            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        /**
         * <pre>
         * [AI 응답 시 메시지 배열에 추가]
         * </pre>
         */
        simulateAIResponse(chatLayer, type, userMessage) {
            const messagesContainer = chatLayer.querySelector('.chat-messages');
            const config = this.getChatConfig(type);
            
            let response = '';
            const lowerMessage = userMessage.toLowerCase();

            // Type-specific responses
            if (type === 'construction-safety') {
                if (lowerMessage.includes('서울') && (lowerMessage.includes('지하 3층') || lowerMessage.includes('지상 7층'))) {
                    response = `오늘 서울에서 진행되는 작업에 대한 안전 점검을 시작합니다.\n\n1. 작업장소 및 작업공종 확인\n• 지하 3층: 방수 및 타설공사\n• 지상 7층: 철근콘크리트 거푸집 설치, 철근 배근, 전선관 배관공사\n• 사용장비: 타워크레인\n\n2. 위험요인 및 안전대책\n\n【지하 3층 (방수 및 타설공사)】\n위험요인: 밀폐공간 유해물질, 미끄러운 바닥, 전기설비 사용 시 감전\n안전대책: 분진마스크 착용, 지속적인 환기, 미끄럼방지 신발, 전기안전 점검\n\n【지상 7층 (거푸집, 철근, 전선관 배관)】\n위험요인: 고소작업 시 추락, 낙하/비래물, 타워크레인 충돌\n안전대책: 안전띠, 안전모 필수 착용, 안전난간 설치, 타워크레인 사전 점검`;
                } else {
                    response = `안녕하세요! 건설안전 전문가입니다.\n\n작업장소와 작업공종을 구체적으로 알려주시면 해당 작업에 맞는 위험요인과 안전대책을 상세히 안내해드리겠습니다.\n\n예시: "서울에서 지하 3층: 방수 및 미장 작업, 지상 7층: 철근콘크리트를 위한 형틀설치, 철근배근, 전선관배관 작업을 타워크레인을 이용해서 진행합니다"`;
                }
            } else if (type === 'risk-assessment') {
                response = `안녕하세요! 위험성평가 전문가입니다.\n\n작업장소와 작업공종을 알려주시면 해당 작업의 위험요인을 분석하고 평가 방법을 안내해드리겠습니다.\n\n위험성평가는 작업 전 필수 절차로, 안전한 작업 환경을 조성하는 데 중요한 역할을 합니다.`;
            } else if (type === 'tax-ai') {
                response = `안녕하세요! 세금계산서 A.I입니다.\n\n세금계산서 작성과 관련된 질문을 해주세요. 부가가치세, 소득세, 법인세 등 다양한 세무 업무를 도와드릴 수 있습니다.\n\n구체적인 상황을 알려주시면 더 정확한 안내를 제공해드리겠습니다.`;
            } else if (type === 'site-ai') {
                response = `안녕하세요! 현장개통/해지 전문가입니다.\n\n현장개통과 해지 절차에 대해 안내해드리겠습니다.\n\n현장개통은 새로운 건설현장을 시작할 때 필요한 절차이며, 해지는 작업 완료 후 현장을 정리하는 절차입니다.\n\n어떤 부분에 대해 궁금하신가요?`;
            }

            // Bot message
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.innerHTML = `
                <div class="modern-bot-icon" style="background: ${config.botMessageColor};">
                    <i class="mdi mdi-robot" style="color: white; font-size: 20px;"></i>
                </div>
                <div class="modern-bot-content" style="background: ${config.botMessageColor};">
                    <div class="modern-bot-text">${response}</div>
                    <div class="modern-bot-divider"></div>
                    <div class="modern-bot-bottom">
                        <span class="modern-bot-time">${this.getCurrentTime()}</span>
                        <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${response.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                            <i class="mdi mdi-content-copy" style="font-size: 16px; color: white;"></i>
                        </button>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(botMessage);
            // 메시지 배열에 추가 (최대 30개 유지)
            if (!this.messages[type]) this.messages[type] = [];
            this.messages[type].push({ role: 'bot', text: response, time: this.getCurrentTime() });
            if (this.messages[type].length > 30) this.messages[type].shift();

            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        /**
         * <pre>
         * [채팅 레이어 최소화]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         */
        minimizeChatLayer(type) {
            this.chatLayers[type].isMinimized = true;
            this.chatLayers[type].bShow = false;
            
            // Remove chat layer from DOM
            const chatLayer = document.querySelector(`[data-chat-type="${type}"]`);
            if (chatLayer) {
                chatLayer.remove();
            }
            
            // Add to minimized list
            if (!this.minimizedChatbots.includes(type)) {
                this.minimizedChatbots.push(type);
            }
            
            this.updateMinimizedChatbots();
            this.saveState();
        }

        /**
         * <pre>
         * [채팅 레이어 크기 조절]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         * @param {string} size 크기 (mini, mid, max)
         */
        resizeChatLayer(type, size) {
            this.chatLayers[type].size = size;
            const chatLayer = document.querySelector(`[data-chat-type="${type}"]`);
            if (chatLayer) {
                chatLayer.className = `chat-layer ${size}`;
            }
            this.saveState();
        }

        /**
         * <pre>
         * [채팅 레이어 닫기]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         */
        closeChatLayer(type) {
            this.chatLayers[type].bShow = false;
            this.chatLayers[type].isMinimized = false;
            
            // Remove from minimized list
            const index = this.minimizedChatbots.indexOf(type);
            if (index > -1) {
                this.minimizedChatbots.splice(index, 1);
            }
            
            const chatLayer = document.querySelector(`[data-chat-type="${type}"]`);
            if (chatLayer) {
                chatLayer.remove();
            }
            
            this.updateMinimizedChatbots();
            this.saveState();
        }

        /**
         * <pre>
         * [최소화된 채팅창 위치 업데이트]
         * </pre>
         */
        updateMinimizedPositions() {
            const minimizedChatbots = document.querySelectorAll('.minimized-chatbot');
            const slotPositions = {
                slot1: 200,
                slot2: 416,
                slot3: 632,
                slot4: 848
            };

            minimizedChatbots.forEach((chatbot, index) => {
                const slotNumber = index + 1;
                let rightPosition;
                
                switch (slotNumber) {
                    case 1:
                        rightPosition = slotPositions.slot1;
                        break;
                    case 2:
                        rightPosition = slotPositions.slot2;
                        break;
                    case 3:
                        rightPosition = slotPositions.slot3;
                        break;
                    case 4:
                        rightPosition = slotPositions.slot4;
                        break;
                    default:
                        rightPosition = slotPositions.slot1;
                }

                chatbot.style.right = `${rightPosition}px`;
                chatbot.style.bottom = '24px';
                chatbot.style.width = '200px';
                chatbot.style.height = '60px';
            });
        }

        /**
         * <pre>
         * [최소화된 채팅창 생성]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         */
        createMinimizedChatbot(type) {
            const container = document.getElementById('minimized-chatbots-container');
            const existingMinimized = container.querySelector(`[data-minimized-type="${type}"]`);
            
            if (existingMinimized) {
                existingMinimized.remove();
            }

            const config = this.getChatConfig(type);
            // 최소화 버튼 타이틀 변경
            const minimizedTitles = {
                'construction-safety': '건설안전 상담',
                'risk-assessment': '위험성평가 상담',
                'tax-ai': '세금계산서 상담',
                'site-ai': '현장개통/해지 상담'
            };
            const minimizedTitle = minimizedTitles[type] || config.title;

            const minimizedChatbot = document.createElement('div');
            minimizedChatbot.className = 'minimized-chatbot';
            minimizedChatbot.setAttribute('data-minimized-type', type);
            minimizedChatbot.style.zIndex = '1000'; // 채팅창보다 아래, 플로팅 메뉴보다 위
            minimizedChatbot.style.background = `linear-gradient(135deg, ${config.headerColor} 0%, ${this.darkenColor(config.headerColor, 20)} 100%)`;

            minimizedChatbot.innerHTML = `
                <div class="minimized-content">
                    <i class="mdi mdi-robot" style="color: white; font-size: 24px;"></i>
                    <span class="minimized-text">${minimizedTitle}</span>
                    <i class="mdi mdi-chevron-up restore-btn" style="color: white; font-size: 20px; cursor:pointer;"></i>
                    <button class="minimized-close-btn" title="닫기" tabindex="0" aria-label="닫기">
                        <i class="mdi mdi-close"></i>
                    </button>
                </div>
            `;

            // 복원 버튼 클릭(chevron-up)
            minimizedChatbot.querySelector('.restore-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.restoreChatLayer(type);
            });
            // 닫기 버튼 클릭(X)
            minimizedChatbot.querySelector('.minimized-close-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                // 최소화 리스트에서 제거 및 DOM에서 삭제
                const idx = this.minimizedChatbots.indexOf(type);
                if (idx > -1) this.minimizedChatbots.splice(idx, 1);
                minimizedChatbot.remove();
                this.saveState();
            });
            // 전체 div 클릭(복원)
            minimizedChatbot.addEventListener('click', (e) => {
                // restore-btn, close-btn이 아닌 경우만 복원
                if (!e.target.closest('.restore-btn') && !e.target.closest('.minimized-close-btn')) {
                    this.restoreChatLayer(type);
                }
            });

            container.appendChild(minimizedChatbot);
            this.updateMinimizedPositions();
        }

        /**
         * <pre>
         * [채팅 레이어 복원]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         */
        restoreChatLayer(type) {
            this.chatLayers[type].isMinimized = false;
            this.chatLayers[type].bShow = true;
            
            // Remove from minimized list
            const index = this.minimizedChatbots.indexOf(type);
            if (index > -1) {
                this.minimizedChatbots.splice(index, 1);
            }
            
            // Remove minimized chatbot
            const minimizedChatbot = document.querySelector(`[data-minimized-type="${type}"]`);
            if (minimizedChatbot) {
                minimizedChatbot.remove();
            }
            
            // Create chat layer
            this.createChatLayer(type);
            this.updateMinimizedChatbots();
            this.saveState();
        }

        /**
         * <pre>
         * [모든 채팅 레이어 닫기]
         * </pre>
         */
        closeAllChatLayers() {
            Object.keys(this.chatLayers).forEach(type => {
                this.closeChatLayer(type);
            });
        }

        /**
         * <pre>
         * [최소화 핸들러]
         * </pre>
         */
        handleMinimize() {
            this.bShowFloatingMenu = false;
            this.renderFloatingMenu();
            // 최소화된 챗봇 버튼은 유지, closeAllMinimizedChatbots() 호출 제거
            // 모든 채팅 내역 초기화
            this.messages = {
                'construction-safety': [],
                'risk-assessment': [],
                'tax-ai': [],
                'site-ai': []
            };
            // localStorage에서도 채팅 내역 제거
            this.saveState();
        }

        /**
         * <pre>
         * [모든 최소화된 채팅창 닫기]
         * </pre>
         */
        closeAllMinimizedChatbots() {
            this.minimizedChatbots = [];
            const container = document.getElementById('minimized-chatbots-container');
            container.innerHTML = '';
        }

        /**
         * <pre>
         * [챗봇 핸들러]
         * </pre>
         */
        handleChatbot() {
            this.bShowFloatingMenu = true;
            this.renderFloatingMenu();
            this.saveState();
        }

        /**
         * <pre>
         * [현재 시간 가져오기]
         * </pre>
         * 
         * @returns {string} 현재 시간 문자열
         */
        getCurrentTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            
            return `${year}.${month}.${day} ${hours}:${minutes}`;
        }

        /**
         * <pre>
         * [상태 저장]
         * </pre>
         */
        saveState() {
            const state = {
                bShowFloatingMenu: this.bShowFloatingMenu,
                chatLayers: this.chatLayers,
                minimizedChatbots: this.minimizedChatbots,
                transparency: this.transparency,
                messages: this.messages, // 메시지 상태도 저장
                micPermissionGranted: this.micPermissionGranted // 마이크 권한 상태 저장
            };
            localStorage.setItem('chatbotState', JSON.stringify(state));
        }

        /**
         * <pre>
         * [상태 로드]
         * </pre>
         */
        loadState() {
            const savedState = localStorage.getItem('chatbotState');
            if (savedState) {
                const state = JSON.parse(savedState);
                this.bShowFloatingMenu = state.bShowFloatingMenu !== undefined ? state.bShowFloatingMenu : true;
                this.chatLayers = state.chatLayers || this.chatLayers;
                this.minimizedChatbots = state.minimizedChatbots || [];
                this.transparency = state.transparency || this.transparency;
                this.messages = state.messages || this.messages; // 메시지 상태도 로드
                this.micPermissionGranted = state.micPermissionGranted || false; // 마이크 권한 상태 로드
            }
        }

        /**
         * <pre>
         * [최소화된 채팅창 업데이트]
         * </pre>
         */
        updateMinimizedChatbots() {
            const container = document.getElementById('minimized-chatbots-container');
            container.innerHTML = '';
            
            this.minimizedChatbots.forEach((type, index) => {
                this.createMinimizedChatbot(type);
            });
        }

        /**
         * <pre>
         * [투명도 업데이트 - 원본과 동일한 계산 방식]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         * @param {number} value 투명도 값
         */
        updateTransparency(type, value) {
            this.transparency[type] = parseInt(value);
            const chatLayer = document.querySelector(`[data-chat-type="${type}"]`);
            if (chatLayer) {
                // 원본과 동일한 계산 방식: 90% = 0.1 (거의 투명), 100% = 1.0 (완전 불투명)
                const opacity = (this.transparency[type] - 90) / 10;
                chatLayer.style.opacity = Math.max(0.1, Math.min(1.0, opacity)); // 0.1 ~ 1.0 범위로 제한
            }
            this.saveState();
        }

        // 음성 인식 관련 상태
        recognitionMap = {};
        isListeningMap = {};
        micPermissionGranted = false;

        /**
         * <pre>
         * [마이크 권한 상태 확인]
         * </pre>
         * @returns {Promise<boolean>} 권한 상태
         */
        async checkMicPermission() {
            try {
                const result = await navigator.permissions.query({ name: 'microphone' });
                return result.state === 'granted';
            } catch (error) {
                console.log('권한 상태 확인 실패, 직접 체크:', error);
                return false;
            }
        }

        /**
         * <pre>
         * [마이크 권한 요청]
         * </pre>
         * @param {string} type 채팅 타입
         */
        async requestMicPermission(type) {
            // 이미 권한이 있는지 먼저 확인
            const hasPermission = await this.checkMicPermission();
            if (hasPermission) {
                this.micPermissionGranted = true;
                localStorage.setItem('micPermissionGranted', 'true');
                return true;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop()); // 권한만 확인하고 스트림은 즉시 중지
                this.micPermissionGranted = true;
                localStorage.setItem('micPermissionGranted', 'true');
                return true;
            } catch (error) {
                console.error('마이크 권한 요청 실패:', error);
                this.showNotification('마이크 권한이 필요합니다.');
                return false;
            }
        }

        /**
         * <pre>
         * [마이크(음성 입력) 토글]
         * </pre>
         * @param {string} type 채팅 타입
         */
        async toggleMic(type) {
            const chatLayer = document.querySelector(`[data-chat-type="${type}"]`);
            if (!chatLayer) return;
            const micBtn = chatLayer.querySelector('.chat-mic-btn');
            const input = chatLayer.querySelector('.chat-input');
            const config = this.getChatConfig(type);

            if (!this.isListeningMap[type]) {
                // 브라우저 지원 체크
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SpeechRecognition) {
                    this.showNotification('이 브라우저는 음성 인식을 지원하지 않습니다.');
                    return;
                }

                // 권한 체크 및 요청 (이미 권한이 있으면 요청하지 않음)
                if (!this.micPermissionGranted) {
                    const permissionGranted = await this.requestMicPermission(type);
                    if (!permissionGranted) return;
                }

                // 인스턴스 생성 및 설정
                const recognition = new SpeechRecognition();
                recognition.lang = 'ko-KR';
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;
                recognition.continuous = false; // 한 번에 하나의 인식만
                this.recognitionMap[type] = recognition;

                recognition.onstart = () => {
                    this.isListeningMap[type] = true;
                    micBtn.innerHTML = `<i class="mdi mdi-microphone" style="font-size: 26px; color: #f44336;"></i>`;
                    this.showNotification('음성 인식이 시작되었습니다. 말씀해 주세요.');
                    console.log('음성 인식 시작');
                };

                recognition.onresult = (event) => {
                    console.log('음성 인식 결과:', event);
                    if (event.results && event.results.length > 0) {
                        const transcript = event.results[0][0].transcript;
                        console.log('인식된 텍스트:', transcript);
                        
                        // 기존 입력값에 추가
                        const currentValue = input.value;
                        const newValue = currentValue ? currentValue + ' ' + transcript : transcript;
                        input.value = newValue;
                        
                        // 입력 이벤트 발생시켜서 UI 업데이트
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        
                        this.showNotification('음성이 텍스트로 변환되었습니다.');
                    }
                };

                recognition.onerror = (event) => {
                    console.error('음성 인식 오류:', event.error);
                    this.showNotification('음성 인식 오류: ' + event.error);
                    this.isListeningMap[type] = false;
                    micBtn.innerHTML = `<i class="mdi mdi-microphone-outline" style="font-size: 26px; color: ${config.headerColor};"></i>`;
                };

                recognition.onend = () => {
                    console.log('음성 인식 종료');
                    this.isListeningMap[type] = false;
                    micBtn.innerHTML = `<i class="mdi mdi-microphone-outline" style="font-size: 26px; color: ${config.headerColor};"></i>`;
                    this.showNotification('음성 인식이 종료되었습니다.');
                };

                try {
                    recognition.start();
                } catch (error) {
                    console.error('음성 인식 시작 실패:', error);
                    this.showNotification('음성 인식을 시작할 수 없습니다.');
                }
            } else {
                // Stop listening
                const recognition = this.recognitionMap[type];
                if (recognition) {
                    try {
                        recognition.stop();
                    } catch (error) {
                        console.error('음성 인식 중지 실패:', error);
                    }
                }
                this.isListeningMap[type] = false;
                micBtn.innerHTML = `<i class="mdi mdi-microphone-outline" style="font-size: 26px; color: ${config.headerColor};"></i>`;
                this.showNotification('음성 인식이 중지되었습니다.');
            }
        }

        /**
         * <pre>
         * [클립보드에 복사]
         * </pre>
         * 
         * @param {string} text 복사할 텍스트
         */
        copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).catch(err => {
                    console.error('클립보드 복사 실패:', err);
                    this.fallbackCopyToClipboard(text);
                });
            } else {
                this.fallbackCopyToClipboard(text);
            }
        }

        /**
         * <pre>
         * [클립보드 복사 폴백]
         * </pre>
         * 
         * @param {string} text 복사할 텍스트
         */
        fallbackCopyToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('폴백 복사 실패:', err);
            }
            
            document.body.removeChild(textArea);
        }

        /**
         * <pre>
         * [알림 표시]
         * </pre>
         * 
         * @param {string} message 알림 메시지
         */
        showNotification(message) {
            // Remove existing notifications to prevent stacking
            const existingNotification = document.querySelector('.chatbot-notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.className = 'chatbot-notification';
            notification.textContent = message;
            
            document.body.appendChild(notification);

            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 3000);
        }

        /**
         * <pre>
         * [색상 어둡게 만들기]
         * </pre>
         * 
         * @param {string} color 원본 색상
         * @param {number} percent 어둡게 할 퍼센트
         * @returns {string} 어두워진 색상
         */
        darkenColor(color, percent) {
            const num = parseInt(color.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) - amt;
            const G = (num >> 8 & 0x00FF) - amt;
            const B = (num & 0x0000FF) - amt;
            return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        }

        /**
         * <pre>
         * [이벤트 리스너 설정]
         * </pre>
         */
        setupEventListeners() {
            // Robot button click event
            const robotBtn = document.getElementById('floating-robot-btn');
            robotBtn.addEventListener('click', () => this.handleChatbot());

            // Keyboard events
            document.addEventListener('keydown', (e) => {
                // ESC: Close all chat layers
                if (e.key === 'Escape') {
                    this.closeAllChatLayers();
                }
                
                // Ctrl/Cmd + M: Toggle floating menu
                if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
                    e.preventDefault();
                    this.toggleFloatingMenu();
                }
                
                // Ctrl/Cmd + 1-4: Open specific chat service
                if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
                    e.preventDefault();
                    const chatTypes = ['construction-safety', 'risk-assessment', 'tax-ai', 'site-ai'];
                    const index = parseInt(e.key) - 1;
                    if (chatTypes[index]) {
                        this.openChatLayer(chatTypes[index]);
                    }
                }
            });
        }

        /**
         * <pre>
         * [플로팅 메뉴 토글]
         * </pre>
         */
        toggleFloatingMenu() {
            this.bShowFloatingMenu = !this.bShowFloatingMenu;
            this.renderFloatingMenu();
            this.saveState();
        }

        // Event handlers (bound in constructor)
        handleInputChange(event) {
            const input = event.target;
            input.style.height = 'auto';
            input.style.height = input.scrollHeight + 'px';
        }

        handleKeydown(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                const chatLayer = event.target.closest('.chat-layer');
                if (chatLayer) {
                    const type = chatLayer.getAttribute('data-chat-type');
                    this.sendMessage(type);
                }
            }
        }

        handleSendClick(event) {
            const chatLayer = event.target.closest('.chat-layer');
            if (chatLayer) {
                const type = chatLayer.getAttribute('data-chat-type');
                this.sendMessage(type);
            }
        }

        handleHeaderClick(event) {
            const button = event.target.closest('button');
            if (button) {
                const action = button.getAttribute('aria-label');
                const chatLayer = button.closest('.chat-layer');
                if (chatLayer) {
                    const type = chatLayer.getAttribute('data-chat-type');
                    
                    if (action === '최소화') {
                        this.minimizeChatLayer(type);
                    } else if (action === '작게') {
                        this.resizeChatLayer(type, 'mini');
                    } else if (action === '중간 크기') {
                        this.resizeChatLayer(type, 'mid');
                    } else if (action === '최대화') {
                        this.resizeChatLayer(type, 'max');
                    } else if (action === '닫기') {
                        this.closeChatLayer(type);
                    }
                }
            }
        }
    }

    // Initialize chatbot when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.chatbotApp = new ChatbotApp();
        });
    } else {
        window.chatbotApp = new ChatbotApp();
    }

    // Export for global access
    window.ConstructionSafetyChatbot = ChatbotApp;
})(); 