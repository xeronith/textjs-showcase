export function GET(): Response {
  return Response.json({
    rps: 900 + Math.random() * 300,
    p99: 90 + Math.random() * 80,
    errorRate: Math.random() * 0.02,
    at: new Date().toISOString(),
  });
}
