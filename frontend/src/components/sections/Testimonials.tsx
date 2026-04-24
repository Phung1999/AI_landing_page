import { Star } from "lucide-react"

interface TestimonialItem {
  name: string
  avatar?: string
  content: string
  rating: number
}

interface TestimonialsProps {
  id?: string
  items: TestimonialItem[]
  onUpdate?: (id: string, props: any) => void
}

export function Testimonials({ id, items, onUpdate }: TestimonialsProps) {
  const handleBlur = (index: number, field: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate && id) {
      const newItems = [...items]
      newItems[index] = { ...newItems[index], [field]: e.currentTarget.innerText }
      onUpdate(id, { items: newItems })
    }
  }

  return (
    <section className="py-20 px-4 bg-slate-50 group relative">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Khach hang noi gi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p 
                contentEditable 
                suppressContentEditableWarning
                onBlur={(e) => handleBlur(index, "content", e)}
                className="text-slate-600 mb-4 outline-none hover:bg-slate-100 rounded px-1 transition-colors"
              >
                "{item.content}"
              </p>
              <p 
                contentEditable 
                suppressContentEditableWarning
                onBlur={(e) => handleBlur(index, "name", e)}
                className="font-semibold text-slate-900 outline-none hover:bg-slate-100 rounded px-1 transition-colors"
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}