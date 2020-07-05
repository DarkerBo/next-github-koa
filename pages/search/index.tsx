import { memo, isValidElement } from 'react';
import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { searchGithubInfo } from '../../service/github';
import { SearchContainer, SearchItem } from '../../styles/search';
import { Row, Col, List, Pagination } from 'antd';
import Repo from '../../components/Repo';
import { initClientCache, genCacheKeyByQuery } from '../../utils/client-cache';

const { cache, useCache } = initClientCache({
  genCacheKeyStrate: (ctx: NextPageContext) => {
    return genCacheKeyByQuery(ctx.query as Record<string, string>);
  },
})

type Props = {
  repos: {
    total_count: number;
    items: any[];
    [key: string]: any;
  }
}

/**
  * 关心的search条件
  * sort: 排序方式
  * order: 排序升降顺序
  * lang: 仓库开发主语言
  * page: 分页
*/

const LANGUAGES = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Vue', 'React'];
const SORT_TYPES = [
  {
    name: 'Best Match',
  },
  {
    name: 'Most Starts',
    sort: 'stars',
    order: 'desc',
  },
  {
    name: 'Fewest Starts',
    sort: 'stars',
    order: 'asc',
  },
  {
    name: 'Most Forks',
    sort: 'forks',
    order: 'desc',
  },
  {
    name: 'Fewest Forks',
    sort: 'forks',
    order: 'asc',
  },
];
const PER_PAGE = 20; // 一页有几条数据

type FilterLinkType = {
  keyword?: string;
  lang?: string;
  sort?: string;
  order?: string;
  page?: string;
  isSelected?: boolean;
  children: React.ReactNode;
}

// 单个链接
const FilterLink = memo<FilterLinkType>(({ children, keyword, lang, sort, order, page, isSelected }) => {
  if (isSelected) {
    return <SearchItem>{children}</SearchItem>;
  }

  let queryString = `?keyword=${keyword}`;

  if (lang) queryString += `&lang=${lang}`;
  if (sort) queryString += `&sort=${sort}&order=${order}`;
  if (page) queryString += `&page=${page}`;

  queryString += `&per_page=${PER_PAGE}`;

  return (
    <Link href={`/search${queryString}`}>
      {isValidElement(children) ? children : <a>{children}</a>}
    </Link>
  )
})


const Search: NextPage<Props> = ({ repos }) => {
  const router = useRouter();
  const { sort, order, lang, page = 1 } = router.query;

  // 从缓存中获取数据，不需要多次请求
  useCache(genCacheKeyByQuery(router.query as Record<string, string|number>), { repos });

  return (
    <SearchContainer>
      <Row gutter={20}>
        <Col span={6}>
          <List 
            bordered
            header={<span className="list-header">语言</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGES}
            renderItem={(language) => {
              const isSelected = lang === language;

              return (
                <List.Item className={isSelected ? 'selected' : ''}>
                  <FilterLink
                    {...router.query}
                    isSelected={isSelected}
                    lang={language}
                  >
                    {language}
                  </FilterLink>
                </List.Item>
              )
            }}
          />

          <List 
            bordered
            header={<span className="list-header">排序</span>}
            style={{ marginBottom: 20 }}
            dataSource={SORT_TYPES}
            renderItem={(item) => {
              let isSelected = false;
              if (item.name === 'Best Match' && !sort) {
                isSelected = true;
              } else if (item.sort === sort && item.order === order) {
                isSelected = true;
              }

              return (
                <List.Item className={isSelected ? 'selected' : ''}>
                  <FilterLink
                    {...router.query}
                    isSelected={isSelected}
                    sort={item.sort}
                    order={item.order}
                  >
                    {item.name}
                  </FilterLink>

                </List.Item>
              )
            }}
          />
        </Col>

        <Col span={18}>
          <h3 className="repos-title">{repos.total_count} 个仓库</h3>
          {
            repos.items.map((repo: Record<string, any>) => <Repo repo={repo} key={repo.id} />)
          }
          <div className="pagination">
            <Pagination
              pageSize={PER_PAGE}
              current={Number(page)}
              onChange={() => {}}
              // github api限制请求前1000条
              total={Math.min(repos.total_count, 1000)}
              // 优化SEO
              itemRender={(renderPage, renderType, renderOl) => {
                const targetPage = renderType === 'page'
                  ? renderPage
                  : renderType === 'prev'
                    ? Number(page) - 1
                    : Number(page) + 1

                const name = renderType === 'page' ? renderPage : renderOl

                return <FilterLink {...router.query} page={targetPage.toString()}>{name}</FilterLink>
              }}
            />
          </div>
        </Col>
      </Row>
    </SearchContainer>
  )
}

Search.getInitialProps = cache(async(ctx: NextPageContext) => {
  const { keyword, sort, lang, order = 'desc', page } = ctx.query;

  if (!keyword) {
    return {
      repos: {
        items: [],
        total_count: 0,
      },
    }
  }

  const params = {
    ctx,
    data: {
      q: keyword as string,
      language: (lang || null) as string | null,
      sort: (sort || null) as string | null,
      order: (sort ? order : null) as string | null,
      page: (page || null) as string | null,
      per_page: PER_PAGE
    }
  };

  try {
    const res = await searchGithubInfo(params);
    return {
      repos: res.data,
    }
  } catch (error) {
    console.log(error);
    return {
      repos: {
        items: [],
        total_count: 0,
      },
    }
  }
})

export default Search;
