// 本文件是覆盖next.js APP组件的文件
import React, { useState, useEffect } from 'react';
import App, { AppProps, AppContext } from 'next/app'
import { Provider } from 'react-redux';
import withRedux from "next-redux-wrapper";
import initializeStore from '../store';
import Layout from '../components/Layout';
import PageLoading from '../components/PageLoading';
import { useRouter } from 'next/router';
import { GlobalStyle } from '../assets/style';
import 'highlight.js/styles/default.css';
import 'github-markdown-css';

import 'antd/dist/antd.css';

type MyAppProps = AppProps & { store: any }

function MyApp({ Component, pageProps, store }: MyAppProps ) {

  // 全局loading状态
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 切换loading状态
  const toggleLoading = (status: boolean) => {
    setLoading(status);
  }

  useEffect(() => {
    // 监听路由切换来更新loading状态
    router.events.on('routeChangeStart', () => toggleLoading(true));
    router.events.on('routeChangeComplete', () => toggleLoading(false));
    router.events.on('routeChangeError', () => toggleLoading(false));

    return () => {
      router.events.off('routeChangeStart', () => toggleLoading(true));
      router.events.off('routeChangeComplete', () => toggleLoading(false));
      router.events.off('routeChangeError', () => toggleLoading(false));
    }
  }, [])

  return (
    <Provider store={store}>
      { loading && <PageLoading /> }
      <Layout title="Hi">
        <Component {...pageProps}/>
        <GlobalStyle />
      </Layout>
    </Provider>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps }
}

export default withRedux(initializeStore)(MyApp);
