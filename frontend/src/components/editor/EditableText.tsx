import { useState, useRef, useEffect } from "react"
import { Edit2 } from "lucide-react"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  as?: "h1" | "h2" | "h3" | "p" | "button"
  className?: string
  editable?: boolean
}

export function EditableText({
  value,
  onChange,
  as: Component = "p",
  className = "",
  editable = true,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false)
    }
    if (e.key === "Escape") {
      setIsEditing(false)
    }
  }

  if (!editable) {
    const props = { className: `${className} cursor-default` }
    return Component === "button" ? (
      <button {...props}>{value}</button>
    ) : (
      // @ts-ignore
      <Component {...props}>{value}</Component>
    )
  }

  if (!isEditing) {
    const props = {
      className: `${className} cursor-text hover:bg-blue-50 transition-colors px-1 rounded`,
      onClick: () => setIsEditing(true),
    }
    return Component === "button" ? (
      <div className="relative inline-block">
        <button {...props}>{value}</button>
        <Edit2 className="w-3 h-3 absolute -right-4 top-1 text-gray-400 hover:text-gray-600" />
      </div>
    ) : (
      <div className="relative">
        {/* @ts-ignore */}
        <Component {...props}>{value}</Component>
        <Edit2 className="w-3 h-3 absolute -right-4 top-1 text-gray-400 hover:text-gray-600" />
      </div>
    )
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setIsEditing(false)}
      onKeyDown={handleKeyDown}
      className={`${className} border-2 border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
  )
}
