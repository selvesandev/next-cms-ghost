import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { HeaderIndex } from '@components/HeaderIndex'
import { StickyNavContainer } from '@effects/StickyNavContainer'
import { SEO } from '@meta/seo'

import { processEnv } from '@lib/processEnv'
import { getAllPosts, getAllSettings, GhostPostOrPage, GhostPostsOrPages, GhostSettings } from '@lib/ghost'
import { seoImage, ISeoImage } from '@meta/seoImage'

import { BodyClass } from '@helpers/BodyClass'
import { blogPosts } from '@utils/posts'

/**
 * Main index page (home page)
 *
 * Loads all posts from CMS
 *
 */

interface CmsData {
  posts: GhostPostsOrPages
  settings: GhostSettings
  seoImage: ISeoImage
  previewPosts?: GhostPostsOrPages
  prevPost?: GhostPostOrPage
  nextPost?: GhostPostOrPage
  bodyClass: string
}

interface IndexProps {
  cmsData: CmsData
}

export default function Index({ cmsData }: IndexProps) {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  let { 
    settings, 
    // posts, 
    seoImage, 
    bodyClass 
  } = cmsData
  settings.title = 'Code Tumor';
  const posts = blogPosts;
// console.log(posts);
  return (
    <>
      {/* <SEO {...{ settings, seoImage }} /> */}
      <StickyNavContainer
        throttle={300}
        activeClass="fixed-nav-active"
        render={(sticky) => (
          <>
            <Layout {...{ bodyClass, sticky, settings, isHome: true }} header={<HeaderIndex {...{ settings }} />}>
              <PostView {...{ settings, posts, isHome: true }} />
            </Layout>
          </>
        )}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  let settings
  // let posts: GhostPostsOrPages | []

  console.time('Index - getStaticProps')

  try {
    // settings = await getAllSettings()
    settings = {
      // processEnv.ts line number 35
      processEnv: {
        siteUrl: 'http://localhost:3000',
        platform: 'linux',
        gaMeasurementId: '',
        nextImages: {
          feature: true,
          inline: true,
          quality: 1,
          source: true
        },
        darkMode: {
          defaultMode: 'dark' || 'light' || null,
          overrideOS: true
        }
      },
      secondary_navigation: [],
      iconImage: {

      },
      logoImage: {
        url: '',
        dimensions: {
          width: 100,
          height: 100
        }
      },
      coverImage: {}
    };
    // posts = await getAllPosts()
  } catch (error) {
    console.log(error,'here...');
    throw new Error('Index creation failed.')
  }

  const cmsData = {
    settings,
    // posts,
    // seoImage: await seoImage({ siteUrl: settings.processEnv.siteUrl }),
    bodyClass: BodyClass({ isHome: true }),
  }

  console.timeEnd('Index - getStaticProps')

  return {
    props: {
      cmsData,
    },
    ...(processEnv.isr.enable && { revalidate: processEnv.isr.revalidate }), // re-generate at most once every revalidate second
  }
}
