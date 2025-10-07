import React, { useState, useEffect } from 'react';
import { TaskHistory, User } from '../types';
import { tasksAPI } from '../services/api';

interface TaskHistoryViewerProps {
  taskId: string;
  onClose: () => void;
}

const TaskHistoryViewer: React.FC<TaskHistoryViewerProps> = ({ taskId, onClose }) => {
  const [history, setHistory] = useState<TaskHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await tasksAPI.getTaskHistory(taskId);
        setHistory(response.data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch task history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [taskId]);

  const getChangeTypeIcon = (changeType: string) => {
    switch (changeType) {
      case 'CREATE':
        return '✅';
      case 'UPDATE':
        return '✏️';
      case 'DELETE':
        return '🗑️';
      case 'STATUS_CHANGE':
        return '🔄';
      case 'ASSIGNMENT_CHANGE':
        return '👤';
      case 'PRIORITY_CHANGE':
        return '⚡';
      case 'DUE_DATE_CHANGE':
        return '📅';
      case 'COMMENT_ADDED':
        return '💬';
      case 'ATTACHMENT_ADDED':
        return '📎';
      case 'SUBTASK_ADDED':
        return '📋';
      case 'DEPENDENCY_ADDED':
        return '🔗';
      default:
        return '📝';
    }
  };

  const getChangeTypeLabel = (changeType: string) => {
    switch (changeType) {
      case 'CREATE':
        return '创建';
      case 'UPDATE':
        return '更新';
      case 'DELETE':
        return '删除';
      case 'STATUS_CHANGE':
        return '状态变更';
      case 'ASSIGNMENT_CHANGE':
        return '分配变更';
      case 'PRIORITY_CHANGE':
        return '优先级变更';
      case 'DUE_DATE_CHANGE':
        return '截止日期变更';
      case 'COMMENT_ADDED':
        return '添加评论';
      case 'ATTACHMENT_ADDED':
        return '添加附件';
      case 'SUBTASK_ADDED':
        return '添加子任务';
      case 'DEPENDENCY_ADDED':
        return '添加依赖';
      default:
        return '其他';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.changeType === filter);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">任务历史记录</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            筛选类型:
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">全部</option>
            <option value="CREATE">创建</option>
            <option value="UPDATE">更新</option>
            <option value="STATUS_CHANGE">状态变更</option>
            <option value="ASSIGNMENT_CHANGE">分配变更</option>
            <option value="PRIORITY_CHANGE">优先级变更</option>
            <option value="DUE_DATE_CHANGE">截止日期变更</option>
          </select>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filter === 'all' ? '暂无历史记录' : '没有符合筛选条件的历史记录'}
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredHistory.map((item) => (
              <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start">
                  <div className="mr-3 text-xl">
                    {getChangeTypeIcon(item.changeType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {getChangeTypeLabel(item.changeType)}
                        </span>
                        {item.fieldName && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({item.fieldName})
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(item.changedAt)}
                      </span>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    )}
                    
                    {item.oldValue !== item.newValue && (
                      <div className="mt-2 text-sm">
                        {item.oldValue && (
                          <div className="text-red-600">
                            之前: {item.oldValue}
                          </div>
                        )}
                        {item.newValue && (
                          <div className="text-green-600">
                            现在: {item.newValue}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500">
                      由 {item.changedByUser?.name || '未知用户'} 操作
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskHistoryViewer;