const express = require("express");
const { randomUUID } = require("crypto");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************

const users = []; //In-memory storage

//Helper Function to help test for valid  non empty string
function isNonEmptyString(x) {
  return typeof x === "string" && x.trim().length > 0;
}

/**
 * Create a User
 * POST /users
 * Body: { name, email }
 * 201 -> { id, name, email }
 * 400 if missing name/email
 */
app.post("/users", (req, res) => {
  const { name, email } = req.body || {};

  if (!isNonEmptyString(name) || !isNonEmptyString(email)) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const user = { id: randomUUID(), name: name.trim(), email: email.trim() };
  users.push(user);
  return res.status(201).json(user);
});

/**
 * Retrieve a User
 * GET /users/:id
 * 200 -> user
 * 404 if not found
 */
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);

  if (!user) return res.status(404).json({ error: "User not found" });
  return res.status(200).json(user);
});

/**
 * Update a User
 * PUT /users/:id
 * Body: { name, email }  (both required by spec)
 * 200 -> updated user
 * 400 if missing fields
 * 404 if not found
 */
app.put("/users/:id", (req, res) => {
  const { name, email } = req.body || {};

  if (!isNonEmptyString(name) || !isNonEmptyString(email)) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });

  users[idx] = { ...users[idx], name: name.trim(), email: email.trim() };
  return res.status(200).json(users[idx]);
});

/**
 * Delete a User
 * DELETE /users/:id
 * 204 on success (no body)
 * 404 if not found
 */
app.delete("/users/:id", (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });

  users.splice(idx, 1);
  return res.status(204).send();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Do not touch the code below this comment
// **************************************************************

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app; // Export the app for testing
