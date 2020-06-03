import styled from 'styled-components';

export const IndexContainer = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px 0;

  .user-info {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    width: 200px;
    margin-right: 40px;
  }

  .login {
    font-weight: 800;
    font-size: 20px;
    margin-top: 20px;
  }

  .name {
    font-size: 16px;
    color: #777;
  }

  .bio {
    margin-top: 20px;
    color: #333;
  }

  .avatar {
    width: 100%;
    border-radius: 5px;
  }

  .user-repos {
    flex: 1;
  }
`;
