import React from 'react';
import { StarFilled } from '@ant-design/icons';
import Link from 'next/link';
import { RepoContainer } from './style';
import { getTimeFromNow } from '../../utils/handleTime';

type Props = {
  repo: Record<string, any>;
}

const Repo: React.FC<Props> = ({ repo }) => {

  // 是否已经获取了该仓库的许可证
  const getLicense = (license: Record<string ,any>) => {
    return license ? `${license.spdx_id} license` : '';
  }

  return (
    <RepoContainer>
      <div className="basic-info">
        <h3 className="repo-title">
          <Link href={`/detail?owner=${repo.owner && repo.owner.login}&name=${repo.name}`}>
            <a>{repo.full_name}</a>
          </Link>
        </h3>
        <p className="repo-desc">
          {repo.description}
        </p>
        <p className="other-info">
          {repo.license ? (
            <span className="license">{getLicense(repo.license)}</span>
          ) : null}
          <span className="last-updated">{getTimeFromNow(repo.updated_at)}</span>
          <span className="open-issues">{repo.open_issues_count} open issues</span>
        </p>
      </div>
      <div className="lang-star">
        <span className="lang">
          {repo.language}
        </span>
        <span className="stars">
          {repo.stargazers_count} <StarFilled />
        </span>
      </div>
    </RepoContainer>
  )
}

export default Repo;