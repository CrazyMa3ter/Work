# Agent 自动化任务执行脚本 (PowerShell 版本)
# 适用于 Windows 环境
#
# 用法: .\scripts\agent-task.ps1 [command]
# 示例: .\scripts\agent-task.ps1 all

# 颜色定义
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

# 项目根目录
$ROOT_DIR = Split-Path -Parent $PSScriptRoot
$STATE_FILE = Join-Path $ROOT_DIR ".agent-state.json"

# 任务定义
$TASKS = @{
    # Phase 1: 环境准备
    "init-dependencies" = @{
        Phase = 1
        Dependencies = @()
        Description = "初始化项目依赖"
    }
    "config-dev-env" = @{
        Phase = 1
        Dependencies = @("init-dependencies")
        Description = "配置开发环境"
    }
    "verify-env" = @{
        Phase = 1
        Dependencies = @("config-dev-env")
        Description = "验证环境"
    }
    
    # Phase 2: 核心框架
    "create-main-process" = @{
        Phase = 2
        Dependencies = @("verify-env")
        Description = "创建主进程入口"
    }
    "create-preload" = @{
        Phase = 2
        Dependencies = @("create-main-process")
        Description = "创建预加载脚本"
    }
    "create-renderer" = @{
        Phase = 2
        Dependencies = @("create-preload")
        Description = "创建渲染进程入口"
    }
    "config-ipc" = @{
        Phase = 2
        Dependencies = @("create-renderer")
        Description = "配置 IPC 通信"
    }
    
    # Phase 3: 灵动岛 UI
    "create-frameless-window" = @{
        Phase = 3
        Dependencies = @("config-ipc")
        Description = "创建无边框窗口"
    }
    "implement-animation" = @{
        Phase = 3
        Dependencies = @("create-frameless-window")
        Description = "实现展开/收起动画"
    }
    "implement-navigation" = @{
        Phase = 3
        Dependencies = @("implement-animation")
        Description = "实现模块导航"
    }
    "integrate-tray" = @{
        Phase = 3
        Dependencies = @("implement-navigation")
        Description = "集成系统托盘"
    }
    
    # Phase 4: 功能模块
    "weather-module" = @{
        Phase = 4
        Dependencies = @("implement-navigation")
        Description = "天气模块"
    }
    "media-module" = @{
        Phase = 4
        Dependencies = @("implement-navigation")
        Description = "媒体控制模块"
    }
    "ide-module" = @{
        Phase = 4
        Dependencies = @("implement-navigation")
        Description = "IDE 状态模块"
    }
    "approval-module" = @{
        Phase = 4
        Dependencies = @("implement-navigation")
        Description = "审批模块"
    }
    
    # Phase 5: 系统功能
    "settings-page" = @{
        Phase = 5
        Dependencies = @("weather-module", "media-module", "ide-module", "approval-module")
        Description = "设置页面"
    }
    "config-persistence" = @{
        Phase = 5
        Dependencies = @("settings-page")
        Description = "配置持久化"
    }
    "auto-start" = @{
        Phase = 5
        Dependencies = @("config-persistence")
        Description = "开机自启"
    }
    
    # Phase 6: 构建与测试
    "unit-tests" = @{
        Phase = 6
        Dependencies = @("auto-start")
        Description = "单元测试"
    }
    "e2e-tests" = @{
        Phase = 6
        Dependencies = @("unit-tests")
        Description = "E2E 测试"
    }
    "build-package" = @{
        Phase = 6
        Dependencies = @("e2e-tests")
        Description = "打包构建"
    }
}

# 状态管理
function Load-State {
    if (Test-Path $STATE_FILE) {
        return Get-Content $STATE_FILE | ConvertFrom-Json
    }
    return @{}
}

function Save-State($state) {
    $state | ConvertTo-Json -Depth 10 | Set-Content $STATE_FILE
}

function Get-TaskState($taskId) {
    $state = Load-State
    if ($state.PSObject.Properties.Name -contains $taskId) {
        return $state.$taskId
    }
    return "pending"
}

function Set-TaskState($taskId, $taskState) {
    $state = Load-State
    $state.$taskId = $taskState
    Save-State $state
}

# 检查依赖是否完成
function Test-Dependencies($taskId) {
    $task = $TASKS[$taskId]
    if (-not $task) { return $false }
    
    foreach ($dep in $task.Dependencies) {
        $depState = Get-TaskState $dep
        if ($depState -ne "completed") {
            Write-Host "${Red}❌ 依赖任务未完成: $dep${Reset}"
            return $false
        }
    }
    return $true
}

