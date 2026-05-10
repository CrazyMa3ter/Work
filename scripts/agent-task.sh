#!/bin/bash
#
# Agent 自动化任务执行脚本 (Bash 版本)
# 适用于 Linux/macOS 环境
#
# 用法: ./scripts/agent-task.sh [command]
# 示例: ./scripts/agent-task.sh all

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
STATE_FILE="$ROOT_DIR/.agent-state.json"

# 任务状态管理
load_state() {
    if [ -f "$STATE_FILE" ]; then
        cat "$STATE_FILE"
    else
        echo '{}'
    fi
}

save_state() {
    echo "$1" > "$STATE_FILE"
}

update_task_state() {
    local task_id="$1"
    local state="$2"
    local current_state
    current_state=$(load_state)
    
    # 使用 jq 或 Python 更新 JSON
    if command -v jq &> /dev/null; then
        echo "$current_state" | jq ".[\"$task_id\"] = \"$state\"" > "$STATE_FILE"
    elif command -v python3 &> /dev/null; then
        python3 -c "
import json
with open('$STATE_FILE', 'r') as f:
    data = json.load(f)
data['$task_id'] = '$state'
with open('$STATE_FILE', 'w') as f:
    json.dump(data, f, indent=2)
"
    else
        echo "{\"$task_id\": \"$state\"}" > "$STATE_FILE"
    fi
}

get_task_state() {
    local task_id="$1"
    local current_state
    current_state=$(load_state)
    
    if command -v jq &> /dev/null; then
        echo "$current_state" | jq -r ".[\"$task_id\"] // \"pending\""
    elif command -v python3 &> /dev/null; then
        python3 -c "
import json
with open('$STATE_FILE', 'r') as f:
    data = json.load(f)
print(data.get('$task_id', 'pending'))
"
    else
        echo "pending"
    fi
}

# 任务定义
declare -A TASKS_PHASE
declare -A TASKS_DEPS
declare -A TASKS_DESC

# Phase 1: 环境准备
TASKS_PHASE["init-dependencies"]=1
TASKS_DEPS["init-dependencies"]=""
TASKS_DESC["init-dependencies"]='初始化项目依赖'

TASKS_PHASE["config-dev-env"]=1
TASKS_DEPS["config-dev-env"]='init-dependencies'
TASKS_DESC["config-dev-env"]='配置开发环境'

TASKS_PHASE["verify-env"]=1
TASKS_DEPS["verify-env"]='config-dev-env'
TASKS_DESC["verify-env"]='验证环境'

# Phase 2: 核心框架
TASKS_PHASE["create-main-process"]=2
TASKS_DEPS["create-main-process"]='verify-env'
TASKS_DESC["create-main-process"]='创建主进程入口'

TASKS_PHASE["create-preload"]=2
TASKS_DEPS["create-preload"]='create-main-process'
TASKS_DESC["create-preload"]='创建预加载脚本'

TASKS_PHASE["create-renderer"]=2
TASKS_DEPS["create-renderer"]='create-preload'
TASKS_DESC["create-renderer"]='创建渲染进程入口'

TASKS_PHASE["config-ipc"]=2
TASKS_DEPS["config-ipc"]='create-renderer'
TASKS_DESC["config-ipc"]='配置 IPC 通信'

# Phase 3: 灵动岛 UI
TASKS_PHASE["create-frameless-window"]=3
TASKS_DEPS["create-frameless-window"]='config-ipc'
TASKS_DESC["create-frameless-window"]='创建无边框窗口'

TASKS_PHASE["implement-animation"]=3
TASKS_DEPS["implement-animation"]='create-frameless-window'
TASKS_DESC["implement-animation"]='实现展开/收起动画'

TASKS_PHASE["implement-navigation"]=3
TASKS_DEPS["implement-navigation"]='implement-animation'
TASKS_DESC["implement-navigation"]='实现模块导航'

TASKS_PHASE["integrate-tray"]=3
TASKS_DEPS["integrate-tray"]='implement-navigation'
TASKS_DESC["integrate-tray"]='集成系统托盘'

