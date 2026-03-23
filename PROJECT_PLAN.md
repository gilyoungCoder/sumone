# Sumone US - Project Plan

## 원본 앱 분석 (레퍼런스 이미지 기반)

### 앱 구조 (5개 메인 탭)
1. **Home** — 반려몽(가상 펫)이 사는 방, D-day 카운터, 커플 이름 표시
2. **Q&A** — 매일 커플 질문 제공, 양쪽 답변, 질문팩 시스템
3. **Sumlog (캘린더)** — 월간 캘린더, 버킷리스트, 기념일 관리
4. **Shop** — 펫 의상, 방 인테리어 오브제, 아이템 구매
5. **My Page** — 커플 프로필, 메모, 펫 일기, 설정

### 핵심 재화 시스템
- **조약돌 (Pebbles)** — 기본 재화, 매일 출석/광고로 획득 (일 최대 30개)
- **하트** — 프리미엄 재화
- 재화로 펫 꾸미기, 방 인테리어 구매

### 수익 모델
- 광고 시청 → 조약돌 획득
- 프리미엄 구독 (SumOne Gold) → 광고 제거 + 추가 혜택
- 친구 초대 이벤트 → 바이럴 성장

---

## 기술 스택 (확정)

| 영역 | 기술 | 이유 |
|------|------|------|
| **Frontend** | React Native + Expo | 크로스플랫폼, 빠른 개발, 바이브코딩 최적 |
| **Backend** | Supabase | 무료 티어 넉넉, 서버리스, SQL 기반, 바이브코딩 트렌드 |
| **Auth** | Supabase Auth | 소셜 로그인 내장, Row Level Security |
| **DB** | PostgreSQL (Supabase) | 관계형 DB, 유연한 쿼리, 실시간 구독 |
| **Storage** | Supabase Storage | 이미지/에셋 저장 |
| **Realtime** | Supabase Realtime | 커플 간 데이터 실시간 동기화 |
| **State** | Zustand | 가볍고 심플 |
| **Navigation** | Expo Router | 파일 기반 라우팅, 직관적 |
| **Styling** | NativeWind (Tailwind) | 빠른 UI 개발 |

---

## MVP 범위 (Phase 1)

> MVP 목표: 커플이 연결하고, 매일 질문에 답하고, 기본적인 펫을 볼 수 있는 상태

### MVP에 포함할 기능
1. **회원가입/로그인** — 이메일 또는 소셜 로그인
2. **커플 연결** — 초대 코드로 파트너 연결
3. **D-day 카운터** — 사귄 날짜 설정, 일수 표시
4. **데일리 질문** — 매일 1개 질문 제공, 양쪽 답변
5. **기본 홈 화면** — 간단한 펫 캐릭터 + 방 배경
6. **기본 프로필** — 커플 이름, 프로필 사진

### MVP에서 제외 (Phase 2 이후)
- 펫 꾸미기 / 의상
- 방 인테리어 오브제
- 재화 시스템 (조약돌/하트)
- 광고 시스템
- 질문팩 시스템
- 캘린더/버킷리스트
- 미니 게임
- 구독 결제
- 푸시 알림
- 커플 심리 테스트

---

## 프로젝트 구조

