import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2 } from "lucide-react"
import { useGeneratorStore } from "@/stores/generatorStore"
import type { Section } from "@/types/generator"

interface SortableSectionProps {
  section: Section
}

export function SortableSection({ section }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const { sections, setSections } = useGeneratorStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleDelete = () => {
    const newSections = sections.filter((s) => s.id !== section.id)
    setSections(newSections)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border rounded-lg p-4 bg-white ${
        isDragging ? "shadow-lg ring-2 ring-blue-400" : "hover:shadow-md"
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-3 top-4 cursor-grab active:cursor-grabbing flex items-center"
      >
        <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
      </div>

      {/* Section Type Badge */}
      <div className="absolute right-3 top-4 flex gap-2">
        <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700">
          {section.type.toUpperCase()}
        </span>
        <button
          onClick={handleDelete}
          className="p-1 hover:bg-red-100 rounded transition"
          title="Xóa section"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      {/* Section Content Preview */}
      <div className="ml-10 mt-8 text-sm text-slate-600">
        {section.type === "hero" && (
          <div>
            <p className="font-semibold">{section.props.title}</p>
            <p className="text-xs">{section.props.subtitle}</p>
          </div>
        )}
        {section.type === "features" && (
          <p>{section.props.items?.length || 0} tính năng</p>
        )}
        {section.type === "testimonials" && (
          <p>{section.props.items?.length || 0} đánh giá</p>
        )}
        {section.type === "pricing" && (
          <p>{section.props.plans?.length || 0} gói giá</p>
        )}
        {section.type === "cta" && (
          <p className="font-semibold">{section.props.title}</p>
        )}
        {section.type === "footer" && (
          <p>{section.props.links?.length || 0} liên kết</p>
        )}
      </div>
    </div>
  )
}
