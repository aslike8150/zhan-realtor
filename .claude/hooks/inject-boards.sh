#!/bin/bash
HERE="$(cd "$(dirname "$0")" && pwd)"
MEM="$HERE/../memory"
SYNC_BOARD="$MEM/SYNC_BOARD.md"
TODO_BOARD="$MEM/TODO_BOARD.md"

TODAY="$(date +%Y-%m-%d 2>/dev/null)"
[ -z "$TODAY" ] && exit 0

awk -v today="$TODAY" -v sync_file="$SYNC_BOARD" -v todo_file="$TODO_BOARD" '
function civil_to_days(y, m, d,    era, yoe, doy) {
  if (m <= 2) y -= 1
  era = int((y >= 0 ? y : y - 399) / 400)
  yoe = y - era * 400
  if (m > 2) doy = int((153*(m-3)+2)/5) + d - 1
  else doy = int((153*(m+9)+2)/5) + d - 1
  return era*146097 + (yoe*365 + int(yoe/4) - int(yoe/100) + doy) - 719468
}
function json_escape(s,    n, arr, i, out) {
  gsub(/\\/, "\\\\", s)
  gsub(/"/, "\\\"", s)
  gsub(/\t/, "\\t", s)
  gsub(/\r/, "", s)
  n = split(s, arr, "\n")
  out = arr[1]
  for (i = 2; i <= n; i++) out = out "\\n" arr[i]
  return out
}
BEGIN {
  RECENT_DAYS = 10
  MAX_ENTRIES = 25
  MAX_TODO_CHARS = 20000

  split(today, tp, "-")
  today_days = civil_to_days(tp[1]+0, tp[2]+0, tp[3]+0)

  news_count = 0
  if (sync_file != "") {
    while ((getline line < sync_file) > 0) {
      if (news_count >= MAX_ENTRIES) continue
      if (match(line, /^-[ \t]*\[[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][ \t]*\|/)) {
        bp = index(line, "[")
        datestr = substr(line, bp + 1, 10)
        split(datestr, dp, "-")
        ldays = civil_to_days(dp[1]+0, dp[2]+0, dp[3]+0)
        age = today_days - ldays
        if (age >= 0 && age < RECENT_DAYS) {
          sub(/[ \t\r]+$/, "", line)
          news_count++
          news_arr[news_count] = line
        }
      }
    }
    close(sync_file)
  }

  state = 0
  todo_count = 0
  if (todo_file != "") {
    while ((getline line < todo_file) > 0) {
      if (state == 0) {
        if (line ~ /^##[ \t]/ && index(line, "未完成") > 0) state = 1
        continue
      }
      if (line ~ /^##[ \t]/) { state = 2 }
      if (state == 2) break
      if (match(line, /^[ \t]*-[ \t]*\[[xX]\]/)) continue
      sub(/[ \t\r]+$/, "", line)
      todo_count++
      todo_arr[todo_count] = line
    }
    close(todo_file)
  }

  news_body = ""
  for (i = 1; i <= news_count; i++) news_body = (i == 1) ? news_arr[i] : news_body "\n" news_arr[i]

  todo_body = ""
  for (i = 1; i <= todo_count; i++) todo_body = (i == 1) ? todo_arr[i] : todo_body "\n" todo_arr[i]
  gsub(/^[ \t\r\n]+/, "", todo_body)
  gsub(/[ \t\r\n]+$/, "", todo_body)
  if (length(todo_body) > MAX_TODO_CHARS) {
    todo_body = substr(todo_body, 1, MAX_TODO_CHARS) "\n…(待辦太長已截斷，該清一清了)"
  }

  parts_count = 0
  if (news_body != "") {
    parts_count++
    parts[parts_count] = "🔄 跨 session 公告欄（最近 " RECENT_DAYS " 天。別的對話視窗做了什麼，看這裡）:\n" news_body
  }
  if (todo_body != "") {
    parts_count++
    parts[parts_count] = "✅ 待辦總帳（接到新待辦就 append 進 .claude/memory/TODO_BOARD.md，做完打勾）:\n" todo_body
  }

  if (parts_count == 0) exit 0

  full = ""
  for (i = 1; i <= parts_count; i++) full = (i == 1) ? parts[i] : full "\n\n" parts[i]

  printf "%s", "{\"hookSpecificOutput\":{\"hookEventName\":\"UserPromptSubmit\",\"additionalContext\":\"" json_escape(full) "\"}}"
}
'
exit 0
