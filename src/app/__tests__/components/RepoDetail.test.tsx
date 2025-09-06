import { render, screen, waitFor } from '@testing-library/react';
import RepoDetail from '@/app/repos/[name]/page';

describe('RepoDetail', () => {
  const mockRepo = {
    name: 'test-repo',
    owner: {
      avatar_url: 'https://example.com/avatar.png',
      login: 'test-user',
    },
    language: 'JavaScript',
    description: 'This is a test repository',
    stargazers_count: 10,
    watchers_count: 5,
    forks_count: 2,
    open_issues_count: 1,
    html_url: 'https://github.com/test-user/test-repo',
  };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRepo),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('リポジトリの詳細のレンダリング確認', async () => {
    const params = { name: 'test-repo' };

    render(await RepoDetail({ params }));

    await waitFor(() => {
      expect(screen.getByText('リポジトリ: test-repo')).toBeInTheDocument();
      expect(screen.getByText('使用言語: JavaScript')).toBeInTheDocument();
      expect(screen.getByText('This is a test repository')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // Star数
      expect(screen.getByText('5')).toBeInTheDocument(); // Watcher数
      expect(screen.getByText('2')).toBeInTheDocument(); // Fork数
      expect(screen.getByText('1')).toBeInTheDocument(); // Issue数
      expect(screen.getByText('GitHubで見る →')).toBeInTheDocument();
    });
  });

  it('APIエラー処理', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as jest.Mock;

    const params = { name: 'non-existent-repo' };

    await expect(async () => {
      await RepoDetail({ params });
    }).rejects.toThrow('リポジトリが見つかりませんでした。');
  });
});