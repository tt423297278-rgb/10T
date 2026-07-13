import { LockKeyhole } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { Button } from '../../components/common/Button'
import { PageMeta } from '../../components/common/PageMeta'

export function AuthGuard({ children }: { children: ReactNode }) {
  const user = useAppStore((state) => state.user)
  if (user) return <>{children}</>

  return (
    <section className="field-container py-16">
      <PageMeta title="需要登录" description="登录后继续访问个人中心、签到、发布和收藏功能。" />
      <div className="paper-panel mx-auto max-w-xl p-8 text-center">
        <LockKeyhole className="mx-auto mb-4 text-wheat" aria-hidden="true" />
        <h1 className="font-serif text-3xl font-semibold text-field-ink">需要登录后继续</h1>
        <p className="mt-3 text-field-soft">签到、发布、收藏和个人中心会记录到你的陪伴手册中。</p>
        <Button asChild className="mt-6">
          <Link to="/login">去登录</Link>
        </Button>
      </div>
    </section>
  )
}
