import React, { useState, useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout, Input, Avatar, Tooltip, Dropdown, Menu } from 'antd';
import { GithubOutlined, UserOutlined } from '@ant-design/icons';
import { HeaderInner, HeaderLeft, HeaderRight, Foot } from './style';
import Container from '../Container';
import { RootState } from '../../store/rootReducer';
import { UserState, UserActionConstants } from '../../store/user/types';
import { backCurrentPage } from '../../service/user';
import config from '../../assets/config.js';

const { Header, Content, Footer } = Layout;

// import getConfig from 'next/config';
// const { publicRuntimeConfig } = getConfig();

type Props = {
  title?: string
}

const MyLayout: React.FC<Props> = ({
  children,
  title = 'This is the default title',
}) => {
  const { userInfo } = useSelector<RootState, UserState>(state => state.user, shallowEqual);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = useCallback(
    () => dispatch({ type: UserActionConstants.LOGOUT }),
    [dispatch]
  );

  const urlKeyword = router.query && router.query.keyword;

  // 搜索框内容
  const [keyword, setKeyword] = useState(urlKeyword || '');

  // 修改搜索框内容
  const handleKeywordChange = useCallback((event) => {
    setKeyword(event.target.value);
  }, []) // setKeyword是不会变的，因此直接写[]即可

  // 开始搜索
  const handleSearch = useCallback(() => {
    router.push(`/search?keyword=${keyword}`);
  }, [keyword]);

  // 跳转github oauth
  const handleGoToOAuth = useCallback(async (e) => {
    e.preventDefault();
    const params = {
      url: router.asPath
    };
    try {
      const res = await backCurrentPage(params);
      if (res.status === 200) {
        location.href = config.github.OAUTH_URL
      } else {
        console.log('prepare fail');
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="#" onClick={handleLogout}>登 出</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* 页面头部组件 */}
      <Header>
        <Container renderer={<HeaderInner />}>
          <HeaderLeft>
            <div className="logo">
              <Link href="/">
                <GithubOutlined />
              </Link>
            </div>
            <div>
              <Input.Search 
                placeholder="搜索仓库" 
                value={keyword} 
                onChange={handleKeywordChange} 
                onSearch={handleSearch}
              />
            </div>
          </HeaderLeft>

          <HeaderRight>
            <div className="user">
              {
                userInfo && userInfo.id ? (
                  <Dropdown overlay={menu} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Avatar size={40} src={userInfo.avatar_url} />
                    </a>
                  </Dropdown>
                ) : (
                  <Tooltip placement="bottom" title="点击进行登录">
                     <a href={config.github.OAUTH_URL} onClick={handleGoToOAuth}>
                      <Avatar size={40} icon={<UserOutlined />} />
                    </a>
                  </Tooltip>
                )
              }
            </div> 
          </HeaderRight>
        </Container>
      </Header>

      {/* 页面内容区 */}
      <Content>
        <Container renderer={<div />}>
          {children}
        </Container>
      </Content>

      {/* 页面底部组件 */}
      <Footer>
        <Foot>Develop by Bowen @<a href="https://github.com/DarkerBo">github</a></Foot>
      </Footer>
    </Layout>
  )
}

export default MyLayout;
