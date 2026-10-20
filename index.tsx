import { useState, useEffect } from 'react';
import type { ReactNode, FormEvent } from 'react';
import Head from 'next/head';

/* =====================================================================
   ARCHIVES OF ELDORIA  -  single-file Next.js app (pages/index.tsx)
   Login page at "/"  ->  Notes page  ->  Logout returns to login
   ===================================================================== */

/* ---------- Types ---------- */
interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  runeColor: string;
}

interface IconProps {
  className?: string;
}

interface LoginErrors {
  email: string;
  password: string;
  form: string;
}

/* ---------- Login rules (change the number if your teacher says otherwise) ---------- */
const MIN_PASSWORD_LENGTH = 6;
const GMAIL_PATTERN = /^[^\s@]+@gmail\.com$/i;

/* ---------- Internal CSS ---------- */
const FANTASY_CSS = `
  html, body { margin: 0; background: #120a07; }
  .font-cinzel { font-family: 'Cinzel', serif; }
  .font-medieval { font-family: 'MedievalSharp', cursive; }
  .gold-border-glow { border-color: #d4af37; box-shadow: 0 0 15px rgba(212, 175, 55, 0.3); }
`;

/* ---------- Inline SVG icons ---------- */
function Svg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const Scroll = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x={3} y={3} width={18} height={18} rx={2} />
    <line x1={7} y1={8} x2={17} y2={8} />
    <line x1={7} y1={12} x2={17} y2={12} />
    <line x1={7} y1={16} x2={13} y2={16} />
  </Svg>
);
const Sparkles = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 3l1.8 4.9L18 9l-4.2 1.9L12 15l-1.8-4.1L6 9l4.2-1.1L12 3z" />
    <path d="M19 15l0.8 2 2 0.8-2 0.8-0.8 2-0.8-2-2-0.8 2-0.8z" />
  </Svg>
);
const Feather = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M20.24 12.24a6 6 0 10-8.49-8.49L5 10.5V19h8.5z" />
    <line x1={16} y1={8} x2={2} y2={22} />
    <line x1={17.5} y1={15} x2={9} y2={15} />
  </Svg>
);
const Trash2 = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <line x1={10} y1={11} x2={10} y2={17} />
    <line x1={14} y1={11} x2={14} y2={17} />
  </Svg>
);
const Edit3 = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </Svg>
);
const Save = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </Svg>
);
const X = ({ className }: IconProps) => (
  <Svg className={className}>
    <line x1={18} y1={6} x2={6} y2={18} />
    <line x1={6} y1={6} x2={18} y2={18} />
  </Svg>
);
const AlertTriangle = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 2L2 20h20L12 2z" />
    <line x1={12} y1={9} x2={12} y2={13} />
    <line x1={12} y1={17} x2={12} y2={17} />
  </Svg>
);
const BookOpen = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 7a4 4 0 00-4-2H4v14h4a4 4 0 014 2" />
    <path d="M12 7a4 4 0 014-2h4v14h-4a4 4 0 00-4 2" />
  </Svg>
);
const ShieldAlert = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1={12} y1={8} x2={12} y2={12} />
    <line x1={12} y1={16} x2={12} y2={16} />
  </Svg>
);
const Flame = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
  </Svg>
);
const Wand2 = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M15 4V2" />
    <path d="M15 16v-2" />
    <path d="M8 9h2" />
    <path d="M20 9h2" />
    <path d="M17.8 11.8L19 13" />
    <path d="M17.8 6.2L19 5" />
    <path d="M3 21l9-9" />
    <path d="M12.2 6.2L11 5" />
  </Svg>
);
const LogOut = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <path d="M16 17l5-5-5-5" />
    <line x1={21} y1={12} x2={9} y2={12} />
  </Svg>
);
const MailIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x={2} y={4} width={20} height={16} rx={2} />
    <path d="M22 7l-10 6L2 7" />
  </Svg>
);
const LockIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x={3} y={11} width={18} height={11} rx={2} />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </Svg>
);

