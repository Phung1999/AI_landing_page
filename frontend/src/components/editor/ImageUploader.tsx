import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (dataUrl: string) => void
  currentImage?: string
  onRemove?: () => void
}

export function ImageUploader({
  onImageUpload,
  currentImage,
  onRemove,
}: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]

        // Convert to base64
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target?.result as string
          onImageUpload(base64)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    noClick: currentImage ? true : false,
  })

  if (currentImage) {
    return (
      <div className="relative w-full rounded-lg overflow-hidden group">
        <img
          src={currentImage}
          alt="Uploaded"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            {...getRootProps()}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition"
            title="Thay đổi ảnh"
          >
            <input {...getInputProps()} />
            <Upload className="w-5 h-5" />
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition"
              title="Xóa ảnh"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-all
        ${
          isDragActive
            ? "bg-blue-50 border-blue-400 scale-105"
            : "bg-gray-50 border-gray-300 hover:border-gray-400"
        }
      `}
    >
      <input {...getInputProps()} />
      <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
      <p className="text-sm font-medium text-gray-700">
        {isDragActive ? "Thả ảnh vào đây" : "Kéo ảnh vào hoặc click để chọn"}
      </p>
      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (tối đa 5MB)</p>
    </div>
  )
}
