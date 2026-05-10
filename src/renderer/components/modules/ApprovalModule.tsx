import { useEffect } from 'react';
import { useApprovalStore } from '../../stores/approval-store';

export function ApprovalModule() {
  const { items, pendingCount, loading, setItems, approveItem, rejectItem, setLoading } = useApprovalStore();

  useEffect(() => {
    // TODO: Integrate with actual approval API
    // Mock data for development
    setItems([
      {
        id: '1',
        title: '请假申请',
        description: '张三申请 2024-01-15 至 2024-01-17 请假 3 天',
        type: 'request',
        priority: 'medium',
        requester: '张三',
        timestamp: Date.now() - 3600000,
        status: 'pending',
      },
      {
        id: '2',
        title: '报销审批',
        description: '李四提交差旅费报销单，金额: ¥2,580',
        type: 'document',
        priority: 'high',
        requester: '李四',
        timestamp: Date.now() - 7200000,
        status: 'pending',
      },
      {
        id: '3',
        title: '代码合并请求',
        description: '王五请求合并 feature/login 到 main 分支',
        type: 'workflow',
        priority: 'low',
        requester: '王五',
        timestamp: Date.now() - 18000000,
        status: 'pending',
      },
      {
        id: '4',
        title: '采购申请',
        description: '申请采购 MacBook Pro M3 一台',
        type: 'request',
        priority: 'high',
        requester: '赵六',
        timestamp: Date.now() - 86400000,
        status: 'approved',
      },
    ]);
  }, []);

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'text-red-400 bg-red-400/10',
      medium: 'text-yellow-400 bg-yellow-400/10',
      low: 'text-green-400 bg-green-400/10',
    };
    return colors[priority] || 'text-white/40 bg-white/5';
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      high: '高',
      medium: '中',
      low: '低',
    };
    return labels[priority] || priority;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      workflow: '工作流',
      document: '文档',
      request: '申请',
    };
    return labels[type] || type;
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  const pendingItems = items.filter((item) => item.status === 'pending');
  const processedItems = items.filter((item) => item.status !== 'pending');

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex-1 p-3 rounded-xl bg-white/5 text-center">
          <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
          <div className="text-white/40 text-xs">待处理</div>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-white/5 text-center">
          <div className="text-2xl font-bold text-green-400">
            {processedItems.filter((item) => item.status === 'approved').length}
          </div>
          <div className="text-white/40 text-xs">已批准</div>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-white/5 text-center">
          <div className="text-2xl font-bold text-red-400">
            {processedItems.filter((item) => item.status === 'rejected').length}
          </div>
          <div className="text-white/40 text-xs">已拒绝</div>
        </div>
      </div>

      {/* Pending Items */}
      {pendingItems.length > 0 && (
        <div>
          <div className="text-white/40 text-xs mb-2">待处理 ({pendingItems.length})</div>
          <div className="space-y-2">
            {pendingItems.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-white/5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{item.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(item.priority)}`}>
                        {getPriorityLabel(item.priority)}
                      </span>
                    </div>
                    <div className="text-white/50 text-xs mt-1">{item.description}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/30 text-xs">
                    <span>{item.requester}</span>
                    <span>·</span>
                    <span>{getTypeLabel(item.type)}</span>
                    <span>·</span>
                    <span>{formatTime(item.timestamp)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => rejectItem(item.id)}
                      className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs transition-colors"
                    >
                      拒绝
                    </button>
                    <button
                      onClick={() => approveItem(item.id)}
                      className="px-3 py-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs transition-colors"
                    >
                      同意
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Items */}
      {processedItems.length > 0 && (
        <div>
          <div className="text-white/40 text-xs mb-2">已处理 ({processedItems.length})</div>
          <div className="space-y-2">
            {processedItems.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-white/5 opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.status === 'approved' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-white/60 text-sm">{item.title}</span>
                  </div>
                  <span className="text-white/30 text-xs">{formatTime(item.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-white/40">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-sm">暂无审批事项</div>
        </div>
      )}
    </div>
  );
}
