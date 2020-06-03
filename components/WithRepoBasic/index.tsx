import React from 'react';
import { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DetailContainer } from './style';
import Repo from '../../components/Repo';
import { getOwnerReposInfo } from '../../service/github';
import { initClientCache, genDetailCacheKey } from '../../utils/client-cache';

const { cache, useCache } = initClientCache({
  genCacheKeyStrate: (ctx: NextPageContext) => {
    return genDetailCacheKey(ctx);
  }
});

type Props = {
  repoBasic: Record<string, any>;
}

export default function (Component: NextPage<any>, type: 'index'| 'issues' = 'index') {
  const WithDetail: NextPage<Props> = ({ repoBasic, ...rest }) => {
    const router = useRouter();

    // 将query对象处理成字符串形式 ?aaa=111&bbb=222
    const handleQuery = (queryObject: Record<string, string | number>) => {
      const query = Object.entries(queryObject)
        .reduce((result, entry) => {
          (result as string[]).push(entry.join('='));
          return result;
        }, [])
        .join('&')
      return `?${query}`
    }

    const query = handleQuery(router.query as Record<string, string | number>);

    // 将详情信息存在缓存中
    useCache(genDetailCacheKey(router), { repoBasic, ...rest })

    return (
      <DetailContainer>
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">
            <Link href={`/detail${query}`}>
              {type === 'index' ? (
                <span className="tab">Readme</span>
              ) : (
                <a title="readme" className="tab index">Readme</a>
              )}
            </Link>
            <Link href={`/detail/issues${query}`}>
              {type === 'issues' ? (
                <span className="tab">Issues</span>
              ) : (
                <a title="issues" className="tab issues">Issues</a>
              )}
            </Link>
          </div>
        </div>
        <div>
          <Component {...rest} />
        </div>
      </DetailContainer>
    )
  }

  WithDetail.getInitialProps = cache(async(ctx: NextPageContext) => {
    const { owner, name } = ctx.query;

    let componentData = {}
    if (Component.getInitialProps) {
      componentData = await Component.getInitialProps(ctx)
    }

    const params = {
      ctx,
      query: {
        owner: owner as string,
        name: name as string
      }
    }

    try {
      const res = await getOwnerReposInfo(params);
      return {
        repoBasic: res.data,
        ...componentData
      }
    } catch (error) {
      console.log(error);
      return {
        repoBasic: [],
        ...componentData
      }
    }
  })

  return WithDetail;
}