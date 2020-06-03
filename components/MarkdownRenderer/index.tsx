import { memo, useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const md = new MarkdownIt({
  html: true,
  linkify: true, // 使超链接可点击跳转
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str, true).value;
      } catch (e) { console.error(e) }
    }
    return ''; // 使用额外的默认转义
  },
})

const b64ToUtf8 = (str: string) => {
  return decodeURIComponent(escape(atob(str)));
}

let hljsInited = false;
export default memo(({ content, isBase64 }: { content: string; isBase64: boolean; }) => {
  const converted = isBase64 ? b64ToUtf8(content) : content;
  const html = useMemo(() => md.render(converted), [converted]);
  if (!hljsInited && typeof window !== 'undefined') {
    hljs.initHighlightingOnLoad();
    hljsInited = true;
  }

  return (
    <div className="markdown-body">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
})
