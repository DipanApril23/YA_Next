export default function Input({ 
  label, 
  error, 
  className = "", 
  ...props 
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          error 
            ? "border-error focus:border-error focus:ring-red-500/20" 
            : "border-slate-300 focus:border-primary-500 focus:ring-primary-500/20"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-error animate-fade-in">{error}</p>
      )}
    </div>
  );
}