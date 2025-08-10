import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import TournamentSetup from "./components/TournamentSetup";
import Dashboard from "./components/Dashboard";
import TournamentList from "./components/TournamentList";

function App() {
  const [currentTournament, setCurrentTournament] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'setup', 'dashboard'

  useEffect(() => {
    // Load tournaments from localStorage on app start
    const savedTournaments = localStorage.getItem('tournaments');
    if (savedTournaments) {
      setTournaments(JSON.parse(savedTournaments));
    }
  }, []);

  useEffect(() => {
    // Save tournaments to localStorage whenever tournaments change
    localStorage.setItem('tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  const handleTournamentCreate = (tournament) => {
    const newTournament = {
      ...tournament,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      matches: generateMatches(tournament.teams, tournament.format, tournament.shuffleRounds),
      standings: generateInitialStandings(tournament.teams)
    };
    
    setTournaments(prev => [...prev, newTournament]);
    setCurrentTournament(newTournament);
    setCurrentView('dashboard');
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateMatches = (teams, format, shuffleRounds = false) => {
    const matches = [];
    let matchId = 1;
    const rounds = format === 'double' ? 2 : 1;
    
    for (let cycle = 0; cycle < rounds; cycle++) {
      const numTeams = teams.length;
      const isEven = numTeams % 2 === 0;
      const totalRounds = isEven ? numTeams - 1 : numTeams;
      
      const teamsForRotation = isEven ? teams.slice(1) : [...teams];
      const fixedTeam = isEven ? teams[0] : null;
      
      let roundMatches = [];
      
      for (let round = 0; round < totalRounds; round++) {
        const currentRoundMatches = [];
        
        if (isEven) {
          const rotatingIndex = round % teamsForRotation.length;
          currentRoundMatches.push({
            home: fixedTeam,
            away: teamsForRotation[rotatingIndex]
          });
          
          for (let i = 1; i < teamsForRotation.length / 2; i++) {
            const homeIndex = (round + i) % teamsForRotation.length;
            const awayIndex = (round - i + teamsForRotation.length) % teamsForRotation.length;
            
            currentRoundMatches.push({
              home: teamsForRotation[homeIndex],
              away: teamsForRotation[awayIndex]
            });
          }
        } else {
          const sittingOutIndex = round % numTeams;
          const playingTeams = teams.filter((_, index) => index !== sittingOutIndex);
          
          for (let i = 0; i < playingTeams.length / 2; i++) {
            const homeIndex = (round + i) % playingTeams.length;
            const awayIndex = (round - i - 1 + playingTeams.length) % playingTeams.length;
            
            if (homeIndex !== awayIndex) {
              currentRoundMatches.push({
                home: playingTeams[homeIndex],
                away: playingTeams[awayIndex]
              });
            }
          }
        }
        
        roundMatches.push({
          round: round + 1 + (cycle * totalRounds),
          matches: currentRoundMatches
        });
      }
      
      // Shuffle rounds if requested
      if (shuffleRounds) {
        roundMatches = shuffleArray(roundMatches).map((roundData, index) => ({
          ...roundData,
          round: index + 1 + (cycle * totalRounds)
        }));
      }
      
      // Add matches to the main list
      roundMatches.forEach(({ round, matches: currentRoundMatches }) => {
        currentRoundMatches.forEach(({ home, away }) => {
          matches.push({
            id: matchId++,
            round: round,
            homeTeam: home,
            awayTeam: away,
            homeScore: null,
            awayScore: null,
            status: 'pending',
            date: null
          });
        });
      });
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
    const updatedTournament = {
      ...currentTournament,
      matches: currentTournament.matches.map(match => 
        match.id === matchId 
          ? { ...match, homeScore, awayScore, status: 'completed' }
          : match
      )
    };
    
    updatedTournament.standings = calculateStandings(updatedTournament.matches, updatedTournament.teams);
    
    setCurrentTournament(updatedTournament);
    setTournaments(prev => prev.map(t => t.id === updatedTournament.id ? updatedTournament : t));
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

  const handleTournamentSelect = (tournament) => {
    setCurrentTournament(tournament);
    setCurrentView('dashboard');
  };

  const handleTournamentEdit = (tournament) => {
    setCurrentTournament(tournament);
    setCurrentView('setup');
  };

  const handleTournamentDelete = (tournamentId) => {
    setTournaments(prev => prev.filter(t => t.id !== tournamentId));
    if (currentTournament && currentTournament.id === tournamentId) {
      setCurrentTournament(null);
      setCurrentView('list');
    }
  };

  const handleTournamentUpdate = (updatedTournament) => {
    const tournament = {
      ...updatedTournament,
      id: currentTournament.id,
      createdAt: currentTournament.createdAt,
      matches: generateMatches(updatedTournament.teams, updatedTournament.format, updatedTournament.shuffleRounds),
      standings: generateInitialStandings(updatedTournament.teams)
    };
    
    setTournaments(prev => prev.map(t => t.id === tournament.id ? tournament : t));
    setCurrentTournament(tournament);
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'setup':
        return (
          <TournamentSetup 
            onTournamentCreate={currentTournament ? handleTournamentUpdate : handleTournamentCreate}
            onBack={() => setCurrentView('list')}
            editingTournament={currentTournament}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            tournament={currentTournament}
            onUpdateScore={updateMatchScore}
            onBackToList={() => {
              setCurrentTournament(null);
              setCurrentView('list');
            }}
            onEditTournament={() => setCurrentView('setup')}
          />
        );
      case 'list':
      default:
        return (
          <TournamentList 
            tournaments={tournaments}
            onTournamentSelect={handleTournamentSelect}
            onTournamentEdit={handleTournamentEdit}
            onTournamentDelete={handleTournamentDelete}
            onCreateNew={() => {
              setCurrentTournament(null);
              setCurrentView('setup');
            }}
          />
        );
    }
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={renderCurrentView()} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;