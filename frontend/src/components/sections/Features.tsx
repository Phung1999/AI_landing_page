import * as Icons from "lucide-react"

interface FeatureItem {
  icon: string
  title: string
  description: string
}

interface FeaturesProps {
  id?: string
  items: FeatureItem[]
  onUpdate?: (id: string, props: any) => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Icons.Clock,
  users: Icons.Users,
  award: Icons.Award,
  check: Icons.CheckCircle,
  zap: Icons.Zap,
  shield: Icons.Shield,
  headphones: Icons.Headphones,
  "badge-check": Icons.BadgeCheck,
  truck: Icons.Truck,
  "rotate-ccw": Icons.RotateCcw,
}

export function Features({ id, items, onUpdate }: FeaturesProps) {
  const handleBlur = (index: number, field: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate && id) {
      const newItems = [...items]
      newItems[index] = { ...newItems[index], [field]: e.currentTarget.innerText }
      onUpdate(id, { items: newItems })
    }
  }

  return (
    <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tính năng nổi bật</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Tất cả những gì bạn cần để bắt đầu hành trình thành công của mình.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Icons.CheckCircle
            return (
              <div
                key={index}
                className="flex flex-col items-start p-8 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:translate-y-[-8px] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <IconComponent className="w-7 h-7 text-primary" />
                </div>
                <h3 
                  contentEditable 
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur(index, "title", e)}
                  className="text-xl font-bold text-slate-900 mb-3 outline-none hover:bg-slate-50 rounded-lg px-1 transition-all"
                >
                  {item.title}
                </h3>
                <p 
                  contentEditable 
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur(index, "description", e)}
                  className="text-slate-500 leading-relaxed outline-none hover:bg-slate-50 rounded-lg px-1 transition-all"
                >
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}