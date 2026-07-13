export function toAuthMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()

  if (normalized.includes('invalid login credentials')) {
    return '邮箱或密码不正确，请检查后重试。'
  }

  if (normalized.includes('email not confirmed')) {
    return '邮箱还未确认，请先完成邮箱验证。'
  }

  if (normalized.includes('fetch') || normalized.includes('network')) {
    return '网络连接异常，请稍后重试。'
  }

  return '操作失败，请稍后重试。'
}
