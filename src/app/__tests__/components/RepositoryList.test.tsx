import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RepositoryList from '@/app/components/RepositoryList';
import React from 'react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} />;
  },
}));

const mockSuccessResponse = [
  { id: 1, name: 'repo1', owner: { avatar_url: 'https://example.com/avatar1.png' } },
  { id: 2, name: 'repo2', owner: { avatar_url: 'https://example.com/avatar2.png' } },
  { id: 3, name: 'repo3', owner: { avatar_url: 'https://example.com/avatar3.png' } },
  { id: 4, name: 'repo4', owner: { avatar_url: 'https://example.com/avatar4.png' } },
];

type Repo = {
  id: number;
  name: string;
  owner: { avatar_url: string };
};

const mockFetch = (data: Repo[] | null, fail = false) => {
  global.fetch = jest.fn((): Promise<Response> => {
      if (fail) {
          return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve({
          json: async () => data,
      } as Response);
  }) as unknown as jest.MockedFunction<typeof fetch>;
};

describe('RepositoryList', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('リポジトリが取得できると表示される', async () => {
    mockFetch(mockSuccessResponse);

    render(<RepositoryList />);

    const repo1 = await screen.findByText('repo1');
    expect(repo1).toBeInTheDocument();

    expect(screen.getByText('repo3')).toBeInTheDocument();
    expect(screen.queryByText('repo4')).not.toBeInTheDocument();

    const nextButton = screen.getByText('進む');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('repo4')).toBeInTheDocument();
      expect(screen.queryByText('repo1')).not.toBeInTheDocument();
    });
  });

  it('fetch が失敗したときにエラーが表示される', async () => {
    mockFetch(null, true);

    render(<RepositoryList />);

    const errorMessage = await screen.findByText('リポジトリの取得に失敗しました。');
    expect(errorMessage).toBeInTheDocument();
  });
});
