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
    
    for (let round = 0; round < rounds; round++) {
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          matches.push({
            id: matchId++,
            round: round + 1,
            homeTeam: teams[i],
            awayTeam: teams[j],
            homeScore: null,
            awayScore: null,
            status: 'pending',
            date: null
          });
        }
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