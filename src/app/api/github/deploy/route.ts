import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Octokit } from '@octokit/rest';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, username, readmeContent, commitMessage, personalToken } = body;

    // Check for token from session or personalToken or Authorization header
    const session: any = await getServerSession(authOptions);
    const authHeader = req.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    const token = personalToken || session?.accessToken || headerToken;

    if (!token) {
      return NextResponse.json(
        {
          error:
            'Authentication required. Please connect your GitHub account via OAuth or provide a GitHub Personal Access Token with "repo" scope.',
        },
        { status: 401 }
      );
    }

    const octokit = new Octokit({ auth: token });

    // Validate the authenticated user
    const { data: authUser } = await octokit.rest.users.getAuthenticated();
    const targetOwner = username || authUser.login;
    const targetRepo = targetOwner; // Special profile repository: <username>/<username>

    // 1. Check if repo exists
    let repoExists = false;
    try {
      await octokit.rest.repos.get({
        owner: targetOwner,
        repo: targetRepo,
      });
      repoExists = true;
    } catch (err: any) {
      if (err.status === 404) {
        repoExists = false;
      } else {
        throw err;
      }
    }

    // 2. Check if README.md exists and get current content + SHA
    let existingReadmeContent: string | null = null;
    let existingSha: string | undefined = undefined;

    if (repoExists) {
      try {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner: targetOwner,
          repo: targetRepo,
          path: 'README.md',
        });

        if (!Array.isArray(fileData) && fileData.type === 'file' && fileData.content) {
          existingSha = fileData.sha;
          existingReadmeContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
        }
      } catch (err: any) {
        // README.md might not exist yet in an existing repo
        if (err.status !== 404) {
          console.warn('Could not read existing README.md:', err.message);
        }
      }
    }

    // If client requested check only (diff inspection)
    if (action === 'check') {
      return NextResponse.json({
        repoExists,
        targetOwner,
        targetRepo,
        existingSha,
        existingReadmeContent,
      });
    }

    // 3. If action is commit:
    if (!repoExists) {
      // Auto-create special repository <username>/<username>
      await octokit.rest.repos.createForAuthenticatedUser({
        name: targetRepo,
        description: `Profile README created with GitCanvas Studio`,
        private: false,
        auto_init: true,
      });

      // Small delay to ensure GitHub initializes default branch
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Try to get initialized README sha if GitHub created one
      try {
        const { data: newFileData } = await octokit.rest.repos.getContent({
          owner: targetOwner,
          repo: targetRepo,
          path: 'README.md',
        });
        if (!Array.isArray(newFileData) && newFileData.sha) {
          existingSha = newFileData.sha;
        }
      } catch (_) {}
    }

    // 4. Commit and push README.md
    const message = commitMessage || 'docs: update profile README via GitCanvas Studio ✨';
    const contentBase64 = Buffer.from(readmeContent, 'utf-8').toString('base64');

    const commitResponse = await octokit.rest.repos.createOrUpdateFileContents({
      owner: targetOwner,
      repo: targetRepo,
      path: 'README.md',
      message,
      content: contentBase64,
      sha: existingSha,
    });

    return NextResponse.json({
      success: true,
      repoCreated: !repoExists,
      commitSha: commitResponse.data.commit.sha,
      commitUrl: commitResponse.data.commit.html_url,
      profileUrl: `https://github.com/${targetOwner}`,
      repoUrl: `https://github.com/${targetOwner}/${targetRepo}`,
      message: `Successfully deployed README.md to github.com/${targetOwner}/${targetRepo}!`,
    });
  } catch (error: any) {
    console.error('GitHub Deploy API Error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to deploy README to GitHub';
    return NextResponse.json({ error: message }, { status });
  }
}
