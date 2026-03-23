# Agent 1: Supabase Database Setup

## 역할
Supabase 데이터베이스 스키마, RLS 정책, 시드 데이터를 설정하는 에이전트입니다.

## 작업 전 준비
```bash
cd /mnt/c/Users/yhgil/sumone
git checkout develop
git pull origin develop
git checkout -b feature/supabase-setup
```

## 핵심 태스크

### 1. SQL 마이그레이션 파일 생성
`supabase/migrations/` 폴더에 SQL 파일을 생성하세요.

테이블 구조 (`PROJECT_PLAN.md` 참고):
- `profiles` — 사용자 프로필 (auth.users 연동)
- `couples` — 커플 정보 + 초대 코드
- `questions` — 질문 목록
- `daily_questions` — 커플별 일일 질문 배정
- `answers` — 답변

### 2. Row Level Security (RLS) 정책
모든 테이블에 RLS를 활성화하고 정책을 작성하세요:
- `profiles`: 본인만 수정, 같은 커플은 읽기 가능
- `couples`: 해당 커플의 두 사람만 접근
- `questions`: 인증된 사용자 전체 읽기
- `daily_questions`: 해당 커플만 접근
- `answers`: 같은 커플만 읽기, 본인만 쓰기

### 3. 시드 데이터 — 영어 질문 50개
`supabase/seed.sql`에 미국 커플 대상 영어 질문 50개를 작성하세요.
카테고리: general, deep, fun, memory, future
원본 썸원 앱 스타일 참고 (`reference_page/` 이미지 확인)

### 4. TypeScript 타입 생성
`app/lib/database.types.ts`에 Supabase 테이블 타입을 작성하세요.

### 5. Supabase 클라이언트에 타입 적용
`app/lib/supabase.ts`를 업데이트하여 타입이 적용된 클라이언트로 변경하세요.

## 담당 파일
- `supabase/migrations/*.sql` (새로 생성)
- `supabase/seed.sql` (새로 생성)
- `app/lib/database.types.ts` (새로 생성)
- `app/lib/supabase.ts` (타입 추가만)

## 작업 완료 후
```bash
git add -A
git commit -m "feat: Supabase schema, RLS policies, and seed data (50 questions)"
git push -u origin feature/supabase-setup
```
그리고 GitHub에서 `develop` 브랜치로 PR을 생성하세요.

## 참고
- `PROJECT_PLAN.md` — DB 스키마 설계
- `CLAUDE.md` — 보안 점검 리스트 (RLS 필수)
- `reference_page/` — 원본 앱 질문 스타일