# Phase 4: 功能模块
TASKS_PHASE["weather-module"]=4
TASKS_DEPS["weather-module"]='implement-navigation'
TASKS_DESC["weather-module"]='天气模块'

TASKS_PHASE["media-module"]=4
TASKS_DEPS["media-module"]='implement-navigation'
TASKS_DESC["media-module"]='媒体控制模块'

TASKS_PHASE["ide-module"]=4
TASKS_DEPS["ide-module"]='implement-navigation'
TASKS_DESC["ide-module"]='IDE 状态模块'

TASKS_PHASE["approval-module"]=4
TASKS_DEPS["approval-module"]='implement-navigation'
TASKS_DESC["approval-module"]='审批模块'

# Phase 5: 系统功能
TASKS_PHASE["settings-page"]=5
TASKS_DEPS["settings-page"]='weather-module media-module ide-module approval-module'
TASKS_DESC["settings-page"]='设置页面'

TASKS_PHASE["config-persistence"]=5
TASKS_DEPS["config-persistence"]='settings-page'
TASKS_DESC["config-persistence"]='配置持久化'

TASKS_PHASE["auto-start"]=5
TASKS_DEPS["auto-start"]='config-persistence'
TASKS_DESC["auto-start"]='开机自启'

# Phase 6: 构建与测试
TASKS_PHASE["unit-tests"]=6
TASKS_DEPS["unit-tests"]='auto-start'
TASKS_DESC["unit-tests"]='单元测试'

TASKS_PHASE["e2e-tests"]=6
TASKS_DEPS["e2e-tests"]='unit-tests'
TASKS_DESC["e2e-tests"]='E2E 测试'

TASKS_PHASE["build-package"]=6
TASKS_DEPS["build-package"]='e2e-tests'
TASKS_DESC["build-package"]='打包构建'

# 检查依赖是否完成
check_dependencies() {
    local task_id="$1"
    local deps="${TASKS_DEPS[$task_id]}"
    
    if [ -z "$deps" ]; then
        return 0
    fi
    
    for dep in $deps; do
        local dep_state
        dep_state=$(get_task_state "$dep")
        if [ "$dep_state" != "completed" ]; then
            echo -e "${RED}❌ 依赖任务未完成: $dep${NC}"
            return 1
        fi
    done
    
    return 0
}

# 执行任务
execute_task() {
    local task_id="$1"
    local task_desc="${TASKS_DESC[$task_id]}"
    
    if [ -z "$task_desc" ]; then
        echo -e "${RED}❌ 未知任务: $task_id${NC}"
        return 1
    fi
    
    # 检查依赖
    if ! check_dependencies "$task_id"; then
        return 1
    fi
    
    # 检查是否已完成
    local current_state
    current_state=$(get_task_state "$task_id")
    if [ "$current_state" == "completed" ]; then
        echo -e "${YELLOW}⏭️  任务已跳过 (已完成): $task_desc [$task_id]${NC}"
        return 0
    fi
    
    # 执行任务
    echo -e "\n${BLUE}🚀 开始执行: $task_desc [$task_id]${NC}"
    update_task_state "$task_id" "running"
    
    # 模拟执行（实际开发中替换为真实命令）
    case "$task_id" in
        "init-dependencies")
            echo -e "${BLUE}📦 正在初始化项目依赖...${NC}"
            # cd "$ROOT_DIR" && npm install
            ;;
        "config-dev-env")
            echo -e "${BLUE}⚙️  正在配置开发环境...${NC}"
            ;;
        "verify-env")
            echo -e "${BLUE}🔍 正在验证环境...${NC}"
            ;;
        "create-main-process")
            echo -e "${BLUE}🖥️  正在创建主进程...${NC}"
            ;;
        "create-preload")
            echo -e "${BLUE}🔗 正在创建预加载脚本...${NC}"
            ;;
        "create-renderer")
            echo -e "${BLUE}🎨 正在创建渲染进程...${NC}"
            ;;
        "config-ipc")
            echo -e "${BLUE}📡 正在配置 IPC 通信...${NC}"
            ;;
        "create-frameless-window")
            echo -e "${BLUE}🪟 正在创建无边框窗口...${NC}"
            ;;
        "implement-animation")
            echo -e "${BLUE}✨ 正在实现动画...${NC}"
            ;;
        "implement-navigation")
            echo -e "${BLUE}🧭 正在实现模块导航...${NC}"
            ;;
        "integrate-tray")
            echo -e "${BLUE}🎯 正在集成系统托盘...${NC}"
            ;;
        "weather-module")
            echo -e "${BLUE}🌤️  正在开发天气模块...${NC}"
            ;;
        "media-module")
            echo -e "${BLUE}🎵 正在开发媒体控制模块...${NC}"
            ;;
        "ide-module")
            echo -e "${BLUE}💻 正在开发 IDE 状态模块...${NC}"
            ;;
        "approval-module")
            echo -e "${BLUE}📋 正在开发审批模块...${NC}"
            ;;
        "settings-page")
            echo -e "${BLUE}⚙️  正在开发设置页面...${NC}"
            ;;
        "config-persistence")
            echo -e "${BLUE}💾 正在实现配置持久化...${NC}"
            ;;
        "auto-start")
            echo -e "${BLUE}🚀 正在实现开机自启...${NC}"
            ;;
        "unit-tests")
            echo -e "${BLUE}🧪 正在运行单元测试...${NC}"
            ;;
        "e2e-tests")
            echo -e "${BLUE}🔍 正在运行 E2E 测试...${NC}"
            ;;
        "build-package")
            echo -e "${BLUE}📦 正在打包构建...${NC}"
            ;;
    esac
    
    # 标记完成
    update_task_state "$task_id" "completed"
    echo -e "${GREEN}✅ 任务完成: $task_desc${NC}"
    return 0
}

