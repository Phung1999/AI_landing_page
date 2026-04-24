import { Button } from "@/components/ui"

interface CTAProps {
  id?: string
  title: string
  description: string
  buttonText: string
  onUpdate?: (id: string, props: any) => void
}

export function CTA({ id, title, description, buttonText, onUpdate }: CTAProps) {
  const handleBlur = (field: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate && id) {
      onUpdate(id, { [field]: e.currentTarget.innerText })
    }
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/40">
          {/* Decorative Circles */}
          <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <h2 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => handleBlur("title", e)}
              className="text-4xl md:text-6xl font-black text-white mb-8 outline-none hover:bg-white/10 rounded-2xl px-4 transition-all leading-tight tracking-tight"
            >
              {title}
            </h2>
            
            <p 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => handleBlur("description", e)}
              className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto outline-none hover:bg-white/10 rounded-2xl px-4 transition-all leading-relaxed"
            >
              {description}
            </p>
            
            <div 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => handleBlur("buttonText", e)}
              className="inline-block"
            >
              <Button
                size="lg"
                variant="secondary"
                className="h-16 px-12 text-xl font-bold rounded-[1.5rem] bg-white text-primary hover:bg-blue-50 shadow-xl pointer-events-none"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}