'use client';

const ROLES = [
  // Engineering
  'Software Engineer', 'Frontend Engineer', 'Backend Engineer',
  'Full Stack Engineer', 'DevOps Engineer', 'Data Engineer',
  'Machine Learning Engineer', 'iOS Developer', 'Android Developer',
  // Data & AI
  'Data Scientist', 'Data Analyst', 'AI/ML Engineer', 'Business Intelligence Analyst',
  // Product & Design
  'Product Manager', 'UX Designer', 'UI Designer', 'UX Researcher',
  // Marketing & Sales
  'Marketing Manager', 'Growth Manager', 'SEO Specialist', 'Sales Manager',
  'Account Executive', 'Business Development Manager',
  // Finance & Ops
  'Financial Analyst', 'Operations Manager', 'Project Manager', 'Scrum Master',
  // Other
  'HR Manager', 'Recruiter', 'Content Writer', 'Graphic Designer',
] as const;

interface RoleSelectorProps {
  value: string;
  onChange: (v: string) => void;
}

export default function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-2 font-body">
        Target Role <span className="text-slate-600">(optional)</span>
      </label>
      <div className="relative">
        <input
          list="role-list"
          type="text"
          placeholder="Type or choose a role…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-3
            text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500
            transition-colors text-sm font-body"
        />
        <datalist id="role-list">
          {ROLES.map((r) => <option key={r} value={r} />)}
        </datalist>
      </div>
      {/* Quick-pick chips for common roles */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'Marketing Manager'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={`px-2.5 py-1 rounded-full text-xs font-body transition-all border
              ${value === r
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                : 'border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
              }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
