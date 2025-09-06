import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBox from "../../components/SearchBox";

describe("SearchBox", () => {
  it("入力ボタンをレンダリングする", () => {
    const mockSetIsSearching = jest.fn();
    render(<SearchBox setIsSearching={mockSetIsSearching} />);

    expect(screen.getByPlaceholderText("リポジトリ名を入力してください")).toBeInTheDocument();
    expect(screen.getByText("検索")).toBeInTheDocument();
  });

  it("検索ボックスに値が入っていない場合にエラーを表示する", () => {
    const mockSetIsSearching = jest.fn();
    render(<SearchBox setIsSearching={mockSetIsSearching} />);

    window.alert = jest.fn();

    fireEvent.click(screen.getByText("検索"));

    expect(window.alert).toHaveBeenCalledWith("リポジトリ名を入力してください！");
  });

  it("APIを呼び出して、検索が成功すると結果を表示します", async () => {
    const mockSetIsSearching = jest.fn();
    const mockResults = [
      {
        id: 1,
        name: "test-repo",
        html_url: "https://github.com/test-repo",
        owner: { avatar_url: "https://example.com/avatar.png" },
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: mockResults }),
      })
    ) as jest.Mock;

    render(<SearchBox setIsSearching={mockSetIsSearching} />);

    fireEvent.change(screen.getByPlaceholderText("リポジトリ名を入力してください"), {
      target: { value: "test" },
    });

    fireEvent.click(screen.getByText("検索"));

    await waitFor(() => {
      expect(screen.getByText("検索結果")).toBeInTheDocument();
      expect(screen.getByText("test-repo")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/search?query=test");
    expect(mockSetIsSearching).toHaveBeenCalledWith(true);
  });

  it("API呼び出しが失敗した場合にエラーメッセージを表示します", async () => {
    const mockSetIsSearching = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as jest.Mock;

    render(<SearchBox setIsSearching={mockSetIsSearching} />);

    fireEvent.change(screen.getByPlaceholderText("リポジトリ名を入力してください"), {
      target: { value: "test" },
    });

    fireEvent.click(screen.getByText("検索"));

    await waitFor(() => {
      expect(screen.getByText("検索に失敗しました")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/search?query=test");
    expect(mockSetIsSearching).not.toHaveBeenCalled();
  });
});