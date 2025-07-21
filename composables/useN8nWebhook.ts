/**
 * <pre>
 * [N8N Webhook 연동 Composable]
 * 위험성평가 A.I 채팅창에서 N8N webhook과 연동하는 기능
 * </pre>
 * 
 * @param webhookUrl: string - N8N webhook URL
 * @param sessionId: string - 세션 ID
 * @returns { sendMessage, isLoading, error }
 */

export const useN8nWebhook = (webhookUrl: string = 'https://ai-chatbot.myconst.com/webhook/chatbot/system') => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * <pre>
   * [메시지 전송 함수]
   * N8N webhook으로 메시지를 전송하고 응답을 받습니다.
   * </pre>
   * 
   * @param message: string - 사용자 메시지
   * @param sessionId: string - 세션 ID (선택사항)
   * @returns Promise<string> - AI 응답 메시지
   */
  const sendMessage = async (message: string, sessionId?: string): Promise<string> => {
    isLoading.value = true
    error.value = null

    try {
      // 세션 ID가 없으면 새로 생성
      const currentSessionId = sessionId || generateSessionId()
      
      // 요청 데이터 구성
      const requestData = {
        message: message,
        timestamp: new Date().toISOString(),
        sessionId: currentSessionId,
        type: 'risk-assessment' // 위험성평가 타입 지정
      }

      console.log('N8N Webhook 요청:', requestData)

      // N8N webhook으로 POST 요청
      const response = await $fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestData,
        timeout: 30000 // 30초 타임아웃
      })

      console.log('N8N Webhook 응답:', response)

      // 응답 검증
      if (!response) {
        throw new Error('응답이 없습니다.')
      }

      // 응답 형식에 따른 처리
      let aiResponse: string
      if (typeof response === 'string') {
        aiResponse = response
      } else if (response.response) {
        aiResponse = response.response
      } else if (response.message) {
        aiResponse = response.message
      } else {
        throw new Error('올바르지 않은 응답 형식입니다.')
      }

      return aiResponse

    } catch (err: any) {
      console.error('N8N Webhook 오류:', err)
      
      // 오류 메시지 설정
      if (err.code === 'ECONNABORTED') {
        error.value = '요청 시간이 초과되었습니다. 다시 시도해주세요.'
      } else if (err.status === 404) {
        error.value = '서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
      } else if (err.status === 500) {
        error.value = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      } else if (err.message) {
        error.value = `오류가 발생했습니다: ${err.message}`
      } else {
        error.value = '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.'
      }

      // 기본 응답 반환
      return '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * <pre>
   * [세션 ID 생성 함수]
   * 고유한 세션 ID를 생성합니다.
   * </pre>
   * 
   * @returns string - 생성된 세션 ID
   */
  const generateSessionId = (): string => {
    return `risk-assessment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * <pre>
   * [오류 초기화 함수]
   * 오류 상태를 초기화합니다.
   * </pre>
   */
  const clearError = () => {
    error.value = null
  }

  return {
    sendMessage,
    isLoading: readonly(isLoading),
    error: readonly(error),
    clearError
  }
} 