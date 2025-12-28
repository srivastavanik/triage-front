'use client';

import type { JSX } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { SiteNav } from '../../components/SiteNav';

const BLOG_POSTS = [
  {
    slug: 'triage-raises-1-5m',
    title: 'Triage Raises $1.5M to Secure AI-Native Applications',
    excerpt: 'Triage has raised $1.5M in pre-seed funding to build an AI-native security and observability platform for teams shipping LLM-powered products.',
    date: 'Dec 27, 2024',
    readTime: '4 min read',
    category: 'Company',
    featured: true,
  },
];

export default function BlogPage(): JSX.Element {
  const featuredPost = BLOG_POSTS.find(p => p.featured);
  const otherPosts = BLOG_POSTS.filter(p => !p.featured);

  return (
    <main className="min-h-screen bg-bg-primary">
      <SiteNav offsetTop={0} />

      {/* Hero */}
      <section className="pt-40 pb-16">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="text-text-muted text-[14px] hover:text-text-secondary transition-colors mb-8 inline-flex items-center gap-2">
              ← Back to Home
            </Link>
            <h1 className="text-[48px] lg:text-[64px] font-normal leading-[1.1] tracking-[-0.02em] mt-8 mb-6">
              Blog
            </h1>
            <p className="text-text-secondary text-[18px] max-w-xl">
              Updates, insights, and announcements from the Triage team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="pb-32">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Featured Post - Large Card */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-8"
              >
                <Link href={`/blog/${featuredPost.slug}`} className="block group">
                  <div className="bg-[#121212] border border-[#1a1a1a] p-8 lg:p-12 h-full hover:border-[#2a2a2a] transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted bg-[#1a1a1a] px-3 py-1.5">
                        {featuredPost.category}
                      </span>
                      <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#4d9375] bg-[#4d9375]/10 px-3 py-1.5">
                        Featured
                      </span>
                    </div>
                    <h2 className="text-[28px] lg:text-[36px] font-normal leading-[1.2] tracking-[-0.02em] mb-4 group-hover:text-text-secondary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-text-tertiary text-[16px] lg:text-[18px] leading-relaxed mb-8 max-w-2xl">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-text-muted text-[13px]">
                      <span>{featuredPost.date}</span>
                      <span className="w-1 h-1 bg-text-muted rounded-full" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Side Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-4 flex flex-col gap-6"
            >
              {/* Quick Links Card */}
              <div className="bg-[#121212] border border-[#1a1a1a] p-6 flex-1">
                <h3 className="text-[13px] font-medium tracking-[0.1em] uppercase text-text-muted mb-6">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Company', 'Product', 'Engineering', 'Security'].map((cat) => (
                    <span
                      key={cat}
                      className="text-[13px] text-text-secondary bg-[#1a1a1a] px-4 py-2 hover:bg-[#222] cursor-pointer transition-colors"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subscribe Card */}
              <div className="bg-[#121212] border border-[#1a1a1a] p-6 flex-1">
                <h3 className="text-[13px] font-medium tracking-[0.1em] uppercase text-text-muted mb-4">
                  Stay Updated
                </h3>
                <p className="text-text-tertiary text-[14px] mb-4">
                  Get notified when we publish new content
                </p>
                <Link
                  href="mailto:srivastavan@berkeley.edu?subject=Subscribe to Triage Blog"
                  className="inline-flex items-center gap-2 text-[14px] text-text-primary hover:text-text-secondary transition-colors"
                >
                  Subscribe
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Other Posts */}
            {otherPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="lg:col-span-4"
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <div className="bg-[#121212] border border-[#1a1a1a] p-6 h-full hover:border-[#2a2a2a] transition-all duration-300">
                    <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted bg-[#1a1a1a] px-3 py-1.5">
                      {post.category}
                    </span>
                    <h3 className="text-[18px] font-normal leading-[1.3] mt-4 mb-3 group-hover:text-text-secondary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-text-tertiary text-[14px] leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-text-muted text-[12px]">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 bg-text-muted rounded-full" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="container-max">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/FullLogo_Transparent_NoBuffer (1) (1).png"
                alt="Triage"
                width={24}
                height={24}
                style={{ objectFit: 'contain' }}
              />
              <span className="text-[16px] font-bold text-text-primary" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                triage
              </span>
            </Link>
            <p className="text-text-muted text-[13px]">
              © 2025 Triage. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

