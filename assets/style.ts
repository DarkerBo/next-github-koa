import { createGlobalStyle } from 'styled-components';

// 全局样式
export const GlobalStyle = createGlobalStyle`
  #__next {
    height: 100%;
  }
  .ant-layout {
    min-height: 100%;
  }
  .ant-layout-header {
    padding-left: 0;
    padding-right: 0;
  }
  .ant-layout-content {
    background-color: #fff;
  }
  .icon-email {
    margin-right: 5px;
  }
  .ant-list-item.selected {
    border-left: 2px solid #e36209;
    font-weight: 100;
  }
  .view-btn {
    position: absolute;
    right: 10px;
    top: 10px
  }
`