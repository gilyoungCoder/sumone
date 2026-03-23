# 5-Agent Parallel Development Guide

## 개요
5개의 터미널을 동시에 열어 각 에이전트가 독립적인 feature 브랜치에서 병렬 작업합니다.

## 실행 방법

각 터미널에서:
```bash
cd /mnt/c/Users/yhgil/sumone
claude --prompt-file agents/agent-{N}-prompt.md
```

| 터미널 | 에이전트 | 브랜치 | 담당 |
|--------|----------|--------|------|
| 1 | Agent 1: Supabase DB | `feature/supabase-setup` | DB 스키마 + RLS + 시드 데이터 |
| 2 | Agent 2: Daily Questions | `feature/daily-questions` | 질문 시스템 전체 구현 |
| 3 | Agent 3: Home & Pet | `feature/home-pet` | 홈 화면 + 펫 UI + D-day |
| 4 | Agent 4: Auth Polish | `feature/auth-polish` | 인증 플로우 완성 + 에러 처리 |
| 5 | Agent 5: UI Components | `feature/ui-components` | 공통 UI 컴포넌트 라이브러리 |

## 주의사항
- 각 에이전트는 **자기 브랜치에서만** 작업합니다
- 작업 완료 후 **develop 브랜치로 PR**을 생성합니다
- 파일 충돌을 최소화하기 위해 담당 영역이 분리되어 있습니다
- 모든 에이전트가 완료되면 develop → main으로 merge 합니다

## 파일 담당 영역 (충돌 방지)

| 에이전트 | 담당 파일/폴더 |
|----------|---------------|
| Agent 1 | `supabase/`, `app/lib/supabase.ts` (DB 타입만) |
| Agent 2 | `app/app/(tabs)/questions.tsx`, `app/constants/questions.ts`, `app/stores/questionStore.ts` |
| Agent 3 | `app/app/(tabs)/home.tsx`, `app/components/pet/`, `app/assets/images/` |
| Agent 4 | `app/app/(auth)/*`, `app/stores/authStore.ts`, `app/app/index.tsx` |
| Agent 5 | `app/components/ui/*`, `app/constants/colors.ts` (확장만) |
