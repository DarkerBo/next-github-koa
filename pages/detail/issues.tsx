import React, { useState, useCallback } from 'react';
import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import withRepoBasic from '../../components/WithRepoBasic';
import { 
  getReposIssuesInfo, 
  searchIssuesListInfo, 
  getReposIssuesLabelsInfo 
} from '../../service/github';
import { Avatar, Button, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { 
  IssueDetailContainer, 
  LabelContainer,
  IssueItemContainer,
  IssuesContainer
} from './style';
import { initClientCache, genDetailCacheKey } from '../../utils/client-cache';
import { getTimeFromNow } from '../../utils/handleTime';
import SearchUser from '../../components/SearchUser';

const MarkdownRenderer = dynamic(import('../../components/MarkdownRenderer'));


const { cache, useCache } = initClientCache({
  genCacheKeyStrate: (ctx: NextPageContext) => {
    return genDetailCacheKey(ctx);
  }
});

const IssueDetail = ({ issue }: { issue: Record<string, any> }) => {
  return (
    <IssueDetailContainer>
      <MarkdownRenderer isBase64={false} content={issue.body} />
      <div className="actions">
        <a href={issue.html_url}>
          <Button target="_blank">打开issue讨论页面</Button>
        </a>
      </div>
    </IssueDetailContainer>
  )
}

const Label = ({ label }: { label: Record<string, any> }) => {
  return (
    <>
      <LabelContainer bgcColor={`#${label.color}`}>
        {label.name}
      </LabelContainer>
    </>
  )
}

const IssueItem = ({ issue }: { issue: Record<string, any> }) => {
  const [showDetail, setShowDetail] = useState(false);

  // 是否显示issues详情
  const toggleShowDetail = useCallback(() => {
    setShowDetail((show) => !show);
  }, [])

  return (
    <IssueItemContainer>
      <div className="issue">
        <Button
          onClick={toggleShowDetail}
          className="view-btn"
          type="primary"
          size="small"
        >查看
        </Button>
        <div className="avatar">
          {
            issue.user.avatar_url ? (
              <Avatar src={issue.user.avatar_url} shape="square" size={50} />
            ) : (
              <Avatar icon={<UserOutlined />} shape="square" size={50} />
            )
          }
          
        </div>
        <div className="main-info">
          <div className="userName">{issue.user.login}</div>
          <h6>
            <span>{issue.title}</span>
            {
              issue.labels.map((label: Record<string, any>) => <Label label={label} key={label.id} />)
            }
          </h6>
          <p className="sub-info">
            <span>Updated at {getTimeFromNow(issue.updated_at)}</span>
          </p>
        </div>
      </div>
      {showDetail ? <IssueDetail issue={issue} /> : null}
    </IssueItemContainer>

  )
}

type Props = {
  services: {
    initIssues: any[];
    labels: any[]
  }
}

const Issues: NextPage<Props> = ({ services }) => {
  const router = useRouter();
  useCache(genDetailCacheKey(router), { services });

  const { initIssues, labels } = services;
  const [creator, setCreator] = useState<string>(''); // 选择创建者条件
  const [issueState, setIssueState] = useState<string>(''); // 选择issues状态条件
  const [selectedLabels, setSelectedLabels] = useState<any[]>([]); // 选择标签条件
  const [issues, setIssues] = useState(initIssues); // issues 数据
  const [fetching, setFetching] = useState(false); // 是否正在请求数据

  // 选择label事件
  const handleLabelsChange = (selected: any[]) => {
    setSelectedLabels(selected)
  }

  // 查询issues事件
  const handleSearch = async () => {
    const { owner, name } = router.query;
    setFetching(true);

    const params = {
      query: { owner, name } as { owner: string; name: string; },
      data: {
        creator: creator || null,
        state: issueState || null,
        labels: selectedLabels && selectedLabels.length > 0 ? selectedLabels.join(',') : null
      }
    }

    const res: Record<string, any> = await searchIssuesListInfo(params);
    
    setIssues(res.data);
    setFetching(false);
  }

  const selectCommenStyle = {
    alignSelf: 'flex-start',
    width: 200,
    marginLeft: 20,
  }
  return (
    <IssuesContainer>
      <div className="search">
        <SearchUser
          style={selectCommenStyle}
          value={creator}
          onChange={setCreator}
        />
        <Select
          allowClear
          onChange={setIssueState}
          value={issueState}
          placeholder="状态"
          style={selectCommenStyle}
        >
          <Select.Option value="all">全部</Select.Option>
          <Select.Option value="open">open</Select.Option>
          <Select.Option value="closed">closed</Select.Option>
        </Select>

        <Select
          allowClear
          mode="multiple"
          onChange={handleLabelsChange}
          value={selectedLabels}
          placeholder="Label"
          style={{ flexGrow: 1, width: 200, margin: '0 20px' }}
        >
          {labels.map((label) => (
            <Select.Option value={label.id} key={label.id}>
              {label.name}
            </Select.Option>
          ))}
        </Select>
        <Button
          loading={fetching}
          onClick={handleSearch}
          size="small"
          type="primary"
          style={{ marginRight: 11 }}
        >
          搜索
        </Button>
      </div>
      <div className="issues">
        {issues.map((issue) => {
          return <IssueItem key={issue.id} issue={issue} />
        })}
      </div>
    </IssuesContainer>
  )
}

Issues.getInitialProps = cache(async (ctx: NextPageContext) => {
  const { owner, name } = ctx.query;

  const params = {
    ctx,
    query: {
      owner: owner as string,
      name: name as string
    }
  }

  try {
    const [{ data: initIssues }, { data: labels }] = await Promise.all([
      getReposIssuesInfo(params),
      getReposIssuesLabelsInfo(params)
    ]);
    return {
      services: {
        initIssues,
        labels,
      },
    }
  } catch (error) {
    console.log(error);
    return {
      services: {
        initIssues: [],
        labels: [],
      },
    }
  }
})

export default withRepoBasic(Issues, 'issues');
