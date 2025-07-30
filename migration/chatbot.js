// AI 건설안전 도우미 챗봇 - 순수 JavaScript 마이그레이션
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
            
            // 별점 시스템 - 위험성평가와 건설안전에만 적용
            this.ratings = {
                'construction-safety': {},
                'risk-assessment': {}
            };

            // Event handler binding for proper 'this' context and cleanup
            this.handleInputChange = this.handleInputChange.bind(this);
            this.handleKeydown = this.handleKeydown.bind(this);
            this.handleSendClick = this.handleSendClick.bind(this);
            this.handleHeaderClick = this.handleHeaderClick.bind(this);

            this.bShowChatList = true; // 채팅방 리스트/안내 텍스트 토글 상태
            this.openChatRoomId = null; // 진입한 채팅방 id, null이면 전체 채팅방 리스트
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
            
            // Google Fonts 로드
            this.loadGoogleFonts();
            
            // CSS 스타일 동적 생성
            this.createStyles();
            
            // 별점 시스템 스타일 추가
            this.addRatingStyles();
            
            // 현장개통/해지 테마 설정
            this.setSiteAiTheme();
            
            // 필요한 HTML 요소들 동적 생성
            this.createRequiredElements();
            
            // Material Design Icons 동적 로드
            this.loadMaterialDesignIcons();
            
            // 이벤트 리스너 설정 (아이콘 로드와 무관)
            this.setupEventListeners();
        }

        /**
         * <pre>
         * [Google Fonts 동적 로드]
         * </pre>
         */
        loadGoogleFonts() {
            // 이미 로드된 경우 중복 로드 방지
            if (document.querySelector('link[href*="fonts.googleapis.com"]')) {
                return;
            }

            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = 'https://fonts.googleapis.com';
            document.head.appendChild(link);

            const link2 = document.createElement('link');
            link2.rel = 'preconnect';
            link2.href = 'https://fonts.gstatic.com';
            link2.crossOrigin = 'anonymous';
            document.head.appendChild(link2);

            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap';
            fontLink.crossOrigin = 'anonymous';
            
            fontLink.onload = () => {
                console.log('Google Fonts 로드 완료');
            };
            
            fontLink.onerror = () => {
                console.error('Google Fonts 로드 실패');
            };
            
            document.head.appendChild(fontLink);
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
                /* AI 건설안전 도우미 챗봇 - 동적 CSS 스타일 */

                /* 기본 리셋 및 폰트 */
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                body {
                    font-family: 'Inter', 'SF Pro Display', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #212121;
                    background-color: #f5f5f5;
                    overflow-x: hidden;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    font-feature-settings: 'liga' 1, 'kern' 1;
                }



                /* 플로팅 메뉴 */
                .floating-menu.pill-menu {
                    position: fixed;
                    right: 48px;
                    bottom: 48px;
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
                    font-weight: 500;
                    letter-spacing: -0.01em;
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
                body .floating-robot-btn {
                    position: fixed;
                    right: 48px;
                    bottom: 48px;
                    top: auto;
                    transform: none;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: #c53030;
                    color: #fff;
                    padding: 0;
                    border: 2px solid #c53030;
                    box-shadow: none;
                    transition: background 0.18s, color 0.18s, border 0.18s;
                    cursor: pointer;
                }

                body .floating-robot-btn:hover, 
                body .floating-robot-btn:focus {
                    background: #dc2626;
                    color: #fff;
                    border: 2px solid #dc2626;
                }

                body .floating-robot-btn .mdi {
                    color: #fff;
                    font-size: 2rem;
                }

                /* 더 구체적인 선택자로 덮어쓰기 */
                body .floating-robot-btn[style] {
                    background: #c53030 !important;
                    color: #fff !important;
                    border: 2px solid #c53030 !important;
                }

                body .floating-robot-btn[style]:hover,
                body .floating-robot-btn[style]:focus {
                    background: #dc2626 !important;
                    color: #fff !important;
                    border: 2px solid #dc2626 !important;
                }

                body .floating-robot-btn[style] .mdi {
                    color: #fff !important;
                }

                /* 숨김 클래스 */
                .floating-robot-btn.hidden {
                    display: none !important;
                }

                /* 최소화된 상태의 로봇 버튼 */
                .floating-robot-btn-minimized {
                    display: flex !important;
                    background: #c53030 !important;
                    border: 2px solid #c53030 !important;
                    color: #fff !important;
                    box-shadow: 0 2px 8px rgba(197,48,48,0.10) !important;
                    width: 56px !important;
                    height: 56px !important;
                    border-radius: 50% !important;
                    align-items: center !important;
                    justify-content: center !important;
                    right: 48px !important;
                    bottom: 48px !important;
                    position: fixed !important;
                }

                .floating-robot-btn-minimized .mdi {
                    color: #fff !important;
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
                    background-color: #dc3545;
                }

                .modern-bot-icon .mdi {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .modern-bot-content {
                    border-radius: 12px;
                    padding: 16px 18px 8px 18px;
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
                    color: #000;
                    font-size: 15px;
                    line-height: 1.7;
                    text-align: left;
                    white-space: pre-line;
                    margin-bottom: 8px;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    font-weight: 400;
                    letter-spacing: -0.01em;
                }

                .modern-bot-divider {
                    width: 100%;
                    height: 1px;
                    margin: 12px 0 6px 0;
                }

                .modern-bot-bottom {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }

                .modern-bot-bottom-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }

                .modern-bot-time {
                    font-size: 12px;
                    color: #6c757d;
                    font-weight: 400;
                }

                .modern-copy-btn.bottom-right {
                    position: static;
                    background: transparent;
                    border-radius: 50%;
                    padding: 2px;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                }

                .modern-copy-btn.bottom-right:hover {
                    background: rgba(0, 0, 0, 0.1);
                }

                /* 사용자 메시지 */
                .modern-user-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    background: transparent;
                    border: none;
                    max-width: 400px;
                    min-width: 250px;
                    box-shadow: none;
                    overflow: hidden;
                    justify-content: flex-end;
                    flex-direction: row;
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
                    background: #c53030;
                }

                .modern-user-icon .mdi {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .modern-user-content {
                    border-radius: 12px;
                    padding: 16px 18px 8px 18px;
                    position: relative;
                    flex: 1;
                    min-width: 200px;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    overflow-x: hidden;
                    max-width: 350px;
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
                    border-left: 8px solid currentColor;
                }

                .modern-user-text {
                    color: #fff;
                    font-size: 15px;
                    line-height: 1.7;
                    text-align: left;
                    white-space: pre-line;
                    margin-bottom: 8px;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    font-weight: 400;
                    letter-spacing: -0.01em;
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
                    font-size: 12px;
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
                    font-size: 15px;
                    resize: none;
                    outline: none;
                    font-family: inherit;
                    line-height: 1.5;
                    min-height: 44px;
                    max-height: 120px;
                    overflow-y: auto;
                    font-weight: 400;
                    letter-spacing: -0.01em;
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

                .pill-menu-btn.active {
                    border-width: 2.5px;
                    border-color: var(--active-glow, #c53030) !important;
                }
                .pill-menu-btn.active-glow {
                    position: relative;
                    background: #fff;
                    overflow: hidden;
                }
                .pill-menu-btn.active-glow::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    border-radius: inherit;
                    pointer-events: none;
                    background: radial-gradient(circle at 50% 50%, var(--active-glow, #c53030) 0%, var(--active-glow, #c53030) 40%, transparent 80%);
                    opacity: 0.35;
                    animation: inner-glow 1.2s ease-in-out infinite alternate;
                }
                @keyframes inner-glow {
                    0% { opacity: 0.25; transform: scale(1); }
                    100% { opacity: 0.55; transform: scale(1.25); }
                }
                .pill-menu-btn.active-glow > * {
                    position: relative;
                    z-index: 1;
                }
                .pill-menu-btn.active-bounce {
                    /* 바운스 효과 제거 */
                 }

                .floating-menu-list {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }
                .floating-menu-card {
                    transition: box-shadow 0.18s, transform 0.18s;
                }
                .floating-menu-card:hover, .floating-menu-card:focus {
                    box-shadow: 0 4px 16px rgba(0,0,0,0.16);
                    transform: translateY(-2px) scale(1.03);
                }

                .floating-menu-root {
                    display: flex;
                    flex-direction: row;
                    background: #f5f6fa;
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
                    min-width: 380px;
                    overflow: hidden;
                }
                .floating-menu-sidebar {
                    width: 56px;
                    background: #ececec;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 12px 0;
                    border-right: 1.5px solid #e0e0e0;
                    height: auto;
                }
                .floating-menu-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    height: auto;
                }
                .floating-menu-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #fff;
                    padding: 12px 18px 12px 18px;
                    border-bottom: 1.5px solid #e0e0e0;
                }
                .header-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #222;
                }
                .header-icons {
                    display: flex;
                    align-items: center;
                }
                .chat-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    padding: 0;
                    height: auto;
                    max-height: none;
                    overflow: visible;
                }
                .chat-card {
                    display: flex;
                    align-items: center;
                    background: #fff;
                    border-radius: 0;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: box-shadow 0.18s, transform 0.18s, background 0.18s;
                    position: relative;
                    min-width: 220px;
                }
                .chat-card:hover, .chat-card:focus {
                    box-shadow: 0 4px 16px rgba(0,0,0,0.16);
                    background: #ececec;
                    transform: translateY(-2px) scale(1.02);
                }
                .chat-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 14px;
                    flex-shrink: 0;
                }
                .chat-info {
                    flex: 1;
                    min-width: 0;
                }
                .chat-title-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1px;
                }
                .chat-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #000;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    letter-spacing: -0.01em;
                }
                .chat-time {
                    font-size: 13px;
                    color: #888;
                    margin-left: 8px;
                    flex-shrink: 0;
                }
                .chat-preview {
                    font-size: 13px;
                    color: #555;
                    opacity: 0.85;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .chat-badge {
                    background: #e53935;
                    color: #fff;
                    font-size: 13px;
                    font-weight: 700;
                    border-radius: 12px;
                    min-width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    right: 16px;
                    bottom: 14px;
                    padding: 0 6px;
                    box-shadow: 0 1px 4px rgba(229,57,53,0.12);
                }
                .header-minimize-btn {
                    background: transparent;
                    border: none;
                    border-radius: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 8px;
                    cursor: pointer;
                    box-shadow: none;
                }
                .header-minimize-btn:hover, .header-minimize-btn:focus {
                    background: transparent;
                    box-shadow: none;
                }

                .chatbot-info-center {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    min-height: 320px;
                }
                .chatbot-info-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1976d2;
                    text-align: center;
                }
                .floating-menu-bottom {
                    padding: 12px 12px 0 12px;
                    background: transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chat-list-item .mdi {
                    font-size: 24px;
                    margin-right: 12px;
                    color: #666;
                }

                .chat-list-item[data-theme="kakao"] .mdi {
                    color: #fee500;
                }

                .chat-list-item:hover {
                    background-color: #f5f5f5;
                }

                .chat-card[data-theme="kakao"] .chat-avatar {
                    background: #fee500 !important;
                }

                .chat-card[data-theme="kakao"] .chat-avatar .mdi {
                    color: #000 !important;
                }

                .sidebar-chat {
                    transition: all 0.2s ease-in-out;
                }

                .sidebar-chat:hover {
                    background: #d0d0d0 !important;
                    transform: scale(1.05);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .sidebar-chat:hover img {
                    transform: scale(1.1);
                    transition: transform 0.2s ease-in-out;
                }

                /* 현장개통/해지 버튼 HTML 생성 함수 */
                .site-ai-button-container {
                    display: flex;
                    gap: 12px;
                    margin-top: 12px;
                }

                .site-ai-btn {
                    background: #4caf50;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 16px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .site-ai-btn:hover {
                    background: #388e3c;
                }

                /* 버튼 스타일 추가 (createStyles 등에서) */
                .site-ai-button-container-vertical { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
                .site-ai-btn-vertical { background: #4caf50; color: #fff; border: none; border-radius: 8px; padding: 12px 16px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; text-align: left; display: flex; align-items: center; }
                .site-ai-btn-vertical:hover { background: #388e3c; }

                /* 팝업 버튼 호버 효과 */
                #site-ai-popup button {
                    transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.15s;
                }
                #site-ai-download-btn:hover {
                    background: #218838;
                    color: #fff;
                    box-shadow: 0 4px 16px rgba(33,136,56,0.25);
                    transform: scale(1.04);
                }
                #site-ai-upload-btn:hover {
                    background: #0d47a1;
                    color: #fff;
                    box-shadow: 0 4px 16px rgba(13,71,161,0.22);
                    transform: scale(1.04);
                }
                #site-ai-close-btn:hover {
                    background: #bdbdbd;
                    color: #111;
                    box-shadow: 0 4px 16px rgba(100,100,100,0.18);
                    transform: scale(1.04);
                }

                /* 현장개통/해제 테마 스타일 */
                .site-ai-theme.modern-bot-icon {
                    background: var(--site-ai-primary, #4caf50) !important;
                }

                .site-ai-theme.modern-bot-content {
                    border: 1.5px solid var(--site-ai-primary, #4caf50) !important;
                    background: var(--site-ai-background, #e6f4ea) !important;
                }

                /* 마크다운 파싱된 요소들의 간격 조정 */
                .modern-bot-text h1, .modern-bot-text h2, .modern-bot-text h3 {
                    margin: 8px 0 4px 0;
                    font-weight: 600;
                    line-height: 1.4;
                }
                .modern-bot-text h1 { font-size: 1.1em; }
                .modern-bot-text h2 { font-size: 1.05em; }
                .modern-bot-text h3 { font-size: 1em; }
                
                .modern-bot-text p {
                    margin: 6px 0;
                    line-height: 1.5;
                    font-size: 14px;
                }
                
                .modern-bot-text ul, .modern-bot-text ol {
                    margin: 6px 0 6px 16px;
                    padding-left: 8px;
                }
                
                .modern-bot-text ul ul, .modern-bot-text ol ol, 
                .modern-bot-text ul ol, .modern-bot-text ol ul {
                    margin: 2px 0 2px 16px;
                }
                
                .modern-bot-text li {
                    margin: 2px 0;
                    line-height: 1.4;
                    font-size: 14px;
                }
                
                .modern-bot-text strong { font-weight: 600; }
                .modern-bot-text em { font-style: italic; }
                .modern-bot-text code {
                    background: rgba(0, 0, 0, 0.1);
                    padding: 1px 3px;
                    border-radius: 3px;
                    font-family: monospace;
                    font-size: 0.9em;
                }
                
                /* 마크다운 테이블 스타일 */
                .modern-md-table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 8px 0;
                    font-size: 13px;
                    overflow-x: auto;
                    display: block;
                }
                .modern-md-table th, .modern-md-table td {
                    border: 1px solid #ddd;
                    padding: 6px 8px;
                    text-align: left;
                    word-break: break-all;
                    white-space: pre-line;
                }
                .modern-md-table th {
                    background: #f5f5f5;
                    font-weight: 600;
                }
                .modern-md-table tr:nth-child(even) td {
                    background: #fafafa;
                }
                
                /* 첫 번째 요소의 상단 마진 제거 */
                .modern-bot-text > *:first-child {
                    margin-top: 0;
                }
                
                /* 마지막 요소의 하단 마진 제거 */
                .modern-bot-text > *:last-child {
                    margin-bottom: 0;
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
                robotBtn.className = 'floating-robot-btn hidden';
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

            if (this.bShowFloatingMenu && this.openChatRoomId === null) {
                menuContainer.style.display = 'flex';
                robotBtn.classList.add('hidden');

                // 샘플 미리보기/시간/뱃지 데이터
                const chatList = [
                  { id: 'construction-safety', label: '건설안전 A.I', icon: 'mdi-robot', theme: 'construction-safety', preview: '안전 및 대책 관련 문의', badge: 1 },
                  { id: 'risk-assessment', label: '위험성평가 A.I', icon: 'mdi-shield-check', theme: 'risk-assessment', preview: '시스템사용방법 관련 문의', badge: 0 },
                  { id: 'tax-ai', label: '세금계산서 A.I', icon: 'mdi-calculator', theme: 'tax-ai', preview: '세금계산서 관련 문의', badge: 2 },
                  { id: 'site-ai', label: '현장개통/해지 A.I', icon: 'mdi-office-building', theme: 'site-ai', preview: '현장개통/해지 관련 문의', badge: 0 },
                  { id: 'kakao-link', label: '카카오톡 상담', icon: 'mdi-message-text-outline', theme: 'kakao', preview: '카카오톡 상담원 연결', badge: 0, isExternal: true, link: 'https://pf.kakao.com/_cxcxdxfs/chat' }
                ];

                // 각 채팅방의 마지막 메시지 시간 구하기
                const getLastMessageTime = (id) => {
                  const msgs = this.messages[id] || [];
                  if (msgs.length === 0) return '';
                  const last = msgs[msgs.length - 1];
                  if (!last.time) return '';
                  // 이미 포맷된 문자열이면 그대로, Date 객체면 포맷
                  if (typeof last.time === 'string') return last.time;
                  const d = new Date(last.time);
                  const h = d.getHours();
                  const m = d.getMinutes();
                  const isPM = h >= 12;
                  const hour12 = h % 12 === 0 ? 12 : h % 12;
                  return `${isPM ? '오후' : '오전'} ${hour12}:${m.toString().padStart(2, '0')}`;
                };

                menuContainer.innerHTML = `
                  <div class="floating-menu-root">
                    <div class="floating-menu-sidebar">
                      <div class="sidebar-logo">
                        <img src="images/logo/symbol-kosha.png" alt="logo" />
                      </div>
                      <div class="sidebar-chat">
                        <img src="images/logo/chat_icon.png" alt="chat" />
                      </div>
                    </div>
                    <div class="floating-menu-main">
                      <div class="floating-menu-header">
                        <span class="header-title">채팅</span>
                        <div class="header-icons">
                          <button class="header-minimize-btn" onclick="window.chatbotApp.handleMinimize()" aria-label="최소화">
                            <i class="mdi mdi-minus icon-minus"></i>
                          </button>
                          <i class="mdi mdi-window-close icon-close" onclick="window.chatbotApp.handleRootClose()"></i>
                        </div>
                      </div>
                      <div class="chat-container">
                        <div class="chat-list ${this.bShowChatList ? '' : 'hidden'}">
                          ${chatList.map(item => {
                            const config = this.getChatConfig(item.theme);
                            if (item.isExternal) {
                              return `
                                <div class="chat-card" data-theme="${item.theme}" onclick="window.open('${item.link}', '_blank')">
                                  <div class="chat-avatar" data-theme="${item.theme}">
                                    <i class="mdi ${item.icon} chat-avatar-icon"></i>
                                  </div>
                                  <div class="chat-info">
                                    <div class="chat-title-row">
                                      <span class="chat-title">${item.label}</span>
                                    </div>
                                    <div class="chat-preview">${item.preview}</div>
                                  </div>
                                </div>
                              `;
                            } else {
                              const isMinimized = this.chatLayers[item.id] && this.chatLayers[item.id].isMinimized;
                              return `
                                <div class="chat-card" onclick="window.chatbotApp.enterChatRoom('${item.id}')">
                                  <div class="chat-avatar" data-theme="${item.theme}">
                                    <i class="mdi ${item.icon} chat-avatar-icon"></i>
                                  </div>
                                  <div class="chat-info">
                                    <div class="chat-title-row">
                                      <span class="chat-title">${item.label}</span>
                                      <span class="chat-time">${getLastMessageTime(item.id)}</span>
                                    </div>
                                    <div class="chat-preview">${item.preview}</div>
                                  </div>
                                  ${isMinimized ? `<div class="chat-badge">대화중</div>` : ''}
                                </div>
                              `;
                            }
                          }).join('')}
                        </div>
                        <div class="chatbot-info-center ${this.bShowChatList ? 'hidden' : ''}">
                          <div class="chatbot-info-title">스마트위험성평가 Chatbot 서비스 v2.0</div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;

                // 사이드바 아이콘 클릭 이벤트 바인딩
                const sidebarProfile = menuContainer.querySelector('.sidebar-profile');
                if (sidebarProfile) {
                  sidebarProfile.onclick = () => { this.bShowChatList = false; this.renderFloatingMenu(); };
                }
                const sidebarChat = menuContainer.querySelector('.sidebar-chat');
                if (sidebarChat) {
                  sidebarChat.onclick = () => { this.bShowChatList = true; this.renderFloatingMenu(); };
                }
            } else if (this.openChatRoomId) {
                // 플로팅 메뉴 숨기고 채팅 레이어만 표시
                menuContainer.style.display = 'none';
                robotBtn.style.display = 'none';
                // 채팅 레이어는 enterChatRoom에서 이미 생성됨
                return;
            } else {
                menuContainer.style.display = 'none';
                // 플로팅 메뉴가 최소화되면 + 버튼(동그라미 안에 +)을 보이게
                robotBtn.innerHTML = '<i class="mdi mdi-plus icon-plus"></i>';
                robotBtn.classList.remove('hidden');
                robotBtn.classList.add('floating-robot-btn-minimized');
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
                                <div class="modern-user-content" data-theme="${type}">
                                    <div class="modern-user-text">${msg.text}</div>
                                    <div class="modern-user-divider"></div>
                                    <div class="modern-user-bottom">
                                        <span class="modern-user-time">${msg.time}</span>
                                        <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${msg.text.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                                            <i class="mdi mdi-content-copy copy-icon"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="modern-user-icon" data-theme="${type}">
                                    <i class="mdi mdi-account user-icon"></i>
                                </div>
                            </div>
                        </div>
                        `;
                    } else {
                        // 메시지 ID가 없으면 생성
                        const messageId = msg.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                        const ratingHTML = this.createRatingHTML(type, messageId);
                        
                        // AI 메시지의 경우 markdown parsing 적용
                        const parsedText = this.parseMarkdown(msg.text);
                        
                        messagesHTML += `
                        <div class="message bot" data-message-id="${messageId}">
                            <div class="modern-bot-icon" data-theme="${type}">
                                <i class="mdi mdi-robot bot-icon"></i>
                            </div>
                            <div class="modern-bot-content" data-theme="${type}">
                                <div class="modern-bot-text">${parsedText}</div>
                                <div class="modern-bot-divider" data-theme="${type}"></div>
                                <div class="modern-bot-bottom">
                                    <div class="modern-bot-bottom-row">
                                        <span class="modern-bot-time">${msg.time}</span>
                                        <div class="flex-center">
                                            ${ratingHTML}
                                            <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${msg.text.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                                                <i class="mdi mdi-content-copy copy-icon-theme" data-theme="${type}"></i>
                                            </button>
                                        </div>
                                    </div>
                                    ${this.getFeedbackTextHTML(type)}
                                </div>

                            </div>
                        </div>
                        `;
                    }
                }
            } else {
                // welcome message만 표시
                const welcomeText = type === 'tax-ai' ? '안녕하세요! 세금계산서 도우미입니다.\n\n어떤 세무 업무에 대해 도움이 필요하신가요?\n아래 버튼을 클릭하여 선택해주세요.\n\n' : config.welcomeMessage;
                
                // site-ai 웰컴 메시지도 연한 초록 테마로 통일
                if (type === 'site-ai') {
                    messagesHTML = `
                        <div class="message bot">
                            <div class="modern-bot-icon" data-theme="site-ai">
                                <i class="mdi mdi-robot bot-icon"></i>
                            </div>
                            <div class="modern-bot-content" data-theme="site-ai">
                                <div class="modern-bot-text">${welcomeText}</div>
                            </div>
                        </div>
                    `;
                } else {
                    messagesHTML = `
                        <div class="message bot">
                            <div class="modern-bot-icon" data-theme="${type}">
                                <i class="mdi mdi-robot bot-icon"></i>
                            </div>
                            <div class="modern-bot-content" data-theme="${type}">
                                <div class="modern-bot-text">${welcomeText}</div>
                                ${type === 'tax-ai' ? this.createTaxButtonsHTML() : ''}
                            </div>
                        </div>
                    `;
                }
            }

            chatLayer.innerHTML = `
                <div class="chat-header" data-theme="${type}">
                    <div class="chat-header-info">
                        <div class="chat-avatar" data-theme="${type}">
                            <i class="mdi mdi-robot bot-icon"></i>
                        </div>
                        <div>
                            <h3 class="chat-title">${config.title}</h3>
                            <p class="chat-status">온라인 상담 중</p>
                        </div>
                    </div>
                    <div class="chat-header-controls">
                        <button class="chat-header-btn" onclick="window.chatbotApp.minimizeChatLayer('${type}')" aria-label="최소화">
                            <i class="mdi mdi-minus header-icon"></i>
                        </button>
                        <button class="chat-header-btn" onclick="window.chatbotApp.resizeChatLayer('${type}', 'mid')" aria-label="중간 크기">
                            <i class="mdi mdi-arrow-expand-horizontal header-icon"></i>
                        </button>
                        <button class="chat-header-btn" onclick="window.chatbotApp.resizeChatLayer('${type}', 'max')" aria-label="최대화">
                            <i class="mdi mdi-arrow-expand-all header-icon"></i>
                        </button>
                        <button class="chat-close-btn" onclick="window.chatbotApp.showCloseConfirmation('${type}')" aria-label="닫기">
                            <i class="mdi mdi-close header-icon"></i>
                        </button>
                    </div>
                </div>
                <div class="chat-messages">
                    ${messagesHTML}
                </div>
                <div class="modern-bottom-divider"></div>
                ${(type === 'tax-ai' || type === 'site-ai') ? `
                <div class="chat-input-area disabled">
                    <textarea class="chat-input" placeholder="입력이 비활성화되었습니다" rows="1" disabled></textarea>
                    <div class="transparency-control">
                        <input type="range" min="90" max="100" value="${this.transparency[type]}" 
                               class="transparency-slider" 
                               onchange="window.chatbotApp.updateTransparency('${type}', this.value)"
                               oninput="window.chatbotApp.updateTransparency('${type}', this.value)">
                    </div>
                    <button class="chat-mic-btn" disabled aria-label="음성 입력">
                        <i class="mdi mdi-microphone-outline mic-icon disabled"></i>
                    </button>
                    <button class="chat-send-btn" disabled aria-label="전송">
                        <i class="mdi mdi-send send-icon disabled"></i>
                    </button>
                </div>
                ` : `
                <div class="chat-input-area">
                    <textarea class="chat-input" placeholder="${config.placeholder}" rows="1"></textarea>
                    <div class="transparency-control">
                        <input type="range" min="90" max="100" value="${this.transparency[type]}" 
                               class="transparency-slider" 
                               onchange="window.chatbotApp.updateTransparency('${type}', this.value)"
                               oninput="window.chatbotApp.updateTransparency('${type}', this.value)">
                    </div>
                    <button class="chat-mic-btn" onclick="window.chatbotApp.toggleMic('${type}')" aria-label="음성 입력">
                        <i class="mdi mdi-microphone-outline mic-icon"></i>
                    </button>
                    <button class="chat-send-btn" onclick="window.chatbotApp.sendMessage('${type}')" aria-label="전송">
                        <i class="mdi mdi-send send-icon"></i>
                    </button>
                </div>
                `}
            `;

            container.appendChild(chatLayer);
            this.setupChatLayerEvents(chatLayer, type);
            
            // 초기 투명도 적용
            this.updateTransparency(type, this.transparency[type]);
            
            // 슬라이더 색상 설정
            this.updateSliderColor(type);
            
            // 저장된 별점 로드 (위험성평가와 건설안전에만)
            if (type === 'construction-safety' || type === 'risk-assessment') {
                this.loadSavedRatings(type);
            }
            
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
                    userMessageColor: '#c53030',
                    placeholder: '건설안전, 건설법 등 궁금한 것을 물어보세요...',
                    welcomeMessage: '안녕하세요? 저는 건설안전 전문가입니다.\n\n오늘 작업장소와 작업공종을 알려주시면 위험요인과 안전대책을 알려드리겠습니다.\n\n(예시: 서울에서 지하 3층: 방수 및 미장 작업, 지상 7층: 철근콘크리트를 위한 형틀설치, 철근배근, 전선관배관 작업을 타워크레인을 이용해서 진행합니다)'
                },
                'risk-assessment': {
                    title: '위험성평가 도우미',
                    headerColor: '#1976d2',
                    botMessageColor: '#1976d2',
                    userMessageColor: '#1976d2',
                    placeholder: '위험성평가에 대해 궁금한 것을 물어보세요...',
                    welcomeMessage: '안녕하세요? 저는 위험성평가 도우미입니다.\n\n 위험성평가 서비스를 사용하시는데 어려움이 많으시죠?\n위험성평가 사용방법을 안내해드리겠습니다.\n\n(예시: 추가위험발굴 메뉴에서 지시를 하였는데 원청사에서 조치도 같은 메뉴에서 하고 싶어)'
                },
                'tax-ai': {
                    title: '세금계산서 도우미',
                    headerColor: '#ff9800',
                    botMessageColor: '#ff8f00',
                    userMessageColor: '#4caf50',
                    placeholder: '세금계산서에 대해 궁금한 것을 물어보세요...',
                    welcomeMessage: ''
                },
                'site-ai': {
                    title: '현장개통/해지 도우미',
                    headerColor: '#4caf50',
                    botMessageColor: '#4caf50', // 초록색으로 변경하여 조건문에 포함
                    userMessageColor: '#2196f3',
                    placeholder: '현장개통/해지에 대해 궁금한 것을 물어보세요...',
                    welcomeMessage: '안녕하세요! 현장개통/해지 A.I입니다.\n\n현장개통/해제 관련 문의 유형을 선택해주세요.\n' + window.createSiteAiButtonsHTML()
                },
                'kakao': {
                    title: '카카오톡 상담',
                    headerColor: '#fee500',
                    botMessageColor: '#fee500',
                    userMessageColor: '#fee500',
                    placeholder: '카카오톡으로 상담하세요...',
                    welcomeMessage: '카카오톡 상담으로 연결됩니다.'
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

            // 세금계산서와 현장개통 채팅방에서는 메시지 전송 비활성화
            if (type === 'tax-ai' || type === 'site-ai') {
                return;
            }

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
                    <div class="modern-user-content" data-theme="${type}">
                        <div class="modern-user-text">${message}</div>
                        <div class="modern-user-divider"></div>
                        <div class="modern-user-bottom">
                            <span class="modern-user-time">${this.getCurrentTime()}</span>
                            <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${message.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                                <i class="mdi mdi-content-copy copy-icon"></i>
                            </button>
                        </div>
                    </div>
                    <div class="modern-user-icon" data-theme="${type}">
                        <i class="mdi mdi-account user-icon"></i>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(userMessage);

            // Clear input
            input.value = '';

            // === 건설 안전 전문가 n8n 연동 ===
            if (type === 'construction-safety') {
                // 로딩 메시지 추가
                const loadingMsg = this.createLoadingMessage('construction-safety', '답변 생성 중...');
                messagesContainer.appendChild(loadingMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                console.log('건설 안전 요청 데이터:', { userid: `construction-safety-${Date.now()}`, message: message });

                fetch('https://ai-chatbot.myconst.com/webhook/99ea553b-9083-40c6-a0f2-11b7776ab22f', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        userid: `construction-safety-${Date.now()}`,
                        message: message 
                    })
                })
                .then(res => {
                    console.log('n8n 응답 상태:', res.status, res.statusText);
                    return res.ok ? res.json() : Promise.reject(res);
                })
                .then(response => {
                    if (loadingMsg) loadingMsg.remove();
                    console.log('건설 안전 n8n 응답:', response); // 디버깅용 로그
                    let answer = '';
                    if (Array.isArray(response) && response.length > 0 && response[0].output) {
                        answer = response[0].output;
                    } else if (Array.isArray(response) && response.length > 0 && response[0].response) {
                        answer = response[0].response;
                    } else if (response.output) {
                        answer = response.output;
                    } else if (response.answer) {
                        answer = response.answer;
                    } else if (response.response) {
                        answer = response.response;
                    } else if (response.message) {
                        answer = response.message;
                    } else if (response.text) {
                        answer = response.text;
                    } else if (response.content) {
                        answer = response.content;
                    } else {
                        console.log('응답 구조 확인:', JSON.stringify(response, null, 2));
                        answer = '답변을 받아오지 못했습니다. 응답 구조를 확인해주세요.';
                    }
                    // 메시지 ID 생성
                    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    const ratingHTML = this.createRatingHTML(type, messageId);
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message bot';
                    botMessage.setAttribute('data-message-id', messageId);
                    botMessage.innerHTML = `
                        <div class="modern-bot-icon" data-theme="${type}">
                            <i class="mdi mdi-robot bot-icon"></i>
                        </div>
                        <div class="modern-bot-content" data-theme="${type}">
                            <div class="modern-bot-text">${this.parseMarkdown(answer)}</div>
                            <div class="modern-bot-divider" data-theme="${type}"></div>
                            <div class="modern-bot-bottom">
                                <div class="modern-bot-bottom-row">
                                    <span class="modern-bot-time">${this.getCurrentTime()}</span>
                                    <div class="flex-center">
                                        ${ratingHTML}
                                        <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${answer.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                                            <i class="mdi mdi-content-copy copy-icon-theme" data-theme="${type}"></i>
                                        </button>
                                    </div>
                                </div>
                                ${this.getFeedbackTextHTML(type)}
                            </div>
                        </div>
                    `;
                    messagesContainer.appendChild(botMessage);
                    // 메시지 배열에 추가 (최대 30개 유지)
                    if (!this.messages[type]) this.messages[type] = [];
                    this.messages[type].push({ role: 'bot', text: answer, time: this.getCurrentTime(), id: messageId });
                    if (this.messages[type].length > 30) this.messages[type].shift();
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                })
                .catch((error) => {
                    console.error('건설 안전 n8n 에러:', error);
                    if (loadingMsg) loadingMsg.remove();
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'message bot';
                    errorMsg.innerHTML = `
                        <div class="modern-bot-icon" data-theme="${type}">
                            <i class="mdi mdi-robot bot-icon"></i>
                        </div>
                        <div class="modern-bot-content" data-theme="${type}">
                            <div class="modern-bot-text">답변 생성에 실패했습니다. 다시 시도해 주세요.<br><small>에러: ${error.message || '알 수 없는 오류'}</small></div>
                        </div>
                    `;
                    messagesContainer.appendChild(errorMsg);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                });
                return;
            }

            // === 위험성평가 도우미 n8n 연동 ===
            if (type === 'risk-assessment') {
                // 로딩 메시지 추가
                const loadingMsg = this.createLoadingMessage('risk-assessment', '답변 생성 중...');
                messagesContainer.appendChild(loadingMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                fetch('https://ai-chatbot.myconst.com/webhook/chatbot/system', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: message, userid: this.getOrCreateSessionId() })
                })
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(response => {
                    if (loadingMsg) loadingMsg.remove();
                    let answer = '';
                    if (Array.isArray(response) && response.length > 0) {
                        answer = response[0].answer || response[0].response || response[0].output;
                    } else if (response.answer) {
                        answer = response.answer;
                    } else if (response.response) {
                        answer = response.response;
                    } else if (response.output) {
                        answer = response.output;
                    } else {
                        answer = '답변을 받아오지 못했습니다.';
                    }
                    // 메시지 ID 생성
                    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    const ratingHTML = this.createRatingHTML(type, messageId);
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message bot';
                    botMessage.setAttribute('data-message-id', messageId);
                    botMessage.innerHTML = `
                        <div class="modern-bot-icon" data-theme="${type}">
                            <i class="mdi mdi-robot bot-icon"></i>
                        </div>
                        <div class="modern-bot-content" data-theme="${type}">
                            <div class="modern-bot-text">${this.parseMarkdown(answer)}</div>
                            <div class="modern-bot-divider" data-theme="${type}"></div>
                            <div class="modern-bot-bottom">
                                <div class="modern-bot-bottom-row">
                                    <span class="modern-bot-time">${this.getCurrentTime()}</span>
                                    <div class="flex-center">
                                        ${ratingHTML}
                                        <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${answer.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                                            <i class="mdi mdi-content-copy copy-icon-theme" data-theme="${type}"></i>
                                        </button>
                                    </div>
                                </div>
                                ${this.getFeedbackTextHTML(type)}
                            </div>
                        </div>
                    `;
                    messagesContainer.appendChild(botMessage);
                    // 메시지 배열에 추가 (최대 30개 유지)
                    if (!this.messages[type]) this.messages[type] = [];
                    this.messages[type].push({ role: 'bot', text: answer, time: this.getCurrentTime(), id: messageId });
                    if (this.messages[type].length > 30) this.messages[type].shift();
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                })
                .catch(() => {
                    if (loadingMsg) loadingMsg.remove();
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'message bot';
                    errorMsg.innerHTML = `
                        <div class="modern-bot-icon" data-theme="${type}">
                            <i class="mdi mdi-robot bot-icon"></i>
                        </div>
                        <div class="modern-bot-content" data-theme="${type}">
                            <div class="modern-bot-text">답변 생성에 실패했습니다. 다시 시도해 주세요.</div>
                        </div>
                    `;
                    messagesContainer.appendChild(errorMsg);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                });
                return;
            }
            // === 건설안전 전문가 n8n 연동 ===
            if (type === 'construction-safety') {
                // 로딩 메시지 추가
                const loadingMsg = this.createLoadingMessage('construction-safety', '답변 생성 중...');
                messagesContainer.appendChild(loadingMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                fetch('https://ai-chatbot.myconst.com/webhook/99ea553b-9083-40c6-a0f2-11b7776ab22f', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message, userid: this.getOrCreateSessionId() })
                })
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(response => {
                    if (loadingMsg) loadingMsg.remove();
                    let answer = '';
                    if (Array.isArray(response) && response.length > 0) {
                        answer = response[0].answer || response[0].response || response[0].output;
                    } else if (response.answer) {
                        answer = response.answer;
                    } else if (response.response) {
                        answer = response.response;
                    } else if (response.output) {
                        answer = response.output;
                    } else {
                        answer = '답변을 받아오지 못했습니다.';
                    }
                    // 메시지 ID 생성
                    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    const ratingHTML = this.createRatingHTML(type, messageId);
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message bot';
                    botMessage.setAttribute('data-message-id', messageId);
                    botMessage.innerHTML = `
                        <div class="modern-bot-icon" data-theme="${type}">
                            <i class="mdi mdi-robot bot-icon"></i>
                        </div>
                        <div class="modern-bot-content" data-theme="${type}">
                            <div class="modern-bot-text">${this.parseMarkdown(answer)}</div>
                            <div class="modern-bot-divider" data-theme="${type}"></div>
                            <div class="modern-bot-bottom">
                                <div class="modern-bot-bottom-row">
                                    <span class="modern-bot-time">${this.getCurrentTime()}</span>
                                    <div class="flex-center">
                                        ${ratingHTML}
                                        <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${answer.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                                            <i class="mdi mdi-content-copy copy-icon-theme" data-theme="${type}"></i>
                                        </button>
                                    </div>
                                </div>
                                ${this.getFeedbackTextHTML(type)}
                            </div>
                        </div>
                    `;
                    messagesContainer.appendChild(botMessage);
                    // 메시지 배열에 추가 (최대 30개 유지)
                    if (!this.messages[type]) this.messages[type] = [];
                    this.messages[type].push({ role: 'bot', text: answer, time: this.getCurrentTime(), id: messageId });
                    if (this.messages[type].length > 30) this.messages[type].shift();
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                })
                .catch(() => {
                    if (loadingMsg) loadingMsg.remove();
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'message bot';
                    errorMsg.innerHTML = `
                        <div class="modern-bot-icon" data-theme="${type}">
                            <i class="mdi mdi-robot bot-icon"></i>
                        </div>
                        <div class="modern-bot-content" data-theme="${type}">
                            <div class="modern-bot-text">답변 생성에 실패했습니다. 다시 시도해 주세요.</div>
                        </div>
                    `;
                    messagesContainer.appendChild(errorMsg);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                });
                return;
            }
            // === 기존 simulateAIResponse ===
            setTimeout(() => {
                this.simulateAIResponse(chatLayer, type, message);
            }, 1000);
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
                response = `안녕하세요! 위험성평가 도우미입니다.\n\n작업장소와 작업공종을 알려주시면 해당 작업의 위험요인을 분석하고 평가 방법을 안내해드리겠습니다.\n\n위험성평가는 작업 전 필수 절차로, 안전한 작업 환경을 조성하는 데 중요한 역할을 합니다.`;
            } else if (type === 'tax-ai') {
                response = `안녕하세요! 세금계산서 도우미입니다.\n\n어떤 세무 업무에 대해 도움이 필요하신가요? 아래 버튼을 클릭하여 선택해주세요.`;
            } else if (type === 'site-ai') {
                response = `안녕하세요! 현장개통/해지 도우미입니다.\n\n현장개통과 해지 절차에 대해 안내해드리겠습니다.\n\n현장개통은 새로운 건설현장을 시작할 때 필요한 절차이며, 해지는 작업 완료 후 현장을 정리하는 절차입니다.\n\n어떤 부분에 대해 궁금하신가요?`;
            } else if (type === 'kakao') {
                response = `카카오톡 상담으로 연결됩니다. 문의 내용을 입력하세요.`;
            }

            // 메시지 ID 생성
            const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // 별점 HTML 생성 (위험성평가와 건설안전에만)
            const ratingHTML = this.createRatingHTML(type, messageId);

            // Bot message
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.setAttribute('data-message-id', messageId);
            botMessage.innerHTML = `
                <div class="modern-bot-icon" data-theme="${type}">
                    <i class="mdi mdi-robot bot-icon"></i>
                </div>
                <div class="modern-bot-content" data-theme="${type}">
                    <div class="modern-bot-text">${response}</div>
                    ${type === 'tax-ai' ? this.createTaxButtonsHTML() : ''}
                    ${type !== 'tax-ai' ? `
                        <div class="modern-bot-divider" data-theme="${type}"></div>
                        <div class="modern-bot-bottom">
                            <div class="modern-bot-bottom-row">
                                <span class="modern-bot-time">${this.getCurrentTime()}</span>
                                <div class="flex-center">
                                    ${ratingHTML}
                                    <button class="modern-copy-btn bottom-right" onclick="window.chatbotApp.copyToClipboard('${response.replace(/'/g, "\\'")}')" aria-label="메시지 복사">
                                        <i class="mdi mdi-content-copy copy-icon-theme" data-theme="${type}"></i>
                                    </button>
                                </div>
                            </div>
                            ${this.getFeedbackTextHTML(type)}
                        </div>
                    ` : ''}
                </div>
            `;
            messagesContainer.appendChild(botMessage);
            
            // 메시지 배열에 추가 (최대 30개 유지)
            if (!this.messages[type]) this.messages[type] = [];
            this.messages[type].push({ role: 'bot', text: response, time: this.getCurrentTime(), id: messageId });
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
            this.renderFloatingMenu();
            // 채팅방 닫기 시 전체 채팅방 리스트로 복귀
            if (this.openChatRoomId === type) {
                this.openChatRoomId = null;
                this.renderFloatingMenu();
            }
        }

        /**
         * <pre>
         * [채팅 레이어 크기 조정 - 토글 기능]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         * @param {string} size 크기 (mini, mid, max)
         */
        resizeChatLayer(type, size) {
            // 현재 크기 확인
            const currentSize = this.chatLayers[type].size;
            
            // 최대화 버튼 클릭 시 토글 기능
            if (size === 'max') {
                if (currentSize === 'max') {
                    // 이미 최대화된 상태면 최소화로 변경
                    this.chatLayers[type].size = 'mini';
                } else {
                    // 최대화되지 않은 상태면 최대화로 변경
                    this.chatLayers[type].size = 'max';
                }
            } else if (size === 'mid') {
                // 중간 크기 버튼 클릭 시 토글 기능
                if (currentSize === 'mid') {
                    // 이미 중간 크기 상태면 최소화로 변경
                    this.chatLayers[type].size = 'mini';
                } else {
                    // 중간 크기가 아닌 상태면 중간 크기로 변경
                    this.chatLayers[type].size = 'mid';
                }
            } else {
                // 최대화가 아닌 다른 크기들은 기존 로직 유지
                this.chatLayers[type].size = size;
            }
            
            const chatLayer = document.querySelector(`[data-chat-type="${type}"]`);
            if (chatLayer) {
                chatLayer.className = `chat-layer ${this.chatLayers[type].size}`;
            }
            this.saveState();
        }

        /**
         * <pre>
         * [채팅 레이어 닫기 확인 팝업 표시]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         */
        showCloseConfirmation(type) {
            // 기존 팝업이 있다면 제거
            const existingPopup = document.querySelector('.close-confirmation-popup');
            if (existingPopup) {
                existingPopup.remove();
            }

            // 채팅 레이어 찾기
            const chatLayer = document.querySelector(`[data-chat-type="${type}"]`);
            if (!chatLayer) {
                console.error('채팅 레이어를 찾을 수 없습니다:', type);
                return;
            }

            const popup = document.createElement('div');
            popup.className = 'close-confirmation-popup';
            popup.innerHTML = `
                <div class="close-confirmation-overlay"></div>
                <div class="close-confirmation-modal">
                    <div class="close-confirmation-content">
                        <div class="close-confirmation-title">
                            <i class="mdi mdi-alert-circle"></i>
                            채팅방을 나가시겠습니까?
                        </div>
                        <div class="close-confirmation-message">
                            채팅방을 나가시면 채팅내역은 복구되지 않습니다.
                        </div>
                        <div class="close-confirmation-buttons">
                            <button class="close-confirmation-btn confirm-btn" onclick="window.chatbotApp.confirmCloseChatLayer('${type}')">
                                확인
                            </button>
                            <button class="close-confirmation-btn cancel-btn" onclick="window.chatbotApp.hideCloseConfirmation()">
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // 채팅 레이어 내부에 팝업 추가
            chatLayer.appendChild(popup);

            // ESC 키로 팝업 닫기
            const handleEscKey = (event) => {
                if (event.key === 'Escape') {
                    this.hideCloseConfirmation();
                    document.removeEventListener('keydown', handleEscKey);
                }
            };
            document.addEventListener('keydown', handleEscKey);
        }

        /**
         * <pre>
         * [채팅 레이어 닫기 확인 팝업 숨기기]
         * </pre>
         */
        hideCloseConfirmation() {
            const popup = document.querySelector('.close-confirmation-popup');
            if (popup) {
                popup.remove();
            }
        }

        /**
         * <pre>
         * [채팅 레이어 닫기 확인 처리]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         */
        confirmCloseChatLayer(type) {
            // 채팅 내역 초기화
            if (this.messages[type]) {
                this.messages[type] = [];
            }
            
            // 채팅 레이어 닫기
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
            this.renderFloatingMenu();
            
            // 채팅방 닫기 시 전체 채팅방 리스트로 복귀
            if (this.openChatRoomId === type) {
                this.openChatRoomId = null;
                this.renderFloatingMenu();
            }
            
            // 팝업 닫기
            this.hideCloseConfirmation();
        }

        /**
         * <pre>
         * [채팅 레이어 닫기 - 기존 기능 유지]
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
            this.renderFloatingMenu();
            // 채팅방 닫기 시 전체 채팅방 리스트로 복귀
            if (this.openChatRoomId === type) {
                this.openChatRoomId = null;
                this.renderFloatingMenu();
            }
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
                    <i class="mdi mdi-robot minimized-icon"></i>
                    <span class="minimized-text">${minimizedTitle}</span>
                    <i class="mdi mdi-chevron-up restore-btn"></i>
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
            this.renderFloatingMenu();
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
            // 플로팅 메뉴만 숨기고 채팅방 정보는 유지
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
            const hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const isPM = hours >= 12;
            const hour12 = hours % 12 === 0 ? 12 : hours % 12;
            const ampm = isPM ? '오후' : '오전';
            
            return `${ampm} ${hour12}:${minutes}`;
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
                micPermissionGranted: this.micPermissionGranted, // 마이크 권한 상태 저장
                ratings: this.ratings // 별점 시스템 저장
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
                this.ratings = state.ratings || this.ratings; // 별점 시스템 로드
            }
        }

        /**
         * <pre>
         * [최소화된 채팅창 업데이트]
         * </pre>
         */
        updateMinimizedChatbots() {
            // 최소화된 챗봇 박스는 더 이상 생성하지 않음
            const container = document.getElementById('minimized-chatbots-container');
            if (container) container.innerHTML = '';
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
                
                // 투명도 슬라이더 색상을 테마에 맞게 변경
                this.updateSliderColor(type);
            }
            this.saveState();
        }

        /**
         * <pre>
         * [투명도 슬라이더 색상 업데이트]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         */
        updateSliderColor(type) {
            const chatLayer = document.querySelector(`[data-chat-type="${type}"]`);
            if (!chatLayer) return;
            
            const slider = chatLayer.querySelector('.transparency-slider');
            if (!slider) return;
            
            const config = this.getChatConfig(type);
            const themeColor = config.headerColor;
            
            // CSS 변수로 슬라이더 색상 설정
            slider.style.setProperty('--slider-thumb-color', themeColor);
        }

        // 음성 인식 관련 상태
        recognitionMap = {};
        isListeningMap = {};
        micPermissionGranted = this.loadMicPermissionState();

        /**
         * <pre>
         * [마이크 권한 상태 확인]
         * </pre>
         * @returns {Promise<boolean>} 권한 상태
         */
        /**
         * <pre>
         * [마이크 권한 상태 로드]
         * </pre>
         * 
         * @returns {boolean|undefined} 저장된 권한 상태 (true: 허용, false: 거부, undefined: 미확인)
         */
        loadMicPermissionState() {
            try {
                const saved = localStorage.getItem('chatbot_mic_permission');
                if (saved === 'true') return true;
                if (saved === 'false') return false;
                return undefined;
            } catch (e) {
                return undefined;
            }
        }

        /**
         * <pre>
         * [마이크 권한 상태 저장]
         * </pre>
         * 
         * @param {boolean} state 권한 상태
         */
        saveMicPermissionState(state) {
            try {
                localStorage.setItem('chatbot_mic_permission', state.toString());
                console.log('마이크 권한 상태 저장:', state);
            } catch (e) {
                console.log('로컬스토리지 저장 실패');
            }
        }

        /**
         * <pre>
         * [마이크 권한 확인]
         * </pre>
         * 
         * @returns {Promise<boolean>} 권한 확인 결과
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
            // 브라우저 권한 상태 실시간 확인
            try {
                if (navigator.permissions) {
                    const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
                    console.log('현재 브라우저 권한 상태:', permissionStatus.state);
                    
                    if (permissionStatus.state === 'granted') {
                        this.micPermissionGranted = true;
                        this.saveMicPermissionState(true);
                        return true;
                    } else if (permissionStatus.state === 'denied') {
                        this.micPermissionGranted = false;
                        this.saveMicPermissionState(false);
                        this.showNotification('마이크 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
                        return false;
                    }
                }
            } catch (e) {
                console.log('권한 상태 확인 실패:', e.message);
            }

            // 권한이 없거나 미확인 상태인 경우 권한 요청
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop()); // 권한만 확인하고 스트림은 즉시 중지
                this.micPermissionGranted = true;
                this.saveMicPermissionState(true);
                return true;
            } catch (error) {
                console.error('마이크 권한 요청 실패:', error);
                this.micPermissionGranted = false;
                this.saveMicPermissionState(false);
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

                // 브라우저 권한 상태 실시간 확인
                try {
                    if (navigator.permissions) {
                        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
                        if (permissionStatus.state === 'granted') {
                            this.micPermissionGranted = true;
                            this.saveMicPermissionState(true);
                        } else if (permissionStatus.state === 'denied') {
                            this.micPermissionGranted = false;
                            this.saveMicPermissionState(false);
                            this.showNotification('마이크 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
                            return;
                        }
                    }
                } catch (e) {
                    console.log('권한 상태 확인 실패:', e.message);
                }

                // 권한이 없거나 미확인 상태인 경우 권한 요청
                if (this.micPermissionGranted === undefined || this.micPermissionGranted === false) {
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
                    this.micPermissionGranted = true; // 성공적으로 시작되면 권한 있음
                    this.saveMicPermissionState(true); // 로컬스토리지에 저장
                    micBtn.innerHTML = `<i class="mdi mdi-microphone mic-icon active"></i>`;
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
                    
                    // 권한 관련 오류 처리
                    if (event.error === 'not-allowed') {
                        this.micPermissionGranted = false;
                        this.saveMicPermissionState(false);
                        this.showNotification('마이크 권한이 거부되었습니다.');
                    } else if (event.error === 'no-speech') {
                        this.showNotification('음성이 감지되지 않았습니다.');
                    } else {
                        this.showNotification('음성 인식 오류: ' + event.error);
                    }
                    
                    this.isListeningMap[type] = false;
                    micBtn.innerHTML = `<i class="mdi mdi-microphone-outline mic-icon"></i>`;
                };

                recognition.onend = () => {
                    console.log('음성 인식 종료');
                    this.isListeningMap[type] = false;
                    micBtn.innerHTML = `<i class="mdi mdi-microphone-outline mic-icon"></i>`;
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
                micBtn.innerHTML = `<i class="mdi mdi-microphone-outline mic-icon"></i>`;
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
                    // 세금계산서와 현장개통 채팅방에서는 Enter 키 입력 비활성화
                    if (type === 'tax-ai' || type === 'site-ai') {
                        return;
                    }
                    this.sendMessage(type);
                }
            }
        }

        handleSendClick(event) {
            const chatLayer = event.target.closest('.chat-layer');
            if (chatLayer) {
                const type = chatLayer.getAttribute('data-chat-type');
                // 세금계산서와 현장개통 채팅방에서는 전송 버튼 클릭 비활성화
                if (type === 'tax-ai' || type === 'site-ai') {
                    return;
                }
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

        /**
         * <pre>
         * [채팅방 진입]
         * </pre>
         * @param {string} id 채팅방 id
         */
        enterChatRoom(id) {
            this.openChatRoomId = id;
            this.createChatLayer(id); // 채팅 레이어를 즉시 생성
            this.renderFloatingMenu();
        }

        /**
         * <pre>
         * [루트 채팅창 닫기(X) - 대화내용 초기화 알림]
         * </pre>
         */
        handleRootClose() {
            // 커스텀 confirm 다이얼로그 생성
            const confirmDiv = document.createElement('div');
            // 플로팅메뉴 위치 기준으로 알림창 위치 계산
            const menu = document.querySelector('.floating-menu-root');
            let left = '50vw', top = '50vh', translate = '-50%, -50%';
            if (menu) {
                const rect = menu.getBoundingClientRect();
                // 오른쪽으로 1%만 이동
                const offset = window.innerWidth * 0.01;
                left = `${rect.left + rect.width/2 + offset}px`;
                top = `${rect.top + rect.height/2}px`;
                translate = '-50%, -50%';
            }
            confirmDiv.style.position = 'fixed';
            confirmDiv.style.left = left;
            confirmDiv.style.top = top;
            confirmDiv.style.transform = `translate(${translate})`;
            confirmDiv.style.background = 'rgba(0,0,0,0)';
            confirmDiv.style.zIndex = '99999';
            confirmDiv.innerHTML = `
                                <div class="popup-container">
                    <div class="popup-title">대화내용이 모두 초기화 됩니다</div>
                    <div class="popup-buttons">
                        <button id="chatbot-confirm-ok" class="btn-primary">확인</button>
                        <button id="chatbot-confirm-cancel" class="btn-secondary">취소</button>
                    </div>
                </div>
            `;
            document.body.appendChild(confirmDiv);
            document.getElementById('chatbot-confirm-ok').onclick = () => {
                // 모든 대화내용 및 minimized 상태 초기화
                Object.keys(this.messages).forEach(k => { this.messages[k] = []; });
                this.minimizedChatbots = [];
                // 모든 채팅방의 minimized 상태도 초기화
                Object.keys(this.chatLayers).forEach(k => {
                    this.chatLayers[k].isMinimized = false;
                    this.chatLayers[k].bShow = false;
                });
                this.saveState();
                // 루트 채팅창 닫기
                this.handleMinimize();
                document.body.removeChild(confirmDiv);
            };
            document.getElementById('chatbot-confirm-cancel').onclick = () => {
                document.body.removeChild(confirmDiv);
            };
        }

        /**
         * <pre>
         * [별점 매기기]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         * @param {string} messageId 메시지 ID
         * @param {number} rating 별점 (1-5)
         */
        rateMessage(type, messageId, rating) {
            if (!this.ratings[type]) {
                this.ratings[type] = {};
            }
            
            this.ratings[type][messageId] = rating;
            this.saveState();
            
            // 별점 UI 업데이트
            this.updateRatingUI(type, messageId, rating);
            
            // 추후 Supabase 연동 시 여기에 DB 저장 로직 추가
            // this.saveRatingToDatabase(type, messageId, rating);
        }

        /**
         * <pre>
         * [별점 UI 업데이트]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         * @param {string} messageId 메시지 ID
         * @param {number} rating 별점 (1-5)
         */
        updateRatingUI(type, messageId, rating) {
            const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
            if (!messageElement) return;
            
            const ratingContainer = messageElement.querySelector('.modern-rating-container');
            if (!ratingContainer) return;
            
            const starButtons = ratingContainer.querySelectorAll('.modern-star-btn');
            starButtons.forEach((btn, index) => {
                const starIndex = index + 1;
                const isRated = starIndex <= rating;
                
                if (isRated) {
                    btn.classList.add('rated');
                    btn.innerHTML = '<i class="mdi mdi-star"></i>';
                } else {
                    btn.classList.remove('rated');
                    btn.innerHTML = '<i class="mdi mdi-star-outline"></i>';
                }
            });
        }

        /**
         * <pre>
         * [저장된 별점 로드]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         */
        loadSavedRatings(type) {
            if (!this.ratings[type]) return;
            
            Object.keys(this.ratings[type]).forEach(messageId => {
                const rating = this.ratings[type][messageId];
                this.updateRatingUI(type, messageId, rating);
            });
        }

        /**
         * <pre>
         * [봇 메시지 배경색 계산]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         * @param {string} botMessageColor 봇 메시지 색상
         * @returns {string} 배경색
         */
        getBotBackgroundColor(type, botMessageColor) {
            // 현장개통/해지 도우미는 특별한 연한 초록색 적용
            if (type === 'site-ai') {
                return '#e6f4ea';
            }
            
            // 채팅방별 브랜드 색상에 맞는 연한 배경색 매핑
            const backgroundColorMap = {
                '#dc3545': '#fff0f0',  // 건설안전 - 연한 빨간색
                '#1976d2': '#e3f2fd',  // 위험성평가 - 연한 파란색
                '#4caf50': '#f1f8e9',  // 초록색 - 연한 초록색
                '#fee500': '#fff9c4',  // 카카오톡 - 연한 노란색
                '#ff8f00': '#fff0f0'   // 세금계산서 - 기본값
            };
            
            return backgroundColorMap[botMessageColor] || '#fff0f0';
        }

        /**
         * <pre>
         * [현장개통/해제 테마 CSS 변수 설정]
         * </pre>
         */
        setSiteAiTheme() {
            document.documentElement.style.setProperty('--site-ai-primary', '#4caf50');
            document.documentElement.style.setProperty('--site-ai-background', '#e6f4ea');
        }

        /**
         * <pre>
         * [별점 시스템 CSS 스타일 추가]
         * </pre>
         */
        addRatingStyles() {
            const existingStyle = document.getElementById('chatbot-styles');
            if (!existingStyle) return;
            
            // 이미 별점 스타일이 추가되었는지 확인
            if (existingStyle.textContent.includes('.modern-rating-container')) {
                return;
            }
            
            const ratingStyles = `
                /* 별점 시스템 스타일 */
                .modern-rating-container {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    margin-right: 8px;
                }

                .modern-stars {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                }

                .modern-star-btn {
                    padding: 2px !important;
                    min-width: 20px !important;
                    width: 20px !important;
                    height: 20px !important;
                    border-radius: 2px !important;
                    transition: all 0.2s ease;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modern-star-btn:hover {
                    transform: scale(1.1);
                }

                .modern-star-btn.rated {
                    background-color: transparent;
                }

                .modern-star-btn .mdi {
                    transition: all 0.2s ease;
                }

                .modern-star-btn:hover .mdi {
                    transform: scale(1.1);
                }

                /* 별점 기본 스타일 */
                .modern-star-btn .mdi {
                    font-size: 16px;
                    color: #ccc;
                    transition: all 0.2s ease;
                }

                /* 건설안전 별점 색상 */
                .modern-star-btn[data-theme="construction-safety"].rated .mdi {
                    color: #c53030;
                }

                /* 위험성평가 별점 색상 */
                .modern-star-btn[data-theme="risk-assessment"].rated .mdi {
                    color: #1976d2;
                }

                /* 피드백 텍스트 스타일 */
                .modern-feedback-text {
                    font-size: 10px;
                    color: #666;
                    text-align: right;
                    margin-top: 4px;
                    padding-right: 8px;
                }

                /* 마크다운 테이블 스타일 */
                .modern-md-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 8px 0;
                    font-size: 14px;
                }

                .modern-md-table th,
                .modern-md-table td {
                    border: 1px solid #ddd;
                    padding: 8px 12px;
                    text-align: left;
                }

                .modern-md-table th {
                    background-color: #f5f5f5;
                    font-weight: 600;
                }

                .modern-md-table tr:nth-child(even) {
                    background-color: #f9f9f9;
                }

                .modern-md-table tr:hover {
                    background-color: #f0f0f0;
                }

                /* 마크다운 헤더 스타일 */
                .modern-bot-text h1 {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 16px 0 8px 0;
                    color: #333;
                }

                .modern-bot-text h2 {
                    font-size: 18px;
                    font-weight: 600;
                    margin: 14px 0 6px 0;
                    color: #333;
                }

                .modern-bot-text h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 12px 0 6px 0;
                    color: #333;
                }

                /* 마크다운 리스트 스타일 */
                .modern-bot-text ul,
                .modern-bot-text ol {
                    margin: 8px 0;
                    padding-left: 20px;
                }

                .modern-bot-text li {
                    margin: 4px 0;
                    line-height: 1.5;
                }

                .modern-bot-text ul li {
                    list-style-type: disc;
                }

                .modern-bot-text ol li {
                    list-style-type: decimal;
                }

                /* 마크다운 단락 스타일 */
                .modern-bot-text p {
                    margin: 8px 0;
                    line-height: 1.6;
                }

                /* 마크다운 강조 스타일 */
                .modern-bot-text strong {
                    font-weight: 600;
                    color: #333;
                }

                .modern-bot-text em {
                    font-style: italic;
                }

                .modern-bot-text code {
                    background-color: #f5f5f5;
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    font-size: 13px;
                }

                /* 채팅방 닫기 확인 팝업 스타일 */
                .close-confirmation-popup {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .close-confirmation-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(2px);
                }

                .close-confirmation-modal {
                    position: relative;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    max-width: 400px;
                    width: 90%;
                    animation: popupFadeIn 0.3s ease-out;
                }

                @keyframes popupFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                .close-confirmation-content {
                    padding: 24px;
                }

                .close-confirmation-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 16px;
                }

                .close-confirmation-title i {
                    color: #f57c00;
                    font-size: 20px;
                }

                .close-confirmation-message {
                    font-size: 14px;
                    color: #666;
                    line-height: 1.5;
                    margin-bottom: 24px;
                }

                .close-confirmation-buttons {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                .close-confirmation-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-width: 80px;
                    flex: 1;
                    max-width: 120px;
                }

                .close-confirmation-btn.cancel-btn {
                    background-color: #f5f5f5;
                    color: #666;
                }

                .close-confirmation-btn.cancel-btn:hover {
                    background-color: #e0e0e0;
                }

                .close-confirmation-btn.confirm-btn {
                    background-color: #f57c00;
                    color: white;
                }

                .close-confirmation-btn.confirm-btn:hover {
                    background-color: #e65100;
                }

                /* 플로팅 메뉴 스타일 */
                .floating-menu-root {
                    width: 420px;
                    min-width: 420px;
                    max-width: 420px;
                }

                .sidebar-logo {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .sidebar-logo img {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                }

                .sidebar-chat {
                    margin: 8px 0;
                    cursor: pointer;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #ececec;
                    border-radius: 4px;
                }

                .sidebar-chat img {
                    width: 28px;
                    height: 28px;
                }

                .icon-minus {
                    font-size: 22px;
                    color: #333;
                }

                .icon-close {
                    font-size: 18px;
                    color: #333;
                    cursor: pointer;
                }

                .chat-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .chat-list {
                    display: flex;
                    flex-direction: column;
                }

                .chat-list.hidden {
                    display: none;
                }

                .chat-avatar {
                    /* 기본 스타일은 유지하고 data-theme으로 배경색 관리 */
                }

                .chat-avatar[data-theme="site-ai"] {
                    background: #4caf50;
                }

                .chat-avatar[data-theme="construction-safety"] {
                    background: #c53030;
                }

                .chat-avatar[data-theme="risk-assessment"] {
                    background: #1976d2;
                }

                .chat-avatar[data-theme="tax-ai"] {
                    background: #ff8f00;
                }

                .chat-avatar-icon {
                    font-size: 22px;
                    color: #fff;
                }

                .chat-badge {
                    background: #1976d2;
                }

                .chatbot-info-center {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    min-height: 320px;
                }

                .chatbot-info-center.hidden {
                    display: none;
                }

                .icon-plus {
                    font-size: 28px;
                }

                /* 사용자 메시지 스타일 */
                .modern-user-content {
                    /* 기본 스타일은 유지하고 data-theme으로 배경색 관리 */
                }

                .modern-user-content[data-theme="construction-safety"] {
                    background: #c53030;
                    border: 1.5px solid #c53030;
                }

                .modern-user-content[data-theme="risk-assessment"] {
                    background: #1976d2;
                    border: 1.5px solid #1976d2;
                }

                .modern-user-content[data-theme="tax-ai"] {
                    background: #ff8f00;
                    border: 1.5px solid #ff8f00;
                }

                .modern-user-content[data-theme="site-ai"] {
                    background: #4caf50;
                    border: 1.5px solid #4caf50;
                }

                .copy-icon {
                    font-size: 16px;
                    color: white;
                }

                .modern-user-icon {
                    /* 기본 스타일은 유지하고 data-theme으로 배경색 관리 */
                }

                .modern-user-icon[data-theme="construction-safety"] {
                    background: #c53030;
                }

                .modern-user-icon[data-theme="risk-assessment"] {
                    background: #1976d2;
                }

                .modern-user-icon[data-theme="tax-ai"] {
                    background: #ff8f00;
                }

                .modern-user-icon[data-theme="site-ai"] {
                    background: #4caf50;
                }

                .user-icon {
                    color: white;
                    font-size: 20px;
                }

                /* 봇 메시지 스타일 */
                .modern-bot-icon {
                    /* 기본 스타일은 유지하고 data-theme으로 배경색 관리 */
                }

                .modern-bot-icon[data-theme="site-ai"] {
                    background: #4caf50;
                }

                .modern-bot-icon[data-theme="construction-safety"] {
                    background: #c53030;
                }

                .modern-bot-icon[data-theme="risk-assessment"] {
                    background: #1976d2;
                }

                .modern-bot-icon[data-theme="tax-ai"] {
                    background: #ff8f00;
                }

                .bot-icon {
                    color: white;
                    font-size: 20px;
                }

                .modern-bot-content {
                    /* 기본 스타일은 유지하고 data-theme으로 테두리와 배경색 관리 */
                }

                .modern-bot-content[data-theme="site-ai"] {
                    border: 1.5px solid #4caf50;
                    background-color: #e6f4ea;
                }

                .modern-bot-content[data-theme="construction-safety"] {
                    border: 1.5px solid #c53030;
                    background-color: #fff0f0;
                }

                .modern-bot-content[data-theme="risk-assessment"] {
                    border: 1.5px solid #1976d2;
                    background-color: #e3f2fd;
                }

                .modern-bot-content[data-theme="tax-ai"] {
                    border: 1.5px solid #ff8f00;
                    background-color: #fff3e0;
                }

                .modern-bot-divider {
                    /* 기본 스타일은 유지하고 data-theme으로 배경색 관리 */
                }

                .modern-bot-divider[data-theme="site-ai"] {
                    background: #4caf50;
                }

                .modern-bot-divider[data-theme="construction-safety"] {
                    background: #c53030;
                }

                .modern-bot-divider[data-theme="risk-assessment"] {
                    background: #1976d2;
                }

                .modern-bot-divider[data-theme="tax-ai"] {
                    background: #ff8f00;
                }

                .flex-center {
                    display: flex;
                    align-items: center;
                }

                .copy-icon-theme {
                    font-size: 16px;
                }

                .copy-icon-theme[data-theme="site-ai"] {
                    color: #4caf50;
                }

                .copy-icon-theme[data-theme="construction-safety"] {
                    color: #c53030;
                }

                .copy-icon-theme[data-theme="risk-assessment"] {
                    color: #1976d2;
                }

                .copy-icon-theme[data-theme="tax-ai"] {
                    color: #ff8f00;
                }

                /* 채팅 헤더 스타일 */
                .chat-header {
                    /* 기본 스타일은 유지하고 data-theme으로 배경색 관리 */
                }

                .chat-header[data-theme="site-ai"] {
                    background: #4caf50;
                }

                .chat-header[data-theme="construction-safety"] {
                    background: #c53030;
                }

                .chat-header[data-theme="risk-assessment"] {
                    background: #1976d2;
                }

                .chat-header[data-theme="tax-ai"] {
                    background: #ff8f00;
                }

                .chat-title {
                    color: white;
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                }

                /* 채팅방 리스트의 chat-title은 검은색으로 */
                .floating-menu-main .chat-title {
                    color: #000;
                }

                .chat-status {
                    color: rgba(255,255,255,0.8);
                    margin: 0;
                    font-size: 14px;
                }

                .header-icon {
                    color: white;
                    font-size: 18px;
                }

                /* 채팅 입력 영역 */
                .chat-input-area.disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }

                .transparency-slider {
                    width: 80px;
                }

                .mic-icon {
                    font-size: 26px;
                }

                .mic-icon.disabled {
                    color: #ccc;
                }

                .send-icon {
                    font-size: 20px;
                }

                .send-icon.disabled {
                    color: #ccc;
                }

                .mic-icon.active {
                    color: #f44336;
                }

                /* 미니마이즈된 채팅봇 */
                .minimized-icon {
                    color: white;
                    font-size: 24px;
                }

                .restore-btn {
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                }

                /* 팝업 스타일 */
                .popup-container {
                    background: #fff;
                    padding: 32px 28px 24px 28px;
                    border-radius: 12px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
                    min-width: 320px;
                    max-width: 90vw;
                    text-align: center;
                }

                .popup-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 18px;
                    letter-spacing: -0.01em;
                }

                .popup-content {
                    font-size: 15px;
                    line-height: 1.7;
                    margin-bottom: 18px;
                }

                .popup-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 18px;
                    margin-top: 12px;
                }

                .btn-primary {
                    background: #1976d2;
                    color: #fff;
                    font-weight: 500;
                    padding: 8px 24px;
                    border: none;
                    border-radius: 6px;
                    font-size: 15px;
                    cursor: pointer;
                    letter-spacing: -0.01em;
                }

                .btn-secondary {
                    background: #ececec;
                    color: #333;
                    font-weight: 600;
                    padding: 8px 24px;
                    border: none;
                    border-radius: 6px;
                    font-size: 15px;
                    cursor: pointer;
                }

                .btn-success {
                    background: #4caf50;
                    color: #fff;
                    font-weight: 600;
                    padding: 10px 18px;
                    border: none;
                    border-radius: 6px;
                    font-size: 15px;
                    cursor: pointer;
                }

                .btn-info {
                    background: #1976d2;
                    color: #fff;
                    font-weight: 600;
                    padding: 10px 18px;
                    border: none;
                    border-radius: 6px;
                    font-size: 15px;
                    cursor: pointer;
                }

                .text-primary {
                    color: #1976d2;
                    font-weight: 700;
                }

                .text-info {
                    font-size: 13px;
                    font-weight: 700;
                    color: #222;
                }

                /* 로딩 스피너 */
                .loading-spinner {
                    animation: rotate 2s linear infinite;
                }

                .loading-circle {
                    animation: dash 1.5s ease-in-out infinite;
                }

                /* 세금계산서 버튼 스타일 */
                .tax-button-container {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-top: 12px;
                }

                .tax-button {
                    background: #ff8f00;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 16px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: left;
                    width: 100%;
                }

                .tax-button:hover {
                    background: #e67e00;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 143, 0, 0.3);
                }

                .tax-button:active {
                    transform: translateY(0);
                }

                /* 세금계산서 발행 폼 스타일 */
                .tax-form-container {
                    margin-top: 16px;
                }

                .tax-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                }

                .form-group input,
                .form-group textarea {
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.2s ease;
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #ff8f00;
                    box-shadow: 0 0 0 2px rgba(255, 143, 0, 0.1);
                }

                .radio-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .radio-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 4px;
                    transition: background-color 0.2s ease;
                }

                .radio-label:hover {
                    background-color: #f5f5f5;
                }

                .radio-label input[type="radio"] {
                    margin: 0;
                }

                .radio-label span {
                    font-size: 14px;
                    color: #333;
                }

                .form-submit {
                    margin-top: 8px;
                }

                .button-group {
                    display: flex;
                    gap: 12px;
                }

                .submit-btn,
                .cancel-btn {
                    flex: 1;
                    padding: 12px 24px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }

                .submit-btn {
                    background: #ff8f00;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .submit-btn:hover {
                    background: #e67e00;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 143, 0, 0.3);
                }

                .submit-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                /* 로딩 스피너 */
                .loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 1s ease-in-out infinite;
                }

                .loading-spinner-large {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    border: 3px solid rgba(255, 143, 0, 0.3);
                    border-radius: 50%;
                    border-top-color: #ff8f00;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 12px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .loading-text {
                    opacity: 0.8;
                }

                .loading-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .loading-message .modern-bot-text {
                    text-align: center;
                }

                .submit-btn:active {
                    transform: translateY(0);
                }

                .cancel-btn {
                    background: #f5f5f5;
                    color: #666;
                    border: 1px solid #ddd;
                }

                .cancel-btn:hover {
                    background: #e8e8e8;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .cancel-btn:active {
                    transform: translateY(0);
                }
            `;
            
            existingStyle.textContent += ratingStyles;
        }

        /**
         * <pre>
         * [별점 색상 가져오기]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         * @param {boolean} isRated 별점 클릭 여부
         * @returns {string} 별점 색상
         */
        getStarColor(type, isRated) {
            if (!isRated) {
                return '#ccc'; // 클릭하지 않은 별점은 회색
            }
            
            // 채팅방별 별점 색상
            const starColorMap = {
                'construction-safety': '#c53030', // 건설안전 - 빨간색
                'risk-assessment': '#1976d2'      // 위험성평가 - 파란색
            };
            
            return starColorMap[type] || '#ffd700'; // 기본값 - 노란색
        }

        /**
         * <pre>
         * [별점 HTML 생성]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         * @param {string} messageId 메시지 ID
         * @returns {string} 별점 HTML
         */
        createRatingHTML(type, messageId) {
            // 위험성평가와 건설안전에만 별점 표시
            if (type !== 'construction-safety' && type !== 'risk-assessment') {
                return '';
            }
            
            const currentRating = this.ratings[type] && this.ratings[type][messageId] ? this.ratings[type][messageId] : 0;
            
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                const isRated = i <= currentRating;
                const starIcon = isRated ? 'mdi-star' : 'mdi-star-outline';
                
                starsHTML += `
                    <button class="modern-star-btn ${isRated ? 'rated' : ''}" 
                            data-theme="${type}"
                            onclick="window.chatbotApp.rateMessage('${type}', '${messageId}', ${i})" 
                            aria-label="${i}점">
                        <i class="mdi ${starIcon}"></i>
                    </button>
                `;
            }
            
            return `
                <div class="modern-rating-container">
                    <div class="modern-stars">
                        ${starsHTML}
                    </div>
                </div>
            `;
        }

        /**
         * <pre>
         * [색상 어둡게 만들기]
         * </pre>
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
         * [세금계산서 버튼 HTML 생성]
         * </pre>
         * 
         * @returns {string} 세금계산서 버튼 HTML
         */
        createTaxButtonsHTML() {
            return `
                <div class="tax-button-container">
                    <button class="tax-button" onclick="window.chatbotApp.handleTaxButtonClick('세금계산서발행')">
                        📄 세금계산서 발행
                    </button>
                    <button class="tax-button" onclick="window.chatbotApp.handleTaxButtonClick('세금계산서조회')">
                        🔍 세금계산서 조회
                    </button>
                    <br>
                </div>
            `;
        }

        /**
         * <pre>
         * [세금계산서 버튼 클릭 처리]
         * </pre>
         * 
         * @param {string} buttonType 버튼 타입
         */
        handleTaxButtonClick(buttonType) {
            const chatLayer = document.querySelector('[data-chat-type="tax-ai"]');
            if (!chatLayer) return;

            if (buttonType === '세금계산서발행') {
                // 세금계산서 발행 폼 메시지 표시
                const messagesContainer = chatLayer.querySelector('.chat-messages');
                const config = this.getChatConfig('tax-ai');
                
                const formMessage = document.createElement('div');
                formMessage.className = 'message bot';
                formMessage.innerHTML = `
                    <div class="modern-bot-icon" data-theme="tax-ai">
                        <i class="mdi mdi-robot bot-icon"></i>
                    </div>
                    <div class="modern-bot-content" data-theme="tax-ai">
                        <div class="modern-bot-text">
                            세금계산서 발행을 위해 아래 정보를 입력해주세요.
                        </div>
                        ${this.createTaxInvoiceFormHTML()}
                    </div>
                `;
                messagesContainer.appendChild(formMessage);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else if (buttonType === '세금계산서조회') {
                // 세금계산서 조회 폼 메시지 표시
                const messagesContainer = chatLayer.querySelector('.chat-messages');
                const config = this.getChatConfig('tax-ai');
                
                const formMessage = document.createElement('div');
                formMessage.className = 'message bot';
                formMessage.innerHTML = `
                    <div class="modern-bot-icon" data-theme="tax-ai">
                        <i class="mdi mdi-robot bot-icon"></i>
                    </div>
                    <div class="modern-bot-content" data-theme="tax-ai">
                        <div class="modern-bot-text">
                            세금계산서 발행시 발급된 접수번호를 입력해주세요.
                        </div>
                        ${this.createTaxInvoiceSearchFormHTML()}
                    </div>
                `;
                messagesContainer.appendChild(formMessage);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else {
                // 기존 방식으로 처리 (기타 버튼들)
                const input = chatLayer.querySelector('.chat-input');
                if (!input) return;

                let message = `${buttonType}에 대해 알려주세요.`;
                input.value = message;
                input.focus();
                
                // 자동으로 메시지 전송
                setTimeout(() => {
                    this.sendMessage('tax-ai');
                }, 100);
            }
        }

        /**
         * <pre>
         * [세금계산서 발행 입력 폼 HTML 생성]
         * </pre>
         * 
         * @returns {string} 세금계산서 발행 입력 폼 HTML
         */
        createTaxInvoiceFormHTML() {
            return `
                <div class="tax-form-container">
                    <form class="tax-form" onsubmit="window.chatbotApp.handleTaxFormSubmit(event)">
                        <div class="form-group">
                            <label for="company-name">회사명</label>
                            <input type="text" id="company-name" name="companyName" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="site-name">현장명</label>
                            <input type="text" id="site-name" name="siteName" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="tax-period">과금연월</label>
                            <input type="date" id="tax-period" name="taxPeriod" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="issue-date">발행일자</label>
                            <input type="date" id="issue-date" name="issueDate" required>
                        </div>
                        
                        <div class="form-group">
                            <label>발행문서</label>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" name="issueDocument" value="세금계산서" required>
                                    <span>세금계산서</span>
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="issueDocument" value="세금계산서+거래명세서" required>
                                    <span>세금계산서+거래명세서</span>
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="issueDocument" value="거래명세서" required>
                                    <span>거래명세서</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact-name">이름</label>
                            <input type="text" id="contact-name" name="contactName" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact-phone">연락처</label>
                            <input type="text" id="contact-phone" name="contactPhone" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact-email">이메일(세금계산서 발행 받을 주소)</label>
                            <input type="email" id="contact-email" name="contactEmail" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="remarks">비고(추가문의사항)</label>
                            <textarea id="remarks" name="remarks" rows="3"></textarea>
                        </div>
                        
                        <div class="form-submit">
                            <div class="button-group">
                                <button type="submit" class="submit-btn">전송</button>
                                <button type="button" class="cancel-btn" onclick="window.chatbotApp.handleTaxFormCancel()">취소</button>
                            </div>
                        </div>
                    </form>
                </div>
            `;
        }

        /**
         * <pre>
         * [세금계산서 발행 폼 제출 처리]
         * </pre>
         * 
         * @param {Event} event 폼 제출 이벤트
         */
        handleTaxFormSubmit(event) {
            event.preventDefault();
            
            // 로딩 메시지 추가
            const chatLayer = document.querySelector('[data-chat-type="tax-ai"]');
            if (chatLayer) {
                const messagesContainer = chatLayer.querySelector('.chat-messages');
                const loadingMsg = this.createLoadingMessage('tax-ai', '세금계산서 발행 중...');
                messagesContainer.appendChild(loadingMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            // 접수번호 생성
            const receiptNumber = this.constructor.generateTaxReceiptNumber();
            const now = new Date();

            // n8n tax.js에 맞는 데이터 변환 + actionNo 추가
            const payload = {
                receiptNumber,
                companyName: data.companyName,
                siteName: data.siteName,
                billingMonth: data.taxPeriod, // 과금연월
                issueDate: data.issueDate,
                contactName: data.contactName,
                phoneNumber: data.contactPhone,
                email: data.contactEmail,
                requestedDocuments: data.issueDocument,
                notes: data.remarks,
                timestamp: this.constructor.getKoreanDatetimeString(now), // 한국식 포맷
                actionNo: 1 // 발행: 1
            };

            fetch('https://ai-chatbot.myconst.com/webhook/chatbot/tax', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.ok ? res.text() : Promise.reject(res))
            .then(resultText => {
                // 로딩 메시지 제거
                const loadingMsg = chatLayer.querySelector('.loading-message');
                if (loadingMsg) {
                    loadingMsg.remove();
                }
                
                // n8n에서 반환한 안내 메시지를 그대로 채팅창에 출력 (text)
                if (chatLayer && resultText) {
                    const messagesContainer = chatLayer.querySelector('.chat-messages');
                    const msg = document.createElement('div');
                    msg.className = 'message bot';
                    msg.innerHTML = `
                        <div class=\"modern-bot-icon\" data-theme=\"tax-ai\">\n                    <i class=\"mdi mdi-robot bot-icon\"></i>\n                </div>\n                <div class=\"modern-bot-content\" data-theme=\"tax-ai\">\n                    <div class=\"modern-bot-text\">\n                        ${resultText}\n                    </div>\n                </div>\n            `;
                    messagesContainer.appendChild(msg);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            })
            .catch(err => {
                // 로딩 메시지 제거
                const loadingMsg = chatLayer.querySelector('.loading-message');
                if (loadingMsg) {
                    loadingMsg.remove();
                }
                
                alert('세금계산서 발행 요청 전송에 실패했습니다. 다시 시도해 주세요.');
            });
        }

        /**
         * <pre>
         * [발행문서 타입 텍스트 변환]
         * </pre>
         * 
         * @param {string} documentType 문서 타입
         * @returns {string} 표시 텍스트
         */
        getDocumentTypeText(documentType) {
            switch (documentType) {
                case 'tax-invoice':
                    return '세금계산서';
                case 'tax-invoice-detail':
                    return '세금계산서+거래명세서';
                case 'detail':
                    return '거래명세서';
                default:
                    return documentType;
            }
        }

        /**
         * <pre>
         * [세금계산서 발행 폼 취소 처리]
         * </pre>
         */
        handleTaxFormCancel() {
            const chatLayer = document.querySelector('[data-chat-type="tax-ai"]');
            if (!chatLayer) return;

            const messagesContainer = chatLayer.querySelector('.chat-messages');
            
            // 폼 메시지 제거 (마지막 메시지가 폼이므로 제거)
            const lastMessage = messagesContainer.lastElementChild;
            if (lastMessage && lastMessage.querySelector('.tax-form-container')) {
                lastMessage.remove();
            }
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        /**
         * <pre>
         * [세금계산서 조회 입력 폼 HTML 생성]
         * </pre>
         * 
         * @returns {string} 세금계산서 조회 입력 폼 HTML
         */
        createTaxInvoiceSearchFormHTML() {
            return `
                <div class="tax-form-container">
                    <form class="tax-form" onsubmit="window.chatbotApp.handleTaxSearchFormSubmit(event)">
                        <div class="form-group">
                            <label for="receipt-number">접수번호</label>
                            <input type="text" id="receipt-number" name="receiptNumber" required>
                        </div>
                        
                        <div class="form-submit">
                            <div class="button-group">
                                <button type="submit" class="submit-btn" id="tax-search-submit-btn">조회</button>
                                <button type="button" class="cancel-btn" onclick="window.chatbotApp.handleTaxFormCancel()">취소</button>
                            </div>
                        </div>
                    </form>
                </div>
            `;
        }

        /**
         * <pre>
         * [세금계산서 조회 로딩 메시지 생성]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         * @returns {HTMLElement} 로딩 메시지 요소
         */
        createTaxSearchLoadingMessage(type) {
            const config = this.getChatConfig(type);
            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'message bot loading-message';
            loadingMsg.innerHTML = `
                <div class="modern-bot-icon" style="background: ${config.botMessageColor};">
                    <i class="mdi mdi-robot" style="color: white; font-size: 20px;"></i>
                </div>
                <div class="modern-bot-content" style="border: 1.5px solid ${config.botMessageColor}; background-color: #fff0f0;">
                    <div class="modern-bot-text">
                        <div class="loading-container">
                            <div class="loading-spinner-large"></div>
                            <div class="loading-text">세금계산서 조회 중...</div>
                        </div>
                    </div>
                </div>
            `;
            return loadingMsg;
        }

        /**
         * <pre>
         * [공통 로딩 메시지 생성]
         * </pre>
         * 
         * @param {string} type 채팅 타입
         * @param {string} loadingText 로딩 텍스트
         * @returns {HTMLElement} 로딩 메시지 요소
         */
        createLoadingMessage(type, loadingText) {
            const config = this.getChatConfig(type);
            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'message bot loading-message';
            
            // 현장개통/해지: 연한 연두색, 위험성평가: 연한 파랑색, 그 외: 연한 분홍색
            let backgroundColor = '#fff0f0';
            if (type === 'site-ai') {
                backgroundColor = '#e6f4ea';
            } else if (type === 'risk-assessment') {
                backgroundColor = '#e3f2fd';
            }

            loadingMsg.innerHTML = `
                <div class="modern-bot-icon" style="background: ${config.botMessageColor};">
                    <i class="mdi mdi-robot" style="color: white; font-size: 20px;"></i>
                </div>
                <div class="modern-bot-content" style="border: 1.5px solid ${config.botMessageColor}; background-color: ${backgroundColor};">
                    <div class="modern-bot-text">
                        <div class="loading-container">
                            <div class="loading-spinner-large"></div>
                            <div class="loading-text">${loadingText}</div>
                        </div>
                    </div>
                </div>
            `;
            return loadingMsg;
        }

        /**
         * <pre>
         * [세금계산서 조회 폼 제출 처리]
         * </pre>
         * 
         * @param {Event} event 폼 제출 이벤트
         */
        handleTaxSearchFormSubmit(event) {
            event.preventDefault();
            
            // 버튼 비활성화
            const submitBtn = event.target.querySelector('#tax-search-submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = '조회 중...';
            
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            const now = new Date();

            // n8n tax.js에 맞는 데이터 변환 + actionNo 추가
            const payload = {
                receiptNumber: data.receiptNumber,
                timestamp: this.constructor.getKoreanDatetimeString(now), // 한국식 포맷
                actionNo: 2 // 조회: 2
            };

            // 로딩 메시지 추가
            const chatLayer = document.querySelector('[data-chat-type="tax-ai"]');
            if (chatLayer) {
                const messagesContainer = chatLayer.querySelector('.chat-messages');
                const loadingMsg = this.createTaxSearchLoadingMessage('tax-ai');
                messagesContainer.appendChild(loadingMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            fetch('https://ai-chatbot.myconst.com/webhook/chatbot/tax', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.ok ? res.text() : Promise.reject(res))
            .then(resultText => {
                // 로딩 메시지 제거
                const loadingMsg = chatLayer.querySelector('.loading-message');
                if (loadingMsg) {
                    loadingMsg.remove();
                }
                
                // 버튼 상태 복원
                submitBtn.disabled = false;
                submitBtn.textContent = '조회';
                
                // n8n에서 반환한 안내 메시지를 그대로 채팅창에 출력 (text)
                if (chatLayer && resultText) {
                    const messagesContainer = chatLayer.querySelector('.chat-messages');
                    const config = this.getChatConfig('tax-ai');
                    const msg = document.createElement('div');
                    msg.className = 'message bot';
                    msg.innerHTML = `
                        <div class=\"modern-bot-icon\" style=\"background: ${config.botMessageColor};\">\n                    <i class=\"mdi mdi-robot\" style=\"color: white; font-size: 20px;\"></i>\n                </div>\n                <div class=\"modern-bot-content\" style=\"border: 1.5px solid ${config.botMessageColor}; background-color: #fff0f0;\">\n                    <div class=\"modern-bot-text\">\n                        ${resultText}\n                    </div>\n                </div>\n            `;
                    messagesContainer.appendChild(msg);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            })
            .catch(err => {
                // 로딩 메시지 제거
                const loadingMsg = chatLayer.querySelector('.loading-message');
                if (loadingMsg) {
                    loadingMsg.remove();
                }
                
                // 버튼 상태 복원
                submitBtn.disabled = false;
                submitBtn.textContent = '조회';
                
                alert('세금계산서 조회 요청 전송에 실패했습니다. 다시 시도해 주세요.');
            });
        }

        // === static 메서드로 추가 ===
        static getKoreanDatetimeString(date = new Date()) {
            return date.toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            });
        }

        static generateTaxReceiptNumber() {
            const now = new Date();
            const pad = (n, len = 2) => n.toString().padStart(len, '0');
            return 'TAX' +
                now.getFullYear() +
                pad(now.getMonth() + 1) +
                pad(now.getDate()) +
                pad(now.getHours()) +
                pad(now.getMinutes()) +
                pad(now.getSeconds()) +
                pad(now.getMilliseconds(), 3);
        }

        handleSiteAiButtonClick(type) {
            if (type === '신청') {
                const existingPopup = document.getElementById('site-ai-popup');
                if (existingPopup) existingPopup.remove();

                const chatLayer = document.querySelector('.chat-layer[data-chat-type="site-ai"]');
                if (!chatLayer) return;

                const rect = chatLayer.getBoundingClientRect();

                const popup = document.createElement('div');
                popup.id = 'site-ai-popup';
                popup.style.position = 'fixed';
                popup.style.left = `${rect.left + rect.width / 2}px`;
                popup.style.top = `${rect.top + rect.height / 2}px`;
                popup.style.transform = 'translate(-50%, -50%)';
                popup.style.background = 'rgba(0,0,0,0.25)';
                popup.style.zIndex = '99999';
                popup.style.width = `${rect.width}px`;
                popup.style.height = `${rect.height}px`;
                popup.style.display = 'flex';
                popup.style.alignItems = 'center';
                popup.style.justifyContent = 'center';
                popup.innerHTML = `
                    <div class="popup-container">
                      <div class="popup-title">현장개통/해지 신청 안내</div>
                      <div class="popup-content">
                        현장개통 또는 해지를 원하실 경우, 아래의 신청/해지서를 다운로드하여 작성 후<br>
                        <span class="text-primary"><b>신청/해지서 업로드</b></span> 버튼을 클릭하셔서 업로드 하시면 됩니다.<br><br>
                        <span class="text-info">※ 신청/해지서에는 현장명, 담당자명, 연락처, 요청내용 등이 포함되어야 합니다.</span>
                      </div>
                      <div class="popup-buttons">
                        <button id="site-ai-download-btn" class="btn-success">신청/해지서 다운로드</button>
                        <button id="site-ai-upload-btn" class="btn-info">신청/해지서 업로드</button>
                        <button id="site-ai-close-btn" class="btn-secondary">닫기</button>
                      </div>
                    </div>
                `;
                document.body.appendChild(popup);
                document.getElementById('site-ai-close-btn').onclick = () => {
                    popup.remove();
                };
                // 다운로드 버튼 이벤트 (text 응답)
                document.getElementById('site-ai-download-btn').onclick = () => {
                    fetch('https://ai-chatbot.myconst.com/webhook/chatbot/project', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ actionNo: 1 })
                    })
                    .then(res => res.ok ? res.text() : Promise.reject(res))
                    .then(resultText => {
                        if (resultText && resultText.startsWith('http')) {
                            window.open(resultText, '_blank');
                        } else {
                            alert(resultText || '다운로드 링크를 받을 수 없습니다. 관리자에게 문의해 주세요.');
                        }
                    })
                    .catch(() => {
                        alert('다운로드 요청에 실패했습니다. 다시 시도해 주세요.');
                    });
                };
                // 업로드 버튼 이벤트 (파일 업로드)
                document.getElementById('site-ai-upload-btn').onclick = () => {
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = '*/*';
                    fileInput.onchange = () => {
                        if (fileInput.files && fileInput.files.length > 0) {
                            // 팝업 닫기
                            popup.remove();
                            
                            // 로딩 메시지 추가
                            const chatLayer = document.querySelector('.chat-layer[data-chat-type="site-ai"]');
                            if (chatLayer) {
                                const messagesContainer = chatLayer.querySelector('.chat-messages');
                                const loadingMsg = this.createLoadingMessage('site-ai', '신청/해지서 업로드 중...');
                                messagesContainer.appendChild(loadingMsg);
                                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                            }
                            
                            const formData = new FormData();
                            formData.append('file', fileInput.files[0]);
                            formData.append('actionNo', 2);
                            fetch('https://ai-chatbot.myconst.com/webhook/chatbot/project', {
                                method: 'POST',
                                body: formData
                            })
                            .then(res => res.ok ? res.text() : Promise.reject(res))
                            .then(resultText => {
                                // 로딩 메시지 제거
                                const loadingMsg = chatLayer.querySelector('.loading-message');
                                if (loadingMsg) {
                                    loadingMsg.remove();
                                }
                                
                                // 서버 응답을 직접 표시
                                if (chatLayer) {
                                    const messagesContainer = chatLayer.querySelector('.chat-messages');
                                    const config = this.getChatConfig('site-ai');
                                    const msg = document.createElement('div');
                                    msg.className = 'message bot';
                                    msg.innerHTML = `
                                        <div class=\"modern-bot-icon\" style=\"background: ${config.botMessageColor};\">
                                            <i class=\"mdi mdi-robot\" style=\"color: white; font-size: 20px;\"></i>
                                        </div>
                                        <div class=\"modern-bot-content\" style=\"border: 1.5px solid ${config.botMessageColor}; background-color: ${this.getBotBackgroundColor('site-ai', config.botMessageColor)};\">
                                            <div class=\"modern-bot-text\">
                                                ${resultText || '업로드가 완료되었습니다.'}
                                            </div>
                                        </div>
                                    `;
                                    messagesContainer.appendChild(msg);
                                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                                }
                            })
                            .catch(() => {
                                // 에러 안내를 챗봇 메시지로 출력
                                const chatLayer = document.querySelector('.chat-layer[data-chat-type="site-ai"]');
                                if (chatLayer) {
                                    const messagesContainer = chatLayer.querySelector('.chat-messages');
                                    const config = window.chatbotApp.getChatConfig('site-ai');
                                    const msg = document.createElement('div');
                                    msg.className = 'message bot';
                                    msg.innerHTML = `
                                        <div class=\"modern-bot-icon site-ai-theme\">
                                            <i class=\"mdi mdi-robot\" style=\"color: white; font-size: 20px;\"></i>
                                        </div>
                                        <div class=\"modern-bot-content site-ai-theme\">
                                            <div class=\"modern-bot-text\">
                                                업로드 요청에 실패했습니다. 다시 시도해 주세요.
                                            </div>
                                        </div>
                                    `;
                                    messagesContainer.appendChild(msg);
                                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                                }
                                // 로딩바 제거, 팝업 닫기
                                if (loading) loading.remove();
                                const popup = document.getElementById('site-ai-popup');
                                if (popup) popup.remove();
                            });
                        }
                    };
                    fileInput.click();
                };
            } else if (type === '조회') {
                // 챗봇에 입력폼 메시지 추가
                const chatLayer = document.querySelector('.chat-layer[data-chat-type="site-ai"]');
                if (chatLayer) {
                    const messagesContainer = chatLayer.querySelector('.chat-messages');
                    const config = window.chatbotApp.getChatConfig('site-ai');
                    // 입력폼 메시지 컨테이너
                    const msg = document.createElement('div');
                    msg.className = 'message bot';
                    msg.id = 'site-ai-search-form-msg';
                    msg.innerHTML = `
                        <style>
                            #site-ai-search-btn:hover { background: #388e3c !important; }
                            #site-ai-search-close-btn:hover { background: #bdbdbd !important; color: #222 !important; }
                        </style>
                        <div class=\"modern-bot-icon\" style=\"background: #4caf50;\">
                            <i class=\"mdi mdi-robot\" style=\"color: white; font-size: 20px;\"></i>
                        </div>
                        <div class=\"modern-bot-content\" style=\"border: 1.5px solid #4caf50; background-color: #e6f4ea;\">
                            <div class=\"modern-bot-text\" style=\"margin-bottom:12px;\">
                                현장개통/해지 신청시 발급받은 접수번호를 입력해주세요.
                            </div>
                            <div class=\"tax-form-container\">
                                <form class=\"tax-form\" id=\"site-ai-search-form\">
                                    <div class=\"form-group\">
                                        <label for=\"site-ai-receipt-input\">접수번호</label>
                                        <input type=\"text\" id=\"site-ai-receipt-input\" name=\"receiptNumber\" required>
                                    </div>
                                    <div class=\"form-submit\">
                                        <div class=\"button-group\">
                                            <button type=\"submit\" class=\"submit-btn\" style=\"background:#4caf50;color:#fff;\">조회</button>
                                            <button type=\"button\" class=\"cancel-btn\" id=\"site-ai-search-close-btn\">닫기</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    `;
                    messagesContainer.appendChild(msg);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    // 조회/닫기 버튼 이벤트 및 로딩바, fetch 등 기존 로직은 그대로 유지
                    const form = msg.querySelector('#site-ai-search-form');
                    form.onsubmit = (e) => {
                        e.preventDefault();
                        const receiptInput = document.getElementById('site-ai-receipt-input');
                        const receiptNumber = receiptInput.value.trim();
                        if (!receiptNumber) {
                            // 입력폼 아래에 안내 메시지(챗봇 말풍선) 출력
                            const chatLayer = document.querySelector('.chat-layer[data-chat-type="site-ai"]');
                            if (chatLayer) {
                                const messagesContainer = chatLayer.querySelector('.chat-messages');
                                const msgWarn = document.createElement('div');
                                msgWarn.className = 'message bot';
                                msgWarn.innerHTML = `
                                    <div class=\"modern-bot-icon\" style=\"background: #4caf50;\">
                                        <i class=\"mdi mdi-robot\" style=\"color: white; font-size: 20px;\"></i>
                                    </div>
                                    <div class=\"modern-bot-content\" style=\"border: 1.5px solid #4caf50; background-color: #e6f4ea;\">
                                        <div class=\"modern-bot-text\">접수번호를 입력해주세요.</div>
                                    </div>
                                `;
                                messagesContainer.appendChild(msgWarn);
                                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                            }
                            receiptInput.focus();
                            return;
                        }
                        // 입력폼 메시지 제거
                        msg.remove();
                        
                        // 로딩 메시지 추가
                        const loadingMsg = this.createLoadingMessage('site-ai', '현장개통/해지 조회 중...');
                        messagesContainer.appendChild(loadingMsg);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        // 조회 요청
                        fetch('https://ai-chatbot.myconst.com/webhook/chatbot/project', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ actionNo: 3, receiptNumber })
                        })
                        .then(res => res.ok ? res.text() : Promise.reject(res))
                        .then(responseText => {
                            // 로딩 메시지 제거
                            const loadingMsg = messagesContainer.querySelector('.loading-message');
                            if (loadingMsg) {
                                loadingMsg.remove();
                            }
                            
                            // 응답 메시지 챗봇에 출력
                            const resultMsg = document.createElement('div');
                            resultMsg.className = 'message bot';
                            resultMsg.innerHTML = `
                                <div class=\"modern-bot-icon\" style=\"background: #4caf50 !important;\">
                                    <i class=\"mdi mdi-robot\" style=\"color: white; font-size: 20px;\"></i>
                                </div>
                                <div class=\"modern-bot-content\" style=\"border: 1.5px solid #4caf50 !important; background: #e6f4ea !important;\">
                                    <div class=\"modern-bot-text\">
                                        ${responseText}
                                    </div>
                                </div>
                            `;
                            messagesContainer.appendChild(resultMsg);
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        })
                        .catch(() => {
                            // 로딩 메시지 제거
                            const loadingMsg = messagesContainer.querySelector('.loading-message');
                            if (loadingMsg) {
                                loadingMsg.remove();
                            }
                            
                            // 에러 메시지 챗봇에 출력
                            const resultMsg = document.createElement('div');
                            resultMsg.className = 'message bot';
                            resultMsg.innerHTML = `
                                <div class=\"modern-bot-icon\" style=\"background: #4caf50 !important;\">
                                    <i class=\"mdi mdi-robot\" style=\"color: white; font-size: 20px;\"></i>
                                </div>
                                <div class=\"modern-bot-content\" style=\"border: 1.5px solid #4caf50 !important; background: #e6f4ea !important;\">
                                    <div class=\"modern-bot-text\">
                                        조회 요청에 실패했습니다. 다시 시도해 주세요.
                                    </div>
                                </div>
                            `;
                            messagesContainer.appendChild(resultMsg);
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        });
                    };
                    // 닫기 버튼 이벤트
                    document.getElementById('site-ai-search-close-btn').onclick = () => {
                        msg.remove();
                    };
                }
            }
            // ...기타 버튼 처리...
        }

        /**
         * <pre>
         * [인라인 마크다운 포맷팅]
         * </pre>
         * 
         * @param {string} text 포맷팅할 텍스트
         * @returns {string} HTML로 변환된 텍스트
         */
        formatInlineMarkdown(text) {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code>$1</code>');
        }

        /**
         * <pre>
         * [마크다운 파싱 - 중첩 리스트 및 테이블 지원]
         * </pre>
         * 
         * @param {string} text 파싱할 마크다운 텍스트
         * @returns {string} HTML로 변환된 텍스트
         */
        parseMarkdown(text) {
            // 줄 단위로 분리
            const lines = text.split(/\r?\n/);
            let html = '';
            let listStack = [];
            let prevIndent = 0;
            
            const listType = (line) => {
                if (/^\s*\d+\. /.test(line)) return 'ol';
                if (/^\s*[-*] /.test(line)) return 'ul';
                return null;
            };
            
            const getIndent = (line) => line.match(/^\s*/)[0].length;

            // 테이블 파싱 함수
            const parseTableBlock = (startIdx) => {
                let tableHtml = '<table class="modern-md-table">';
                let i = startIdx;
                
                // 헤더
                const headerLine = lines[i];
                const headerCells = headerLine.split('|').map(cell => cell.trim()).filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1 || arr.length === 2);
                const colCount = headerCells.length;
                tableHtml += '<thead><tr>' + headerCells.map(cell => `<th>${this.formatInlineMarkdown(cell)}</th>`).join('') + '</tr></thead>';
                i++;
                
                // 구분선(---) 무시
                if (i < lines.length && /^\s*\|?[-: ]+\|?\s*$/.test(lines[i])) i++;
                tableHtml += '<tbody>';
                
                while (i < lines.length && /^\s*\|.*$/.test(lines[i])) {
                    // 구분선(---) 줄은 완전히 무시
                    if (/^\s*\|?[-: ]+\|?\s*$/.test(lines[i])) {
                        i++;
                        continue;
                    }
                    let rowCells = lines[i].split('|').map(cell => cell.trim()).filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1 || arr.length === 2);
                    // 셀 개수 맞추기
                    while (rowCells.length < colCount) rowCells.push('');
                    if (rowCells.length > colCount) rowCells.length = colCount;
                    // 모든 셀이 --- 또는 :---: 등 구분선 패턴이면 해당 행 무시
                    const isDividerRow = rowCells.every(cell => /^:?-{3,}:?$/.test(cell));
                    if (isDividerRow) {
                        i++;
                        continue;
                    }
                    tableHtml += '<tr>' + rowCells.map(cell => `<td>${this.formatInlineMarkdown(cell)}</td>`).join('') + '</tr>';
                    i++;
                }
                tableHtml += '</tbody></table>';
                return { tableHtml, nextIdx: i };
            };

            let i = 0;
            while (i < lines.length) {
                let line = lines[i];
                
                // 테이블 감지: |로 시작하고, 다음 줄이 |---로 시작하면 테이블로 간주
                if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*[-: ]+\|/.test(lines[i + 1])) {
                    const { tableHtml, nextIdx } = parseTableBlock(i);
                    html += tableHtml;
                    i = nextIdx;
                    prevIndent = 0;
                    while (listStack.length) html += `</${listStack.pop()}>`;
                    continue;
                }
                
                // 헤더
                if (/^### /.test(line)) {
                    html += `<h3>${this.formatInlineMarkdown(line.replace(/^### /, ''))}</h3>`;
                    i++;
                    continue;
                }
                if (/^## /.test(line)) {
                    html += `<h2>${this.formatInlineMarkdown(line.replace(/^## /, ''))}</h2>`;
                    i++;
                    continue;
                }
                if (/^# /.test(line)) {
                    html += `<h1>${this.formatInlineMarkdown(line.replace(/^# /, ''))}</h1>`;
                    i++;
                    continue;
                }
                
                // 리스트
                const indent = getIndent(line);
                const type = listType(line);
                if (type) {
                    if (indent > prevIndent) {
                        html += `<${type}>`;
                        listStack.push(type);
                    } else if (indent < prevIndent) {
                        while (indent < prevIndent && listStack.length) {
                            html += `</${listStack.pop()}>`;
                            prevIndent -= 2;
                        }
                    }
                    html += `<li>${this.formatInlineMarkdown(line.replace(/^\s*([-*]|\d+\.) /, ''))}</li>`;
                    prevIndent = indent;
                    i++;
                    continue;
                } else {
                    while (listStack.length) {
                        html += `</${listStack.pop()}>`;
                    }
                    if (line.trim() !== '') {
                        html += `<p>${this.formatInlineMarkdown(line)}</p>`;
                    }
                    prevIndent = 0;
                    i++;
                    continue;
                }
            }
            
            while (listStack.length) {
                html += `</${listStack.pop()}>`;
            }
            
            return html;
        }

        /**
         * <pre>
         * [피드백 텍스트 HTML 생성]
         * </pre>
         * 
         * @param {string} type 채팅방 타입
         * @returns {string} 피드백 텍스트 HTML
         */
        getFeedbackTextHTML(type) {
            const feedbackRooms = ['construction-safety', 'risk-assessment'];
            return feedbackRooms.includes(type) ? 
                '<div class="modern-feedback-text">※답변에 대해 점수를 피드백해주세요. 더 좋은 답변을 위해 노력하겠습니다.</div>' : 
                '';
        }

        /**
         * <pre>
         * [세션ID 생성 및 재사용]
         * </pre>
         * @returns {string} 세션ID
         */
        getOrCreateSessionId() {
            let sessionId = localStorage.getItem('chatbot_session_id');
            if (!sessionId) {
                sessionId = 'chatbot_' + Math.random().toString(36).substr(2, 12);
                localStorage.setItem('chatbot_session_id', sessionId);
            }
            return sessionId;
        }

        /**
         * <pre>
         * [마크다운 파싱 함수]
         * </pre>
         * @param {string} text - 마크다운 텍스트
         * @returns {string} HTML 문자열
         */
        parseMarkdown(text) {
            // 인라인 마크다운 포맷 변환 함수
            const formatInlineMarkdown = (text) => {
                return text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code>$1</code>');
            };

            // 줄 단위로 분리
            const lines = text.split(/\r?\n/);
            let html = '';
            let listStack = [];
            let prevIndent = 0;
            const listType = (line) => {
                if (/^\s*\d+\. /.test(line)) return 'ol';
                if (/^\s*[-*] /.test(line)) return 'ul';
                return null;
            };
            const getIndent = (line) => line.match(/^\s*/)[0].length;

            // 테이블 파싱 함수 (셀 개수 헤더와 맞추기)
            function parseTableBlock(startIdx) {
                let tableHtml = '<table class="modern-md-table">';
                let i = startIdx;
                // 헤더
                const headerLine = lines[i];
                const headerCells = headerLine.split('|').map(cell => cell.trim()).filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1 || arr.length === 2);
                const colCount = headerCells.length;
                tableHtml += '<thead><tr>' + headerCells.map(cell => `<th>${formatInlineMarkdown(cell)}</th>`).join('') + '</tr></thead>';
                i++;
                // 구분선(---) 무시
                if (i < lines.length && /^\s*\|?[-: ]+\|?\s*$/.test(lines[i])) i++;
                tableHtml += '<tbody>';
                while (i < lines.length && /^\s*\|.*$/.test(lines[i])) {
                    // 구분선(---) 줄은 완전히 무시
                    if (/^\s*\|?[-: ]+\|?\s*$/.test(lines[i])) {
                        i++;
                        continue;
                    }
                    let rowCells = lines[i].split('|').map(cell => cell.trim()).filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1 || arr.length === 2);
                    // 셀 개수 맞추기
                    while (rowCells.length < colCount) rowCells.push('');
                    if (rowCells.length > colCount) rowCells.length = colCount;
                    // 모든 셀이 --- 또는 :---: 등 구분선 패턴이면 해당 행 무시
                    const isDividerRow = rowCells.every(cell => /^:?-{3,}:?$/.test(cell));
                    if (isDividerRow) {
                        i++;
                        continue;
                    }
                    tableHtml += '<tr>' + rowCells.map(cell => `<td>${formatInlineMarkdown(cell)}</td>`).join('') + '</tr>';
                    i++;
                }
                tableHtml += '</tbody></table>';
                return { tableHtml, nextIdx: i };
            }

            let i = 0;
            while (i < lines.length) {
                let line = lines[i];
                // 테이블 감지: |로 시작하고, 다음 줄이 |---로 시작하면 테이블로 간주
                if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*[-: ]+\|/.test(lines[i + 1])) {
                    const { tableHtml, nextIdx } = parseTableBlock(i);
                    html += tableHtml;
                    i = nextIdx;
                    prevIndent = 0;
                    while (listStack.length) html += `</${listStack.pop()}>`;
                    continue;
                }
                // 헤더
                if (/^### /.test(line)) {
                    html += `<h3>${formatInlineMarkdown(line.replace(/^### /, ''))}</h3>`;
                    i++;
                    continue;
                }
                if (/^## /.test(line)) {
                    html += `<h2>${formatInlineMarkdown(line.replace(/^## /, ''))}</h2>`;
                    i++;
                    continue;
                }
                if (/^# /.test(line)) {
                    html += `<h1>${formatInlineMarkdown(line.replace(/^# /, ''))}</h1>`;
                    i++;
                    continue;
                }
                // 리스트
                const indent = getIndent(line);
                const type = listType(line);
                if (type) {
                    if (indent > prevIndent) {
                        html += `<${type}>`;
                        listStack.push(type);
                    } else if (indent < prevIndent) {
                        while (indent < prevIndent && listStack.length) {
                            html += `</${listStack.pop()}>`;
                            prevIndent -= 2;
                        }
                    }
                    html += `<li>${formatInlineMarkdown(line.replace(/^\s*([-*]|\d+\.) /, ''))}</li>`;
                    prevIndent = indent;
                    i++;
                    continue;
                } else {
                    while (listStack.length) {
                        html += `</${listStack.pop()}>`;
                    }
                    if (line.trim() !== '') {
                        html += `<p>${formatInlineMarkdown(line)}</p>`;
                    }
                    prevIndent = 0;
                    i++;
                    continue;
                }
            }
            while (listStack.length) {
                html += `</${listStack.pop()}>`;
            }
            return html;
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

    // --- 현장개통/해지 버튼 HTML 생성 함수 ---
    window.createSiteAiButtonsHTML = function() {
        return `
            <div class="site-ai-button-container-vertical">
                <button class="site-ai-btn-vertical" onclick="window.chatbotApp.handleSiteAiButtonClick('신청')">
                    <i class='mdi mdi-file-document-edit-outline' style='margin-right:8px; font-size:18px; vertical-align:middle;'></i>현장개통/해제 신청
                </button>
                <button class="site-ai-btn-vertical" onclick="window.chatbotApp.handleSiteAiButtonClick('조회')">
                    <i class='mdi mdi-file-search-outline' style='margin-right:8px; font-size:18px; vertical-align:middle;'></i>신청/해지서 조회
                </button>
            </div>
        `;
    };
})(); 