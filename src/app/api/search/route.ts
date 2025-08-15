import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({error: 'リポジトリを入力してください！'}, {status: 400})
    }

    try {
        // GitHubユーザー名
        const name = 'yuya1228';
        const res = await fetch( `https://api.github.com/search/repositories?q=${query}+user:${name}`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });

        if (!res.ok) {
            return NextResponse.json({error: 'リポジトリの検索に失敗しました。'}, {status: 500})
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json({error: 'サーバーエラーが発生しました。'}, {status: 500})
        }
    }
}