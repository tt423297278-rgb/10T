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
  nickname: z.string().min(2, '昵称至少 2 个字符'),
  email: z.email('请输入有效邮箱'),
  password: z.string().min(6, '密码至少 6 位'),
})

type RegisterForm = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const signInAsDemoUser = useAppStore((state) => state.signInAsDemoUser)
  const setToast = useAppStore((state) => state.setToast)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<RegisterForm>({ resolver: zodResolver(schema) })
  const onSubmit = async (values: RegisterForm) => {
    setErrorMessage(null)

    if (!authService.isConfigured) {
      signInAsDemoUser()
      navigate('/profile')
      return
    }

    try {
      await authService.signUp(values)
      setToast('注册成功，请根据 Supabase 邮箱确认设置完成验证。')
      navigate('/profile')
    } catch (error) {
      setErrorMessage(toAuthMessage(error))
    }
  }

  return (
    <section className="field-container grid min-h-[70dvh] place-items-center py-12">
      <PageMeta title="注册" description="注册十个勤天陪伴社区原型。" path="/register" />
      <form onSubmit={handleSubmit(onSubmit)} className="paper-panel w-full max-w-md p-6">
        <h1 className="font-serif text-3xl font-semibold text-field-ink">建立你的陪伴手册</h1>
        <p className="mt-2 text-sm text-field-soft">
          {authService.isConfigured
            ? '当前使用 Supabase Auth 注册。'
            : `当前缺少 ${authService.missingConfig.join('、')}，提交后会进入原型登录态。`}
        </p>
        <label className="mt-6 grid gap-1 text-sm font-semibold">昵称<input {...register('nickname')} className="field-input" />{formState.errors.nickname ? <span className="text-sm text-brick">{formState.errors.nickname.message}</span> : null}</label>
        <label className="mt-4 grid gap-1 text-sm font-semibold">邮箱<input {...register('email')} type="email" autoComplete="email" className="field-input" />{formState.errors.email ? <span className="text-sm text-brick">{formState.errors.email.message}</span> : null}</label>
        <label className="mt-4 grid gap-1 text-sm font-semibold">密码<input {...register('password')} type="password" autoComplete="new-password" className="field-input" />{formState.errors.password ? <span className="text-sm text-brick">{formState.errors.password.message}</span> : null}</label>
        {errorMessage ? <p className="mt-4 rounded-field bg-brick/10 px-3 py-2 text-sm text-brick">{errorMessage}</p> : null}
        <Button type="submit" className="mt-6 w-full" isLoading={formState.isSubmitting}>注册</Button>
        <p className="mt-4 text-sm text-field-soft">已有账号？<Link className="font-semibold text-wheat-strong" to="/login">登录</Link></p>
      </form>
    </section>
  )
}
