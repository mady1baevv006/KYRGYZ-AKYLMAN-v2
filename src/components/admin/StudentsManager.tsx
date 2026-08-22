import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Trash2,
  Edit2,
  Sparkles,
  Star,
  School,
  Check,
  RotateCcw,
  ExternalLink,
  Search,
  Eye,
  Award,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { StudentResult } from '../../types';
import {
  getStoredStudents,
  saveStoredStudents,
  addStoredStudent,
  updateStoredStudent,
  deleteStoredStudent,
  resetStoredStudents,
} from '../../data/studentsData';
import { KYRGYZ_UNIVERSITIES } from '../../data/constants';
import { getOptimizedStudentPhotoUrl } from '../../utils/imageOptimization';

export const StudentsManager: React.FC = () => {
  const [students, setStudents] = useState<StudentResult[]>(getStoredStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form fields
  const [formData, setFormData] = useState<{
    name: string;
    nameKg: string;
    score: number;
    university: string;
    universityKg: string;
    photoUrl: string;
    isGoldCertificate: boolean;
  }>({
    name: '',
    nameKg: '',
    score: 200,
    university: '',
    universityKg: '',
    photoUrl: '',
    isGoldCertificate: false,
  });

  const reloadStudents = () => {
    setStudents(getStoredStudents());
  };

  useEffect(() => {
    window.addEventListener('ort_students_updated', reloadStudents);
    return () => window.removeEventListener('ort_students_updated', reloadStudents);
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingStudentId(null);
    setFormData({
      name: '',
      nameKg: '',
      score: 200,
      university: '',
      universityKg: '',
      photoUrl: '',
      isGoldCertificate: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: StudentResult) => {
    setEditingStudentId(student.id);
    setFormData({
      name: student.name || '',
      nameKg: student.nameKg || student.name || '',
      score: student.score || 200,
      university: student.university || '',
      universityKg: student.universityKg || student.university || '',
      photoUrl: student.photoUrl || '',
      isGoldCertificate: student.isGoldCertificate || (student.score >= 220),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string | number, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить ученика "${name}"?`)) {
      deleteStoredStudent(id);
      reloadStudents();
      showToast(`Ученик "${name}" успешно удален!`);
    }
  };

  const handleReset = () => {
    if (window.confirm('Сбросить список к первоначальным 6 ученикам? Все несохраненные добавления будут заменены.')) {
      resetStoredStudents();
      reloadStudents();
      showToast('Список успешно сброшен к исходному!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Укажите имя и фамилию ученика!', 'error');
      return;
    }
    if (!formData.score || formData.score < 50 || formData.score > 250) {
      showToast('Укажите корректный балл ОРТ (от 50 до 250)!', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      nameKg: formData.nameKg.trim() || formData.name.trim(),
      score: Number(formData.score),
      scoreLabel: `${formData.score} баллов`,
      scoreLabelKg: `${formData.score} балл`,
      university: formData.university.trim() || 'Ведущий ВУЗ КР',
      universityKg: formData.universityKg.trim() || formData.university.trim() || 'КР алдыңкы ЖОЖу',
      photoUrl: formData.photoUrl.trim(),
      isGoldCertificate: formData.isGoldCertificate || Number(formData.score) >= 220,
    };

    if (editingStudentId !== null) {
      updateStoredStudent(editingStudentId, payload);
      showToast(`Данные ученика "${payload.name}" успешно обновлены!`);
    } else {
      addStoredStudent(payload);
      showToast(`Ученик "${payload.name}" успешно добавлен в базу!`);
    }

    setIsModalOpen(false);
    reloadStudents();
  };

  const filteredStudents = students.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.nameKg?.toLowerCase().includes(q) ||
      s.university?.toLowerCase().includes(q) ||
      s.score?.toString().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between shadow-lg text-sm font-semibold border transition-all ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMsg.type === 'success' ? (
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header controls */}
      <div className="bg-[#05261c] border border-emerald-800/60 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Управление учениками и результатами ОРТ</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
            Все изменения мгновенно сохраняются и отображаются на главной странице сайта.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-xs font-bold text-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Восстановить изначальный список"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сброс</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black tracking-wide shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Добавить ученика</span>
          </button>
        </div>
      </div>

      {/* Search and Stats bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск по имени, ВУЗу или баллу..."
            className="w-full pl-10 pr-4 py-2 bg-[#041d16] border border-emerald-800/60 rounded-xl text-sm text-white placeholder-emerald-400/40 focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div className="text-xs text-emerald-300/80 font-bold self-end sm:self-center">
          Всего учеников: <span className="text-emerald-400 font-black">{students.length}</span> (показано {filteredStudents.length})
        </div>
      </div>

      {/* Students Cards Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredStudents.map((student) => {
          const isGold = student.isGoldCertificate || student.score >= 220;

          return (
            <div
              key={student.id}
              className={`bg-[#06261d] border rounded-2xl p-4 flex flex-col justify-between transition-all group ${
                isGold
                  ? 'border-amber-400/60 shadow-lg shadow-amber-500/10'
                  : 'border-emerald-800/60 hover:border-emerald-500/70 shadow-lg shadow-black/30'
              }`}
            >
              <div>
                {/* Photo with live preview */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#031510] border border-emerald-900/60 mb-3 flex items-center justify-center">
                  {student.photoUrl ? (
                    <img
                      src={getOptimizedStudentPhotoUrl(student.photoUrl)}
                      alt={student.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-2xl text-slate-950">
                      {student.name.charAt(0)}
                    </div>
                  )}

                  {/* Score badge */}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-emerald-400/50 text-[11px] font-black text-emerald-300 shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>{student.score} б.</span>
                  </div>

                  {/* Gold star */}
                  {isGold && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-md bg-black/70 border border-amber-400/60 flex items-center justify-center text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-base font-black text-white leading-snug group-hover:text-emerald-300 transition-colors">
                  {student.name}
                </h3>
                {student.nameKg && student.nameKg !== student.name && (
                  <p className="text-[11px] text-emerald-400/70 font-semibold mt-0.5">
                    KG: {student.nameKg}
                  </p>
                )}

                {/* University */}
                <div className="flex items-start gap-1.5 text-xs font-semibold text-emerald-200/80 mt-2">
                  <School className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{student.university}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-emerald-900/50 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEdit(student)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/70 text-xs font-bold text-emerald-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Изменить</span>
                </button>

                <button
                  onClick={() => handleDelete(student.id, student.name)}
                  className="py-1.5 px-2.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-xs font-bold text-rose-300 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                  title="Удалить"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-[#041d16] border border-emerald-900/40 rounded-2xl p-6">
          <p className="text-emerald-200/70 font-semibold text-sm">
            Ученики не найдены. Добавьте нового ученика через кнопку выше!
          </p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#05261c] border border-emerald-700/60 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3.5">
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <span>{editingStudentId !== null ? 'Редактировать ученика' : 'Добавить нового ученика'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800/60 text-emerald-400 hover:text-white flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name RU */}
              <div>
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                  Имя и Фамилия (на русском) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Бабанов Актилек"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Name KG */}
              <div>
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                  Аты-жөнү (на кыргызском, опционально)
                </label>
                <input
                  type="text"
                  placeholder="Эгер айырмаланса, мисалы: Өмүржанова Адеми"
                  value={formData.nameKg}
                  onChange={(e) => setFormData({ ...formData, nameKg: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Score & Gold cert */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                    Балл ОРТ (ЖРТ) *
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={250}
                    value={formData.score}
                    onChange={(e) => {
                      const sc = Number(e.target.value);
                      setFormData({
                        ...formData,
                        score: sc,
                        isGoldCertificate: sc >= 220 ? true : formData.isGoldCertificate,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 p-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl cursor-pointer hover:border-emerald-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isGoldCertificate}
                      onChange={(e) => setFormData({ ...formData, isGoldCertificate: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      Золотой сертификат
                    </span>
                  </label>
                </div>
              </div>

              {/* University RU */}
              <div>
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                  ВУЗ / Университет (на русском)
                </label>
                <input
                  type="text"
                  placeholder="Например: КГТУ им. И. Раззакова (Политех)"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  list="universities-list"
                  className="w-full px-3.5 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400"
                />
                <datalist id="universities-list">
                  {KYRGYZ_UNIVERSITIES.map((uni, idx) => (
                    <option key={idx} value={uni} />
                  ))}
                </datalist>
              </div>

              {/* University KG */}
              <div>
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                  ЖОЖ / Университет (на кыргызском)
                </label>
                <input
                  type="text"
                  placeholder="Например: И. Раззаков атындагы КМТУ (Политех)"
                  value={formData.universityKg}
                  onChange={(e) => setFormData({ ...formData, universityKg: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                  Ссылка на фото (Cloudinary или прямая ссылка)
                </label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/.../photo.png"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              {/* Live Preview Photo */}
              {formData.photoUrl && (
                <div className="p-3 bg-[#031510] border border-emerald-800/50 rounded-2xl flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-emerald-700/50 shrink-0">
                    <img
                      src={formData.photoUrl}
                      alt="Превью фото"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="text-xs text-emerald-300/80">
                    <div className="font-bold text-white">Превью фотографии</div>
                    <div>Фотография корректно подгружается и готова к публикации.</div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-3 border-t border-emerald-800/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/60 text-xs font-bold text-emerald-300 cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black tracking-wide shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95"
                >
                  {editingStudentId !== null ? 'Сохранить изменения' : 'Добавить ученика'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
