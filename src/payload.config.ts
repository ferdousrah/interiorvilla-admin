// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { Request, Response } from 'express'

// Collections
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'

import Projects from './collections/Projects'
import ProjectCategories from './collections/ProjectCategories'
import Services from './collections/Services'
import Testimonials from './collections/Testimonials'
import TeamMembers from './collections/TeamMembers'
import BlogPosts from './collections/BlogPosts'
import BlogCategories from './collections/BlogCategories'
import Offices from './collections/Offices'
import Slider from './collections/Slider'

// Globals
import Home from './globals/Home'
import About from './globals/About'
import Portfolio from './globals/Portfolio'
import Contact from './globals/Contact'
import Blog from './globals/Blog'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  defaultDepth: 1,
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: { baseDir: path.resolve(dirname) },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Projects,
    ProjectCategories,
    Services,
    Testimonials,
    TeamMembers,
    BlogPosts,
    BlogCategories,
    Offices,
    Slider,
  ],
  cors: ['http://localhost:3000', 'https://interiorvillabd.com', 'https://www.interiorvillabd.com'],
  csrf: ['http://localhost:3000', 'https://interiorvillabd.com', 'https://www.interiorvillabd.com'],
  globals: [Header, Footer, Home, Blog, About, Portfolio, Contact],
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  jobs: {
    access: {
      run: ({ req }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },

  /** ✅ Register custom routes on server init */
  onInit: async (payload) => {
    const app = payload.express
    const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://interiorvillabd.com'

    // Sitemap
    app.get('/sitemap.xml', async (req: Request, res: Response) => {
      try {
        const [projects, blogPosts] = await Promise.all([
          payload.find({ collection: 'projects', depth: 1, limit: 1000 }),
          payload.find({ collection: 'blogPosts', depth: 1, limit: 1000 }),
        ])

        const urls: string[] = []

        // Static
        const staticRoutes = [
          { path: '/', priority: 1.0 },
          { path: '/about', priority: 0.9 },
          { path: '/portfolio', priority: 0.9 },
          { path: '/blog', priority: 0.7 },
          { path: '/contact', priority: 0.9 },
          { path: '/services/residential-interior', priority: 0.9 },
          { path: '/services/residential/apartment-interior-design', priority: 0.9 },
          { path: '/services/residential/home-interior-design', priority: 0.9 },
          { path: '/services/residential/duplex-interior-design', priority: 0.9 },
          { path: '/services/commercial-interior', priority: 0.9 },
          {
            path: '/services/commercial-interior/corporate-and-office-interior-design',
            priority: 0.9,
          },
          {
            path: '/services/commercial-interior/buying-house-office-interior-design',
            priority: 0.9,
          },
          {
            path: '/services/commercial-interior/travel-agency-office-interior-design',
            priority: 0.9,
          },
          {
            path: '/services/commercial-interior/hotel-and-hospitality-interior-design',
            priority: 0.9,
          },
          {
            path: '/services/commercial-interior/restaurant-and-cafe-interior-design',
            priority: 0.9,
          },
          { path: '/services/commercial-interior/brand-showroom-interior-design', priority: 0.9 },
          {
            path: '/services/commercial-interior/mens-salon-and-lifestyle-interior-design',
            priority: 0.9,
          },
          {
            path: '/services/commercial-interior/hospital-and-clinic-interior-design',
            priority: 0.9,
          },
          { path: '/services/commercial-interior/pharmacy-interior-design', priority: 0.9 },
          { path: '/services/commercial-interior/dental-chamber-interior-design', priority: 0.9 },
          {
            path: '/services/commercial-interior/spa-and-beauty-parlor-interior-design',
            priority: 0.9,
          },
          { path: '/services/commercial-interior/resort-interior-design', priority: 0.9 },
          { path: '/services/commercial-interior/retail-shop-interior-design', priority: 0.9 },
          {
            path: '/services/commercial-interior/educational-institute-interior-design',
            priority: 0.9,
          },
          { path: '/services/commercial-interior/fitness-center-interior-design', priority: 0.9 },

          { path: '/services/architectural-consultancy', priority: 0.9 },
        ]

        staticRoutes.forEach((r) =>
          urls.push(`
  <url>
    <loc>${baseUrl}${r.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${r.priority}</priority>
  </url>`),
        )

        // Dynamic projects
        projects.docs.forEach((p: any) => {
          if (p.slug) {
            urls.push(`
  <url>
    <loc>${baseUrl}/project-details/${p.slug}</loc>
    <lastmod>${p.updatedAt || p.createdAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
          }
        })

        // Dynamic blogs
        blogPosts.docs.forEach((b: any) => {
          if (b.slug) {
            urls.push(`
  <url>
    <loc>${baseUrl}/blog/${b.slug}</loc>
    <lastmod>${b.updatedAt || b.createdAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`)
          }
        })

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

        res.type('application/xml').send(sitemap)
      } catch (err) {
        console.error('Error generating sitemap:', err)
        res.status(500).send('Error generating sitemap')
      }
    })

    // Robots.txt
    app.get('/robots.txt', (req: Request, res: Response) => {
      res.type('text/plain').send(`User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /media/
Disallow: /src/
Disallow: /dist/
Disallow: /*.js$
Disallow: /*.ts$
Disallow: /*.tsx$
Disallow: /*.css$

Sitemap: ${baseUrl}/sitemap.xml`)
    })
  },
})
