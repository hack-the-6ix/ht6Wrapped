// TODO: Replace stub with real DB query when HACKATHON_DB_URL is available.
// Expected query shape:
//   SELECT activity_name FROM attendances WHERE email = $1
// Connect via postgres/pg using process.env.HACKATHON_DB_URL

export async function getActivitiesForUser(_email: string): Promise<string[]> {
  return []
}
