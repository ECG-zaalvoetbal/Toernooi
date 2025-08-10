import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import TournamentSetup from "./components/TournamentSetup";
import Dashboard from "./components/Dashboard";
import mockTournaments from "./mock/mockTournaments";

function App() {
  const [currentTournament, setCurrentTournament] = useState(null);
  const [tournaments, setTournaments] = useState(mockTournaments);

  const handleTournamentCreate = (tournament) => {
    const newTournament = {
      ...tournament,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      matches: generateMatches(tournament.teams, tournament.format),
      standings: generateInitialStandings(tournament.teams)
    };
    
    setTournaments(prev => [...prev, newTournament]);
    setCurrentTournament(newTournament);
  };

  const generateMatches = (teams, format) => {
    const matches = [];
    let matchId = 1;
    const rounds = format === 'double' ? 2 : 1;
    
    for (let cycle = 0; cycle < rounds; cycle++) {
      // Generate balanced round-robin schedule
      const numTeams = teams.length;
      const isEven = numTeams % 2 === 0;
      const totalRounds = isEven ? numTeams - 1 : numTeams;
      
      // Create a fixed position for one team (if even number of teams)
      const teamsForRotation = isEven ? teams.slice(1) : [...teams];
      const fixedTeam = isEven ? teams[0] : null;
      
      for (let round = 0; round < totalRounds; round++) {
        const roundMatches = [];
        
        if (isEven) {
          // Pair fixed team with rotating team
          const rotatingIndex = round % teamsForRotation.length;
          roundMatches.push({
            home: fixedTeam,
            away: teamsForRotation[rotatingIndex]
          });
          
          // Pair remaining teams
          for (let i = 1; i < teamsForRotation.length / 2; i++) {
            const homeIndex = (round + i) % teamsForRotation.length;
            const awayIndex = (round - i + teamsForRotation.length) % teamsForRotation.length;
            
            roundMatches.push({
              home: teamsForRotation[homeIndex],
              away: teamsForRotation[awayIndex]
            });
          }
        } else {
          // For odd number of teams, one team sits out each round
          const sittingOutIndex = round % numTeams;
          const playingTeams = teams.filter((_, index) => index !== sittingOutIndex);
          
          for (let i = 0; i < playingTeams.length / 2; i++) {
            const homeIndex = (round + i) % playingTeams.length;
            const awayIndex = (round - i - 1 + playingTeams.length) % playingTeams.length;
            
            if (homeIndex !== awayIndex) {
              roundMatches.push({
                home: playingTeams[homeIndex],
                away: playingTeams[awayIndex]
              });
            }
          }
        }
        
        // Add matches to the main list
        roundMatches.forEach(({ home, away }) => {
          matches.push({
            id: matchId++,
            round: round + 1 + (cycle * totalRounds),
            homeTeam: home,
            awayTeam: away,
            homeScore: null,
            awayScore: null,
            status: 'pending',
            date: null
          });
        });
      }
    }
    
    return matches;
  };

  const generateInitialStandings = (teams) => {
    return teams.map(team => ({
      team,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    }));
  };

  const updateMatchScore = (matchId, homeScore, awayScore) => {
    setCurrentTournament(prev => {
      const updatedMatches = prev.matches.map(match => 
        match.id === matchId 
          ? { ...match, homeScore, awayScore, status: 'completed' }
          : match
      );
      
      const updatedStandings = calculateStandings(updatedMatches, prev.teams);
      
      return {
        ...prev,
        matches: updatedMatches,
        standings: updatedStandings
      };
    });
  };

  const calculateStandings = (matches, teams) => {
    const standings = teams.map(team => ({
      team,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    }));

    matches.forEach(match => {
      if (match.status === 'completed') {
        const homeTeamData = standings.find(s => s.team.name === match.homeTeam.name);
        const awayTeamData = standings.find(s => s.team.name === match.awayTeam.name);
        
        homeTeamData.played++;
        awayTeamData.played++;
        homeTeamData.goalsFor += match.homeScore;
        homeTeamData.goalsAgainst += match.awayScore;
        awayTeamData.goalsFor += match.awayScore;
        awayTeamData.goalsAgainst += match.homeScore;

        if (match.homeScore > match.awayScore) {
          homeTeamData.wins++;
          homeTeamData.points += 3;
          awayTeamData.losses++;
        } else if (match.homeScore < match.awayScore) {
          awayTeamData.wins++;
          awayTeamData.points += 3;
          homeTeamData.losses++;
        } else {
          homeTeamData.draws++;
          awayTeamData.draws++;
          homeTeamData.points += 1;
          awayTeamData.points += 1;
        }
      }
    });

    standings.forEach(team => {
      team.goalDifference = team.goalsFor - team.goalsAgainst;
    });

    return standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              currentTournament ? (
                <Dashboard 
                  tournament={currentTournament}
                  onUpdateScore={updateMatchScore}
                  onBackToSetup={() => setCurrentTournament(null)}
                />
              ) : (
                <TournamentSetup onTournamentCreate={handleTournamentCreate} />
              )
            } 
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;