```
sumone/
├── CLAUDE.md              # 하네스 규칙
├── DECISIONS.md           # 결정 사항 기록
├── PROJECT_PLAN.md        # 이 파일
├── reference_page/        # 원본 앱 스크린샷
│
└── app/                   # Expo 프로젝트 루트
    ├── app/               # Expo Router 페이지
    │   ├── (auth)/        # 로그인/회원가입
    │   │   ├── login.tsx
    │   │   └── register.tsx
    │   ├── (tabs)/        # 메인 탭 레이아웃
    │   │   ├── _layout.tsx
    │   │   ├── home.tsx       # 홈 (펫 + D-day)
    │   │   ├── questions.tsx  # 데일리 질문
    │   │   ├── calendar.tsx   # 캘린더 (Phase 2)
    │   │   ├── shop.tsx       # 상점 (Phase 2)
    │   │   └── profile.tsx    # 마이페이지
    │   ├── couple/
    │   │   └── connect.tsx    # 커플 연결
    │   └── _layout.tsx
    │
    ├── components/        # 재사용 컴포넌트
    │   ├── ui/            # 버튼, 카드, 인풋 등
    │   ├── pet/           # 펫 관련 컴포넌트
    │   └── question/      # 질문 카드 컴포넌트
    │
    ├── lib/               # 유틸리티
    │   ├── supabase.ts    # Supabase 설정
    │   └── utils.ts       # 헬퍼 함수
    │
    ├── stores/            # Zustand 상태 관리
    │   ├── authStore.ts
    │   └── coupleStore.ts
    │
    ├── constants/         # 상수, 질문 데이터
    │   ├── colors.ts
    │   └── questions.ts
    │
    └── assets/            # 이미지, 폰트
        ├── images/
        └── fonts/
```

---

## MVP 개발 순서

### Step 1: 프로젝트 초기 설정
- Expo 프로젝트 생성
- 기본 패키지 설치 (supabase-js, zustand, nativewind)
- Supabase 프로젝트 생성 및 연결
- 기본 네비게이션 구조

### Step 2: 인증 시스템
- 회원가입 / 로그인 화면
- Supabase Auth 연동
- 로그인 상태 관리

### Step 3: 커플 연결
- 초대 코드 생성/입력 화면
- PostgreSQL에 커플 데이터 저장
- 연결 상태 관리

### Step 4: 홈 화면
- D-day 카운터 표시
- 기본 펫 캐릭터 (정적 이미지)
- 커플 이름 표시

### Step 5: 데일리 질문
- 질문 데이터 (영어, 미국 문화에 맞게)
- 질문 카드 UI
- 답변 작성/저장
- 파트너 답변 확인 (답변 전에는 가려짐)

### Step 6: 마이페이지
- 프로필 표시
- 기본 설정
- 로그아웃

---

## 디자인 방향

### 원본 썸원 참고
- **색상**: 따뜻한 톤 (크림, 연분홍, 연노랑)
- **폰트**: 둥글고 귀여운 느낌 → 영어 대응 폰트 필요
- **분위기**: 아기자기, 따뜻함, 일러스트 감성
- **배경**: 밝은 회색/크림색 (#F8F8F8)

### 미국 시장 조정
- 영어 UI
- 미국 문화에 맞는 질문 내용
- 인치/마일 등 단위 (필요시)
- 미국 공휴일 반영 (기념일 기능)

---

## PostgreSQL 데이터 구조 (MVP)

```sql
-- 사용자 프로필 (Supabase Auth와 연동)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT NOT NULL,
  profile_image TEXT,
  couple_id UUID REFERENCES couples(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 커플
CREATE TABLE couples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES auth.users(id) NOT NULL,
  user2_id UUID REFERENCES auth.users(id),
  invite_code TEXT UNIQUE NOT NULL,
  anniversary_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 질문 목록
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INT NOT NULL
);

-- 커플별 데일리 질문 배정
CREATE TABLE daily_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID REFERENCES couples(id) NOT NULL,
  question_id INT REFERENCES questions(id) NOT NULL,
  assigned_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(couple_id, assigned_date)
);

-- 답변
CREATE TABLE answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  daily_question_id UUID REFERENCES daily_questions(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(daily_question_id, user_id)
);
```

### Row Level Security (RLS) 정책
- 사용자는 자신의 프로필만 수정 가능
- 커플 데이터는 해당 커플의 두 사람만 접근 가능
- 답변은 같은 커플만 읽기 가능, 본인 답변만 쓰기 가능
- 질문은 모든 인증된 사용자가 읽기 가능
