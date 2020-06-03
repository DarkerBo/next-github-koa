import styled from 'styled-components';

export const RepoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  .root + .root {
    border-top: 1px solid #eee;
    padding-top: 20px;
  }

  .other-info > span + span {
    margin-left: 10px;
  }

  .repo-title {
    font-size: 20px;
  }

  .lang-star {
    display: flex;
  }

  .lang-star > span {
    width: 120px;
    text-align: right;
  }

  .repo-desc {
    width: 400px;
  }
`;