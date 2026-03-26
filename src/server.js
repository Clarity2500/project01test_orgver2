const express = require("express");
const {
  clearSessionCookie,
  createSessionToken,
  hashPassword,
  normalizeEmail,
  parseCookies,
  sessionCookie,
  verifyPassword
} = require("./auth");
const {
  createFeedback,
  createSession,
  createUser,
  deleteSession,
  findUserByEmail,
  getUserBySession,
  listFeedback,
  toggleFeedback
} = require("./store");
const {
  renderDashboard,
  renderLanding,
  renderLogin,
  renderRegister
} = require("./ui");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.urlencoded({ extended: false }));

app.use((req, _res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.session_token;

  req.sessionToken = token || null;
  req.currentUser = token ? getUserBySession(token) : null;
  next();
});

function requireAuth(req, res, next) {
  if (!req.currentUser) {
    res.redirect("/auth/login");
    return;
  }

  next();
}

app.get("/", (req, res) => {
  if (req.currentUser) {
    res.redirect("/app");
    return;
  }

  res.status(200).send(renderLanding());
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/auth/register", (_req, res) => {
  res.status(200).send(renderRegister("", { name: "", email: "" }));
});

app.post("/auth/register", (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!name || !email || password.length < 8) {
    res.status(400).send(
      renderRegister("Name, email, and a password of at least 8 characters are required.", {
        name,
        email
      })
    );
    return;
  }

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    res.status(409).send(renderRegister("That email is already registered.", { name, email }));
    return;
  }

  const passwordHash = hashPassword(password);
  const user = createUser({ email, name, passwordHash });
  const token = createSessionToken();
  createSession(token, user.id);

  res.setHeader("Set-Cookie", sessionCookie(token));
  res.redirect("/app");
});

app.get("/auth/login", (_req, res) => {
  res.status(200).send(renderLogin("", { email: "" }));
});

app.post("/auth/login", (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).send(renderLogin("Invalid email or password.", { email }));
    return;
  }

  const token = createSessionToken();
  createSession(token, user.id);
  res.setHeader("Set-Cookie", sessionCookie(token));
  res.redirect("/app");
});

app.post("/auth/logout", (req, res) => {
  if (req.sessionToken) {
    deleteSession(req.sessionToken);
  }

  res.setHeader("Set-Cookie", clearSessionCookie());
  res.redirect("/auth/login");
});

app.get("/app", requireAuth, (req, res) => {
  const feedback = listFeedback(req.currentUser.id);
  res.status(200).send(renderDashboard({ user: req.currentUser, feedback, error: "" }));
});

app.post("/app/feedback", requireAuth, (req, res) => {
  const title = String(req.body.title || "").trim();
  const notes = String(req.body.notes || "").trim();

  if (!title) {
    const feedback = listFeedback(req.currentUser.id);
    res
      .status(400)
      .send(renderDashboard({ user: req.currentUser, feedback, error: "Title is required." }));
    return;
  }

  createFeedback(req.currentUser.id, { title, notes });
  res.redirect("/app");
});

app.post("/app/feedback/:id/toggle", requireAuth, (req, res) => {
  const feedbackId = Number(req.params.id);
  if (Number.isFinite(feedbackId)) {
    toggleFeedback(req.currentUser.id, feedbackId);
  }

  res.redirect("/app");
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Feedback Inbox Lite listening on http://localhost:${port}`);
});