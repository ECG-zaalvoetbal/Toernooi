// Mock tournament data for development and testing
const mockTournaments = [
  {
    id: "1",
    name: "Premier League Cup",
    createdAt: "2025-01-01T10:00:00Z",
    format: "single",
    numTeams: 4,
    teams: [
      { name: "Manchester Blue", color: "#3b82f6" },
      { name: "Liverpool Red", color: "#ef4444" },
      { name: "Arsenal Green", color: "#22c55e" },
      { name: "Chelsea White", color: "#6b7280" }
    ],
    matches: [
      {
        id: 1,
        round: 1,
        homeTeam: { name: "Manchester Blue", color: "#3b82f6" },
        awayTeam: { name: "Liverpool Red", color: "#ef4444" },
        homeScore: 2,
        awayScore: 1,
        status: "completed",
        date: "2025-01-15T15:00:00Z"
      },
      {
        id: 2,
        round: 1,
        homeTeam: { name: "Arsenal Green", color: "#22c55e" },
        awayTeam: { name: "Chelsea White", color: "#6b7280" },
        homeScore: null,
        awayScore: null,
        status: "pending",
        date: null
      },
      {
        id: 3,
        round: 2,
        homeTeam: { name: "Manchester Blue", color: "#3b82f6" },
        awayTeam: { name: "Arsenal Green", color: "#22c55e" },
        homeScore: null,
        awayScore: null,
        status: "pending",
        date: null
      },
      {
        id: 4,
        round: 2,
        homeTeam: { name: "Liverpool Red", color: "#ef4444" },
        awayTeam: { name: "Chelsea White", color: "#6b7280" },
        homeScore: null,
        awayScore: null,
        status: "pending",
        date: null
      },
      {
        id: 5,
        round: 3,
        homeTeam: { name: "Manchester Blue", color: "#3b82f6" },
        awayTeam: { name: "Chelsea White", color: "#6b7280" },
        homeScore: null,
        awayScore: null,
        status: "pending",
        date: null
      },
      {
        id: 6,
        round: 3,
        homeTeam: { name: "Liverpool Red", color: "#ef4444" },
        awayTeam: { name: "Arsenal Green", color: "#22c55e" },
        homeScore: null,
        awayScore: null,
        status: "pending",
        date: null
      }
    ],
    standings: [
      {
        team: { name: "Manchester Blue", color: "#3b82f6" },
        played: 1,
        wins: 1,
        draws: 0,
        losses: 0,
        goalsFor: 2,
        goalsAgainst: 1,
        goalDifference: 1,
        points: 3
      },
      {
        team: { name: "Liverpool Red", color: "#ef4444" },
        played: 1,
        wins: 0,
        draws: 0,
        losses: 1,
        goalsFor: 1,
        goalsAgainst: 2,
        goalDifference: -1,
        points: 0
      },
      {
        team: { name: "Arsenal Green", color: "#22c55e" },
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      },
      {
        team: { name: "Chelsea White", color: "#6b7280" },
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      }
    ]
  }
];

export default mockTournaments;