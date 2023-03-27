export const API_END_POINT = 'https://cnu1.notion.edu-api.programmers.co.kr'

// 너 이녀석 Promise를 반환했구나.
export const request = async (url, options = {}) => {
  try {
    const res = await fetch(`${API_END_POINT}${url}`, {
      ...options,
      headers: {
        'x-username': 'test',
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) {
      // resolved Promise
      return await res.json()
    }
    // rejected된 에러는 여기서 throw
    throw new Error('API 처리 중 문제가 발생했습니다')
  } catch (e) {
    alert(e.message)
  }
}
