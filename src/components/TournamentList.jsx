import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Calendar, Users, Edit, Trash2, Plus, Play } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const TournamentList = ({ 
  tournaments, 
  onTournamentSelect, 
  onTournamentEdit, 
  onTournamentDelete, 
  onCreateNew 
}) => {
  const { toast } = useToast();

  const handleDelete = (tournament) => {
    if (window.confirm(`Are you sure you want to delete "${tournament.name}"? This action cannot be undone.`)) {
      onTournamentDelete(tournament.id);
      toast({
        title: "Tournament deleted",
        description: `${tournament.name} has been removed.`,
        variant: "destructive",
      });
    }
  };

  const getCompletionStatus = (tournament) => {
    const completed = tournament.matches.filter(m => m.status === 'completed').length;
    const total = tournament.matches.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tournament Manager</h1>
          <p className="text-gray-600">Manage your soccer tournaments</p>
        </div>

        {/* Create New Tournament Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={onCreateNew}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Tournament
          </Button>
        </div>

        {/* Tournament List */}
        {tournaments.length === 0 ? (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center p-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tournaments Yet</h3>
              <p className="text-gray-500 mb-6">Create your first tournament to get started!</p>
              <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Tournament
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => {
              const status = getCompletionStatus(tournament);
              return (
                <Card key={tournament.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="w-5 h-5" />
                      {tournament.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-blue-100 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {tournament.teams.length} teams
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(tournament.createdAt)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 space-y-4">
                    {/* Tournament Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Format:</span>
                        <Badge variant="secondary">
                          {tournament.format === 'double' ? 'Double' : 'Single'} Round Robin
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progress:</span>
                        <span className="text-sm font-medium">
                          {status.completed}/{status.total} matches
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${status.percentage}%` }}
                        />
                      </div>
                      
                      {status.percentage === 100 && (
                        <Badge className="w-full justify-center bg-green-100 text-green-800">
                          Tournament Complete!
                        </Badge>
                      )}
                    </div>

                    {/* Team Preview */}
                    <div>
                      <span className="text-sm text-gray-600 mb-2 block">Teams:</span>
                      <div className="flex flex-wrap gap-1">
                        {tournament.teams.slice(0, 4).map((team, index) => (
                          <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: team.color }}
                            />
                            {team.name}
                          </div>
                        ))}
                        {tournament.teams.length > 4 && (
                          <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                            +{tournament.teams.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => onTournamentSelect(tournament)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      
                      <Button 
                        onClick={() => onTournamentEdit(tournament)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        onClick={() => handleDelete(tournament)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentList;