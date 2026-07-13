import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../app/store/useAppStore'
import { Button } from '../../components/common/Button'
import { PageMeta } from '../../components/common/PageMeta'
import { authService } from '../../features/auth/authService'
import { toAuthMessage } from '../../features/auth/authErrors'

const schema = z.object({
  email: z.email('请输入有效邮箱'),
  password: z.string().min(6, '密码至少 6 位'),
})

type LoginForm = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const signInAsDemoUser = useAppStore((state) => state.signInAsDemoUser)
  const signInAsAdmin = useAppStore((state) => state.signInAsAdmin)
  const setToast = useAppStore((state) => state.setToast)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<LoginForm>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: LoginForm) => {
    setErrorMessage(null)

    if (!authService.isConfigured) {
      signInAsDemoUser()
      navigate('/profile')
      return
    }

    try {
      await authService.signIn(values)
      setToast('登录成功')
      navigate('/profile')
    } catch (error) {
      setErrorMessage(toAuthMessage(error))
    }
  }

  const sendResetEmail = async () => {
    const email = document.querySelector<HTMLInputElement>('input[name="email"]')?.value
    if (!email) {
      setErrorMessage('请先填写邮箱，再发送找回密码邮件。')
      return
    }

    try {
      await authService.resetPassword(email)
      setToast(authService.isConfigured ? '找回密码邮件已发送' : '当前未配置 Supabase，无法发送邮件')
    } catch (error) {
      setErrorMessage(toAuthMessage(error))
    }
  }

  return (
    <section className="field-container grid min-h-[70dvh] place-items-center py-12">
      <PageMeta title="登录" description="登录十个勤天陪伴社区原型。" path="/login" />
      <form onSubmit={handleSubmit(onSubmit)} className="paper-panel w-full max-w-md p-6">
        <h1 className="font-serif text-3xl font-semibold text-field-ink">登录陪伴手册</h1>
        <p className="mt-2 text-sm text-field-soft">
          {authService.isConfigured
            ? '当前使用 Supabase Auth 登录。'
            : `当前缺少 ${authService.missingConfig.join('、')}，提交后会进入原型登录态。`}
        </p>
        <label className="mt-6 grid gap-1 text-sm font-semibold">
          邮箱
          <input {...register('email')} type="email" autoComplete="email" className="field-input" />
          {formState.errors.email ? <span className="text-sm text-brick">{formState.errors.email.message}</span> : null}
        </label>
        <label className="mt-4 grid gap-1 text-sm font-semibold">
          密码
          <input {...register('password')} type="password" autoComplete="current-password" className="field-input" />
          {formState.errors.password ? <span className="text-sm text-brick">{formState.errors.password.message}</span> : null}
        </label>
        {errorMessage ? <p className="mt-4 rounded-field bg-brick/10 px-3 py-2 text-sm text-brick">{errorMessage}</p> : null}
        <Button type="submit" className="mt-6 w-full" isLoading={formState.isSubmitting}>登录</Button>
        <Button type="button" variant="ghost" className="mt-3 w-full" onClick={sendResetEmail}>找回密码</Button>
        {!authService.isConfigured ? (
          <Button type="button" variant="secondary" className="mt-3 w-full" onClick={() => { signInAsAdmin(); navigate('/admin') }}>以管理员原型态进入</Button>
        ) : null}
        <p className="mt-4 text-sm text-field-soft">还没有账号？<Link className="font-semibold text-wheat-strong" to="/register">注册</Link></p>
      </form>
    </section>
  )
}
