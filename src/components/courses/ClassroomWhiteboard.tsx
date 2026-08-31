import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  Eraser,
  RotateCcw,
  Download,
  Trash2,
  Square,
  Circle,
  Triangle,
  MoveRight,
  Grid,
  Maximize2,
  Sparkles,
  Type,
  PlusCircle,
  FileQuestion,
  Eye,
  Check,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup } from '../../types/courses';

interface ClassroomWhiteboardProps {
  course: CourseGroup;
  lang: AppLanguage;
  isTeacherMode?: boolean;
}

type ToolType = 'pen' | 'highlighter' | 'eraser' | 'rect' | 'circle' | 'triangle' | 'arrow' | 'line' | 'coordinate';
type GridType = 'math_grid' | 'dots' | 'blank';

const MATH_FORMULA_STAMPS = [
  { label: '√x', text: '√(' },
  { label: 'x²', text: '²' },
  { label: 'π', text: 'π' },
  { label: 'Σ', text: 'Σ' },
  { label: 'Δ', text: 'Δ' },
  { label: '≠', text: '≠' },
  { label: '≤', text: '≤' },
  { label: '≥', text: '≥' },
  { label: 'α', text: 'α' },
  { label: 'β', text: 'β' },
  { label: 'f(x)', text: 'f(x)=' },
];

const PRESET_SAMPLE_PROBLEMS = [
  {
    id: 'geom-1',
    titleRu: '📐 Геометрия: Площадь трапеции и вписанный круг',
    titleKg: '📐 Геометрия: Трапециянын аянты жана ичине сызылган тегерек',
    taskTextRu: 'В равнобедренную трапецию ABCD с основаниями BC = 8 и AD = 18 вписана окружность. Найдите радиус R окружности и площадь S трапеции.',
    taskTextKg: 'Негиздери BC = 8 жана AD = 18 болгон тең капталдуу ABCD трапециясынын ичине айлана сызылган. Айлананын R радиусун жана трапециянын S аянтын табыңыз.',
  },
  {
    id: 'alg-1',
    titleRu: '🔢 Алгебра: Система показательных уравнений',
    titleKg: '🔢 Алгебра: Көрсөткүчтүү теңдемелер системасы',
    taskTextRu: 'Решите систему уравнений: 2^x · 3^y = 72 и 3^x · 2^y = 108. Найдите значение выражения x² + y².',
    taskTextKg: 'Теңдемелер системасын чыгаргыла: 2^x · 3^y = 72 жана 3^x · 2^y = 108. x² + y² туюнтмасынын маанисин тапкыла.',
  },
  {
    id: 'perc-1',
    titleRu: '📊 Задачи: Сплавы и процентное содержание',
    titleKg: '📊 Маселелер: Куймалар жана пайыздык катыш',
    taskTextRu: 'Имеется два сплава золота и серебра. В первом сплаве золото составляет 40%, во втором — 65%. Сколько кг каждого сплава нужно взять, чтобы получить 50 кг сплава с 55% содержанием золота?',
    taskTextKg: 'Алтын менен күмүштүн эки куймасы бар. Биринчисинде алтын 40%, экинчисинде 65%. 55% алтыны бар 50 кг куйма алуу үчүн ар бир куймадан канча кг алуу керек?',
  },
];

const COLORS = [
  { id: '#34d399', label: 'Изумруд', class: 'bg-emerald-400' },
  { id: '#fbbf24', label: 'Золото', class: 'bg-amber-400' },
  { id: '#ffffff', label: 'Белый', class: 'bg-white' },
  { id: '#38bdf8', label: 'Голубой', class: 'bg-sky-400' },
  { id: '#f87171', label: 'Красный', class: 'bg-rose-400' },
  { id: '#c084fc', label: 'Фиолетовый', class: 'bg-purple-400' },
];

