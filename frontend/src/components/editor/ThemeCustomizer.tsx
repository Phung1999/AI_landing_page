import { useGeneratorStore } from "../../stores/generatorStore"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Input } from "../ui/Input"

const FONTS = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Outfit", value: "Outfit, sans-serif" },
]

export function ThemeCustomizer() {
  const { theme, setTheme } = useGeneratorStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tuy chinh giao dien</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mau chu dao
          </label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => setTheme({ primaryColor: e.target.value })}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={theme.primaryColor}
              onChange={(e) => setTheme({ primaryColor: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Font chu
          </label>
          <select
            value={theme.fontFamily}
            onChange={(e) => setTheme({ fontFamily: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FONTS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  )
}