# 执行指定 Phase
execute_phase() {
    local phase="$1"
    echo -e "\n${BLUE}📋 执行 Phase $phase${NC}"
    
    for task_id in "${!TASKS_PHASE[@]}"; do
        if [ "${TASKS_PHASE[$task_id]}" == "$phase" ]; then
            execute_task "$task_id"
        fi
    done
}

# 执行所有任务
execute_all() {
    echo -e "${BLUE}🤖 Agent 自动化任务执行器启动${NC}"
    echo -e "${BLUE}===========================${NC}"
    
    for phase in {1..6}; do
        execute_phase "$phase"
    done
    
    echo -e "\n${GREEN}🎉 所有任务执行完毕${NC}"
}

# 显示状态
show_status() {
    echo -e "\n${BLUE}📊 任务状态${NC}"
    echo -e "${BLUE}==========${NC}"
    
    for phase in {1..6}; do
        echo -e "\n${BLUE}Phase $phase:${NC}"
        for task_id in "${!TASKS_PHASE[@]}"; do
            if [ "${TASKS_PHASE[$task_id]}" == "$phase" ]; then
                local state
                state=$(get_task_state "$task_id")
                local icon
                case "$state" in
                    "pending") icon="⏳" ;;
                    "running") icon="🔄" ;;
                    "completed") icon="✅" ;;
                    "failed") icon="❌" ;;
                    *) icon="⏳" ;;
                esac
                echo -e "  $icon ${TASKS_DESC[$task_id]} [$task_id]"
            fi
        done
    done
}

# 主函数
main() {
    local command="${1:-all}"
    
    case "$command" in
        "all")
            execute_all
            ;;
        "status")
            show_status
            ;;
        phase-*)
            local phase="${command#phase-}"
            execute_phase "$phase"
            ;;
        *)
            if [ -n "${TASKS_PHASE[$command]}" ]; then
                execute_task "$command"
            else
                echo "用法: $0 [command]"
                echo ""
                echo "命令:"
                echo "  all              执行所有任务"
                echo "  status           显示任务状态"
                echo "  phase-N          执行指定 Phase (1-6)"
                echo "  [task-id]        执行指定任务"
                echo ""
                echo "示例:"
                echo "  $0 all"
                echo "  $0 phase-1"
                echo "  $0 init-dependencies"
            fi
            ;;
    esac
}

main "$@"
