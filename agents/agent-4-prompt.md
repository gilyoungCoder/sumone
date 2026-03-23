# Agent 4: Auth Flow Polish

## 역할
인증 플로우(회원가입/로그인)를 완성하고, 에러 처리, 프로필 설정, 온보딩 흐름을 구현하는 에이전트입니다.

## 작업 전 준비
```bash
cd /mnt/c/Users/yhgil/sumone
git checkout develop
git pull origin develop
git checkout -b feature/auth-polish
```

## 핵심 태스크

### 1. Auth Store 개선
`app/stores/authStore.ts` 업데이트:
- `profile` 상태 추가 (display_name, profile_image 등)
- `fetchProfile(userId)` — 프로필 가져오기
- `updateProfile(data)` — 프로필 업데이트
- 로그인 후 자동으로 프로필 로드
- 세션 만료 처리

### 2. 온보딩 플로우 추가
`app/app/(auth)/onboarding.tsx` (새로 생성):
회원가입 직후 보여줄 화면:
1. "Welcome to SumOne!" 인삿말
2. 이름 입력 (이미 회원가입에서 받지만, 수정 가능)
3. 프로필 이미지 선택 (MVP: 이모지 아바타 6개 중 선택)
   - 😊 😎 🥰 😄 🤗 😇
4. "Next" → 커플 연결 화면으로 이동

### 3. 로그인/회원가입 화면 개선
`app/app/(auth)/login.tsx`, `register.tsx` 업데이트:
- 이메일 형식 검증
- 비밀번호 강도 표시 (약함/보통/강함)
- 로딩 시 버튼 스피너
- 키보드 dismiss on tap outside
- "Forgot password?" 링크 (비밀번호 재설정 이메일)
- 부드러운 에러 메시지 (Alert 대신 인라인 에러)

### 4. 인증 가드 개선
`app/app/index.tsx` 업데이트:
라우팅 로직:
1. 로딩 중 → 스플래시 스크린
2. 미로그인 → 로그인 화면
3. 로그인 + 프로필 없음 → 온보딩
4. 로그인 + 프로필 있음 + 커플 없음 → 커플 연결 화면
5. 로그인 + 프로필 + 커플 → 홈 화면

### 5. 비밀번호 재설정
`app/app/(auth)/forgot-password.tsx` (새로 생성):
- 이메일 입력
- Supabase `resetPasswordForEmail` 호출
- 성공 메시지 표시

## 디자인 참고
- 원본 썸원의 부드러운 분위기
- 에러 메시지: 빨간색이 아닌 부드러운 경고색
- 로딩: 핑크색 스피너
- 트랜지션: 부드러운 화면 전환

## 담당 파일
- `app/stores/authStore.ts` (업데이트)
- `app/app/(auth)/login.tsx` (업데이트)
- `app/app/(auth)/register.tsx` (업데이트)
- `app/app/(auth)/onboarding.tsx` (새로 생성)
- `app/app/(auth)/forgot-password.tsx` (새로 생성)
- `app/app/index.tsx` (업데이트)

## 작업 완료 후
```bash
git add -A
git commit -m "feat: polished auth flow with onboarding, validation, and password reset"
git push -u origin feature/auth-polish
```
develop 브랜치로 PR 생성.

## 참고
- `app/lib/supabase.ts` — Supabase 클라이언트
- `app/constants/colors.ts` — 색상 팔레트
- `CLAUDE.md` — 보안 점검 리스트
