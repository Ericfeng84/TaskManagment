import React, { useState } from 'react';
import { Task, TaskPatch, User, BulkUpdateResponse } from '../types';
import { tasksAPI } from '../services/api';

interface BulkTaskEditorProps {
  selectedTasks: Task[];
  onUpdate: (updatedTasks: Task[]) => void;
  onCancel: () => void;
  availableUsers?: User[];
}

const BulkTaskEditor: React.FC<BulkTaskEditorProps> = ({ 
  selectedTasks, 
  onUpdate, 
  onCancel, 
  availableUsers = []
}) => {
  const [formData, setFormData] = useState<TaskPatch>({
    status: undefined,
    priority: undefined,
    assigneeId: undefined,
    tags: undefined,
    customFields: undefined
  });
  
  const [newTag, setNewTag] = useState('');
  const [customFieldName, setCustomFieldName] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState<BulkUpdateResponse | null>(null);

  // 处理表单字段变更
  const handleChange = (field: keyof TaskPatch, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 添加标签
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // 添加自定义字段
  const handleAddCustomField = () => {
    if (customFieldName.trim() && customFieldValue.trim()) {
      setFormData(prev => ({
        ...prev,
        customFields: {
          ...(prev.customFields || {}),
          [customFieldName.trim()]: customFieldValue.trim()
        }
      }));
      setCustomFieldName('');
      setCustomFieldValue('');
    }
  };

  // 删除自定义字段
  const handleRemoveCustomField = (fieldToRemove: string) => {
    const newCustomFields = { ...(formData.customFields || {}) };
    delete newCustomFields[fieldToRemove];
    setFormData(prev => ({
      ...prev,
      customFields: newCustomFields
    }));
  };

  // 批量更新任务
  const handleBulkUpdate = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    
    try {
      // 准备提交数据，只包含有变更的字段
      const patchData: TaskPatch = {};
      
      if (formData.status !== undefined) patchData.status = formData.status;
      if (formData.priority !== undefined) patchData.priority = formData.priority;
      if (formData.assigneeId !== undefined) patchData.assigneeId = formData.assigneeId;
      if (formData.tags !== undefined) patchData.tags = formData.tags;
      if (formData.customFields !== undefined) patchData.customFields = formData.customFields;
      
      // 如果没有变更，直接返回
      if (Object.keys(patchData).length === 0) {
        setError('请至少选择一个字段进行更新');
        setLoading(false);
        return;
      }
      
      const bulkUpdateRequest = {
        taskIds: selectedTasks.map(task => task.id),
        updates: patchData
      };
      
      const response = await tasksAPI.bulkUpdateTasks(bulkUpdateRequest);
      setResponse(response.data);
      
      // 更新本地状态
      const updatedTasks = selectedTasks.map(task => {
        const updatedTask = { ...task };
        if (patchData.status !== undefined) updatedTask.status = patchData.status;
        if (patchData.priority !== undefined) updatedTask.priority = patchData.priority;
        if (patchData.assigneeId !== undefined) updatedTask.assigneeId = patchData.assigneeId;
        if (patchData.tags !== undefined) updatedTask.tags = patchData.tags;
        if (patchData.customFields !== undefined) updatedTask.customFields = patchData.customFields;
        return updatedTask;
      });
      
      onUpdate(updatedTasks);
    } catch (error: any) {
      setError(error.response?.data?.message || '批量更新任务失败');
    } finally {
      setLoading(false);
    }
  };

  // 渲染编辑器内容
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          批量编辑任务 ({selectedTasks.length} 个任务)
        </h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {response && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>批量更新完成:</p>
            <p>成功: {response.totalSuccessful} 个</p>
            <p>失败: {response.totalFailed} 个</p>
            {response.failedUpdates.length > 0 && (
              <details className="mt-2">
                <summary>查看失败详情</summary>
                <ul className="mt-1 list-disc list-inside">
                  {response.failedUpdates.map((error, index) => (
                    <li key={index}>
                      任务 {error.taskId}: {error.errorMessage}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
        
        <div className="space-y-4">
          {/* 状态编辑 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.status || ''}
              onChange={(e) => handleChange('status', e.target.value || undefined)}
            >
              <option value="">不更改</option>
              <option value="TODO">待办</option>
              <option value="IN_PROGRESS">进行中</option>
              <option value="DONE">已完成</option>
            </select>
          </div>
          
          {/* 优先级编辑 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              优先级
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.priority || ''}
              onChange={(e) => handleChange('priority', e.target.value || undefined)}
            >
              <option value="">不更改</option>
              <option value="LOW">低</option>
              <option value="MEDIUM">中</option>
              <option value="HIGH">高</option>
            </select>
          </div>
          
          {/* 分配给 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分配给
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.assigneeId || ''}
              onChange={(e) => handleChange('assigneeId', e.target.value || undefined)}
            >
              <option value="">不更改</option>
              <option value="">取消分配</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标签
            </label>
            <div className="text-xs text-gray-500 mb-2">
              当前操作: {formData.tags === undefined ? '不更改' : '替换为以下标签'}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-blue-500 hover:text-blue-700"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="添加标签"
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                onClick={handleAddTag}
              >
                添加
              </button>
            </div>
          </div>
          
          {/* 自定义字段 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              自定义字段
            </label>
            <div className="text-xs text-gray-500 mb-2">
              当前操作: {formData.customFields === undefined ? '不更改' : '替换为以下字段'}
            </div>
            <div className="space-y-2 mb-2">
              {Object.entries(formData.customFields || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveCustomField(key)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={customFieldName}
                onChange={(e) => setCustomFieldName(e.target.value)}
                placeholder="字段名"
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={customFieldValue}
                onChange={(e) => setCustomFieldValue(e.target.value)}
                placeholder="字段值"
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleAddCustomField}
              >
                添加
              </button>
            </div>
          </div>
        </div>
        
        {/* 选中的任务列表 */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">选中的任务:</h4>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
            {selectedTasks.map(task => (
              <div key={task.id} className="py-1 px-2 hover:bg-gray-100 rounded">
                {task.title}
              </div>
            ))}
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={onCancel}
            disabled={loading}
          >
            取消
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            onClick={handleBulkUpdate}
            disabled={loading || Object.keys(formData).every(key => formData[key as keyof TaskPatch] === undefined)}
          >
            {loading ? '更新中...' : '批量更新'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkTaskEditor;