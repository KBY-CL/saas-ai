/**
 * <pre>
 * [챗봇 메시지 상태 관리 스토어]
 * </pre>
 * 
 * @description 챗봇의 메시지 송수신, 상태 관리를 담당하는 Pinia 스토어
 */

import { defineStore } from 'pinia'

export interface ChatMessage {
  id: string
  content: string
  timestamp: Date
  isUser: boolean
  isLoading?: boolean
}

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  sessionId: string | null
  error: string | null
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [],
    isLoading: false,
    sessionId: null,
    error: null
  }),

  getters: {
    /**
     * <pre>
     * [메시지 개수 반환]
     * </pre>
     * 
     * @return 메시지 개수
     */
    messageCount: (state) => state.messages.length,

    /**
     * <pre>
     * [마지막 메시지 반환]
     * </pre>
     * 
     * @return 마지막 메시지 또는 null
     */
    lastMessage: (state) => state.messages[state.messages.length - 1] || null,

    /**
     * <pre>
     * [사용자 메시지만 필터링]
     * </pre>
     * 
     * @return 사용자 메시지 배열
     */
    userMessages: (state) => state.messages.filter(msg => msg.isUser),

    /**
     * <pre>
     * [AI 메시지만 필터링]
     * </pre>
     * 
     * @return AI 메시지 배열
     */
    aiMessages: (state) => state.messages.filter(msg => !msg.isUser)
  },

  actions: {
    /**
     * <pre>
     * [세션 ID 초기화]
     * </pre>
     * 
     * @param sessionId 세션 ID
     */
    initializeSession(sessionId: string) {
      this.sessionId = sessionId
    },

    /**
     * <pre>
     * [사용자 메시지 추가]
     * </pre>
     * 
     * @param content 메시지 내용
     * @return 추가된 메시지 ID
     */
    addUserMessage(content: string): string {
      const message: ChatMessage = {
        id: this.generateMessageId(),
        content,
        timestamp: new Date(),
        isUser: true
      }
      this.messages.push(message)
      return message.id
    },

    /**
     * <pre>
     * [AI 메시지 추가]
     * </pre>
     * 
     * @param content 메시지 내용
     * @return 추가된 메시지 ID
     */
    addAiMessage(content: string): string {
      const message: ChatMessage = {
        id: this.generateMessageId(),
        content,
        timestamp: new Date(),
        isUser: false
      }
      this.messages.push(message)
      return message.id
    },

    /**
     * <pre>
     * [로딩 상태 설정]
     * </pre>
     * 
     * @param isLoading 로딩 상태
     */
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading
    },

    /**
     * <pre>
     * [에러 상태 설정]
     * </pre>
     * 
     * @param error 에러 메시지
     */
    setError(error: string | null) {
      this.error = error
    },

    /**
     * <pre>
     * [메시지 삭제]
     * </pre>
     * 
     * @param messageId 삭제할 메시지 ID
     * @return 삭제 성공 여부
     */
    removeMessage(messageId: string): boolean {
      const index = this.messages.findIndex(msg => msg.id === messageId)
      if (index > -1) {
        this.messages.splice(index, 1)
        return true
      }
      return false
    },

    /**
     * <pre>
     * [모든 메시지 삭제]
     * </pre>
     */
    clearMessages() {
      this.messages = []
      this.error = null
    },

    /**
     * <pre>
     * [메시지 ID 생성]
     * </pre>
     * 
     * @return 고유한 메시지 ID
     */
    generateMessageId(): string {
      return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },

    /**
     * <pre>
     * [로컬 스토리지에서 메시지 복원]
     * </pre>
     * 
     * @param sessionId 세션 ID
     */
    loadMessagesFromStorage(sessionId: string) {
      try {
        const stored = localStorage.getItem(`chat_messages_${sessionId}`)
        if (stored) {
          const parsed = JSON.parse(stored)
          this.messages = parsed.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }
      } catch (error) {
        console.error('Failed to load messages from storage:', error)
      }
    },

    /**
     * <pre>
     * [메시지를 로컬 스토리지에 저장]
     * </pre>
     * 
     * @param sessionId 세션 ID
     */
    saveMessagesToStorage(sessionId: string) {
      try {
        localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify({
          messages: this.messages,
          timestamp: new Date().toISOString()
        }))
      } catch (error) {
        console.error('Failed to save messages to storage:', error)
      }
    }
  }
}) 