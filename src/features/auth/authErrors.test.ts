import { describe, expect, it } from 'vitest'
import { toAuthMessage } from './authErrors'

describe('toAuthMessage', () => {
  it('maps common Supabase auth messages to clear Chinese guidance', () => {
    expect(toAuthMessage(new Error('Invalid login credentials'))).toBe(
      '\u90ae\u7bb1\u6216\u5bc6\u7801\u4e0d\u6b63\u786e\uff0c\u8bf7\u68c0\u67e5\u540e\u91cd\u8bd5\u3002',
    )
    expect(toAuthMessage(new Error('Email not confirmed'))).toBe(
      '\u90ae\u7bb1\u8fd8\u672a\u786e\u8ba4\uff0c\u8bf7\u5148\u5b8c\u6210\u90ae\u7bb1\u9a8c\u8bc1\u3002',
    )
  })

  it('falls back to a recoverable network message', () => {
    expect(toAuthMessage(new Error('fetch failed'))).toBe(
      '\u7f51\u7edc\u8fde\u63a5\u5f02\u5e38\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002',
    )
    expect(toAuthMessage('unknown')).toBe(
      '\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002',
    )
  })
})
