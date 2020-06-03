import { NextPageContext } from 'next';

export type searchGithubInfoPamamsType = {
  ctx: NextPageContext;
  data: {
    q: string;
    lang?: string | null;
    sort?: string | null;
    order?: string | null;
    page?: string | null;
    per_page: number;
  }
}

export type getMyProjectInfoPamamsType = {
  ctx: NextPageContext;
}

export type getMyStarInfoPamamsType = {
  ctx: NextPageContext;
}

export type getOwnerReposInfoPamamsType = {
  ctx: NextPageContext;
  query: {
    owner: string;
    name: string;
  }
}

export type getReposReadMeInfoPamamsType = {
  ctx: NextPageContext;
  query: {
    owner: string;
    name: string;
  }
}

export type getReposIssuesInfoPamamsType = {
  ctx: NextPageContext;
  query: {
    owner: string;
    name: string;
  }
}

export type getReposIssuesLabelsInfoPamamsType = {
  ctx: NextPageContext;
  query: {
    owner: string;
    name: string;
  }
}

export type searchUserListInfoParamsType = {
  q: string|number;
}

export type searchIssuesListInfoParamsType = {
  query: {
    owner: string;
    name: string;
  },

  data: {
    creator?: string | null;
    state?: string | null;
    labels?: string | null;
  }
}
