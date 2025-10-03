// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import type { Express, Request, Response } from 'express'

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

import Home from './globals/Home'
import About from './globals/About'
import Portfolio from './globals/Portfolio'
import Contact from './globals/Contact'
import Blog from './globals/Blog'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL, // e.g. https://cms.interiorvillabd.com
  defaultDepth: 1,
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
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
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  /** ✅ Add custom express routes here */
  expressRoutes: (app: Express, payload) => {
    const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://interiorvillabd.com'

    // Sitemap
    app.get('/sitemap.xml', async (req: Request, res: Response) => {
      try {
        const [projects, blogPosts] = await Promise.all([
          payload.find({ collection: 'projects', depth: 1, limit: 1000 }),
          payload.find({ collection: 'blogPosts', depth: 1, limit: 1000 }),
        ])

        const urls: string[] = [
          `${baseUrl}/`,
          `${baseUrl}/about`,
          `${baseUrl}/services/residential-interior`,
          `${baseUrl}/services/commercial-interior`,
          `${baseUrl}/services/architectural-consultancy`,
          `${baseUrl}/portfolio`,
          `${baseUrl}/blog`,
          `${baseUrl}/contact`,
        ]

        projects.docs.forEach((proj: any) => {
          urls.push(`${baseUrl}/project/${proj.slug}`)
        })

        blogPosts.docs.forEach((post: any) => {
          urls.push(`${baseUrl}/blog/${post.slug}`)
        })

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url>
  <loc>${u}</loc>
</url>`,
  )
  .join('\n')}
</urlset>`

        res.header('Content-Type', 'application/xml')
        res.send(sitemap)
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
