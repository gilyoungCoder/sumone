# Agent 2: Daily Questions System

## 역할
데일리 질문 시스템 전체를 구현하는 에이전트입니다. 질문 표시, 답변 작성, 파트너 답변 확인 기능을 만듭니다.

## 작업 전 준비
```bash
cd /mnt/c/Users/yhgil/sumone
git checkout develop
git pull origin develop
git checkout -b feature/daily-questions
```

## 핵심 태스크

### 1. Question Store 생성
`app/stores/questionStore.ts` — Zustand 스토어:
- `todayQuestion` — 오늘의 질문
- `myAnswer` — 내 답변
- `partnerAnswer` — 파트너 답변 (내가 답변 전에는 null)
- `fetchTodayQuestion(coupleId)` — 오늘 질문 가져오기 (없으면 새로 배정)
- `submitAnswer(text)` — 답변 제출
- `fetchPartnerAnswer()` — 파트너 답변 확인

### 2. Questions 화면 완전 재구현
`app/app/(tabs)/questions.tsx`를 완전히 재작성:

UI 플로우 (원본 썸원 참고 — `reference_page/` 이미지 00, 01, 02, 08, 09):
1. 상단: "SumOne" 로고 + "Daily Question" 서브타이틀
2. 하트 이모지 (💕💕) — 둘 다 답변하면 빨간 하트, 한쪽만 하면 회색 하트
3. 질문 텍스트 (큰 글씨)
4. 질문 번호 + 날짜
5. 내 답변 영역 (작성 전: 입력 필드, 작성 후: 답변 표시)
6. 파트너 답변 영역 (내가 답변 전: "Answer first to see your partner's response" 블러 처리)
7. 하단 버튼: "Nudge 👈" (파트너가 아직 답변 안 했을 때), "Chat about this 💬"

### 3. 질문 배정 로직
- 매일 자정 기준으로 새 질문 배정
- 커플별로 순서대로 질문 제공 (이미 답한 질문은 스킵)
- Supabase의 `daily_questions` 테이블 활용

### 4. 답변 전 파트너 답변 숨기기
- 내가 답변하기 전까지는 파트너의 답변을 볼 수 없음
- 답변 후 reveal 애니메이션 (간단한 fade-in)

## 디자인 참고
- 배경: `Colors.background` (#FFF8F0)
- 카드: 흰색 라운드 카드, 부드러운 그림자
- 폰트: 질문은 크고 굵게, 답변은 일반 크기
- 원본 썸원의 따뜻한 감성 유지

## 담당 파일
- `app/stores/questionStore.ts` (새로 생성)
- `app/app/(tabs)/questions.tsx` (재작성)
- `app/constants/questions.ts` (새로 생성 — 오프라인 폴백용 질문)

## 작업 완료 후
```bash
git add -A
git commit -m "feat: daily questions system with answer/reveal flow"
git push -u origin feature/daily-questions
```
develop 브랜치로 PR 생성.

## 참고
- `reference_page/KakaoTalk_20260323_160634539.png` — 질문 답변 화면
- `reference_page/KakaoTalk_20260323_160634539_01.png` — 질문 답변 화면 2
- `reference_page/KakaoTalk_20260323_160634539_02.png` — 한쪽만 답변한 상태
- `reference_page/KakaoTalk_20260323_160634539_08.png` — 질문 허브
- `reference_page/KakaoTalk_20260323_160634539_09.png` — 질문 허브 2
- `app/lib/supabase.ts` — Supabase 클라이언트
- `app/constants/colors.ts` — 색상 팔레트
