import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Trophy, Users, Settings, Play } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const DEFAULT_TEAMS = [
  { name: 'Orange', color: '#f97316' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Green', color: '#22c55e' },
  { name: 'Grey', color: '#6b7280' },
  { name: 'Team 5', color: '#8b5cf6' },
  { name: 'Team 6', color: '#f59e0b' }
];

const TournamentSetup = ({ onTournamentCreate }) => {
  const [tournamentName, setTournamentName] = useState('');
  const [numTeams, setNumTeams] = useState(4);
  const [format, setFormat] = useState('single');
  const [teams, setTeams] = useState(DEFAULT_TEAMS.slice(0, 4));
  const { toast } = useToast();

  const handleNumTeamsChange = (value) => {
    const num = parseInt(value);
    setNumTeams(num);
    setTeams(DEFAULT_TEAMS.slice(0, num));
  };

  const handleTeamNameChange = (index, newName) => {
    if (newName.trim() === '') return;
    setTeams(prev => prev.map((team, i) => 
      i === index ? { ...team, name: newName } : team
    ));
  };

  const handleCreateTournament = () => {
    if (!tournamentName.trim()) {
      toast({
        title: "Tournament name required",
        description: "Please enter a name for your tournament.",
        variant: "destructive",
      });
      return;
    }

    const duplicateNames = teams.filter((team, index, arr) => 
      arr.findIndex(t => t.name.toLowerCase() === team.name.toLowerCase()) !== index
    );

    if (duplicateNames.length > 0) {
      toast({
        title: "Duplicate team names",
        description: "Each team must have a unique name.",
        variant: "destructive",
      });
      return;
    }

    onTournamentCreate({
      name: tournamentName,
      teams,
      format,
      numTeams
    });

    toast({
      title: "Tournament created!",
      description: `${tournamentName} is ready to start.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tournament Manager</h1>
          <p className="text-gray-600">Create and manage your soccer tournament</p>
        </div>

        {/* Main Setup Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Tournament Setup
            </CardTitle>
            <CardDescription className="text-blue-100">
              Configure your tournament settings and teams
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Tournament Name */}
            <div className="space-y-2">
              <Label htmlFor="tournament-name" className="text-sm font-medium text-gray-700">
                Tournament Name
              </Label>
              <Input
                id="tournament-name"
                placeholder="Enter tournament name..."
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Number of Teams */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Number of Teams
              </Label>
              <Select value={numTeams.toString()} onValueChange={handleNumTeamsChange}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Teams
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Tournament Format
              </Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Round Robin</SelectItem>
                  <SelectItem value="double">Double Round Robin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {format === 'single' 
                  ? 'Each team plays every other team once'
                  : 'Each team plays every other team twice'
                }
              </p>
            </div>

            {/* Team Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <Label className="text-sm font-medium text-gray-700">
                  Team Names
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map((team, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: team.color }}
                    />
                    <Input
                      value={team.name}
                      onChange={(e) => handleTeamNameChange(index, e.target.value)}
                      placeholder={`Team ${index + 1} name`}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tournament Summary */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Tournament Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Teams:</span>
                  <Badge variant="secondary" className="ml-2">{numTeams}</Badge>
                </div>
                <div>
                  <span className="text-gray-600">Total Matches:</span>
                  <Badge variant="secondary" className="ml-2">
                    {format === 'double' 
                      ? numTeams * (numTeams - 1) 
                      : (numTeams * (numTeams - 1)) / 2
                    }
                  </Badge>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <Button 
              onClick={handleCreateTournament}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Create Tournament
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentSetup;