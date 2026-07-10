#!/usr/bin/env bash
# 扫描传入内容里的疑似密钥与高危命令；命中则非零退出 + 提示。
# 用法：echo "<内容>" | bash scripts/hook-policy.sh   或   bash scripts/hook-policy.sh <file>
set -uo pipefail
input="$(cat "${1:-/dev/stdin}")"
fail=0
emit(){ echo "  ✗ hook-policy: $1"; fail=1; }

printf '%s' "$input" | grep -Eq '[Aa]uthorization:[[:space:]]*[Bb]earer[[:space:]]+[A-Za-z0-9._-]{12,}' && emit "疑似 Bearer token"
printf '%s' "$input" | grep -Eq '(api_key|apikey|secret|token|password|API_KEY|SECRET|TOKEN|PASSWORD)[[:space:]]*[:=].*[A-Za-z0-9._/+-]{16,}' && emit "疑似密钥/口令"
printf '%s' "$input" | grep -Eq 'git[[:space:]]+reset[[:space:]]+--hard' && emit "高危命令 git reset --hard"
printf '%s' "$input" | grep -Eq 'rm[[:space:]]+-[A-Za-z]*r[A-Za-z]*f[A-Za-z]*[[:space:]]+(/|\.|\*|~)' && emit "高危命令 rm -rf"
# 裸强推（--force 而非 --force-with-lease）——git-workflow 分级表"高危禁止"（ADR-0025）
printf '%s' "$input" | grep -Eq 'git[[:space:]]+push[[:space:]]([^|;&]*[[:space:]])?--force([[:space:]]|$)' && emit "高危命令 裸 git push --force（要用 --force-with-lease）"
printf '%s' "$input" | grep -Eq 'git[[:space:]]+push[[:space:]]+-f([[:space:]]|$)' && emit "高危命令 裸 git push -f（要用 --force-with-lease）"
# 直推 main（本仓 main 只走 PR merge）——匹配 push 目标分支为 main（含 HEAD:main / xxx:main 形态）
printf '%s' "$input" | grep -Eq 'git[[:space:]]+push[[:space:]][^|;&]*[[:space:]](\+?main|[A-Za-z0-9._/+-]*:(refs/heads/)?main|refs/heads/main)([[:space:]]|$)' && emit "直推 main（main 只走 PR merge，见 hc-git-workflow）"
printf '%s' "$input" | grep -Eq 'git[[:space:]]+push[[:space:]][^|;&]*--mirror' && emit "高危命令 git push --mirror（会覆写远端全部引用）"

exit "$fail"
