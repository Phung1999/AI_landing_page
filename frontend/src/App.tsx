import { useState } from "react"
import { Sparkles, Loader2, Download, Settings, Layout, Eye, EyeOff, Wand2, Palette, Box, Copy, Globe, X } from "lucide-react"
import { useGeneratorStore } from "@/stores/generatorStore"
import { Button, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui"
import { Hero, Features, Testimonials, Pricing, CTA, Footer, Gallery } from "@/components/sections"
import { ThemeCustomizer, DragDropEditor } from "@/components/editor"
import { TemplateGallery } from "@/components/generator/TemplateGallery"

const LANDING_TYPES = [
  { value: "course", label: "Khóa học", icon: <Box className="w-4 h-4" /> },
  { value: "saas", label: "SaaS", icon: <Wand2 className="w-4 h-4" /> },
  { value: "product", label: "Sản phẩm", icon: <Box className="w-4 h-4" /> },
]

function SectionRenderer({ section }: { section: { id: string; type: string; props: Record<string, unknown> } }) {
  const updateSection = useGeneratorStore((state) => state.updateSection)
  const commonProps = { id: section.id, onUpdate: updateSection }

  switch (section.type) {
    case "hero":
      return <Hero {...commonProps} {...(section.props as any)} />
    case "features":
      return <Features {...commonProps} {...(section.props as any)} />
    case "testimonials":
      return <Testimonials {...commonProps} {...(section.props as any)} />
    case "pricing":
      return <Pricing {...commonProps} {...(section.props as any)} />
    case "cta":
      return <CTA {...commonProps} {...(section.props as any)} />
    case "footer":
      return <Footer {...commonProps} {...(section.props as any)} />
    case "gallery":
      return <Gallery {...commonProps} {...(section.props as any)} />
    default:
      return null
  }
}

export default function App() {
  const { 
    landingType, 
    description, 
    sections, 
    theme,
    isGenerating, 
    setLandingType, 
    setDescription, 
    setSections, 
    setTheme,
    setIsGenerating, 
    error,
    setError, 
    reset 
  } = useGeneratorStore()
  
  const [showPreview, setShowPreview] = useState(true)
  const [activeTab, setActiveTab] = useState<"generate" | "edit" | "templates" | "customize">("generate")
  const [isExporting, setIsExporting] = useState(false)
  const [exportMessage, setExportMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null)
  const [cloneUrl, setCloneUrl] = useState("")
  const [isCloneMode, setIsCloneMode] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [cloneProgress, setCloneProgress] = useState(0)

  const handleGenerate = async () => {
    if (!landingType || !description) {
      setError("Vui lòng chọn loại và nhập mô tả chi tiết")
      return
    }

    setIsGenerating(true)
    setError(null)
    setShowPreview(true)

    try {
      const response = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: landingType, description }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Lỗi hệ thống khi khởi tạo")
      }

      const data = await response.json()
      setSections(data.sections)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClone = async () => {
    if (!cloneUrl) {
      setError("Vui lòng nhập URL landing page")
      return
    }

    setCloneProgress(0)
    setIsGenerating(true)
    setError(null)
    setShowPreview(true)

    try {
      const response = await fetch("http://localhost:8000/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cloneUrl, name: projectName || undefined }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Lỗi khi clone landing page")
      }

      const data = await response.json()
      setSections(data.sections)
      if (data.theme) {
        setTheme(data.theme)
      }
      setLandingType(data.landing_type)
      setProjectName(data.name)
      setShowSaveModal(true)
      setCloneProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi clone landing page")
    } finally {
      setIsGenerating(false)
      setCloneProgress(0)
    }
  }

  const handleSaveProject = async () => {
    if (!projectName || sections.length === 0) return

    try {
      await fetch("http://localhost:8000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          landing_type: landingType,
          sections: sections,
          theme: theme,
          url: cloneUrl || null
        }),
      })
      setShowSaveModal(false)
      setCloneUrl("")
    } catch (err) {
      console.error(err)
    }
  }

  const handleExport = async () => {
    if (sections.length === 0) return

    setIsExporting(true)
    setExportMessage(null)

    try {
      const response = await fetch("http://localhost:8000/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, theme }),
      })

      if (!response.ok) throw new Error("Export failed")

      const data = await response.json()
      const blob = new Blob([data.html], { type: "text/html" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "landing-page.html"
      a.click()
      
      setExportMessage({ text: "Xuất file thành công!", type: 'success' })
      setTimeout(() => setExportMessage(null), 3000)
    } catch (err) {
      console.error(err)
      setExportMessage({ text: "Không thể xuất file HTML", type: 'error' })
      setTimeout(() => setExportMessage(null), 3000)
    } finally {
      setIsExporting(false)
    }
  }

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault()
    const prompt = (e.target as any).refinePrompt.value
    if (!prompt || sections.length === 0) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, theme, prompt }),
      })

      if (!response.ok) throw new Error("Refine failed")

      const data = await response.json()
      setSections(data.sections)
      if (data.theme) setTheme(data.theme)
      ;(e.target as any).refinePrompt.value = ""
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi cập nhật giao diện")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]" style={{ fontFamily: theme.fontFamily }}>
      {/* Header Cao Cấp */}
      <header className="glass sticky top-0 z-50 border-b border-white/40">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">Antigravity AI</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Landing Page Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? "Ẩn Preview" : "Hiện Preview"}
            </Button>
            {sections.length > 0 && (
              <Button size="sm" onClick={handleExport} className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200">
                <Download className="w-4 h-4 mr-2" />
                Xuất HTML
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar - Control Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-white sidebar-shadow flex gap-1">
              <button
                onClick={() => setActiveTab("generate")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold rounded-xl transition-all ${
                  activeTab === "generate" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Wand2 className="w-4 h-4" />
                Khởi tạo
              </button>
              {sections.length > 0 && (
                <button
                  onClick={() => setActiveTab("edit")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold rounded-xl transition-all ${
                    activeTab === "edit" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Layout className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              )}
              <button
                onClick={() => setActiveTab("templates")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold rounded-xl transition-all ${
                  activeTab === "templates" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Layout className="w-4 h-4" />
                Mẫu
              </button>
              <button
                onClick={() => setActiveTab("customize")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold rounded-xl transition-all ${
                  activeTab === "customize" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Palette className="w-4 h-4" />
                Tùy chỉnh
              </button>
            </div>

            <div className="animate-fade-in">
              {activeTab === "generate" && (
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-white to-slate-50 border-b border-slate-100">
                    <CardTitle className="text-xl">Thiết kế bằng AI</CardTitle>
                    <CardDescription>
                      Hãy mô tả ý tưởng của bạn, AI sẽ lo phần còn lại.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setIsCloneMode(false)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                          !isCloneMode ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Wand2 className="w-4 h-4" />
                        AI Tạo
                      </button>
                      <button
                        onClick={() => setIsCloneMode(true)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                          isCloneMode ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Globe className="w-4 h-4" />
                        Copy URL
                      </button>
                    </div>

                    {isCloneMode ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-3 uppercase tracking-wider">
                            Nhập URL Landing Page
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="https://example.com/landing-page"
                              value={cloneUrl}
                              onChange={(e) => setCloneUrl(e.target.value)}
                              className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white transition-all text-sm px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={handleClone}
                          disabled={isGenerating || !cloneUrl}
                          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-100"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              {cloneProgress > 0 ? `Đang clone... ${cloneProgress}%` : "Đang copy..."}
                            </>
                          ) : (
                            <>
                              <Globe className="w-5 h-5 mr-2" />
                              Copy Landing Page
                            </>
                          )}
                        </Button>
                        {isGenerating && cloneProgress > 0 && (
                          <div className="mt-3">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{ width: `${cloneProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-slate-500 mt-1 text-center">
                              Đang phân tích cấu trúc trang...
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                    <>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-3 uppercase tracking-wider">
                        Bạn đang muốn tạo gì?
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {LANDING_TYPES.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => setLandingType(type.value as any)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                              landingType === type.value
                                ? "border-blue-600 bg-blue-50 text-blue-700 ring-4 ring-blue-50"
                                : "border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-500"
                            }`}
                          >
                            {type.icon}
                            <span className="text-[12px] font-bold">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-3 uppercase tracking-wider">
                        Chi tiết yêu cầu
                      </label>
                      <Textarea
                        placeholder="VD: Website học vẽ cho trẻ em, màu sắc tươi sáng, có phần cam kết chất lượng..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-slate-50 border-slate-100 focus:bg-white transition-all text-sm min-h-[120px] rounded-xl"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !landingType || !description}
                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Đang thiết kế...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Bắt đầu tạo
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={reset} className="h-12 w-12 p-0 rounded-xl border-slate-200">
                        <Settings className="w-5 h-5 text-slate-400" />
                      </Button>
                    </div>
                    </>
                    )}
                    {error && (
                      <div className="text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                        {error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "edit" && (
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-white to-slate-50 border-b border-slate-100">
                    <CardTitle className="text-xl">Chỉnh sửa Sections</CardTitle>
                    <CardDescription>
                      Kéo thả để sắp xếp, click để chỉnh sửa nội dung
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <DragDropEditor />
                  </CardContent>
                </Card>
              )}

              {activeTab === "templates" && <TemplateGallery />}
              
              {activeTab === "customize" && <ThemeCustomizer />}
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-8 space-y-4">
            {showPreview && sections.length > 0 ? (
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Browser-like Preview */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-4">
                    <div className="flex gap-2 shrink-0">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-lg px-4 py-1.5 text-xs text-slate-400 flex-1 flex items-center gap-2">
                      <Settings className="w-3 h-3" />
                      <span>https://landing-preview.ai/project-id</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Layout className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                  <div className="overflow-auto max-h-[750px] preview-container">
                    <div className="shadow-2xl">
                      {sections.map((section) => (
                        <SectionRenderer key={section.id} section={section} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Refinement Floating Bar */}
                <div className="bg-white/80 backdrop-blur-xl border border-white p-2 rounded-2xl shadow-2xl flex gap-2 items-center sidebar-shadow">
                   <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                      <Wand2 className="w-5 h-5 text-indigo-600" />
                   </div>
                   <form onSubmit={handleRefine} className="flex-1 flex gap-2">
                    <input
                      name="refinePrompt"
                      placeholder="Bạn muốn sửa gì? (Ví dụ: Thêm màu gradient cho Hero, đổi font sang Serif...)"
                      className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 px-2"
                      disabled={isGenerating}
                    />
                    <Button type="submit" disabled={isGenerating} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4">
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gửi yêu cầu"}
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white/40 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center min-h-[700px] animate-fade-in preview-container">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 rounded-full animate-pulse" />
                  <div className="relative w-24 h-24 bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Sẵn sàng để sáng tạo?</h3>
                <p className="text-slate-500 max-w-sm leading-relaxed text-lg">
                  Mô tả dự án của bạn và để AI thiết kế một landing page chuyên nghiệp chỉ trong vài giây.
                </p>
                <div className="mt-10 grid grid-cols-2 gap-4">
                   <div className="bg-white/80 p-4 rounded-2xl border border-white shadow-sm flex items-center gap-3">
                      <Palette className="w-5 h-5 text-pink-500" />
                      <span className="text-sm font-bold text-slate-700">Tùy chỉnh màu</span>
                   </div>
                   <div className="bg-white/80 p-4 rounded-2xl border border-white shadow-sm flex items-center gap-3">
                      <Box className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-bold text-slate-700">Tải về HTML</span>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Save Project Modal */}
      {showSaveModal && sections.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Lưu Landing Page</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tên dự án
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Nhập tên dự án..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveProject}
                  disabled={!projectName}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Lưu
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
