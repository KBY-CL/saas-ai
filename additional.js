// 건설안전 전문가 챗봇 - 기존 React 컴포넌트 완전 복제본
(function() {
    'use strict';
  
    // 중복 로드 방지
    if (window.ConstructionSafetyChatbot) {
      return;
    }
  
    // CSS 스타일 주입 - 기존 React 컴포넌트와 동일
    const styles = `
      .construction-safety-chatbot * {
        box-sizing: border-box;
        font-family: 'Malgun Gothic', -apple-system, BlinkMacSystemFont, sans-serif;
      }
  
      /* 플로팅 버튼 - 업로드된 이미지와 동일한 빨간색 */
      .cs-floating-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 64px;
        height: 64px;
        background: #c53030;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 25px -5px rgba(197, 48, 48, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 50;
        color: white;
      }
  
      .cs-floating-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 20px 40px -10px rgba(197, 48, 48, 0.4);
      }
  
      /* 챗봇 창 */
      .cs-chatbot-window {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        z-index: 50;
        display: none;
        flex-direction: column;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
  
      .cs-chatbot-window.show { display: flex; }
      .cs-chatbot-window.mini { width: 400px; height: 650px; }
      .cs-chatbot-window.mid { width: 900px; height: 650px; }
      .cs-chatbot-window.max {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        border-radius: 0;
      }
  
      /* 헤더 - 업로드된 이미지와 동일한 빨간색 */
      .cs-header {
        padding: 16px;
        background: #c53030;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
  
      .cs-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
  
      .cs-avatar {
        background: white;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
  
      .cs-title {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
      }
  
      .cs-status {
        font-size: 14px;
        opacity: 0.9;
        margin: 0;
      }
  
      .cs-controls {
        display: flex;
        gap: 4px;
      }
  
      .cs-control-btn {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        border-radius: 4px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
      }
  
      .cs-control-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
  
      /* 메시지 영역 */
      .cs-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        max-height: 500px;
      }
  
      .cs-chatbot-window.max .cs-messages {
        max-height: calc(100vh - 200px);
      }
  
      .cs-message {
        margin-bottom: 16px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
  
      .cs-message.user {
        flex-direction: row-reverse;
      }
  
      .cs-message-avatar {
        padding: 8px;
        border-radius: 50%;
        background: #c53030;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        flex-shrink: 0;
      }
  
      .cs-message-content {
        max-width: 80%;
        position: relative;
      }
  
      .cs-message-bubble {
        padding: 12px 16px;
        border-radius: 12px;
        word-wrap: break-word;
        line-height: 1.5;
        position: relative;
      }
  
      .cs-message.bot .cs-message-bubble {
        background: #fbe9eb;
        border: 1px solid #b31e30;
      }
  
      .cs-message.user .cs-message-bubble {
        background: #c53030;
        color: white;
      }
  
      /* 마크다운 스타일 */
      .cs-message-bubble h1, .cs-message-bubble h2, .cs-message-bubble h3 {
        font-weight: 600;
        margin: 8px 0 4px 0;
      }
      .cs-message-bubble h1 { font-size: 1.2em; }
      .cs-message-bubble h2 { font-size: 1.1em; }
      .cs-message-bubble h3 { font-size: 1em; }
      /* 마크다운 리스트 스타일 개선 */
      .cs-message-bubble ul, .cs-message-bubble ol {
        margin: 8px 0 8px 1em;
        padding-left: 1em;
      }
      .cs-message-bubble ul ul, .cs-message-bubble ol ol, .cs-message-bubble ul ol, .cs-message-bubble ol ul {
        margin-top: 2px;
        margin-bottom: 2px;
      }
      .cs-message-bubble li {
        margin: 4px 0;
        font-size: 15px;
        line-height: 1.6;
      }
      .cs-message-bubble p {
        margin: 8px 0;
        font-size: 15px;
        line-height: 1.7;
      }
      .cs-message-bubble strong { font-weight: 600; }
      .cs-message-bubble code {
        background: rgba(0, 0, 0, 0.1);
        padding: 2px 4px;
        border-radius: 3px;
        font-family: monospace;
        font-size: 0.9em;
      }
  
      /* 마크다운 테이블 스타일 */
      .cs-md-table {
        border-collapse: collapse;
        width: 100%;
        margin: 12px 0;
        font-size: 15px;
        overflow-x: auto;
        display: block;
      }
      .cs-md-table th, .cs-md-table td {
        border: 1.5px solid #c53030;
        padding: 8px 12px;
        text-align: left;
        word-break: break-all;
        white-space: pre-line;
      }
      .cs-md-table th {
        background: #c53030;
        color: #fff;
        font-weight: 800;
      }
      .cs-md-table tr:nth-child(even) td {
        background: #fff5f5;
      }
  
      /* 복사 버튼 */
      .cs-copy-btn {
        background: transparent;
        border: none;
        border-radius: 4px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #722f37;
        transition: all 0.2s;
        opacity: 0.8;
      }
  
      .cs-copy-btn:hover {
        background: rgba(114, 47, 55, 0.1);
        opacity: 1;
        transform: scale(1.1);
      }
  
      .cs-copy-btn.copied {
        background: #10b981;
        color: white;
        border-color: #10b981;
      }
  
      /* 시간 표시 스타일 - 버블 안 별점 라인에 표시 */
      .cs-message-time {
        font-size: 11px;
        color: #722f37;
        font-weight: 500;
        margin-right: auto;
      }
  
      /* 입력 영역 */
      .cs-input-area {
        padding: 16px;
        border-top: 1.5px solid #c53030;
        background: #fbe9eb;
      }
  
      .cs-input-container {
        display: flex;
        gap: 8px;
        align-items: flex-end;
      }
  
      .cs-input {
        flex: 1;
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        background: white;
        font-size: 14px;
        resize: none;
        min-height: 44px;
        outline: none;
      }
  
      .cs-input:focus {
        border: 1.5px solid #c53030;
        box-shadow: 0 0 0 3px rgba(197, 48, 48, 0.1);
        outline: none;
      }
  
      .cs-mic-btn, .cs-send-btn {
        background: #c53030;
        color: white;
        border: none;
        border-radius: 8px;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }
  
      .cs-mic-btn:hover, .cs-send-btn:hover {
        background: #a53030;
        transform: scale(1.05);
      }
  
      .cs-mic-btn.listening {
        animation: pulse 1.5s infinite;
      }
  
      .cs-typing {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #6b7280;
        padding: 8px 0;
      }
  
      .cs-typing-dots {
        display: flex;
        gap: 2px;
      }
  
      .cs-typing-dot {
        width: 4px;
        height: 4px;
        background: #6b7280;
        border-radius: 50%;
        animation: typing 1.4s infinite;
      }
  
      .cs-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .cs-typing-dot:nth-child(3) { animation-delay: 0.4s; }
  
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
  
      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }
  
      /* 모바일 반응형 */
      @media (max-width: 768px) {
        .cs-chatbot-window:not(.max) {
          width: calc(100vw - 24px) !important;
          height: calc(100vh - 24px) !important;
          bottom: 12px !important;
          right: 12px !important;
        }
      }
    `;
  
    // 스타일 주입
    if (!document.getElementById('cs-chatbot-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'cs-chatbot-styles';
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }
  
    // 동적 경로 계산 함수
    function getAssetPath(filename) {
      // 현재 스크립트의 위치를 기준으로 상대 경로 계산
      const scripts = document.getElementsByTagName('script');
      let chatbotScriptSrc = '';
      
      // chatbot.js 스크립트 찾기
      for (let script of scripts) {
        if (script.src && script.src.includes('chatbot.js')) {
          chatbotScriptSrc = script.src;
          break;
        }
      }
      
      if (chatbotScriptSrc) {
        // chatbot.js가 있는 디렉토리 기준으로 경로 계산
        const baseUrl = chatbotScriptSrc.replace('/chatbot.js', '');
        return `${baseUrl}/${filename}`;
      }
      
      // 폴백: 현재 페이지 기준 상대 경로
      return filename;
    }
  
    // SVG 아이콘들
    const icons = {
      // 플로팅 버튼: PNG 이미지 (크기 60x60, 여백 없음)
      hardhat: `<img src="${getAssetPath('chatbot_icon.png')}" style="width:60px;height:60px;padding:0;margin:0;display:block;" alt="챗봇" onerror="this.style.display='none'; this.parentNode.innerHTML='🏗️';">`,
      // 타이틀바: PNG 이미지 (크기 40x40, 여백 없음)
      titlebar: `<img src="${getAssetPath('chatbot_icon2.png')}" style="width:40px;height:40px;padding:0;margin:0;display:block;" alt="타이틀 아이콘" onerror="this.style.display='none'; this.parentNode.innerHTML='🏗️';">`,
      user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      bot: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`,
      send: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
      copy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
      check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`,
      mic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
      micOff: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" x2="22" y1="2" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
      minimize: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>`,
      square: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`,
      maximize: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>`,
      close: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
    };
  
    // 인라인 마크다운 포맷 변환 함수
    function formatInlineMarkdown(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    }
  
    // 마크다운 파싱 함수 (중첩 리스트 지원 + 테이블 지원)
    function parseMarkdown(text) {
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
        let tableHtml = '<table class="cs-md-table">';
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
  
    // 시간 포맷 함수 추가
    function formatTime(date) {
      return date.toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }
  
    // Supabase 클라이언트 생성 (UMD CDN 방식, 진단 로그 포함)
    if (!window.CHATBOT_CONFIG) {
      console.error('CHATBOT_CONFIG가 로드되지 않았습니다. config.js 파일을 확인해주세요.');
    }
    
    const supabaseUrl = window.CHATBOT_CONFIG?.supabaseUrl;
    const supabaseKey = window.CHATBOT_CONFIG?.supabaseKey;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase 설정이 올바르지 않습니다. config.js 파일을 확인해주세요.');
    }
    
    const supabase = window.supabase && supabaseUrl && supabaseKey ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;
    console.log('supabaseUrl:', supabaseUrl);
    console.log('supabaseKey:', supabaseKey ? supabaseKey.slice(0, 10) + '...' : 'undefined');
    console.log('supabase 객체:', supabase);
  
    // 한국 시간 생성 함수
    function getKoreanTime() {
      const now = new Date();
      // 한국 시간으로 변환 (UTC+9)
      const koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
      return koreanTime.toISOString();
    }
  
    // 챗봇 로그 저장 함수
    async function saveChatLog(question, answer, conversationId) {
      if (!supabase) {
        console.error('Supabase 클라이언트가 생성되지 않았습니다!');
        return false;
      }
      
      try {
        const { error } = await supabase.from('chatbot_logs').insert({
          user_id: 'tester',
          question,
          answer,
          rating: null,
          conversation_id: conversationId,
          created_at: getKoreanTime() // 한국 시간으로 명시적 설정
        });
        
        if (error) {
          console.error('채팅 저장 실패:', error.message);
          return false;
        }
        
        console.log('채팅 저장 성공 - 한국 시간:', getKoreanTime());
        return true;
      } catch (e) {
        console.error('채팅 저장 중 오류:', e.message);
        return false;
      }
    }
  
    // 건설안전 챗봇 클래스
    class ConstructionSafetyChatbot {
      constructor() {
        this.messages = [];
        this.isOpen = false;
        this.isTyping = false;
        this.currentSize = 'mid';
        this.copiedMessageId = null;
        this.userId = `user_${Math.random().toString(36).substr(2, 9)}`;
        this.isListening = false;
        this.recognition = null;
        this.speechTimeout = null;
        // 로컬스토리지에서 권한 상태 복원
        this.micPermissionGranted = this.loadMicPermissionState(); // 권한 상태: undefined(미확인), true(허용), false(거부)
        console.log('로컬스토리지에서 복원된 마이크 권한 상태:', this.micPermissionGranted);
        this.sessionId = this.generateSessionId(); // 고유한 세션 ID
        this.conversationCounter = 0; // 세션 내 대화 일련번호
        this.pendingQuestions = []; // 답변 전 누적된 질문들
  
  
        this.initSpeechRecognition();
        this.render();
        this.addInitialMessage();
        
        // 페이지 로드 시 권한 상태 미리 확인 (모든 경우에 실행)
        this.preCheckMicrophonePermission();
      }
  
      generateSessionId() {
        // 현재 시간 + 랜덤 문자열로 고유한 세션 ID 생성
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substr(2, 15);
        return `session_${timestamp}_${randomStr}`;
      }
  
      generateConversationId() {
        // 세션 내 대화 번호 증가
        this.conversationCounter++;
        // 세션ID + 대화번호로 고유한 대화번호 생성
        return `${this.sessionId}_${this.conversationCounter.toString().padStart(3, '0')}`;
      }
  
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
  
      saveMicPermissionState(state) {
        try {
          localStorage.setItem('chatbot_mic_permission', state.toString());
          console.log('마이크 권한 상태 저장:', state);
        } catch (e) {
          console.log('로컬스토리지 저장 실패');
        }
      }
  
      async preCheckMicrophonePermission() {
        console.log('=== 페이지 로드 시 마이크 권한 미리 확인 ===');
        try {
          if (navigator.permissions) {
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
            console.log('현재 브라우저 권한 상태:', permissionStatus.state);
            
            if (permissionStatus.state === 'denied') {
              this.micPermissionGranted = false;
              this.saveMicPermissionState(false);
              console.log('브라우저에서 권한이 거부되었습니다. 로컬 상태 업데이트.');
            } else if (permissionStatus.state === 'granted') {
              console.log('브라우저에서 권한이 확인되었습니다.');
            }
          }
        } catch (e) {
          console.log('권한 미리 확인 실패:', e.message);
        }
      }
  
      initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
          this.recognition = new webkitSpeechRecognition();
          this.recognition.continuous = false; // 한 번에 하나의 발화만 인식
          this.recognition.interimResults = false; // 중간 결과 비활성화
          this.recognition.lang = 'ko-KR';
          this.recognition.maxAlternatives = 1; // 최대 대안 1개만
  
          this.recognition.onstart = () => {
            console.log('=== recognition.onstart 이벤트 ===');
            this.isListening = true;
            this.micPermissionGranted = true; // 성공적으로 시작되면 권한 있음
            this.saveMicPermissionState(true); // 로컬스토리지에 저장
            this.updateMicButton();
          };
  
          this.recognition.onresult = (event) => {
            console.log('=== recognition.onresult 이벤트 ===');
            console.log('전체 결과 개수:', event.results.length);
            
            if (event.results && event.results.length > 0) {
              // 가장 최신 결과만 가져오기 (마지막 인덱스)
              const lastResultIndex = event.results.length - 1;
              const transcript = event.results[lastResultIndex][0].transcript;
              console.log('인식된 텍스트:', transcript);
              console.log('결과 인덱스:', lastResultIndex);
              
              const input = document.getElementById('cs-input');
              // 기존 값에 추가하지 말고 새로운 텍스트만 추가
              if (transcript.trim()) {
                // 입력창이 비어있으면 그대로, 내용이 있으면 공백 추가 후 새 텍스트
                const currentValue = input.value.trim();
                input.value = currentValue ? currentValue + ' ' + transcript.trim() : transcript.trim();
              }
              input.focus();
            }
            
            // 음성 인식이 완료되면 상태 초기화
            this.isListening = false;
            this.updateMicButton();
          };
  
          this.recognition.onerror = (event) => {
            console.log('=== recognition.onerror 이벤트 ===');
            console.log('에러 타입:', event ? event.error : '알 수 없음');
            this.isListening = false;
            this.updateMicButton();
            
            if (event && event.error === 'not-allowed') {
              this.micPermissionGranted = false;
              this.saveMicPermissionState(false); // 로컬스토리지에 저장
              console.log('마이크 사용 권한이 거부되었습니다.');
            } else if (event && event.error === 'no-speech') {
              // 음성이 감지되지 않음 - 정상적인 상황
              console.log('음성이 감지되지 않았습니다.');
            } else if (event && event.error === 'aborted') {
              console.log('음성 인식이 중단되었습니다.');
            } else if (event && event.error === 'audio-capture') {
              console.log('오디오 캡처 실패.');
            } else if (event && event.error === 'network') {
              console.log('네트워크 오류.');
            } else {
              console.log('음성 인식 오류:', event ? event.error : '알 수 없는 오류');
            }
          };
  
          this.recognition.onend = (event) => {
            console.log('=== recognition.onend 이벤트 ===');
            console.log('음성 인식 완전 종료');
            this.isListening = false;
            this.updateMicButton();
          };
        }
      }
  
      render() {
        const container = document.createElement('div');
        container.className = 'construction-safety-chatbot';
        container.innerHTML = `
          <button class="cs-floating-btn" id="cs-toggle">
            ${icons.hardhat}
          </button>
          <div class="cs-chatbot-window ${this.currentSize}" id="cs-window">
            <div class="cs-header">
              <div class="cs-header-info">
                <div class="cs-avatar">
                  ${icons.titlebar}
                </div>
                <div>
                  <h2 class="cs-title">건설안전 전문가</h2>
                  <p class="cs-status">온라인 상담 중</p>
                </div>
              </div>
              <div class="cs-controls" id="cs-controls">
                <button class="cs-control-btn" onclick="window.ConstructionSafetyChatbot.minimize()" title="최소화">
                  ${icons.minimize}
                </button>
                <button class="cs-control-btn" id="cs-mini-btn" onclick="window.ConstructionSafetyChatbot.resize('mini')" title="미니">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="12" rx="1"/></svg>
                </button>
                <button class="cs-control-btn" id="cs-mid-btn" onclick="window.ConstructionSafetyChatbot.resize('mid')" title="중간">
                  ${icons.square}
                </button>
                <button class="cs-control-btn" id="cs-max-btn" onclick="window.ConstructionSafetyChatbot.resize('max')" title="최대화">
                  ${icons.maximize}
                </button>
                <button class="cs-control-btn" onclick="window.ConstructionSafetyChatbot.close()" title="닫기">
                  ${icons.close}
                </button>
              </div>
            </div>
            <div class="cs-messages" id="cs-messages"></div>
            <div class="cs-input-area">
              <div class="cs-input-container">
                <textarea 
                  id="cs-input"
                  class="cs-input" 
                  placeholder="건설안전, 건설공법 등 건설과 관련된 궁금한 것을 물어보세요..."
                  rows="1"
                ></textarea>
                <button class="cs-mic-btn" id="cs-mic" title="음성 입력">
                  ${icons.mic}
                </button>
                <button class="cs-send-btn" id="cs-send" title="전송">
                  ${icons.send}
                </button>
              </div>
            </div>
          </div>
        `;
  
        document.body.appendChild(container);
        this.setupEventListeners();
        this.updateSizeButtons(); // 초기 버튼 상태 설정
      }
  
      setupEventListeners() {
        document.getElementById('cs-toggle').onclick = () => this.open();
        document.getElementById('cs-send').onclick = () => this.sendMessage();
        document.getElementById('cs-mic').onclick = () => this.toggleMic();
        
        const input = document.getElementById('cs-input');
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.isListening) this.stopListening();
            if (input.value.trim()) this.sendMessage();
          }
        });
      }
  
      addInitialMessage() {
        this.messages = [{
          id: 1,
          text: "안녕하세요? 저는 건설안전 전문가입니다.\n\n오늘 작업장소와 작업공종을 알려주시면 위험요인과 안전대책을 알려드리겠습니다.\n\n(예시: 서울에서 지하 3층: 방수 및 미장 작업, 지상 7층: 철근콘크리트를 위한 형틀설치, 철근배근, 전선관배관 작업을 타워크레인을 이용해서 진행합니다)",
          isBot: true,
          timestamp: new Date(),
          isInitial: true  // 초기 인사말 표시
        }];
        this.renderMessages();
      }
  
      async open() {
        this.isOpen = true;
        document.getElementById('cs-toggle').style.display = 'none';
        document.getElementById('cs-window').classList.add('show');
        setTimeout(() => document.getElementById('cs-input').focus(), 100);
        
        // 챗봇 열릴 때 마이크 권한 미리 확보 시도
        await this.preRequestMicrophonePermission();
      }
  
      async preRequestMicrophonePermission() {
        console.log('=== 챗봇 열릴 때 마이크 권한 미리 확보 시도 ===');
        try {
          // 숨겨진 음성 인식 객체로 권한 미리 확보
          const tempRecognition = new webkitSpeechRecognition();
          tempRecognition.continuous = false;
          tempRecognition.interimResults = false;
          tempRecognition.lang = 'ko-KR';
          
          // 매우 짧은 시간만 실행하고 즉시 중단
          tempRecognition.onstart = () => {
            console.log('임시 음성 인식 시작 - 권한 확보됨');
            this.micPermissionGranted = true;
            this.saveMicPermissionState(true);
            setTimeout(() => {
              try { tempRecognition.abort(); } catch (e) {}
            }, 10); // 10ms 후 즉시 중단
          };
          
          tempRecognition.onerror = (event) => {
            console.log('임시 음성 인식 오류:', event.error);
            if (event.error === 'not-allowed') {
              this.micPermissionGranted = false;
              this.saveMicPermissionState(false);
            }
          };
          
          tempRecognition.onend = () => {
            console.log('임시 음성 인식 종료');
          };
          
          // 권한 요청 시작
          tempRecognition.start();
          
        } catch (error) {
          console.log('미리 권한 확보 실패:', error);
        }
      }
  
      close() {
        this.isOpen = false;
        document.getElementById('cs-window').classList.remove('show');
        document.getElementById('cs-toggle').style.display = 'flex';
        this.messages = [];
        this.addInitialMessage();
      }
  
      minimize() {
        this.isOpen = false;
        document.getElementById('cs-window').classList.remove('show');
        document.getElementById('cs-toggle').style.display = 'flex';
      }
  
      resize(size) {
        this.currentSize = size;
        const window = document.getElementById('cs-window');
        window.className = `cs-chatbot-window ${size} show`;
        this.updateSizeButtons(); // 창 크기 변경 시 버튼 상태 업데이트
      }
  
      updateSizeButtons() {
        const miniBtn = document.getElementById('cs-mini-btn');
        const midBtn = document.getElementById('cs-mid-btn');
        const maxBtn = document.getElementById('cs-max-btn');
        
        // 모든 버튼을 먼저 보이게 설정
        if (miniBtn) miniBtn.style.display = 'flex';
        if (midBtn) midBtn.style.display = 'flex';
        if (maxBtn) maxBtn.style.display = 'flex';
        
        // 현재 창 크기에 해당하는 버튼 숨기기
        switch (this.currentSize) {
          case 'mini':
            if (miniBtn) miniBtn.style.display = 'none';
            break;
          case 'mid':
            if (midBtn) midBtn.style.display = 'none';
            break;
          case 'max':
            if (maxBtn) maxBtn.style.display = 'none';
            break;
        }
      }
  
      updateMicButton() {
        const micBtn = document.getElementById('cs-mic');
        if (this.isListening) {
          micBtn.innerHTML = icons.micOff;
          micBtn.classList.add('listening');
        } else {
          micBtn.innerHTML = icons.mic;
          micBtn.classList.remove('listening');
        }
      }
  
      async toggleMic() {
        console.log('=== toggleMic 호출 ===');
        console.log('현재 상태 - isListening:', this.isListening);
        
        if (!this.recognition) {
          alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
          return;
        }
        
        if (this.isListening) {
          console.log('마이크 중지 시도');
          this.stopListening();
        } else {
          console.log('마이크 시작 시도');
          await this.startListening();
        }
      }
  
      async startListening() {
        console.log('=== startListening 호출 ===');
        console.log('조건 체크 - recognition:', !!this.recognition);
        console.log('조건 체크 - isListening:', this.isListening);
        console.log('권한 상태 - micPermissionGranted:', this.micPermissionGranted);
        
        if (this.recognition && !this.isListening) {
          // 권한이 미리 확보되었는지 확인
          if (this.micPermissionGranted === true) {
            console.log('권한이 이미 확보됨 - 바로 음성 인식 시작');
          } else {
            console.log('권한이 확보되지 않음 - 권한 요청 필요');
          }
          
          try {
            // 이전 음성 인식이 완전히 종료되었는지 확인
            if (this.recognition.readyState && this.recognition.readyState !== 'inactive') {
              console.log('이전 음성 인식이 아직 활성 상태입니다. 중지 후 재시작합니다.');
              this.recognition.abort();
              // 잠시 대기 후 재시작
              setTimeout(() => {
                this.startListening();
              }, 100);
              return;
            }
            
            console.log('음성 인식 시작 시도');
            this.recognition.start();
            console.log('recognition.start() 호출 완료');
          } catch (error) {
            console.log('음성 인식 시작 실패:', error.message);
            console.log('에러 상세:', error);
            
            // 권한 관련 에러 처리
            if (error.name === 'NotAllowedError') {
              this.micPermissionGranted = false;
              this.saveMicPermissionState(false);
              console.log('마이크 권한이 거부되었습니다.');
            } else if (error.name === 'InvalidStateError') {
              console.log('음성 인식이 이미 시작되었습니다.');
              // 이미 시작된 경우 상태만 업데이트
              this.isListening = true;
              this.updateMicButton();
            }
          }
        } else {
          console.log('startListening 조건 불만족');
          if (!this.recognition) console.log('- recognition 없음');
          if (this.isListening) console.log('- 이미 listening 중');
        }
      }
  
      stopListening() {
        console.log('=== stopListening 호출 ===');
        console.log('조건 체크 - recognition:', !!this.recognition);
        console.log('조건 체크 - isListening:', this.isListening);
        
        if (this.recognition) {
          try {
            console.log('recognition.abort() 호출 - 강제 중지');
            this.recognition.abort(); // stop() 대신 abort() 사용하여 완전히 중지
            this.isListening = false;
            this.updateMicButton();
          } catch (error) {
            console.log('음성 인식 중지 실패:', error.message);
            // 에러가 발생해도 상태는 초기화
            this.isListening = false;
            this.updateMicButton();
          }
        } else {
          console.log('stopListening - recognition 없음');
        }
      }
  
      async sendMessage() {
        const input = document.getElementById('cs-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // 질문을 누적 배열에 추가
        this.pendingQuestions.push(message);
        
        this.messages.push({
          id: this.messages.length + 1,
          text: message,
          isBot: false,
          timestamp: new Date()
        });
        
        input.value = '';
        this.renderMessages();
        
        this.isTyping = true;
        this.renderMessages();
        
        try {
          const response = await this.sendToWebhook(message);
          
          // 누적된 질문들을 합병
          const mergedQuestions = this.pendingQuestions.join('\n');
          
          // 고유한 대화번호 생성
          const conversationId = this.generateConversationId();
          
          // Supabase 저장
          let saveSuccess = false;
          if (supabase) {
            saveSuccess = await saveChatLog(mergedQuestions, response, conversationId);
          }
          
          this.messages.push({
            id: this.messages.length + 1,
            text: response,
            isBot: true,
            timestamp: new Date(),
            rating: 0,
            conversationId: saveSuccess ? conversationId : null
          });
          
          // 누적된 질문들 초기화
          this.pendingQuestions = [];
          
        } catch (error) {
          this.messages.push({
            id: this.messages.length + 1,
            text: "죄송합니다. 현재 서버와 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.",
            isBot: true,
            timestamp: new Date(),
            rating: 0,
            conversationId: null
          });
          
          // 에러 시에도 누적된 질문들 초기화
          this.pendingQuestions = [];
        }
        
        this.isTyping = false;
        this.renderMessages();
      }
  
      async sendToWebhook(message) {
        const webhookBody = {
          message: message,
          userid: this.userId,
          timestamp: new Date().toISOString(),
          type: "user_message"
        };
  
        const response = await fetch('https://ai-chatbot.myconst.com/webhook/99ea553b-9083-40c6-a0f2-11b7776ab22f', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookBody),
        });
  
        if (!response.ok) {
          throw new Error(`Webhook failed: ${response.status}`);
        }
  
        const responseText = await response.text();
        if (!responseText) {
          return "죄송합니다. 웹훅에서 빈 응답을 받았습니다.";
        }
  
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          return "죄송합니다. 웹훅 응답 형식에 문제가 있습니다.";
        }
  
        if (data.success === false) {
          return data.message || data.error || "죄송합니다. 웹훅 처리 중 오류가 발생했습니다.";
        }
        
        return data.output || data.message || data.response || "죄송합니다. 웹훅에서 유효한 응답을 받지 못했습니다.";
      }
  
      renderMessages() {
        const container = document.getElementById('cs-messages');
        container.innerHTML = '';
        
        this.messages.forEach(message => {
          const messageEl = document.createElement('div');
          messageEl.className = `cs-message ${message.isBot ? 'bot' : 'user'}`;
          
          const avatar = document.createElement('div');
          avatar.className = 'cs-message-avatar';
          avatar.innerHTML = message.isBot ? icons.bot : icons.user;
          
          const content = document.createElement('div');
          content.className = 'cs-message-content';
          
          const bubble = document.createElement('div');
          bubble.className = 'cs-message-bubble';
          bubble.id = `cs-message-${message.id}`;
          
          if (message.isBot) {
            bubble.innerHTML = parseMarkdown(message.text);
            
            // 별점과 카피버튼을 한 줄에 배치 (초기 인사말 제외)
            if (!message.isInitial) {
              const actionContainer = document.createElement('div');
              actionContainer.style.display = 'flex';
              actionContainer.style.alignItems = 'center';
              actionContainer.style.justifyContent = 'space-between';
              actionContainer.style.marginTop = '12px';
              actionContainer.style.paddingTop = '8px';
              actionContainer.style.borderTop = '1px solid #b31e30'; // 버블 테두리선과 동일한 색상
  
              // 시간 표시 (맨 왼쪽)
              const timeEl = document.createElement('div');
              timeEl.className = 'cs-message-time';
              timeEl.textContent = formatTime(message.timestamp);
              actionContainer.appendChild(timeEl);
  
              // 별점과 복사버튼을 담는 오른쪽 컨테이너
              const rightContainer = document.createElement('div');
              rightContainer.style.display = 'flex';
              rightContainer.style.alignItems = 'center';
              rightContainer.style.gap = '8px';
  
              // 별점 컨테이너
              const ratingContainer = document.createElement('div');
              ratingContainer.style.display = 'flex';
              ratingContainer.style.alignItems = 'center';
              ratingContainer.style.gap = '3px';
              ratingContainer.setAttribute('data-message-id', message.id);
  
              // 별점 상태 관리 (메모리에 영구 저장)
              if (typeof message.rating === 'undefined') message.rating = 0;
            
              for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.style.cursor = 'pointer';
                star.style.fontSize = '16px';
                star.style.transition = 'all 0.2s';
                star.style.userSelect = 'none';
                star.title = `${i}점`;
                
                // 별 스타일 설정
                if (i <= message.rating) {
                  // 클릭된 별: 버블 테두리선 색으로 채움
                  star.textContent = '★';
                  star.style.color = '#b31e30';
                  star.style.textShadow = 'none';
                } else {
                  // 클릭되지 않은 별: 테두리만 버블 테두리선 색, 바탕은 흰색
                  star.textContent = '☆';
                  star.style.color = '#b31e30';
                  star.style.textShadow = '0 0 0 white';
                }
                
                star.onclick = async (e) => {
                  // 스크롤 이동 방지
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // 현재 스크롤 위치 저장
                  const container = document.getElementById('cs-messages');
                  const currentScrollTop = container.scrollTop;
                  
                  // 메모리에 즉시 반영
                  message.rating = i;
                  this.renderMessages();
                  
                  // 스크롤 위치 복원
                  setTimeout(() => {
                    container.scrollTop = currentScrollTop;
                  }, 0);
                  
                  // Supabase UPDATE 시도
                  if (supabase && message.conversationId) {
                    try {
                       const ratingValue = parseInt(i, 10);
                       
                       const { error } = await supabase
                         .from('chatbot_logs')
                         .update({ rating: ratingValue })
                         .eq('conversation_id', message.conversationId);
                       
                       if (error) {
                         console.error('별점 저장 실패:', error.message);
                         alert('별점 저장 실패: ' + error.message);
                       }
                    } catch (e) {
                      console.error('별점 저장 중 오류:', e.message);
                      alert('별점 저장 중 오류 발생: ' + e.message);
                    }
                  } else if (!message.conversationId) {
                    alert('이 메시지는 DB에 저장되지 않아 별점을 저장할 수 없습니다.');
                  }
                };
                ratingContainer.appendChild(star);
              }
  
              // 카피버튼
              const copyBtn = document.createElement('button');
              copyBtn.className = 'cs-copy-btn';
              copyBtn.innerHTML = this.copiedMessageId === message.id ? icons.check : icons.copy;
              copyBtn.onclick = () => this.copyMessage(message.id);
  
              // 별점과 카피버튼을 오른쪽 컨테이너에 추가
              rightContainer.appendChild(ratingContainer);
              rightContainer.appendChild(copyBtn);
              
              // 오른쪽 컨테이너를 액션 컨테이너에 추가
              actionContainer.appendChild(rightContainer);
              bubble.appendChild(actionContainer);
  
              // 피드백 텍스트를 별점 아래에 추가
              const feedbackText = document.createElement('div');
              feedbackText.textContent = '※답변에 대해 점수를 피드백해주세요. 더 좋은 답변을 위해 노력하겠습니다.';
              feedbackText.style.fontSize = '11px';
              feedbackText.style.color = '#722f37';
              feedbackText.style.marginTop = '8px';
              feedbackText.style.textAlign = 'right';
              feedbackText.style.opacity = '0.8';
              bubble.appendChild(feedbackText);
            }
            // 초기 인사말에는 아무것도 추가하지 않음
          } else {
            bubble.textContent = message.text;
          }
          
          content.appendChild(bubble);
          messageEl.appendChild(avatar);
          messageEl.appendChild(content);
          container.appendChild(messageEl);
        });
        
        if (this.isTyping) {
          const typingEl = document.createElement('div');
          typingEl.className = 'cs-typing';
          typingEl.innerHTML = `
            <div class="cs-message-avatar">${icons.bot}</div>
            <div>
              <span>전문가가 답변 중입니다</span>
              <div class="cs-typing-dots">
                <div class="cs-typing-dot"></div>
                <div class="cs-typing-dot"></div>
                <div class="cs-typing-dot"></div>
              </div>
            </div>
          `;
          container.appendChild(typingEl);
        }
        
        container.scrollTop = container.scrollHeight;
      }
  
      async copyMessage(messageId) {
        const messageEl = document.getElementById(`cs-message-${messageId}`);
        if (!messageEl) return;
        
        try {
          const text = messageEl.innerText;
          await navigator.clipboard.writeText(text);
          
          this.copiedMessageId = messageId;
          this.renderMessages();
          
          setTimeout(() => {
            this.copiedMessageId = null;
            this.renderMessages();
          }, 2000);
          
        } catch (error) {
          console.error('복사 실패:', error);
        }
      }
    }
  
    // 전역 인스턴스 생성
    window.ConstructionSafetyChatbot = new ConstructionSafetyChatbot();
  
  })();