export const ClassroomWhiteboard: React.FC<ClassroomWhiteboardProps> = ({
  course,
  lang,
  isTeacherMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isKg = lang === 'kg';

  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [activeColor, setActiveColor] = useState<string>('#34d399');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [gridMode, setGridMode] = useState<GridType>('math_grid');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [snapshotImg, setSnapshotImg] = useState<string | null>(null);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [activeProblem, setActiveProblem] = useState<(typeof PRESET_SAMPLE_PROBLEMS)[0] | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Setup canvas size
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Save content before resize
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(canvas, 0, 0);
    }

    canvas.width = rect.width * dpr;
    canvas.height = (rect.height || 540) * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height || 540}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // Restore
      if (tempCanvas.width > 0 && tempCanvas.height > 0) {
        ctx.drawImage(tempCanvas, 0, 0, rect.width, rect.height || 540);
      }
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const saveStateToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), data]);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    const prev = newHistory.pop();
    if (prev) {
      ctx.putImageData(prev, 0, 0);
      setHistory(newHistory);
    }
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    saveStateToHistory();
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  };

  const downloadScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');
    if (!tCtx) return;

    // Fill background with dark board color
    tCtx.fillStyle = '#051f17';
    tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tCtx.drawImage(canvas, 0, 0);

    const dataUrl = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `kyrgyz-akylman-whiteboard-${course.id}.png`;
    link.href = dataUrl;
    link.click();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveStateToHistory();
    const { x, y } = getCanvasCoords(e);
    setStartX(x);
    setStartY(y);
    setIsDrawing(true);

    if (activeTool === 'pen' || activeTool === 'highlighter' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    ctx.strokeStyle = activeColor;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = 1.0;

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#051f17';
      ctx.lineWidth = lineWidth * 5;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (activeTool === 'highlighter') {
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = lineWidth * 3.5;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (activeTool === 'pen') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    ctx.strokeStyle = activeColor;
    ctx.fillStyle = activeColor;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = 1.0;

    // Draw Geometric Shapes
    if (activeTool === 'rect') {
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (activeTool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (activeTool === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.lineTo(startX - (x - startX), y);
      ctx.closePath();
      ctx.stroke();
    } else if (activeTool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (activeTool === 'arrow') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
      // Arrowhead
      const angle = Math.atan2(y - startY, x - startX);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 14 * Math.cos(angle - Math.PI / 6), y - 14 * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(x, y);
      ctx.lineTo(x - 14 * Math.cos(angle + Math.PI / 6), y - 14 * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    } else if (activeTool === 'coordinate') {
      // XY Axis
      const width = Math.abs(x - startX);
      const height = Math.abs(y - startY);
      const cx = (startX + x) / 2;
      const cy = (startY + y) / 2;

      ctx.beginPath();
      // X axis
      ctx.moveTo(cx - width / 2, cy);
      ctx.lineTo(cx + width / 2, cy);
      // Y axis
      ctx.moveTo(cx, cy + height / 2);
      ctx.lineTo(cx, cy - height / 2);
      ctx.stroke();

      // Axis labels
      ctx.font = '12px monospace';
      ctx.fillText('X', cx + width / 2 - 8, cy - 6);
      ctx.fillText('Y', cx + 6, cy - height / 2 + 12);
      ctx.fillText('0', cx - 12, cy + 14);
    }

    ctx.beginPath();
    setIsDrawing(false);
  };

  const addFormulaStamp = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    saveStateToHistory();

    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = activeColor;
    ctx.fillText(text, 60, 80);
  };

  const loadProblemToBoard = (problem: (typeof PRESET_SAMPLE_PROBLEMS)[0]) => {
    setActiveProblem(problem);
    setShowTaskSelector(false);
    clearBoard();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const title = isKg ? problem.titleKg : problem.titleRu;
    const text = isKg ? problem.taskTextKg : problem.taskTextRu;

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(title, 20, 35);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px sans-serif';

    // Simple text wrapper
    const words = text.split(' ');
    let line = '';
    let currentY = 60;
    const maxWidth = (canvas.width / (window.devicePixelRatio || 1)) - 40;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 20, currentY);
        line = words[n] + ' ';
        currentY += 22;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 20, currentY);
  };

  return (
    <div className="bg-[#041a14] border border-emerald-800/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col space-y-0">
      {/* Top Toolbar */}
      <div className="bg-[#031510] border-b border-emerald-800/60 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Left Tools Group */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Pen */}
          <button
            type="button"
            onClick={() => setActiveTool('pen')}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === 'pen'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30 font-black'
                : 'bg-white/5 hover:bg-white/10 text-emerald-200 border-emerald-800/60'
            }`}
            title="Маркер / Ручка"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">{isKg ? 'Маркер' : 'Маркер'}</span>
          </button>

          {/* Highlighter */}
          <button
            type="button"
            onClick={() => setActiveTool('highlighter')}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === 'highlighter'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30 font-black'
                : 'bg-white/5 hover:bg-white/10 text-emerald-200 border-emerald-800/60'
            }`}
            title="Выделитель"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{isKg ? 'Түс' : 'Выделитель'}</span>
          </button>

          {/* Geometric Shapes */}
          <div className="flex items-center gap-1 bg-[#020e0b] p-1 rounded-xl border border-emerald-900/60">
            <button
              type="button"
              onClick={() => setActiveTool('rect')}
              className={`p-1.5 rounded-lg transition-colors ${
                activeTool === 'rect' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Прямоугольник"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('circle')}
              className={`p-1.5 rounded-lg transition-colors ${
                activeTool === 'circle' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Круг / Окружность"
            >
              <Circle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('triangle')}
              className={`p-1.5 rounded-lg transition-colors ${
                activeTool === 'triangle' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Треугольник"
            >
              <Triangle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('arrow')}
              className={`p-1.5 rounded-lg transition-colors ${
                activeTool === 'arrow' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Стрелка / Вектор"
            >
              <MoveRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('coordinate')}
              className={`p-1.5 rounded-lg transition-colors text-[10px] font-black ${
                activeTool === 'coordinate' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Координатная плоскость XY"
            >
              XY
            </button>
          </div>

          {/* Eraser */}
          <button
            type="button"
            onClick={() => setActiveTool('eraser')}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === 'eraser'
                ? 'bg-rose-500 text-white border-rose-400 shadow-md font-black'
                : 'bg-white/5 hover:bg-white/10 text-emerald-200 border-emerald-800/60'
            }`}
            title="Ластик"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">{isKg ? 'Өчүргүч' : 'Ластик'}</span>
          </button>
        </div>

        {/* Color Palette & Thickness */}
        <div className="flex items-center gap-3">
          {/* Colors */}
          <div className="flex items-center gap-1.5 bg-[#020e0b] p-1.5 rounded-2xl border border-emerald-900/60">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveColor(c.id)}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${c.class} ${
                  activeColor === c.id ? 'scale-125 ring-2 ring-white shadow-md' : 'opacity-80 hover:opacity-100'
                }`}
                title={c.label}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="hidden sm:flex items-center gap-1 bg-[#020e0b] p-1 rounded-xl border border-emerald-900/60 text-xs text-slate-300 font-bold">
            {[2, 4, 8].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setLineWidth(w)}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  lineWidth === w ? 'bg-emerald-500 text-slate-950 font-black' : 'hover:text-white'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>

          {/* Action Tools: Undo, Clear, Snapshot */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
              title="Отменить действие"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={clearBoard}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
              title="Очистить всю доску"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={downloadScreenshot}
              className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 transition-colors cursor-pointer"
              title="Сохранить скриншот доски"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Bar: Math formula stamps & Grid Modes & Load Task */}
      <div className="bg-[#02100c] px-3 sm:px-4 py-2 border-b border-emerald-950/80 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] uppercase font-bold text-emerald-400/80 mr-1">
            {isKg ? 'Формулалар:' : 'Штампы:'}
          </span>
          {MATH_FORMULA_STAMPS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => addFormulaStamp(s.text)}
              className="px-2 py-0.5 rounded-md bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-200 text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Load Sample Task Button */}
          <button
            type="button"
            onClick={() => setShowTaskSelector((prev) => !prev)}
            className="px-2.5 py-1 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>{isKg ? 'ЖРТ тапшырмасын жүктөө' : 'Загрузить задачу ОРТ'}</span>
          </button>

          {/* Grid Mode Selector */}
          <button
            type="button"
            onClick={() => setGridMode((prev) => (prev === 'math_grid' ? 'blank' : 'math_grid'))}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              gridMode === 'math_grid'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/5 text-slate-400'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{gridMode === 'math_grid' ? (isKg ? 'Клетка' : 'Клетка') : (isKg ? 'Бош' : 'Без сетки')}</span>
          </button>
        </div>
      </div>

      {/* Task Selector Dropdown / Overlay */}
      {showTaskSelector && (
        <div className="bg-[#05261c] border-b border-emerald-800/80 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <FileQuestion className="w-4 h-4" />
              <span>{isKg ? 'Талкуулоо үчүн ЖРТ маселесин тандаңыз' : 'Выберите задачу ОРТ для совместного разбора'}</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowTaskSelector(false)}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESET_SAMPLE_PROBLEMS.map((prob) => (
              <div
                key={prob.id}
                onClick={() => loadProblemToBoard(prob)}
                className="p-3 rounded-2xl bg-[#031510] border border-emerald-800/60 hover:border-amber-400 transition-all cursor-pointer group text-left space-y-1.5"
              >
                <div className="text-xs font-bold text-amber-200 group-hover:text-amber-300">
                  {isKg ? prob.titleKg : prob.titleRu}
                </div>
                <p className="text-[11px] text-emerald-200/70 line-clamp-2">
                  {isKg ? prob.taskTextKg : prob.taskTextRu}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  {isKg ? 'Доскага чыгаруу →' : 'Вывести на доску →'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Canvas Drawing Area */}
      <div
        ref={containerRef}
        className={`relative w-full min-h-[500px] sm:min-h-[580px] bg-[#051f17] overflow-hidden ${
          gridMode === 'math_grid' ? 'bg-[radial-gradient(#10b98126_1px,transparent_1px)] [background-size:24px_24px]' : ''
        }`}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 cursor-crosshair touch-none select-none"
        />

        {/* Floating Live Teacher Broadcast Indicator */}
        <div className="absolute top-4 right-4 pointer-events-none z-10 flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-[#031510]/90 backdrop-blur-md border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isKg ? 'Интерактивдүү такта активдүү' : 'Интерактивная доска активна'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
