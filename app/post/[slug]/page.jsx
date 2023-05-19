import { format, parseISO } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import style from './post.module.css';
import 'highlight.js/styles/default.css';
import hljs from 'highlight.js';
import Link from 'next/link';
import { useMDXComponent } from 'next-contentlayer/hooks'

//Markdown
import tocAndAnchor from 'markdown-it-toc-and-anchor';
import emoji from 'markdown-it-emoji';
import footnote from 'markdown-it-footnote';
import highlightjs from 'markdown-it-highlightjs';
import iterator from 'markdown-it-for-inline'

var md = require('markdown-it')({
  breaks: true,
  linkify: true,
  langPrefix: 'language-',
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre className="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>';
      } catch (__) { }
    }
    return '<pre className="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});
md.use(emoji).use(footnote).use(tocAndAnchor).use(highlightjs).use(
  iterator, 'url_new_win', 'link_open', function (tokens, idx) {
    tokens[idx].attrPush(['target', '_blank']);
  });

const MDXComponents = {
  // Override the default <a> element to use the next/link component.
  a: ({ href, children }) => <Link href={href}>{children}</Link>,
  pre: ({ children }) => <pre className='overflow-x-scroll'>{children}</pre>,
  // Add a custom component.
}

const upyunImg = ({ src, width, quality }) => {
  return `${src}_itp/fw/${width}`
}

export function fetchPost(props) {
  const post = allPosts.find((post) => post.url == props.params.slug)
  const url = 'https://next.tripper.press/post/' + props.params.slug
  const postCont = post.body.raw
  const postCode = post.body.code
  const title = post.title + ' - Tripper Press'
  const result = md.render(postCont);
  return {
    post,
    result,
    title,
    postCode,
  };
}

export function generateMetadata(props) {
  const { title } = fetchPost(props);
  return {
    title,
  }
}

export default function PostPage(props) {
  const { post, postCode } = fetchPost(props);
  const MDXContent = useMDXComponent(postCode)
  return (
    <main className='dark:bg-zinc-900'>
      {post.cover ? (
        <div className={`${style['postCoverHeader']}`} style={{ backgroundImage: 'url("' + post.cover + '")' }}>
          <div className={`${style['postHeaderLayer']}`}>
            <div className={`${style['info-area']} px-6 lg:px-8 max-w-[800px]`}>
              <div className='text-3xl font-medium pt-4 dark:text-white'>{post.title}</div>
              <div className='opacity-60 pt-4 dark:text-zinc-400'>{format(parseISO(post.date), 'yyyy-MM-dd')}{post.category ? ` · ${post.category}` : ''}{post.tags ? ` · ${post.tags}` : ''}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${style['postDefaultHeader']}`}>
          <div className={`${style['postHeaderLayer']}`}>
            <div className={`${style['info-area']} px-6 lg:px-8 max-w-[800px]`}>
              <div className='text-3xl font-medium pt-4 dark:text-white'>{post.title}</div>
              <div className='opacity-60 pt-4 dark:text-zinc-400'>{format(parseISO(post.date), 'yyyy-MM-dd')}{post.category ? ` · ${post.category}` : ''}{post.tags ? ` · ${post.tags}` : ''}</div>
            </div>
          </div>
        </div>
      )}
      <div className='container pt-8 px-6 lg:px-8 max-w-[800px] article'><MDXContent components={MDXComponents}/></div>
      <div className={`${style['commentHr']} pt-10 pb-6`}>
      </div>
    </main>
  );
}