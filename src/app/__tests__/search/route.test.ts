import { GET } from "../../api/search/route";
import { NextRequest, NextResponse } from "next/server";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

describe("GET /api/search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("クエリがない場合、400エラーを返す", async () => {
    const req = {
      url: "http://localhost/api/search",
    } as NextRequest;

    const response = await GET(req);
    expect(response).toBeDefined();
    const json = await response!.json();

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "リポジトリを入力してください！" },
      { status: 400 }
    );
    expect(response!.status).toBe(400);
    expect(json).toEqual({ error: "リポジトリを入力してください！" });
  });

  it("GitHub APIが正常に応答した場合、データを返す", async () => {
    const mockData = { items: [{ id: 1, name: "test-repo" }] };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    ) as jest.Mock;

    const req = {
      url: "http://localhost/api/search?query=test",
    } as NextRequest;

    const response = await GET(req);
    const json = await response!.json();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/search/repositories?q=test+user:yuya1228",
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockData);
    expect(response!.status).toBe(200);
    expect(json).toEqual(mockData);
  });

  it("GitHub APIがエラーを返した場合、500エラーを返す", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as jest.Mock;

    const req = {
      url: "http://localhost/api/search?query=test",
    } as NextRequest;

    const response = await GET(req);
    const json = await response!.json();

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "リポジトリの検索に失敗しました。" },
      { status: 500 }
    );
    expect(response!.status).toBe(500);
    expect(json).toEqual({ error: "リポジトリの検索に失敗しました。" });
  });

  it("fetchが例外をスローした場合、500エラーを返す", async () => {
    global.fetch = jest.fn(() => {
      throw new SyntaxError("JSONエラー");
    }) as jest.Mock;

    const req = {
      url: "http://localhost/api/search?query=test",
    } as NextRequest;

    const response = await GET(req);
    const json = await response!.json();

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
    expect(response!.status).toBe(500);
    expect(json).toEqual({ error: "サーバーエラーが発生しました。" });
  });
});