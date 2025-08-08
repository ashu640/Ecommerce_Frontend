import { Facebook, X, Youtube } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation('common') // 'footer' namespace

  return (
    <footer className="w-full mt-8">
      <hr className="border border-gray-300 dark:border-gray-700" />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 flex-col md:flex-row justify-between items-center">
            <h1 className="text-xl font-bold">{t('brand')}</h1>
            <p className="text-sm">{t('tagline')}</p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <a href="#" className="text-sm hover:underline">{t('about')}</a>
            <a href="#" className="text-sm hover:underline">{t('contact')}</a>
            <a href="#" className="text-sm hover:underline">{t('privacy')}</a>
            <a href="#" className="text-sm hover:underline">{t('terms')}</a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm">{t('follow')}</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:opacity-75"><Facebook /></a>
            <a href="#" className="hover:opacity-75"><X /></a>
            <a href="#" className="hover:opacity-75"><Youtube /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
