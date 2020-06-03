import React from 'react';
import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getReposReadMeInfo } from '../../service/github';
import withRepoBasic from '../../components/WithRepoBasic';
import { initClientCache, genDetailCacheKey } from '../../utils/client-cache';

const MarkdownRenderer = dynamic(import('../../components/MarkdownRenderer'));

const { cache, useCache } = initClientCache({
  genCacheKeyStrate: (ctx: NextPageContext) => {
    return genDetailCacheKey(ctx);
  }
});

type Props = {
  readme: {
    conetent: any;
    [key: string]: any;
  };
}

const Detail: NextPage<Props> = ({ readme }) => {
  const router = useRouter();

  useCache(genDetailCacheKey(router), {
    readme,
  })

  return (
    <MarkdownRenderer
      isBase64={true}
      content={readme.content}
    />
  )
}

Detail.getInitialProps = cache(async (ctx: NextPageContext) => {

  const { owner, name } = ctx.query;

    const params = {
      ctx,
      query: {
        owner: owner as string,
        name: name as string
      }
    }

    try {
      const res = await getReposReadMeInfo(params);
      return {
        readme: res.data
      }
    } catch (error) {
      console.log(error);
      return {
        readme: {
          content: ''
        }
      }
    }
})

export default withRepoBasic(Detail, 'index');
