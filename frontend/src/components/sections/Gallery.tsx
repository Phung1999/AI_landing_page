interface GalleryProps {
  id?: string
  images: string[]
  onUpdate?: (id: string, props: any) => void
}

export function Gallery({ id, images, onUpdate }: GalleryProps) {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Hình ảnh</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Khám phá bộ sưu tập của chúng tôi.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="aspect-square rounded-2xl overflow-hidden bg-slate-100"
            >
              <img 
                src={img} 
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}