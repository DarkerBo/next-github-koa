import React from 'react'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router';
import { Button, Tabs } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { getMyProjectInfo, getMyStarInfo } from '../../service/github';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../../store';
import { UserState } from '../../store/user/types';
import config from '../../assets/config';
import { IndexContainer, UserContainer } from '../../styles/index';
import Repo from '../../components/Repo';
import { initClientCache } from '../../utils/client-cache';

const { cache, useCache } = initClientCache();

type Props = {
  userRepos: Record<string, any>[];
  starred: Record<string, any>[];
}

const IndexPage: NextPage<Props> = ({ userRepos, starred }) => {

  useCache('CACHE', {
    userRepos,
    starred,
  })

  const { userInfo } = useSelector<RootState, UserState>(state => state.user, shallowEqual);
  const router = useRouter();
  const tabKey = router.query.key || '1'

  // 改变tab事件
  const handleTabChange = (activeKey: string) => {
    router.push(`/?key=${activeKey}`);
  }

  if (!userInfo || !userInfo.id) {
    return (
      <IndexContainer>
        <p>亲，您还没有登录哦~~</p>
        <a href={config.github.OAUTH_URL}>
          <Button type="primary">
            点击登录
          </Button>
        </a>
      </IndexContainer>
    )
  }

  const { avatar_url, login, name, bio, html_url } = userInfo;

  return (
    <UserContainer className="root">
      <div className="user-info">
        <img src={avatar_url} alt="" className="avatar" />
        <span className="login">{login}</span>
        <span className="name">{name}</span>
        <span className="bio">{bio}</span>
        <p className="email">
          <MailOutlined className="icon-email" />
          <a href={`mailto:${html_url}`}>{html_url}</a>
        </p>
      </div>
      <div className="user-repos">
        <Tabs activeKey={tabKey as string} onChange={handleTabChange} animated={false}>
          <Tabs.TabPane tab="你的仓库" key="1">
            {userRepos.map((repo: Record<string, any>) => (
              <Repo key={repo.id} repo={repo} />
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="你关注的仓库" key="2">
            {starred.map((repo:  Record<string, any>) => (
              <Repo key={repo.id} repo={repo} />
            ))}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </UserContainer>
  )
}

IndexPage.getInitialProps = cache(async (ctx: NextPageContext) => {
  const { store } = ctx;
  const { userInfo = {} } = store.getState().user;
  if (!userInfo || !userInfo.id) {
    return {
      userRepos: [],
      starred: [],
    };
  }

  try {
    const reposParams = { ctx };
    const reposRes = await getMyProjectInfo(reposParams);

    const starParams = { ctx };
    const starRes = await getMyStarInfo(starParams);

    return {
      userRepos: reposRes.data,
      starred: starRes.data,
    }
  } catch (error) {
    console.log(error);
    return {
      userRepos: [],
      starred: [],
    };
  }
})

export default IndexPage
