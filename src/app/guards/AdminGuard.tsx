import { ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { Button } from '../../components/common/Button'
import { PageMeta } from '../../components/common/PageMeta'

export function AdminGuard({ children }: { children: ReactNode }) {
  const user = useAppStore((state) => state.user)
  if (user?.role === 'admin') return <>{children}</>

  return (
    <section className="field-container py-16">
      <PageMeta title="无后台访问权限" description="后台管理需要管理员身份和服务端权限校验。" />
      <div className="paper-panel mx-auto max-w-xl p-8 text-center">
        <ShieldAlert className="mx-auto mb-4 text-brick" aria-hidden="true" />
        <h1 className="font-serif text-3xl font-semibold text-field-ink">无后台访问权限</h1>
        <p className="mt-3 text-field-soft">后台权限不能只靠前端隐藏按钮，后续会由 Supabase RLS 和服务端校验共同限制。</p>
        <Button asChild variant="secondary" className="mt-6">
          <Link to="/">回到首页</Link>
        </Button>
      </div>
    </section>
  )
}
