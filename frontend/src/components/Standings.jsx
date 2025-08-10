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
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />;
      default:
        return <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-gray-400 font-bold text-xs sm:text-sm">{position}</div>;
    }
  };

  const getPositionBadge = (position) => {
    const baseClass = "text-xs px-1.5 py-0.5";
    if (position === 1) return <Badge className={`bg-yellow-500 text-white ${baseClass}`}>1st</Badge>;
    if (position === 2) return <Badge className={`bg-gray-500 text-white ${baseClass}`}>2nd</Badge>;
    if (position === 3) return <Badge className={`bg-amber-600 text-white ${baseClass}`}>3rd</Badge>;
    return <Badge variant="outline" className={baseClass}>{position}th</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tournament Standings</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <p className="text-gray-600 text-sm sm:text-base">
            {completedMatches} of {totalMatches} matches completed
          </p>
          <div className="w-32 sm:w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5" />
            League Table
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Pos</th>
                  <th className="text-left p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Team</th>
                  <th className="text-center p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">P</th>
                  <th className="text-center p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">W</th>
                  <th className="text-center p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">D</th>
                  <th className="text-center p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">L</th>
                  <th className="text-center p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">GF</th>
                  <th className="text-center p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">GA</th>
                  <th className="text-center p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">GD</th>
                  <th className="text-center p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm">Pts</th>
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
                    <td className="p-2 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        {getPositionIcon(index + 1)}
                        <div className="hidden sm:block">
                          {getPositionBadge(index + 1)}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-3">
                        <div 
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: team.team.color }}
                        />
                        <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                          {team.team.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-center p-2 sm:p-4 text-gray-600 text-xs sm:text-sm">{team.played}</td>
                    <td className="text-center p-2 sm:p-4 text-green-600 font-medium text-xs sm:text-sm">{team.wins}</td>
                    <td className="text-center p-2 sm:p-4 text-yellow-600 font-medium text-xs sm:text-sm">{team.draws}</td>
                    <td className="text-center p-2 sm:p-4 text-red-600 font-medium text-xs sm:text-sm">{team.losses}</td>
                    <td className="text-center p-2 sm:p-4 text-gray-700 text-xs sm:text-sm hidden sm:table-cell">{team.goalsFor}</td>
                    <td className="text-center p-2 sm:p-4 text-gray-700 text-xs sm:text-sm hidden sm:table-cell">{team.goalsAgainst}</td>
                    <td className={`text-center p-2 sm:p-4 font-medium text-xs sm:text-sm ${
                      team.goalDifference > 0 ? 'text-green-600' :
                      team.goalDifference < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                    </td>
                    <td className="text-center p-2 sm:p-4">
                      <span className="font-bold text-sm sm:text-lg text-blue-600">
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
        <CardContent className="p-3 sm:p-4">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Scoring System</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
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