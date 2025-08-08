import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('i18nextLng', selectedLang); // optional: save preference
  };

  return (
    <select
      onChange={handleChange}
      value={i18n.language}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="en">English</option>
      <option value="bn">বাংলা</option>
    </select>
  );
};

export default LanguageSwitcher;
