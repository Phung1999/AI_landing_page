interface FooterLink {
  label: string
  href: string
}

interface FooterProps {
  id?: string
  links: FooterLink[]
  onUpdate?: (id: string, props: any) => void
}

export function Footer({ id, links, onUpdate }: FooterProps) {
  const handleLinkBlur = (index: number, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate && id) {
      const newLinks = [...links]
      newLinks[index] = { ...newLinks[index], label: e.currentTarget.innerText }
      onUpdate(id, { links: newLinks })
    }
  }

  return (
    <footer className="py-12 px-4 bg-slate-900 group relative">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8">
          {links.map((link, index) => (
            <span
              key={index}
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => handleLinkBlur(index, e)}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer outline-none hover:bg-slate-800 rounded px-1"
            >
              {link.label}
            </span>
          ))}
        </div>
        <p className="text-center text-slate-500 mt-8">
          © 2026 AI Landing Page Generator
        </p>
      </div>
    </footer>
  )
}