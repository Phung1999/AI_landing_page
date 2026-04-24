export type LandingType = "course" | "saas" | "product"

export interface Section {
  id: string
  type: "hero" | "features" | "testimonials" | "pricing" | "cta" | "footer"
  props: Record<string, unknown>
}

export interface ThemeConfig {
  primaryColor: string
  fontFamily: string
}

export interface GeneratorState {
  landingType: LandingType | null
  description: string
  sections: Section[]
  selectedTemplate: string | null
  theme: ThemeConfig
  isGenerating: boolean
  isPreviewOpen: boolean
  error: string | null

  setLandingType: (type: LandingType | null) => void
  setDescription: (desc: string) => void
  setSections: (sections: Section[]) => void
  updateSection: (id: string, props: Record<string, unknown>) => void
  setTheme: (theme: Partial<ThemeConfig>) => void
  setIsGenerating: (isGenerating: boolean) => void
  setIsPreviewOpen: (isPreviewOpen: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}