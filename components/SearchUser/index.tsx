import React, { useState, useCallback, useRef } from 'react'
import { Select, Spin } from 'antd'
import debounce from '../../utils/debounce';
import { searchUserListInfo } from '../../service/github';

type SearchUserParams = {
  onChange: any;
  value: string|number;
  style: Record<string, any>;
}

function SearchUser({ onChange, value, style }: SearchUserParams) {
  const [fetching, setFetching] = useState(false); // 是否正在请求中
  const [options, setOptions] = useState([]); // 用户信息数组
   // 请求的ID,为了防止用户第一次输入aaa后马上输入bbb，页面的aaa数据还未请求完成时又发送新的bbb请求
   // 此时页面会出现渲染aaa的数据后又渲染为bbb的数据的情况出现
   // 判断请求时的fetchId 是否为lastFetchIdRef保存的ID，若不是，说明fetchId所在的请求不是最新所需要的请求
   // 这时候就把旧请求return掉 不保存它的数据，而是保存最新的请求返回的数据
   // 用useRef还可以逃脱闭包陷阱，避免了使useCallback依赖state更新而导致重新渲染方法的负优化情况出现
  const lastFetchIdRef = useRef(0);

  // 请求搜索用户接口
  const fetchUser = useCallback(
    async (searchValue: string|number, fetchId: number) => {
      setFetching(true);
      setOptions([]);

      const params = {
        q: searchValue
      }
      const res: Record<string, any> = await searchUserListInfo(params);

      const userOptions = res.data.items.map(((user: Record<string, any>) => ({
        text: user.login,
        value: user.login,
      })))

      if (fetchId === lastFetchIdRef.current) {
        setOptions(userOptions);
      } else {
        setOptions([]);
      }
      setFetching(false);
    },
    [],
  )

  // 搜索用户
  const fetchUserBefore = (searchValue: string) => {
    lastFetchIdRef.current += 1;
    if (searchValue.trim()) {
      return debounce(fetchUser(searchValue, lastFetchIdRef.current), 500);
    }
    return null;
  }

  // 搜索框内容改变
  const handleChange = (selectValue: string|number) => {
    onChange(selectValue);
    setOptions([]);
  }

  return (
    <Select
      allowClear
      showSearch
      value={value}
      onChange={handleChange}
      onSearch={fetchUserBefore}
      notFoundContent={fetching ? <Spin size="small" /> : <span>找不到用户</span>}
      // 禁用本地搜索
      filterOption={false}
      placeholder="创建者"
      style={({ width: 200, ...style })}
    >
      {options.map((option) => {
        const {
          value: optionValue,
          text: optionText,
        } = option
        return (
          <Select.Option key={optionValue} value={optionValue}>
            {optionText}
          </Select.Option>
        )
      })}
    </Select>
  )
}

export default SearchUser;
