const { randomUUID } = require("node:crypto");

const users = [];
const sessions = new Map();
const feedbackByUser = new Map();

function createUser({ email, name, passwordHash }) {
  const existing = users.find((user) => user.email === email);
  if (existing) {
    return null;
  }

  const user = {
    id: randomUUID(),
    email,
    name: String(name || "").trim() || "User",
    passwordHash,
    createdAt: new Date()
  };

  users.push(user);
  feedbackByUser.set(user.id, []);
  return user;
}

function findUserByEmail(email) {
  return users.find((user) => user.email === email) || null;
}

function findUserById(userId) {
  return users.find((user) => user.id === userId) || null;
}

function createSession(token, userId) {
  sessions.set(token, userId);
}

function deleteSession(token) {
  sessions.delete(token);
}

function getUserBySession(token) {
  const userId = sessions.get(token);
  if (!userId) {
    return null;
  }

  return findUserById(userId);
}

function listFeedback(userId) {
  return feedbackByUser.get(userId) || [];
}

function createFeedback(userId, payload) {
  const records = listFeedback(userId);
  const record = {
    id: records.length + 1,
    title: payload.title,
    notes: payload.notes,
    createdAt: new Date(),
    done: false
  };

  records.unshift(record);
  feedbackByUser.set(userId, records);
  return record;
}

function toggleFeedback(userId, feedbackId) {
  const records = listFeedback(userId);
  const record = records.find((item) => item.id === feedbackId);
  if (!record) {
    return null;
  }

  record.done = !record.done;
  return record;
}

module.exports = {
  createFeedback,
  createSession,
  createUser,
  deleteSession,
  findUserByEmail,
  getUserBySession,
  listFeedback,
  toggleFeedback
};