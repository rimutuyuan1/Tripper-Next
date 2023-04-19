import Image from 'next/image'
import Link from 'next/link';
import { compareDesc, format, parseISO } from 'date-fns'
import heroStyle from './hero.module.css'
import { allPosts } from 'contentlayer/generated'
import IndexStyle from './index.module.css'
async function fetchBlogData() {
  const posts = allPosts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 3)
  return { posts }
}

export default async function Home() {
  const { posts } = await fetchBlogData()
  return (
    <main className="container lg:px-8 max-w-[1280px]">
      <div className={`${heroStyle['hero-area']}`}>
        <div className={`${heroStyle['hero-img']} h-[300px] lg:h-[400px]`}>
          <div className={`${heroStyle['hero-layer']}`}>
            <div className={`${heroStyle['hero-title']} text-4xl font-bold`}>前行，有风</div>
            <div className={`${heroStyle['hero-subtitle']} text-white opacity-80 pt-3`}>Tripper Press</div>
          </div>
        </div>
      </div>
      <div className='pt-6 grid grid-cols-1 px-6 gap-6 lg:grid-cols-3 lg:px-0'>
        {posts && posts.map((post) => (
          <div key={post.url}>
            <Link href={`/post/${post.url}`} >
              {post.cover ? (
                <div className={`${IndexStyle['postEntry']}`}>
                  <div className={`${IndexStyle['postEntryCover']} h-[233px]`} style={{ backgroundImage: 'url("' + post.cover + '")' }}></div>
                  <div className={`${IndexStyle['postEntryInfo']} h-[167px] px-4 py-6`}>
                    <div className='text-2xl font-medium'>{post.title}</div>
                    <div className='opacity-60 py-1'>{format(parseISO(post.date), 'yyyy-MM-dd')}
                      {post.category && (
                        ' · ' + post.category
                      )}
                    </div>
                    <div className='opacity-60 py-1'>{post.excerpt}</div>
                  </div>
                </div>
              ) : (
                <div className={`${IndexStyle['postEntry']}`}>
                  <div className={`${IndexStyle['postEntryInfo']} h-[400px] px-4 py-8`}>
                    <div className='text-2xl font-medium'>{post.title}</div>
                    <div className='opacity-60 py-1'>{format(parseISO(post.date), 'yyyy-MM-dd')}
                      {post.category && (
                        ' · ' + post.category
                      )}
                    </div>
                    <div className='opacity-60 py-1'>{post.excerpt}</div>
                  </div>
                </div>
              )}
            </Link>
          </div>
        ))
        }
      </div>
      <div className='pt-6'>

      </div>
    </main >
  )
}