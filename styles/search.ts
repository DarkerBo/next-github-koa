import styled from 'styled-components';

export const SearchContainer = styled.div`
  padding: 20px 0;

  .list-header {
    font-weight: 800;
    font-size: 16px;
  }

  .repos-title {
    border-bottom: 1px solid #eee;
    font-size: 24px;
    line-height: 50px;
  }

  .pagination {
    margin-top: 16px;
    text-align: right;
  }
`;


export const SearchItem = styled.a`
  border-left: '2px solid #e36209';
  font-weight: 100
`;