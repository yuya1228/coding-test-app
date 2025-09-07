import { GET } from "../../../api/repos/route";
import { NextResponse } from "next/server";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

describe("GET /api/repos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GitHub APIが正常に応答した場合、データを返す", async () => {
    const mockData = [{ id: 1, name: "test-repo" }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    ) as jest.Mock;

    const response = await GET();
    const json = await response.json();

    expect(global.fetch).toHaveBeenCalledWith("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    expect(response.status).toBe(200);
    expect(json).toEqual(mockData);
  });

  it("GitHub APIがエラーを返した場合、エラーメッセージを返す", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 403,
      })
    ) as jest.Mock;

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json).toEqual({
      error: "GitHub APIエラー",
      status: 403,
    });
  });

  it("fetchが例外をスローした場合、サーバーエラーを返す", async () => {
    global.fetch = jest.fn(() => {
      throw new Error("ネットワークエラー");
    }) as jest.Mock;

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({
      error: "サーバーエラー",
      details: "ネットワークエラー",
    });
  });
});