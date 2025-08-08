import { Button } from '@/components/ui/button';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation("common");

  return (
    <div className="w-[60%] m-auto flex flex-col justify-center items-center">
      <img src="/not found.jpeg" alt={t("notFound.altText")} />
      <Link to={'/'}>
        <Button variant="ghost">{t("notFound.goHomeBtn")}</Button>
      </Link>
    </div>
  );
};

export default NotFound;
