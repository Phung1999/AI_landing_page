import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"

interface PricingPlan {
  name: string
  price: string
  features: string[]
  cta: string
  highlight?: boolean
}

interface PricingProps {
  id?: string
  plans: PricingPlan[]
  onUpdate?: (id: string, props: any) => void
}

export function Pricing({ id, plans, onUpdate }: PricingProps) {
  const handleBlur = (index: number, field: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate && id) {
      const newPlans = [...plans]
      newPlans[index] = { ...newPlans[index], [field]: e.currentTarget.innerText }
      onUpdate(id, { plans: newPlans })
    }
  }

  const handleFeatureBlur = (planIndex: number, featureIndex: number, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate && id) {
      const newPlans = [...plans]
      const newFeatures = [...newPlans[planIndex].features]
      newFeatures[featureIndex] = e.currentTarget.innerText
      newPlans[planIndex] = { ...newPlans[planIndex], features: newFeatures }
      onUpdate(id, { plans: newPlans })
    }
  }

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Bảng giá minh bạch</h2>
          <p className="text-slate-500">Lựa chọn gói dịch vụ phù hợp nhất với nhu cầu của bạn.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {plans.map((plan, planIndex) => (
            <div
              key={planIndex}
              className={cn(
                "p-10 rounded-[2.5rem] transition-all duration-300 relative",
                plan.highlight
                  ? "bg-slate-900 text-white shadow-2xl shadow-slate-400/50 scale-105 z-10"
                  : "border border-slate-200 bg-white"
              )}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-10 translate-y-[-50%] bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-primary/30">
                  Phổ biến nhất
                </div>
              )}
              
              <h3 
                contentEditable 
                suppressContentEditableWarning
                onBlur={(e) => handleBlur(planIndex, "name", e)}
                className={cn(
                  "text-xl font-bold mb-4 outline-none rounded-lg px-2 inline-block",
                  plan.highlight ? "text-white hover:bg-white/10" : "text-slate-900 hover:bg-slate-50"
                )}
              >
                {plan.name}
              </h3>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span 
                  contentEditable 
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur(planIndex, "price", e)}
                  className={cn(
                    "text-5xl font-black outline-none rounded-xl px-2",
                    plan.highlight ? "text-white hover:bg-white/10" : "text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {plan.price}
                </span>
                <span className={plan.highlight ? "text-slate-400" : "text-slate-400"}>/tháng</span>
              </div>
              
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0",
                      plan.highlight ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      ✓
                    </div>
                    <span
                      contentEditable 
                      suppressContentEditableWarning
                      onBlur={(e) => handleFeatureBlur(planIndex, featureIndex, e)}
                      className={cn(
                        "outline-none rounded-lg px-2 w-full transition-all",
                        plan.highlight ? "hover:bg-white/10" : "hover:bg-slate-50"
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div 
                contentEditable 
                suppressContentEditableWarning
                onBlur={(e) => handleBlur(planIndex, "cta", e)}
                className="w-full"
              >
                <Button
                  variant={plan.highlight ? "default" : "outline"}
                  className={cn(
                    "w-full h-14 rounded-2xl text-lg font-bold transition-all pointer-events-none",
                    plan.highlight ? "bg-primary hover:opacity-90 border-none" : "border-slate-200 text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}