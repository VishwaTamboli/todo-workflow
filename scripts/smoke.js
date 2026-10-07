const app = require("../src/app");

async function main() {
  const server = app.listen(0);
  await new Promise((resolve) => server.on("listening", resolve));

  try {
    const { port } = server.address();
    const base = `http://127.0.0.1:${port}`;

    const createRes = await fetch(`${base}/todos`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "smoke test", priority: "high" }),
    });

    if (createRes.status !== 201) {
      throw new Error(`expected POST /todos to return 201, got ${createRes.status}`);
    }

    const created = await createRes.json();

    const getRes = await fetch(`${base}/todos/${created.id}`);
    const todo = await getRes.json();

    if (getRes.status !== 200) {
      throw new Error(`expected GET /todos/:id to return 200, got ${getRes.status}`);
    }

    if (todo.priority !== "high") {
      throw new Error(`expected priority "high", got "${todo.priority}"`);
    }

    console.log("smoke test passed");
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