# 执行任务
function Invoke-Task($taskId) {
    $task = $TASKS[$taskId]
    if (-not $task) {
        Write-Host "${Red}❌ 未知任务: $taskId${Reset}"
        return $false
    }
    
    # 检查依赖
    if (-not (Test-Dependencies $taskId)) {
        return $false
    }
    
    # 检查是否已完成
    $currentState = Get-TaskState $taskId
    if ($currentState -eq "completed") {
        Write-Host "${Yellow}⏭️  任务已跳过 (已完成): $($task.Description) [$taskId]${Reset}"
        return $true
    }
    
    # 执行任务
    Write-Host ""
    Write-Host "${Blue}🚀 开始执行: $($task.Description) [$taskId]${Reset}"
    Set-TaskState $taskId "running"
    
    # 模拟执行（实际开发中替换为真实命令）
    switch ($taskId) {
        "init-dependencies" { Write-Host "${Blue}📦 正在初始化项目依赖...${Reset}" }
        "config-dev-env" { Write-Host "${Blue}⚙️  正在配置开发环境...${Reset}" }
        "verify-env" { Write-Host "${Blue}🔍 正在验证环境...${Reset}" }
        "create-main-process" { Write-Host "${Blue}🖥️  正在创建主进程...${Reset}" }
        "create-preload" { Write-Host "${Blue}🔗 正在创建预加载脚本...${Reset}" }
        "create-renderer" { Write-Host "${Blue}🎨 正在创建渲染进程...${Reset}" }
        "config-ipc" { Write-Host "${Blue}📡 正在配置 IPC 通信...${Reset}" }
        "create-frameless-window" { Write-Host "${Blue}🪟 正在创建无边框窗口...${Reset}" }
        "implement-animation" { Write-Host "${Blue}✨ 正在实现动画...${Reset}" }
        "implement-navigation" { Write-Host "${Blue}🧭 正在实现模块导航...${Reset}" }
        "integrate-tray" { Write-Host "${Blue}🎯 正在集成系统托盘...${Reset}" }
        "weather-module" { Write-Host "${Blue}🌤️  正在开发天气模块...${Reset}" }
        "media-module" { Write-Host "${Blue}🎵 正在开发媒体控制模块...${Reset}" }
        "ide-module" { Write-Host "${Blue}💻 正在开发 IDE 状态模块...${Reset}" }
        "approval-module" { Write-Host "${Blue}📋 正在开发审批模块...${Reset}" }
        "settings-page" { Write-Host "${Blue}⚙️  正在开发设置页面...${Reset}" }
        "config-persistence" { Write-Host "${Blue}💾 正在实现配置持久化...${Reset}" }
        "auto-start" { Write-Host "${Blue}🚀 正在实现开机自启...${Reset}" }
        "unit-tests" { Write-Host "${Blue}🧪 正在运行单元测试...${Reset}" }
        "e2e-tests" { Write-Host "${Blue}🔍 正在运行 E2E 测试...${Reset}" }
        "build-package" { Write-Host "${Blue}📦 正在打包构建...${Reset}" }
    }
    
    # 标记完成
    Set-TaskState $taskId "completed"
    Write-Host "${Green}✅ 任务完成: $($task.Description)${Reset}"
    return $true
}

# 执行指定 Phase
function Invoke-Phase($phase) {
    Write-Host ""
    Write-Host "${Blue}📋 执行 Phase $phase${Reset}"
    
    foreach ($taskId in $TASKS.Keys) {
        if ($TASKS[$taskId].Phase -eq $phase) {
            Invoke-Task $taskId
        }
    }
}

# 执行所有任务
function Invoke-All {
    Write-Host "${Blue}🤖 Agent 自动化任务执行器启动${Reset}"
    Write-Host "${Blue}===========================${Reset}"
    
    for ($phase = 1; $phase -le 6; $phase++) {
        Invoke-Phase $phase
    }
    
    Write-Host ""
    Write-Host "${Green}🎉 所有任务执行完毕${Reset}"
}

# 显示状态
function Show-Status {
    Write-Host ""
    Write-Host "${Blue}📊 任务状态${Reset}"
    Write-Host "${Blue}==========${Reset}"
    
    for ($phase = 1; $phase -le 6; $phase++) {
        Write-Host ""
        Write-Host "${Blue}Phase $phase`:${Reset}"
        foreach ($taskId in $TASKS.Keys) {
            if ($TASKS[$taskId].Phase -eq $phase) {
                $state = Get-TaskState $taskId
                $icon = switch ($state) {
                    "pending" { "⏳" }
                    "running" { "🔄" }
                    "completed" { "✅" }
                    "failed" { "❌" }
                    default { "⏳" }
                }
                Write-Host "  $icon $($TASKS[$taskId].Description) [$taskId]"
            }
        }
    }
}

# 主函数
function Main {
    param([string]$Command = "all")
    
    switch ($Command) {
        "all" { Invoke-All }
        "status" { Show-Status }
        { $_ -match "^phase-(\d+)$" } {
            $phase = [int]$matches[1]
            Invoke-Phase $phase
        }
        default {
            if ($TASKS.ContainsKey($Command)) {
                Invoke-Task $Command
            } else {
                Write-Host "用法: .\scripts\agent-task.ps1 [command]"
                Write-Host ""
                Write-Host "命令:"
                Write-Host "  all              执行所有任务"
                Write-Host "  status           显示任务状态"
                Write-Host "  phase-N          执行指定 Phase (1-6)"
                Write-Host "  [task-id]        执行指定任务"
                Write-Host ""
                Write-Host "示例:"
                Write-Host "  .\scripts\agent-task.ps1 all"
                Write-Host "  .\scripts\agent-task.ps1 phase-1"
                Write-Host "  .\scripts\agent-task.ps1 init-dependencies"
            }
        }
    }
}

# 执行
Main -Command ($args[0] -or "all")
