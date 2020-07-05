import styled from 'styled-components';

type LabelContainerProps = {
  readonly bgcColor: string;
};

export const DetailContainer = styled.div`
  padding-top: 20px;
  .repo-basic {
    padding: 20px;
    border: 1px solid #eee;
    margin-bottom: 20px;
    border-radius: 5px;
  }

  .tab + .tab {
    margin-left: 20px;
  }
`;

export const IssueDetailContainer = styled.div`
  background: #fefefe;
  padding: 20px;
  .actions {
    text-align: right;
  }
`;

export const LabelContainer = styled.span<LabelContainerProps>`
  margin-left: 8px;
  height: 20px;
  padding: .15em 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  border-radius: 2px;
  box-shadow: inset 0 -1px 0 rgba(27,31,35,.12);
  background-color: ${props => props.bgcColor || '#FFF'};
`;

export const IssueItemContainer = styled.div`
  & + & {
    border-top: 1px solid #eee;
  }

  .userName {
    font-weight: bold;
    color: #666;
  }

  .issue {
    display: flex;
    position: relative;
    padding: 10px;
  }

  .issue:hover {
    background: #fafafa;
  }

  .main-info {
    width: 85%;
  }

  .main-info > h6 {
    padding-right: 40px;
    font-size: 16px;
    word-break: break-all;
  }

  .avatar {
    margin-right: 20px;
  }

  .sub-info {
    margin-bottom: 0;
  }

  .sub-info > span + span {
    display: inline-block;
    margin-left: 20px;
    font-size: 12px;
  }
`;

export const IssuesContainer = styled.div`
  .issues {
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .search {
    display: flex;
    align-items: center;
  }
`;
