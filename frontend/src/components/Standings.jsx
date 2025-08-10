import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

const Standings = ({ standings, matches }) => {
  const totalMatches = matches.length;
  const completedMatches = matches.filter(m => m.status === 'completed').length;
  const progressPercentage = (completedMatches / totalMatches) * 100;

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold text-sm">{position}</div>;
    }
  };

  const getPositionBadge = (position) => {
    if (position === 1) return <Badge className="bg-yellow-500 text-white">1st</Badge>;
    if (position === 2) return <Badge className="bg-gray-500 text-white">2nd</Badge>;
    if (position === 3) return <Badge className="bg-amber-600 text-white">3rd</Badge>;
    return <Badge variant="outline">{position}th</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tournament Standings</h2>
        <div className="flex items-center justify-center gap-4">
          <p className="text-gray-600">
            {completedMatches} of {totalMatches} matches completed
          </p>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            League Table
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700 text-sm">Pos</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-sm">Team</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">P</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">W</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">D</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">L</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">GF</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">GA</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">GD</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, index) => (
                  <tr 
                    key={team.team.name}
                    className={`
                      border-b hover:bg-gray-50 transition-colors
                      ${index === 0 ? 'bg-yellow-50 border-yellow-200' : ''}
                      ${index === 1 ? 'bg-gray-50 border-gray-200' : ''}
                      ${index === 2 ? 'bg-amber-50 border-amber-200' : ''}
                    `}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getPositionIcon(index + 1)}
                        {getPositionBadge(index + 1)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: team.team.color }}
                        />
                        <span className="font-medium text-gray-900">
                          {team.team.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-center p-4 text-gray-600">{team.played}</td>
                    <td className="text-center p-4 text-green-600 font-medium">{team.wins}</td>
                    <td className="text-center p-4 text-yellow-600 font-medium">{team.draws}</td>
                    <td className="text-center p-4 text-red-600 font-medium">{team.losses}</td>
                    <td className="text-center p-4 text-gray-700">{team.goalsFor}</td>
                    <td className="text-center p-4 text-gray-700">{team.goalsAgainst}</td>
                    <td className={`text-center p-4 font-medium ${
                      team.goalDifference > 0 ? 'text-green-600' :
                      team.goalDifference < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-lg text-blue-600">
                        {team.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Points System Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Scoring System</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Win: 3 points</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">Draw: 1 point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Loss: 0 points</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Standings;