import { create } from "zustand"
import { type GeneratorState, type LandingType, type Section, type ThemeConfig } from "../types/generator"

const initialTheme: ThemeConfig = {
  primaryColor: "#3b82f6",
  fontFamily: "system-ui, sans-serif",
}

export const useGeneratorStore = create<GeneratorState>((set) => ({
  landingType: null,
  description: "",
  sections: [],
  selectedTemplate: null,
  theme: initialTheme,
  isGenerating: false,
  isPreviewOpen: false,
  error: null,

  setLandingType: (landingType: LandingType | null) => set({ landingType }),
  setDescription: (description: string) => set({ description }),
  setSections: (sections: Section[]) => set({ sections }),
  updateSection: (id: string, props: Record<string, unknown>) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === id ? { ...section, props: { ...section.props, ...props } } : section
      ),
    })),
  setTheme: (theme: Partial<ThemeConfig>) =>
    set((state) => ({ theme: { ...state.theme, ...theme } })),
  setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
  setIsPreviewOpen: (isPreviewOpen: boolean) => set({ isPreviewOpen }),
  setError: (error: string | null) => set({ error }),
  reset: () =>
    set({
      landingType: null,
      description: "",
      sections: [],
      selectedTemplate: null,
      theme: initialTheme,
      isGenerating: false,
      isPreviewOpen: false,
      error: null,
    }),
}))