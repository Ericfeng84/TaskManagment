import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Avatar component that displays image or initials
const Avatar: React.FC<{ user: any; size?: string }> = ({ user, size = "h-8 w-8" }) => {
  if (user.avatar) {
    return (
      <img
        className={`inline-block ${size} rounded-full ring-2 ring-white`}
        src={user.avatar}
        alt={`${user.name}'s avatar`}
      />
    );
  }
  
  const initials = getInitials(user.name);
  const colors = ['bg-purple-200 text-purple-800', 'bg-green-200 text-green-800', 'bg-red-200 text-red-800', 'bg-blue-200 text-blue-800', 'bg-yellow-200 text-yellow-800'];
  const colorClass = user.id ? colors[user.id.charCodeAt(0) % colors.length] : 'bg-gray-200 text-gray-800';
  
  return (
    <div
      className={`inline-flex ${size} rounded-full items-center justify-center text-sm font-medium ${colorClass}`}
      title={user.name}
    >
      {initials}
    </div>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const completedTasks = project.tasks?.filter(task => task.status === 'DONE').length || 0;
  const totalTasks = project.tasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get project members (include owner and members)
  const allMembers = [project.owner, ...project.members.map(member => member.user)];
  const uniqueMembers = allMembers.filter((member, index, self) =>
    index === self.findIndex((m) => (
      m.id === member.id
    ))
  );
  
  // Limit to 3 avatars
  const displayedMembers = uniqueMembers.slice(0, 3);
  const remainingCount = uniqueMembers.length > 3 ? uniqueMembers.length - 3 : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 mb-6 h-12 overflow-hidden">{project.description}</p>
        
        <div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">任务进度</span>
            <div className="text-sm text-gray-600">
              <span className="font-bold">{completedTasks}</span>
              <span className="text-gray-400"> / {totalTasks}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="flex space-x-2">
          {displayedMembers.map((member, index) => (
            <Avatar key={`${member.id}-${index}`} user={member} />
          ))}
          {remainingCount > 0 && (
            <div className="inline-flex h-8 w-8 rounded-full bg-gray-200 items-center justify-center text-gray-700 text-sm font-medium">
              +{remainingCount}
            </div>
          )}
        </div>
        <Link
          to={`/projects/${project.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm"
        >
          进入看板
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;