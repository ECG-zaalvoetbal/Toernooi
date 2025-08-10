import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Calendar, BarChart3, ArrowLeft } from 'lucide-react';
import MatchSchedule from './MatchSchedule';
import Standings from './Standings';

const Dashboard = ({ tournament, onUpdateScore, onBackToSetup }) => {
  const [activeTab, setActiveTab] = useState('matches');
  
  const completedMatches = tournament.matches.filter(m => m.status === 'completed').length;
  const totalMatches = tournament.matches.length;
  const progressPercentage = (completedMatches / totalMatches) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBackToSetup}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Setup
              </Button>
              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">{tournament.name}</h1>
                </div>
                <p className="text-sm text-gray-600">
                  {tournament.teams.length} teams • {tournament.format === 'double' ? 'Double' : 'Single'} Round Robin
                </p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600 mb-1">
                Progress: {completedMatches} / {totalMatches} matches
              </div>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96 mx-auto">
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Matches
            </TabsTrigger>
            <TabsTrigger value="standings" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Standings
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
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;