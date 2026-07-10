#!/usr/bin/env bash
# hook-policy 的自测：喂样例，验证该拦的拦、该放的放。改 policy 必须同步改本测试。
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POLICY="$ROOT/scripts/hook-policy.sh"
pass=0; fail=0

expect_block(){ # $1 desc $2 input
  if printf '%s' "$2" | bash "$POLICY" >/dev/null 2>&1; then
    echo "  ✗ 应拦未拦：$1"; fail=$((fail+1))
  else pass=$((pass+1)); fi
}
expect_ok(){
  if printf '%s' "$2" | bash "$POLICY" >/dev/null 2>&1; then
    pass=$((pass+1))
  else echo "  ✗ 应放行却拦：$1"; fail=$((fail+1)); fi
}

expect_block "bearer token"  'Authorization: Bearer abcdef1234567890XY'
expect_block "api key 赋值"  'api_key = "sk-abcdef1234567890ZZ"'
expect_block "reset --hard"  'git reset --hard origin/main'
expect_block "危险 rm"       'rm -rf /'
expect_ok    "普通代码"      'func main() { println("hi") }'
expect_ok    "普通中文文档"  '本规则禁止泄露密钥与执行危险命令。'
expect_block "裸强推 --force"    'git push --force origin feat/x'
expect_block "裸强推 -f"         'git push -f origin feat/x'
expect_block "直推 main"         'git push origin main'
expect_block "直推 HEAD:main"    'git push origin HEAD:main'
expect_ok    "with-lease 强推"   'git push --force-with-lease=feat/x:abc123 origin feat/x'
expect_ok    "普通 push 分支"    'git push -u origin feat/mechanism-checkup'
expect_block "refspec 强推 main"  'git push origin +main'
expect_block "全名直推 main"      'git push origin HEAD:refs/heads/main'
expect_block "push --mirror"      'git push --mirror backup'
expect_ok    "分支名含 main 子串" 'git push origin feat/main-page'
expect_ok    "mainline 分支"      'git push origin mainline'

echo "hook-policy.test: pass=$pass fail=$fail"
[ "$fail" -eq 0 ]
