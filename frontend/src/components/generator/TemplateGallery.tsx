import { useEffect, useState } from "react"
import { useGeneratorStore } from "../../stores/generatorStore"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Button } from "../ui/Button"
import { Loader2, Layout } from "lucide-react"

interface Template {
  id: string
  name: string
  type: string
  description: string
  sections: any[]
}

export function TemplateGallery() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { setSections, setLandingType } = useGeneratorStore()

  useEffect(() => {
    fetch("http://localhost:8000/api/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data.templates)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  const handleSelect = (template: Template) => {
    setSections(template.sections)
    setLandingType(template.type as any)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Layout className="w-5 h-5 text-blue-600" />
        Thu vien Template
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:border-blue-400 transition-colors cursor-pointer group" onClick={() => handleSelect(template)}>
            <CardHeader className="p-4">
              <CardTitle className="text-base">{template.name}</CardTitle>
              <p className="text-xs text-slate-500">{template.description}</p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded uppercase font-bold">
                  {template.type}
                </span>
                <Button variant="ghost" size="sm" className="h-8 text-xs group-hover:text-blue-600">
                  Su dung
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
