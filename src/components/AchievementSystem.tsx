import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Target, TrendingUp, Award, Crown, Medal } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  condition: (data: AchievementSystemProps) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
}

interface AchievementSystemProps {
  courses: Course[];
  currentCGPA: number;
  scale: '4.0' | '5.0';
  previousCGPA?: number;
  consecutiveImprovement: number;
  totalCredits: number;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  courses,
  currentCGPA,
  scale,
  previousCGPA,
  consecutiveImprovement,
  totalCredits,
}) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<Achievement | null>(null);

  // Define all possible achievements
  const achievements: Achievement[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Added your first course to track',
      icon: <Star className="w-6 h-6" />,
      condition: ({ courses }) => courses.length > 0,
      rarity: 'common',
      points: 10,
    },
    {
      id: 'honor-roll',
      title: 'Honor Roll',
      description: 'Achieved a CGPA above 3.5',
      icon: <Trophy className="w-6 h-6" />,
      condition: ({ currentCGPA }) => currentCGPA >= 3.5,
      rarity: 'rare',
      points: 50,
    },
    {
      id: 'perfect-score',
      title: 'Perfect Score',
      description: 'Got an A in any course',
      icon: <Crown className="w-6 h-6" />,
      condition: ({ courses }) => courses.some(course => course.grade === 'A'),
      rarity: 'rare',
      points: 30,
    },
    {
      id: 'improvement-streak',
      title: 'Rising Star',
      description: 'Improved CGPA for 3 consecutive updates',
      icon: <TrendingUp className="w-6 h-6" />,
      condition: ({ consecutiveImprovement }) => consecutiveImprovement >= 3,
      rarity: 'epic',
      points: 100,
    },
    {
      id: 'credit-master',
      title: 'Credit Master',
      description: 'Completed over 60 credit units',
      icon: <Award className="w-6 h-6" />,
      condition: ({ totalCredits }) => totalCredits >= 60,
      rarity: 'epic',
      points: 75,
    },
    {
      id: 'deans-list',
      title: "Dean's List",
      description: 'Maintained a CGPA of 4.0 or higher',
      icon: <Medal className="w-6 h-6" />,
      condition: ({ currentCGPA }) => currentCGPA >= 4.0,
      rarity: 'legendary',
      points: 150,
    },
    {
      id: 'consistency',
      title: 'Consistent Performer',
      description: 'Maintained same or higher CGPA for 5 updates',
      icon: <Zap className="w-6 h-6" />,
      condition: ({ consecutiveImprovement }) => consecutiveImprovement >= 5,
      rarity: 'legendary',
      points: 200,
    },
  ];

  // Check for newly unlocked achievements
  useEffect(() => {
    const checkAchievements = () => {
      const props = {
        courses,
        currentCGPA,
        scale,
        previousCGPA,
        consecutiveImprovement,
        totalCredits,
      };

      achievements.forEach(achievement => {
        const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
        const shouldUnlock = achievement.condition(props);

        if (!isUnlocked && shouldUnlock) {
          const newAchievement = { ...achievement, unlockedAt: new Date() };
          setUnlockedAchievements(prev => [...prev, newAchievement]);
          setTotalPoints(prev => prev + achievement.points);
          setShowNotification(newAchievement);
        }
      });
    };

    checkAchievements();
  }, [courses, currentCGPA, consecutiveImprovement, totalCredits]);

  // Hide notification after 3 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 bg-gray-100';
      case 'rare':
        return 'text-blue-600 bg-blue-100';
      case 'epic':
        return 'text-purple-600 bg-purple-100';
      case 'legendary':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="mt-8 p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Achievements</h3>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <span className="font-bold text-lg text-gray-800">{totalPoints} pts</span>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(achievement => {
          const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
          const colorClass = getRarityColor(achievement.rarity);

          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg ${
                isUnlocked ? colorClass : 'bg-gray-100 opacity-50'
              } transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`${isUnlocked ? '' : 'text-gray-400'}`}>
                  {achievement.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {isUnlocked && (
                    <div className="mt-1 text-xs text-gray-500">
                      +{achievement.points} points
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg animate-slide-up">
          <div className="flex items-center gap-3">
            <div className={getRarityColor(showNotification.rarity)}>
              {showNotification.icon}
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Achievement Unlocked!</h4>
              <p className="text-sm text-gray-600">{showNotification.title}</p>
              <p className="text-xs text-gray-500">+{showNotification.points} points</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Your Progress</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {unlockedAchievements.length}
            </div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {consecutiveImprovement}
            </div>
            <div className="text-sm text-gray-600">Improvement Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{totalCredits}</div>
            <div className="text-sm text-gray-600">Credit Units</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;
