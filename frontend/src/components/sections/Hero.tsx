import { Button } from "@/components/ui"
import { ImageUploader } from "@/components/editor"
import { Sparkles } from "lucide-react"

interface HeroProps {
  id?: string
  title: string
  subtitle: string
  cta: string
  ctaLink?: string
  image?: string
  onUpdate?: (id: string, props: any) => void
}

export function Hero({ id, title, subtitle, cta, image, onUpdate }: HeroProps) {
  const handleBlur = (field: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate && id) {
      onUpdate(id, { [field]: e.currentTarget.innerText })
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    if (onUpdate && id) {
      onUpdate(id, { image: imageUrl })
    }
  }

  const handleImageRemove = () => {
    if (onUpdate && id) {
      onUpdate(id, { image: undefined })
    }
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-white group">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Image Section */}
        {onUpdate && id && (
          <div className="mb-12">
            <ImageUploader
              onImageUpload={handleImageUpload}
              currentImage={image}
              onRemove={image ? handleImageRemove : undefined}
            />
          </div>
        )}

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Mới nhất từ AI Engine
          </div>
          
          <h1 
            contentEditable={onUpdate ? true : false}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur("title", e)}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-8 outline-none hover:bg-slate-50 rounded-2xl px-4 transition-all leading-[1.1] tracking-tight"
          >
            {title}
          </h1>
          
          <p 
            contentEditable={onUpdate ? true : false}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur("subtitle", e)}
            className="text-xl text-slate-500 mb-12 max-w-3xl mx-auto outline-none hover:bg-slate-50 rounded-2xl px-4 transition-all leading-relaxed"
          >
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div 
              contentEditable={onUpdate ? true : false}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur("cta", e)}
              className="inline-block"
            >
              <Button size="lg" className="h-14 px-10 text-lg rounded-2xl bg-primary hover:opacity-90 shadow-2xl shadow-primary/20 pointer-events-none">
                {cta}
              </Button>
            </div>
            <Button variant="ghost" size="lg" className="h-14 px-10 text-lg rounded-2xl text-slate-600 hover:bg-slate-50">
              Xem thêm →
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}