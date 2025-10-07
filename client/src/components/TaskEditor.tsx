import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskPatch, User, TaskHistory } from '../types';
import { tasksAPI } from '../services/api';
import TaskHistoryViewer from './TaskHistoryViewer';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface TaskEditorProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onCancel: () => void;
  mode?: 'inline' | 'modal';
  availableUsers?: User[];
}

const TaskEditor: React.FC<TaskEditorProps> = ({ 
  task, 
  onUpdate, 
  onCancel, 
  mode = 'modal',
  availableUsers = []
}) => {
  const [formData, setFormData] = useState<TaskPatch>({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId || '',
    startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    tags: task.tags || [],
    customFields: task.customFields || {}
  });
  
  const [newTag, setNewTag] = useState('');
  const [customFieldName, setCustomFieldName] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showHistoryViewer, setShowHistoryViewer] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // 自动保存功能
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // 检查是否有变更
  useEffect(() => {
    const hasFormChanges = 
      formData.title !== task.title ||
      formData.description !== (task.description || '') ||
      formData.status !== task.status ||
      formData.priority !== task.priority ||
      formData.assigneeId !== (task.assigneeId || '') ||
      formData.startDate !== (task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '') ||
      formData.dueDate !== (task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '') ||
      JSON.stringify(formData.tags) !== JSON.stringify(task.tags || []) ||
      JSON.stringify(formData.customFields) !== JSON.stringify(task.customFields || {});
    
    setHasChanges(hasFormChanges);
  }, [formData, task]);

  // 保存任务
  const handleSave = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // 准备提交数据，只包含有变更的字段
      const patchData: TaskPatch = {};
      
      if (formData.title !== task.title) patchData.title = formData.title;
      if (formData.description !== (task.description || '')) patchData.description = formData.description;
      if (formData.status !== task.status) patchData.status = formData.status;
      if (formData.priority !== task.priority) patchData.priority = formData.priority;
      if (formData.assigneeId !== (task.assigneeId || '')) patchData.assigneeId = formData.assigneeId;
      if (formData.startDate !== (task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '')) {
        patchData.startDate = formData.startDate ? new Date(formData.startDate).toISOString() : undefined;
      }
      if (formData.dueDate !== (task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')) {
        patchData.dueDate = formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined;
      }
      if (JSON.stringify(formData.tags) !== JSON.stringify(task.tags || [])) patchData.tags = formData.tags;
      if (JSON.stringify(formData.customFields) !== JSON.stringify(task.customFields || {})) {
        patchData.customFields = formData.customFields;
      }
      
      // 如果没有变更，直接返回
      if (Object.keys(patchData).length === 0) {
        onUpdate(task);
        return;
      }
      
      const response = await tasksAPI.patchTask(task.id, patchData);
      onUpdate(response.data);
      setLastSaved(new Date());
      setHasChanges(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  }, [formData, task, onUpdate]);

  // 自动保存逻辑
  useEffect(() => {
    if (!autoSave || !hasChanges) return;
    
    const timer = setTimeout(() => {
      handleSave();
    }, 2000); // 2秒后自动保存
    
    return () => clearTimeout(timer);
  }, [formData, autoSave, hasChanges, handleSave]);

  // 快捷键支持
  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      action: handleSave,
      description: '保存任务'
    },
    {
      key: 'Escape',
      action: onCancel,
      description: '取消编辑'
    },
    {
      key: 'h',
      ctrlKey: true,
      action: () => setShowHistoryViewer(true),
      description: '查看历史记录'
    },
    {
      key: '?',
      shiftKey: true,
      action: () => setShowShortcutsHelp(!showShortcutsHelp),
      description: '显示/隐藏快捷键帮助'
    }
  ]);

  // 获取任务历史
  const fetchTaskHistory = useCallback(async () => {
    try {
      const response = await tasksAPI.getTaskHistory(task.id);
      setTaskHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch task history:', error);
    }
  }, [task.id]);

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
          ...prev.customFields,
          [customFieldName.trim()]: customFieldValue.trim()
        }
      }));
      setCustomFieldName('');
      setCustomFieldValue('');
    }
  };

  // 删除自定义字段
  const handleRemoveCustomField = (fieldToRemove: string) => {
    const newCustomFields = { ...formData.customFields };
    delete newCustomFields[fieldToRemove];
    setFormData(prev => ({
      ...prev,
      customFields: newCustomFields
    }));
  };


  // 切换历史记录显示
  const toggleHistory = () => {
    if (!showHistory) {
      fetchTaskHistory();
    }
    setShowHistory(!showHistory);
  };

  // 渲染编辑器内容
  const renderEditorContent = () => (
    <div className={`${mode === 'modal' ? 'p-6' : 'p-4'}`}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {/* 标题编辑 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标题
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        
        {/* 描述编辑 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            描述
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
        
        {/* 状态和优先级 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="TODO">待办</option>
              <option value="IN_PROGRESS">进行中</option>
              <option value="DONE">已完成</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              优先级
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              <option value="LOW">低</option>
              <option value="MEDIUM">中</option>
              <option value="HIGH">高</option>
            </select>
          </div>
        </div>
        
        {/* 分配给 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            分配给
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.assigneeId}
            onChange={(e) => handleChange('assigneeId', e.target.value)}
          >
            <option value="">未分配</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* 日期 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              开始日期
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              截止日期
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              min={formData.startDate}
            />
          </div>
        </div>
        
        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标签
          </label>
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
        
        {/* 自动保存选项 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoSave"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
          />
          <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-900">
            自动保存
          </label>
          {lastSaved && (
            <span className="ml-2 text-xs text-gray-500">
              最后保存: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {hasChanges && (
            <span className="ml-2 text-xs text-orange-500">
              有未保存的更改
            </span>
          )}
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between">
        <div className="mb-3 sm:mb-0">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 text-sm mr-3"
            onClick={toggleHistory}
          >
            {showHistory ? '隐藏' : '显示'}历史记录
          </button>
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 text-sm mr-3"
            onClick={() => setShowHistoryViewer(true)}
          >
            查看完整历史
          </button>
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 text-sm"
            onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
          >
            快捷键
          </button>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            onClick={handleSave}
            disabled={loading || !hasChanges}
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
      
      {/* 历史记录 */}
      {showHistory && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">历史记录</h3>
          {taskHistory.length === 0 ? (
            <p className="text-gray-500">暂无历史记录</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {taskHistory.map((history) => (
                <div key={history.id} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{history.fieldName}</span>
                    <span className="text-gray-500">
                      {new Date(history.changedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {history.oldValue !== history.newValue && (
                      <>
                        {history.oldValue && <span>从: {history.oldValue}</span>}
                        {history.newValue && <span> 到: {history.newValue}</span>}
                      </>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs">
                    由 {history.changedByUser?.name || '未知用户'} {history.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 根据模式渲染不同的容器
  if (mode === 'inline') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {renderEditorContent()}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">编辑任务</h3>
        {renderEditorContent()}
      </div>
    </div>
  );
};

export default TaskEditor;