# Agent 5: UI Component Library

## 역할
프로젝트 전체에서 재사용할 공통 UI 컴포넌트를 만드는 에이전트입니다. 원본 썸원 앱의 따뜻한 감성을 일관되게 유지하는 디자인 시스템을 구축합니다.

## 작업 전 준비
```bash
cd /mnt/c/Users/yhgil/sumone
git checkout develop
git pull origin develop
git checkout -b feature/ui-components
```

## 핵심 태스크

### 1. Button 컴포넌트
`app/components/ui/Button.tsx`:
- `variant`: primary (핑크), secondary (외곽선), ghost (텍스트만)
- `size`: sm, md, lg
- `loading` 상태 (스피너)
- `disabled` 상태
- 라운드 모서리 (borderRadius: 16)
- 부드러운 press 애니메이션 (scale 0.98)

### 2. Input 컴포넌트
`app/components/ui/Input.tsx`:
- `label` (위에 라벨 텍스트)
- `error` (에러 메시지)
- `icon` (왼쪽 아이콘)
- 포커스 시 테두리 색상 변경 (핑크)
- 원본 썸원의 부드러운 인풋 스타일

### 3. Card 컴포넌트
`app/components/ui/Card.tsx`:
- 흰색 배경, 라운드 모서리, 부드러운 그림자
- `variant`: default (흰색), warm (크림색), highlight (연핑크)
- padding, margin 커스텀 가능

### 4. Header 컴포넌트
`app/components/ui/Header.tsx`:
- 앱 로고 "SumOne" (이탈릭체)
- 선택적 뒤로가기 버튼
- 선택적 오른쪽 액션 버튼
- 투명 배경, 심플한 스타일

### 5. Avatar 컴포넌트
`app/components/ui/Avatar.tsx`:
- 이모지 기반 아바타 (원형)
- `size`: sm (32), md (48), lg (64)
- 배경색 자동 (이모지에 따라)
- 커플 아바타 (두 개 겹쳐 표시)

### 6. Badge 컴포넌트
`app/components/ui/Badge.tsx`:
- 작은 알림 뱃지 (숫자)
- 색상: primary, accent, error

### 7. Divider 컴포넌트
`app/components/ui/Divider.tsx`:
- 가로 구분선
- "OR" 같은 중간 텍스트 옵션

### 8. Typography 상수
`app/constants/typography.ts` (새로 생성):
- 폰트 사이즈 체계 (xs, sm, md, lg, xl, xxl)
- 폰트 웨이트 체계
- 줄 간격
- 앱 전체 텍스트 스타일 일관성

### 9. 색상 팔레트 확장
`app/constants/colors.ts` 확장:
- 그림자 색상
- 오버레이 색상
- 그라데이션 시작/끝 색상

### 10. 컴포넌트 인덱스
`app/components/ui/index.ts`:
- 모든 UI 컴포넌트를 한 곳에서 export

## 디자인 원칙
- **일관성**: 모든 라운드 모서리는 12~20px
- **따뜻함**: 차가운 색상 사용 금지, 항상 따뜻한 톤
- **부드러움**: 딱딱한 그림자 대신 부드러운 그림자 (shadowOpacity 낮게)
- **여백**: 넉넉한 패딩, 숨 쉴 수 있는 레이아웃

## 담당 파일
- `app/components/ui/Button.tsx` (새로 생성)
- `app/components/ui/Input.tsx` (새로 생성)
- `app/components/ui/Card.tsx` (새로 생성)
- `app/components/ui/Header.tsx` (새로 생성)
- `app/components/ui/Avatar.tsx` (새로 생성)
- `app/components/ui/Badge.tsx` (새로 생성)
- `app/components/ui/Divider.tsx` (새로 생성)
- `app/components/ui/index.ts` (새로 생성)
- `app/constants/typography.ts` (새로 생성)
- `app/constants/colors.ts` (확장만)

## 작업 완료 후
```bash
git add -A
git commit -m "feat: UI component library (Button, Input, Card, Header, Avatar, Badge, Divider)"
git push -u origin feature/ui-components
```
develop 브랜치로 PR 생성.

## 참고
- `reference_page/` — 원본 앱 UI 스타일
- `app/constants/colors.ts` — 기존 색상 팔레트
