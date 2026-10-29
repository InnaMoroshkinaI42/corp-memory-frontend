export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white px-8 py-4">
      <div className="flex items-center justify-between text-sm text-[var(--text-3)]">
        <span>© 2026 MeetMind</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[var(--text)]">Конфиденциальность</a>
          <span>·</span>
          <a href="#" className="hover:text-[var(--text)]">Поддержка</a>
        </div>
      </div>
    </footer>
  )
}