/* ---------- Seed data ---------- */
const SEED_NOTES: Note[] = [
  {
    id: '1',
    title: 'Spellbook Draft: Fireball Arcana',
    description:
      'Requires sulfur and bat guano. Incantation: "Ignis Invicta!". Ensure focus is maintained on target to prevent splash back.',
    createdAt: 'Age III, Solis 14',
    runeColor: '#ff4500',
  },
  {
    id: '2',
    title: 'Quest: Defeat the Dragon of Eldoria',
    description:
      'Gather dragon-scale armor from the High Forge in Ironforge. Seek the Elven Oracle in Aethelgard for weakness runes.',
    createdAt: 'Age III, Solis 18',
    runeColor: '#d4af37',
  },
  {
    id: '3',
    title: 'Alchemy Recipe: Greater Elixir of Health',
    description: 'Mix 3 Silverleaf, 2 Kingsblood, and crystal water under the light of a full moon.',
    createdAt: 'Age III, Luna 2',
    runeColor: '#39ff14',
  },
];

/* =====================================================================
   FORM VALIDATION
   ===================================================================== */
function validateLogin(email: string, password: string): LoginErrors {
  const result: LoginErrors = { email: '', password: '', form: '' };

  if (!email.trim()) {
    result.email = 'Email cannot be empty.';
  } else if (!GMAIL_PATTERN.test(email.trim())) {
    result.email = 'Email must be a valid @gmail.com address.';
  }

  if (!password) {
    result.password = 'Password cannot be empty.';
  } else if (password.length <= MIN_PASSWORD_LENGTH) {
    result.password = `Password must be more than ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (result.email || result.password) {
    result.form = 'The gates remain sealed. Please correct the errors above and try again.';
  }
  return result;
}

/* =====================================================================
   LOGIN PAGE
   ===================================================================== */
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({ email: '', password: '', form: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = validateLogin(email, password);
    setErrors(result);
    if (!result.form) onLogin();
  };

  const fieldClass = (hasError: boolean) =>
    `w-full bg-[#120a07] border-2 ${
      hasError ? 'border-red-500' : 'border-[#b8860b]/60 focus:border-[#d4af37]'
    } rounded-lg p-3 pl-10 text-sm text-[#f4e4bc] font-serif focus:outline-none transition-all placeholder-[#735d45]`;

  return (
    <div className="min-h-screen bg-[#120a07] text-[#f4e4bc] font-serif flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#21140e] border-2 border-[#d4af37] rounded-xl p-8 gold-border-glow relative overflow-hidden">
        <Feather className="absolute right-3 bottom-3 w-32 h-32 text-[#d4af37]/5 pointer-events-none" />

        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center items-center gap-3">
            <BookOpen className="w-9 h-9 text-[#d4af37]" />
            <Wand2 className="w-9 h-9 text-[#d4af37]" />
          </div>
          <h1 className="font-cinzel text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#e5a99c] via-[#d4af37] to-[#e8d5b7]">
            GATES OF ELDORIA
          </h1>
          <p className="font-medieval text-[#c2b293] tracking-wider">
            Speak thy credentials to enter the Archives.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className="block text-xs font-cinzel text-[#d4af37] uppercase tracking-widest mb-2">
              Email
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-3.5 w-4 h-4 text-[#a88c5d]" />
              <input
                type="text"
                placeholder="wizard@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass(!!errors.email)}
              />
            </div>
            {errors.email && <p className="mt-2 text-xs text-red-400 font-serif">⚠ {errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-cinzel text-[#d4af37] uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-3.5 w-4 h-4 text-[#a88c5d]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass(!!errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xs font-cinzel text-[#a88c5d] hover:text-[#d4af37]"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-xs text-red-400 font-serif">⚠ {errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-cinzel font-black tracking-widest text-sm uppercase bg-gradient-to-r from-[#b8860b] to-[#d4af37] text-[#120a07] hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-300"
          >
            <Flame className="w-4 h-4" /> Login
          </button>

          {/* Error message BELOW the login button */}
          {errors.form && (
            <div className="flex items-center gap-3 p-3 bg-red-950/80 border border-red-500 rounded-lg text-red-200 text-xs font-serif">
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* =====================================================================
   NOTE ITEM  (separate component for each note)
   ===================================================================== */
interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedTitle: string, updatedDescription: string) => void;
}

function NoteItem({ note, onDelete, onUpdate }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editDescription, setEditDescription] = useState(note.description);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(note.id, editTitle, editDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditDescription(note.description);
    setIsEditing(false);
  };

  return (
    <div className="relative group bg-[#261912]/90 text-[#e8d5b7] border-2 border-[#b8860b] rounded-lg p-5 shadow-[0_4px_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300 flex flex-col justify-between min-h-[220px]">
      <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
      <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />

      <div className="flex items-center justify-between pb-3 border-b border-[#5e432d]">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full animate-pulse inline-block shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: note.runeColor, color: note.runeColor }}
          />
          <Scroll className="w-4 h-4 text-[#d4af37]" />
          <span className="text-xs tracking-widest uppercase font-serif text-[#a88c5d]">
            Archived Scroll
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#8c734b]">{note.createdAt}</span>
      </div>

      <div className="my-3 flex-1">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-[#170e0a] border border-[#d4af37] rounded p-2 text-sm text-[#f5e6cc] font-serif focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
            />
            <textarea
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full bg-[#170e0a] border border-[#b8860b]/60 rounded p-2 text-xs text-[#d4c3a3] font-serif focus:outline-none focus:ring-1 focus:ring-[#d4af37] resize-none"
            />
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-black font-serif text-[#f4e4bc] tracking-wide mb-2 flex items-center gap-2">
              {note.title}
            </h3>
            <p className="text-sm font-serif text-[#c2b293] whitespace-pre-wrap leading-relaxed">
              {note.description}
            </p>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[#422e1d] flex justify-end items-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1 text-xs font-serif rounded bg-[#381e18] text-[#e5a99c] hover:bg-[#4a271f] transition-colors border border-[#8b3a2b]"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 text-xs font-serif rounded bg-[#b8860b] text-[#1a0e08] font-bold hover:bg-[#d4af37] transition-all shadow-[0_0_10px_rgba(212,175,55,0.4)]"
            >
              <Save className="w-3 h-3" /> Enscribe (Save)
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded text-[#a88c5d] hover:text-[#d4af37] hover:bg-[#3d291c] transition-colors"
              title="Edit Scroll"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-1.5 rounded text-[#a88c5d] hover:text-[#e74c3c] hover:bg-[#3d1a18] transition-colors"
              title="Banish Scroll (Delete)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* =====================================================================
   NOTES PAGE
   ===================================================================== */
interface NotesPageProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  onLogout: () => void;
}

function NotesPage({ notes, setNotes, onLogout }: NotesPageProps) {
  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);

  // useEffect: check whether a note with this title already exists
  useEffect(() => {
    if (!titleInput.trim()) {
      setIsDuplicate(false);
      return;
    }
    const exists = notes.some(
      (note) => note.title.trim().toLowerCase() === titleInput.trim().toLowerCase()
    );
    setIsDuplicate(exists);
  }, [titleInput, notes]);

  const handleAddNote = (e: FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || isDuplicate) return;

    const runeColors = ['#d4af37', '#ff4500', '#9370db', '#00ffff', '#39ff14'];
    const newNote: Note = {
      id: Date.now().toString(),
      title: titleInput.trim(),
      description: descriptionInput.trim() || 'No runes enscribed.',
      createdAt: `Age III, Cycle ${Math.floor(Math.random() * 30) + 1}`,
      runeColor: runeColors[Math.floor(Math.random() * runeColors.length)],
    };

    setNotes([newNote, ...notes]);
    setTitleInput('');
    setDescriptionInput('');
  };

  const handleUpdateNote = (id: string, updatedTitle: string, updatedDescription: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, title: updatedTitle, description: updatedDescription } : note
      )
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#120a07] text-[#f4e4bc] font-serif p-4 sm:p-8 selection:bg-[#d4af37] selection:text-[#120a07]">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="text-center space-y-4 pt-6 pb-4 border-b-2 border-[#b8860b]/40 relative">
          <button
            onClick={onLogout}
            className="absolute right-0 top-0 flex items-center gap-2 px-4 py-2 text-xs font-cinzel font-bold tracking-widest uppercase rounded-lg bg-[#381e18] text-[#e5a99c] border border-[#8b3a2b] hover:bg-[#4a271f] transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
          <div className="flex justify-center items-center gap-3 pt-10 sm:pt-0">
            <BookOpen className="w-10 h-10 text-[#d4af37] animate-bounce" />
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#e5a99c] via-[#d4af37] to-[#e8d5b7]">
              ARCHIVES OF ELDORIA
            </h1>
            <Wand2 className="w-10 h-10 text-[#d4af37]" />
          </div>
          <p className="font-medieval text-lg text-[#c2b293] tracking-wider max-w-xl mx-auto">
            Enscribe your magical spells, quest objectives, and alchemy recipes into ancient scrolls.
          </p>
        </header>

        <section className="bg-[#21140e] border-2 border-[#d4af37] rounded-xl p-6 sm:p-8 gold-border-glow relative overflow-hidden">
          <Feather className="absolute right-4 bottom-4 w-32 h-32 text-[#d4af37]/5 pointer-events-none" />

          <div className="flex items-center gap-2 mb-6 border-b border-[#5e432d] pb-3">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-cinzel text-xl font-bold text-[#f4e4bc]">Enscribe New Scroll</h2>
          </div>

          <form onSubmit={handleAddNote} className="space-y-5">
            <div>
              <label className="block text-xs font-cinzel text-[#d4af37] uppercase tracking-widest mb-2">
                Scroll Title / Title of Arcana
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Quest: Search for the Lost Relic"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className={`w-full bg-[#120a07] border-2 ${
                  isDuplicate ? 'border-red-500' : 'border-[#b8860b]/60 focus:border-[#d4af37]'
                } rounded-lg p-3 text-sm text-[#f4e4bc] font-serif focus:outline-none transition-all placeholder-[#735d45]`}
              />
            </div>

            {isDuplicate && (
              <div className="flex items-center gap-3 p-3 bg-red-950/80 border border-red-500 rounded-lg text-red-200 text-xs font-serif animate-pulse">
                <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-red-400">RUNE CONFLICT DETECTED!</span>
                  A scroll with the exact title <span className="underline">&quot;{titleInput}&quot;</span>{' '}
                  already exists in the Archives. Please provide a unique title.
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-cinzel text-[#d4af37] uppercase tracking-widest mb-2">
                Runes &amp; Description
              </label>
              <textarea
                rows={4}
                placeholder="Write the details, incantations, or coordinates..."
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                className="w-full bg-[#120a07] border-2 border-[#b8860b]/60 rounded-lg p-3 text-sm text-[#f4e4bc] font-serif focus:outline-none focus:border-[#d4af37] transition-all resize-none placeholder-[#735d45]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isDuplicate || !titleInput.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-cinzel font-black tracking-widest text-sm uppercase transition-all duration-300 ${
                  isDuplicate || !titleInput.trim()
                    ? 'bg-[#3d2b20] text-[#735d45] cursor-not-allowed border border-[#5e432d]'
                    : 'bg-gradient-to-r from-[#b8860b] to-[#d4af37] text-[#120a07] hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.5)] cursor-pointer'
                }`}
              >
                <Flame className="w-4 h-4" /> Enscribe Scroll
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#5e432d] pb-3">
            <h2 className="font-cinzel text-2xl font-bold text-[#f4e4bc] flex items-center gap-2">
              <Scroll className="w-6 h-6 text-[#d4af37]" /> Archived Scrolls ({notes.length})
            </h2>
            <span className="text-xs font-medieval text-[#a88c5d]">Total Magic Preserved</span>
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-16 bg-[#21140e]/50 border-2 border-dashed border-[#5e432d] rounded-xl p-8 space-y-3">
              <AlertTriangle className="w-10 h-10 text-[#d4af37] mx-auto opacity-60" />
              <p className="font-medieval text-lg text-[#c2b293]">
                The Archives are empty. No active spells or scrolls recorded.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onUpdate={handleUpdateNote}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* =====================================================================
   ROOT PAGE  (route "/")  -  switches between Login and Notes
   ===================================================================== */
export default function Home() {
  const [route, setRoute] = useState<'login' | 'notes'>('login');
  const [loggedIn, setLoggedIn] = useState(false);
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);

  // Keep the page in sync with the URL hash (#/ = login, #/notes = notes)
  useEffect(() => {
    const sync = () => setRoute(window.location.hash === '#/notes' ? 'notes' : 'login');
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  // Guard: opening #/notes while logged out sends you back to login
  useEffect(() => {
    if (route === 'notes' && !loggedIn) window.location.hash = '#/';
  }, [route, loggedIn]);

  const handleLogin = () => {
    setLoggedIn(true);
    window.location.hash = '#/notes';
  };

  const handleLogout = () => {
    setLoggedIn(false);
    window.location.hash = '#/';
  };

  return (
    <>
      <Head>
        <title>Archives of Eldoria</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=MedievalSharp&display=swap"
          rel="stylesheet"
        />
        {/* Tailwind via CDN so the whole project stays in one file */}
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <style>{FANTASY_CSS}</style>

      {route === 'notes' && loggedIn ? (
        <NotesPage notes={notes} setNotes={setNotes} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}
