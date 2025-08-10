import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar, Clock, Edit, Check, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const MatchSchedule = ({ matches, onUpdateScore }) => {
  const [editingMatch, setEditingMatch] = useState(null);
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const groupedMatches = matches.reduce((acc, match) => {
    const round = `Round ${match.round}`;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {});

  const handleEditScore = (match) => {
    setEditingMatch(match);
    setHomeScore(match.homeScore?.toString() || '');
    setAwayScore(match.awayScore?.toString() || '');
    setIsDialogOpen(true);
  };

  const handleSaveScore = () => {
    const home = parseInt(homeScore);
    const away = parseInt(awayScore);

    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      toast({
        title: "Invalid score",
        description: "Please enter valid non-negative numbers for both scores.",
        variant: "destructive",
      });
      return;
    }

    onUpdateScore(editingMatch.id, home, away);
    setIsDialogOpen(false);
    setEditingMatch(null);
    setHomeScore('');
    setAwayScore('');
    
    toast({
      title: "Score updated",
      description: `${editingMatch.homeTeam.name} ${home} - ${away} ${editingMatch.awayTeam.name}`,
    });
  };

  const getMatchStatusBadge = (match) => {
    if (match.status === 'completed') {
      return <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Completed</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Pending</Badge>;
  };

  const getMatchResult = (match) => {
    if (match.status === 'completed') {
      return `${match.homeScore} - ${match.awayScore}`;
    }
    return 'vs';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Schedule</h2>
        <p className="text-gray-600">Click on any match to enter or edit scores</p>
      </div>

      {Object.entries(groupedMatches).map(([round, roundMatches]) => (
        <Card key={round} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              {round}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {roundMatches.map((match) => (
                <div 
                  key={match.id}
                  className="p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => handleEditScore(match)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-gray-500 font-medium w-8 sm:w-16 flex-shrink-0">
                        #{match.id}
                      </div>
                      
                      <div className="flex items-center gap-1 sm:gap-4 flex-1 min-w-0">
                        {/* Home Team */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                          <div 
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: match.homeTeam.color }}
                          />
                          <span className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {match.homeTeam.name}
                          </span>
                        </div>

                        {/* Score */}
                        <div className="text-center flex-shrink-0 px-2">
                          <span className="text-lg sm:text-xl font-bold text-gray-900">
                            {getMatchResult(match)}
                          </span>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 justify-end">
                          <span className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {match.awayTeam.name}
                          </span>
                          <div 
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: match.awayTeam.color }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                      {getMatchStatusBadge(match)}
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>

                  {match.date && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mt-2 ml-10 sm:ml-20">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      {new Date(match.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Score Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Enter Match Score</DialogTitle>
            <DialogDescription>
              {editingMatch && (
                <span>
                  {editingMatch.homeTeam.name} vs {editingMatch.awayTeam.name}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {editingMatch && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                      style={{ backgroundColor: editingMatch.homeTeam.color }}
                    />
                    <span className="font-medium text-xs sm:text-sm">{editingMatch.homeTeam.name}</span>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    value={homeScore}
                    onChange={(e) => setHomeScore(e.target.value)}
                    placeholder="0"
                    className="text-center text-lg"
                  />
                </div>
                
                <div className="text-center text-xl sm:text-2xl font-bold text-gray-400">
                  -
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                      style={{ backgroundColor: editingMatch.awayTeam.color }}
                    />
                    <span className="font-medium text-xs sm:text-sm">{editingMatch.awayTeam.name}</span>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    value={awayScore}
                    onChange={(e) => setAwayScore(e.target.value)}
                    placeholder="0"
                    className="text-center text-lg"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveScore}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Score
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MatchSchedule;