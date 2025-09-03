import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Download, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { server } from "@/main"; 
import { UserData } from "@/context/UserContext";
import { useTranslation } from "react-i18next";

const Catalogue = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuth, user } = UserData();
  const { t } = useTranslation('catalogue');

  const fetchCatalogues = async () => {
    try {
      const { data } = await axios.get(`${server}/api/catalogues`);
      setCatalogues(data);
    } catch (err) {
      console.error(err);
      toast.error(t("catalogues.fetchError"));
    }
  };

  useEffect(() => {
    fetchCatalogues();
  }, []);

  // Admin: upload catalogue
  const handleUpload = async () => {
    if (!file || !title) return toast.error(t("catalogues.titleFileRequired"));
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      const { data } = await axios.post(`${server}/api/catalogues`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success(data.message);
      setTitle("");
      setDescription("");
      setFile(null);
      fetchCatalogues();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("catalogues.uploadError"));
    }
    setLoading(false);
  };

  // Admin: delete catalogue
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/api/catalogues/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      fetchCatalogues();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("catalogues.deleteError"));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("catalogues.heading")}</h1>

      {/* Admin upload form */}
      {user?.role === "admin" && (
        <div className="mb-8 p-4 border rounded-md shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-xl">{t("catalogues.uploadHeading")}</h2>
          <input
            type="text"
            placeholder={t("catalogues.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded"
          />
          <textarea
            placeholder={t("catalogues.descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-max flex items-center gap-2"
          >
            <Plus size={16} /> {loading ? t("catalogues.uploading") : t("catalogues.uploadBtn")}
          </button>
        </div>
      )}

      {/* Catalogue list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {catalogues.map((cat) => (
          <div
            key={cat._id}
            className="border p-4 rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{cat.title}</h3>
              {cat.description && <p className="text-gray-600">{cat.description}</p>}
            </div>
            <div className="flex gap-2">
              {/* Download link (all users) */}
              <a
                href={cat.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
              >
                <Download size={16} /> {t("catalogues.download")}
              </a>

              {/* Admin delete */}
              {user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                >
                  <Trash2 size={16} /> {t("catalogues.delete")}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogue;
