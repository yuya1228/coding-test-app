import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const response = await fetch(`https://api.github.com/user/repos`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "GitHub APIエラー", status: response.status }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: "サーバーエラー", details: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "サーバーエラー", details: "不明なエラーが発生しました。" }, { status: 500 });
    }
}