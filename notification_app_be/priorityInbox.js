const BASE_URL = "http://20.207.122.201/evaluation-service";

async function Log(stack, level, pkg, message) {
  try {
    await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (err) {
    // Silent fail — logging should never break main flow
    console.error("[Log Error]", err.message);
  }
}
// fetch all notifications
async function fetchNotifications(token) {
  await Log("fetchNotifications", "INFO", "notifications", "Fetching all notifications from API");

  const res = await fetch(`${BASE_URL}/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    await Log("fetchNotifications", "ERROR", "notifications", `Failed to fetch notifications: ${JSON.stringify(data)}`);
    throw new Error(`Failed to fetch notifications: ${JSON.stringify(data)}`);
  }

  await Log("fetchNotifications", "INFO", "notifications", `Fetched ${data.notifications.length} notifications`);
  return data.notifications;
}

const TYPE_WEIGHT = {
  Placement: 300,
  Result: 200,
  Event: 100,
};

function scoreNotification(notification) {
  const typeScore = TYPE_WEIGHT[notification.Type] ?? 0;
  const timestamp = new Date(notification.Timestamp).getTime();
  return { ...notification, _typeScore: typeScore, _timestamp: timestamp };
}

async function getTopNPriorityNotifications(token, n = 10) {
  await Log("getTopNPriorityNotifications", "INFO", "priorityInbox", `Computing top ${n} priority notifications`);

  const notifications = await fetchNotifications(token);

  const scored = notifications.map(scoreNotification);

  scored.sort((a, b) => {
    if (b._typeScore !== a._typeScore) return b._typeScore - a._typeScore;
    return b._timestamp - a._timestamp; // more recent first
  });

  const topN = scored.slice(0, n).map(({ _typeScore, _timestamp, ...rest }) => rest);

  await Log("getTopNPriorityNotifications", "INFO", "priorityInbox", `Top ${n} notifications computed successfully`);

  return topN;
}
async function main() {
  console.log("=== Campus Notification Platform — Stage 1: Priority Inbox ===\n");

  try {
    const token = "Your_Bearer_Token";
    const top10 = await getTopNPriorityNotifications(token, 10);

    console.log("\n=== Top 10 Priority Notifications ===\n");
    top10.forEach((n, i) => {
      console.log(`${i + 1}. [${n.Type}] ${n.Message} — ${n.Timestamp}`);
    });

    await Log("main", "INFO", "priorityInbox", "Stage 1 completed successfully");
  } catch (err) {
    await Log("main", "ERROR", "priorityInbox", `Fatal error in main: ${err.message}`);
    console.error("\nError:", err.message);
    process.exit(1);
  }
}

main();
