function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout({ title, body, user }) {
  const userPill = user
    ? `<div class="pill">${escapeHtml(user.name)} (${escapeHtml(user.email)})</div>`
    : "";

  const authLink = user
    ? `<form method="post" action="/auth/logout"><button class="ghost" type="submit">Logout</button></form>`
    : `<a class="ghost" href="/auth/login">Login</a>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f7f9fc;
        --surface: #ffffff;
        --ink: #1f2937;
        --muted: #6b7280;
        --line: #e5e7eb;
        --primary: #0f766e;
        --primary-strong: #115e59;
        --danger: #b91c1c;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        font-family: "Segoe UI", "Helvetica Neue", sans-serif;
        background: radial-gradient(circle at 20% 0%, #d5f3ef 0%, var(--bg) 45%);
        color: var(--ink);
      }

      .wrap {
        width: min(920px, 92vw);
        margin: 0 auto;
      }

      header {
        position: sticky;
        top: 0;
        background: rgba(247, 249, 252, 0.92);
        backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--line);
      }

      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 0;
      }

      .brand {
        text-decoration: none;
        font-weight: 700;
        color: var(--ink);
      }

      .nav-right {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .pill {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 6px 12px;
        color: var(--muted);
        font-size: 13px;
      }

      .card {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 10px 40px rgba(15, 23, 42, 0.05);
      }

      main { padding: 28px 0 36px; }

      h1, h2, h3 { margin-top: 0; }

      p { color: var(--muted); }

      form {
        display: grid;
        gap: 12px;
      }

      label {
        display: grid;
        gap: 6px;
        font-weight: 600;
        font-size: 14px;
      }

      input, textarea, button {
        font: inherit;
      }

      input, textarea {
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 10px 12px;
        background: #fff;
      }

      button, .ghost {
        border: 0;
        border-radius: 10px;
        padding: 10px 14px;
        text-decoration: none;
        cursor: pointer;
      }

      button {
        background: var(--primary);
        color: #fff;
        font-weight: 600;
      }

      button:hover {
        background: var(--primary-strong);
      }

      .ghost {
        border: 1px solid var(--line);
        background: #fff;
        color: var(--ink);
      }

      .error {
        border: 1px solid #fecaca;
        background: #fef2f2;
        color: var(--danger);
        border-radius: 10px;
        padding: 10px 12px;
        margin-bottom: 12px;
      }

      .grid {
        display: grid;
        gap: 16px;
      }

      .feedback-item {
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 12px;
        display: grid;
        gap: 8px;
      }

      .feedback-title {
        font-weight: 700;
      }

      .feedback-meta {
        color: var(--muted);
        font-size: 13px;
      }

      .row {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }

      .badge {
        border-radius: 999px;
        padding: 3px 10px;
        font-size: 12px;
        border: 1px solid var(--line);
      }

      .badge.done {
        color: #065f46;
        border-color: #6ee7b7;
        background: #ecfdf5;
      }

      .badge.open {
        color: #7c2d12;
        border-color: #fed7aa;
        background: #fff7ed;
      }
    </style>
  </head>
  <body>
    <header>
      <div class="wrap nav">
        <a class="brand" href="/">Feedback Inbox Lite</a>
        <div class="nav-right">
          ${userPill}
          ${authLink}
        </div>
      </div>
    </header>
    <main>
      <div class="wrap">
        ${body}
      </div>
    </main>
  </body>
</html>`;
}

function renderLanding() {
  return layout({
    title: "Feedback Inbox Lite",
    body: `
      <section class="card">
        <h1>Ultra-simple SaaS MVP</h1>
        <p>Collect customer feedback per account and track open vs done in one place.</p>
        <div class="row">
          <a class="ghost" href="/auth/login">Login</a>
          <a class="ghost" href="/auth/register">Create account</a>
        </div>
      </section>
    `
  });
}

function renderRegister(error, values) {
  return layout({
    title: "Create Account",
    body: `
      <section class="card">
        <h2>Create account</h2>
        ${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
        <form method="post" action="/auth/register">
          <label>Name
            <input name="name" value="${escapeHtml(values.name)}" required />
          </label>
          <label>Email
            <input type="email" name="email" value="${escapeHtml(values.email)}" required />
          </label>
          <label>Password
            <input type="password" name="password" minlength="8" required />
          </label>
          <button type="submit">Register</button>
        </form>
      </section>
    `
  });
}

function renderLogin(error, values) {
  return layout({
    title: "Login",
    body: `
      <section class="card">
        <h2>Login</h2>
        ${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
        <form method="post" action="/auth/login">
          <label>Email
            <input type="email" name="email" value="${escapeHtml(values.email)}" required />
          </label>
          <label>Password
            <input type="password" name="password" required />
          </label>
          <button type="submit">Login</button>
        </form>
      </section>
    `
  });
}

function renderDashboard({ user, feedback, error }) {
  const feedbackList = feedback.length
    ? feedback
        .map((item) => {
          const badgeClass = item.done ? "badge done" : "badge open";
          const badgeText = item.done ? "Done" : "Open";
          return `
            <article class="feedback-item">
              <div class="row">
                <div class="feedback-title">${escapeHtml(item.title)}</div>
                <span class="${badgeClass}">${badgeText}</span>
              </div>
              <div>${escapeHtml(item.notes || "No notes")}</div>
              <div class="feedback-meta">Created: ${new Date(item.createdAt).toLocaleString()}</div>
              <form method="post" action="/app/feedback/${item.id}/toggle">
                <button type="submit">Mark as ${item.done ? "open" : "done"}</button>
              </form>
            </article>
          `;
        })
        .join("")
    : `<div class="feedback-item">No feedback yet. Add your first one below.</div>`;

  return layout({
    title: "Dashboard",
    user,
    body: `
      <div class="grid">
        <section class="card">
          <h2>Add Feedback</h2>
          ${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
          <form method="post" action="/app/feedback">
            <label>Title
              <input name="title" required maxlength="100" />
            </label>
            <label>Notes
              <textarea name="notes" rows="3" maxlength="800"></textarea>
            </label>
            <button type="submit">Create</button>
          </form>
        </section>

        <section class="card">
          <h2>Your Inbox</h2>
          <div class="grid">${feedbackList}</div>
        </section>
      </div>
    `
  });
}

module.exports = {
  renderDashboard,
  renderLanding,
  renderLogin,
  renderRegister
};