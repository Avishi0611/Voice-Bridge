import { Outlet } from 'react-router-dom'
import { LanguageSelector } from '../i18n/LanguageContext'
import Logo from './Logo'

function PublicLayout() {
  return (
    <main className="page-enter min-h-screen bg-[#f2f3f5] px-5 py-8 sm:px-8">
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between">
        <Logo size="sm" to="/" subtitle={false} />
        <LanguageSelector />
      </div>
      <Outlet />
    </main>
  )
}

export default PublicLayout