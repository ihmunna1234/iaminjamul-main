import { Camera } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
}

const photos: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    size: 'tall',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=500&h=500&fit=crop',
    size: 'small',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
    size: 'small',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800&h=500&fit=crop',
    size: 'medium',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&h=700&fit=crop',
    size: 'tall',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&h=600&fit=crop',
    size: 'large',
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    size: 'small',
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&h=500&fit=crop',
    size: 'small',
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    size: 'medium',
  },
  {
    id: '10',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
    size: 'tall',
  },
  {
    id: '11',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    size: 'small',
  },
  {
    id: '12',
    url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=600&fit=crop',
    size: 'small',
  },
  {
    id: '13',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop',
    size: 'tall',
  },
  {
    id: '14',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop',
    size: 'small',
  },
  {
    id: '15',
    url: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca44?w=800&h=500&fit=crop',
    size: 'medium',
  },
  {
    id: '16',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop',
    size: 'large',
  },
  {
    id: '17',
    url: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=400&h=400&fit=crop',
    size: 'small',
  },
  {
    id: '18',
    url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&h=700&fit=crop',
    size: 'tall',
  },
  {
    id: '19',
    url: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=400&fit=crop',
    size: 'small',
  },
  {
    id: '20',
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&h=500&fit=crop',
    size: 'medium',
  },
  {
    id: '21',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    size: 'small',
  },
  {
    id: '22',
    url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=500&h=700&fit=crop',
    size: 'tall',
  },
  {
    id: '23',
    url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400&h=400&fit=crop',
    size: 'small',
  },
  {
    id: '24',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop',
    size: 'small',
  },
  {
    id: '25',
    url: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=800&h=500&fit=crop',
    size: 'medium',
  },
  {
    id: '26',
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop',
    size: 'tall',
  },
  {
    id: '27',
    url: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&h=400&fit=crop',
    size: 'small',
  },
  {
    id: '28',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&h=500&fit=crop',
    size: 'small',
  },
  {
    id: '29',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
    size: 'large',
  },
  
];

const getSizeClasses = (size: Photo['size']) => {
  switch (size) {
    case 'small':
      return 'col-span-1 row-span-1';
    case 'medium':
      return 'col-span-2 row-span-1';
    case 'large':
      return 'col-span-2 row-span-2';
    case 'wide':
      return 'col-span-3 row-span-1';
    case 'tall':
      return 'col-span-1 row-span-2';
    default:
      return 'col-span-1 row-span-1';
  }
};

export function PhotoGallerySection() {

  return (
    <section id="gallery" className="py-20 bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <span className="section-badge mb-4 inline-flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Photo Gallery
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Moments & <span className="gradient-text">Memories</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A glimpse into my professional journey, events, and personal adventures
          </p>
        </div>

        {/* Photo Grid with Masonry Layout & Advanced Animations */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 auto-rows-[120px] gap-1" style={{ gridAutoFlow: 'dense' }}>
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`
                group relative overflow-hidden rounded-lg
                ${index % 3 === 0 ? 'animate-float' : index % 3 === 1 ? 'animate-wave' : 'animate-bounce-subtle'}
                ${index % 2 === 0 ? 'animate-rotate-3d' : 'animate-tilt'}
                transition-all duration-700 ease-out
                hover:scale-110 hover:z-20 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-2
                ${getSizeClasses(photo.size)}
              `}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationDuration: `${3 + (index % 5)}s`,
              }}
            >
              {/* Image Container with Perspective */}
              <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <img
                  src={photo.url}
                  alt={`Gallery image ${index + 1}`}
                  className="
                    w-full h-full object-cover 
                    animate-ken-burns animate-parallax
                    transition-all duration-1000 ease-out
                    group-hover:scale-125 group-hover:rotate-6 group-hover:brightness-110 group-hover:saturate-150
                  "
                  loading="lazy"
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    animationDuration: `${25 + (index % 8) * 4}s`,
                  }}
                />
                
                {/* Gradient Overlay on Hover */}
                <div className="
                  absolute inset-0 
                  bg-gradient-to-t from-primary/60 via-primary/20 to-transparent 
                  opacity-0 group-hover:opacity-100 
                  transition-all duration-500
                  backdrop-blur-[2px]
                " />
                
                {/* Animated border glow */}
                <div 
                  className="
                    absolute inset-0 
                    border-2 border-primary/20 rounded-lg 
                    animate-pulse-border
                    group-hover:border-primary/60 group-hover:shadow-inner
                    transition-all duration-500
                  "
                  style={{ 
                    animationDelay: `${index * 0.25}s`,
                  }}
                />

                {/* Corner accent on hover */}
                <div className="
                  absolute top-2 right-2 w-8 h-8 
                  border-t-2 border-r-2 border-primary 
                  opacity-0 group-hover:opacity-100 
                  transition-all duration-500 
                  group-hover:w-12 group-hover:h-12
                " />
                <div className="
                  absolute bottom-2 left-2 w-8 h-8 
                  border-b-2 border-l-2 border-primary 
                  opacity-0 group-hover:opacity-100 
                  transition-all duration-500 delay-100
                  group-hover:w-12 group-hover:h-12
                " />
              </div>

              {/* Floating glow effect - Enhanced on hover */}
              <div 
                className="
                  absolute -inset-2 
                  bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 
                  blur-xl opacity-0 
                  animate-glow 
                  group-hover:opacity-100 group-hover:blur-2xl
                  transition-all duration-700
                  -z-10
                "
                style={{ 
                  animationDelay: `${index * 0.35}s`,
                }}
              />

              {/* Shimmer effect on hover */}
              <div className="
                absolute inset-0 
                bg-gradient-to-r from-transparent via-white/20 to-transparent 
                translate-x-[-200%] 
                group-hover:translate-x-[200%] 
                transition-transform duration-1000 ease-out
                skew-x-12
              " />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
