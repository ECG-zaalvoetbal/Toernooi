import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Calendar, BarChart3, ArrowLeft, Edit, Timer } from 'lucide-react';
import MatchSchedule from './MatchSchedule';
import Standings from './Standings';
import MatchTimer from './MatchTimer';

const Dashboard = ({ tournament, onUpdateScore, onBackToList, onEditTournament }) => {
  const [activeTab, setActiveTab] = useState('matches');
  
  const completedMatches = tournament.matches.filter(m => m.status === 'completed').length;
  const totalMatches = tournament.matches.length;
  const progressPercentage = (completedMatches / totalMatches) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBackToList}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to List
              </Button>
              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{tournament.name}</h1>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onEditTournament}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  {tournament.teams.length} teams • {tournament.format === 'double' ? 'Double' : 'Single'} Round Robin
                </p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="text-right w-full sm:w-auto">
              <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                Progress: {completedMatches} / {totalMatches} matches
              </div>
              <div className="w-full sm:w-48 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              {progressPercentage === 100 && (
                <div className="text-xs sm:text-sm text-green-600 font-medium mt-1">
                  Tournament Complete! 🏆
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-96 mx-auto">
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Matches</span>
              <span className="sm:hidden">Games</span>
            </TabsTrigger>
            <TabsTrigger value="standings" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Standings</span>
              <span className="sm:hidden">Table</span>
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="hidden sm:inline">Timer</span>
              <span className="sm:hidden">Timer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            <MatchSchedule 
              matches={tournament.matches}
              onUpdateScore={onUpdateScore}
            />
          </TabsContent>

          <TabsContent value="standings" className="space-y-6">
            <Standings 
              standings={tournament.standings}
              matches={tournament.matches}
            />
          </TabsContent>

          <TabsContent value="timer" className="space-y-6">
            <MatchTimer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;