import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';

export function BlogSection() {
  const navigate = useNavigate();
  const { data: blogPosts, isLoading, isError } = useBlogPosts();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBlogClick = (id: string) => {
    navigate(`/blog/${id}`);
  };

  // Show only first 3 posts on home page
  const displayedPosts = blogPosts?.slice(0, 3) ?? [];

  return (
    <section id="blog" className="py-24 bg-[#111111] text-white border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#e49797]/30 text-[#e49797] bg-[#e49797]/5 mb-4">
            Blog
          </span>
          <h2 className="text-3xl md:text-5xl font-bold flex flex-col items-center justify-center gap-1">
            <span className="font-serif font-medium text-white italic">Latest</span>
            <span className="font-sans font-black uppercase tracking-tight text-[#e49797]">Articles</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto mt-4 font-sans leading-relaxed">
            AI-powered insights on trending topics in tech, SEO, and digital marketing
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-[#e49797] animate-spin" />
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-white/60 text-sm">Unable to load posts. Please try again later.</p>
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && !isError && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-white/5 border border-white/10 hover:border-[#e49797]/30 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:bg-white/10 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleBlogClick(post.id)}
              >
                <div>
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#A31414]/20 to-[#A31414]/5 border-b border-white/5">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#e49797]/30 text-[#e49797] bg-[#111111]/80 backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-[#e49797] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    className="p-0 bg-transparent border-none text-[#e49797] hover:text-[#e49797]/85 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlogClick(post.id);
                    }}
                  >
                    Read More 
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => navigate('/blogs')}
            className="rounded-2xl bg-[#e49797] hover:bg-[#d88d8d] hover:scale-105 active:scale-95 text-[#1a0505] font-bold uppercase tracking-wider px-6 py-4 border-none flex items-center justify-center gap-1.5 transition-all text-xs shadow-md mx-auto"
          >
            See All Blogs
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
