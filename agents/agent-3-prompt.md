# Agent 3: Home Screen & Pet UI

## 역할
홈 화면을 원본 썸원 앱처럼 예쁘고 따뜻한 감성으로 구현하는 에이전트입니다. 펫 캐릭터, D-day, 커플 정보를 표시합니다.

## 작업 전 준비
```bash
cd /mnt/c/Users/yhgil/sumone
git checkout develop
git pull origin develop
git checkout -b feature/home-pet
```

## 핵심 태스크

### 1. 홈 화면 완전 재구현
`app/app/(tabs)/home.tsx`를 원본 썸원처럼 재작성:

레이아웃 (원본 참고 — `reference_page/` 이미지 10, 11):
1. **상단 바**: 코인 표시(MVP에서는 장식용), 이모지 아이콘, 알림벨
2. **커플 정보**: "You ❤️ Partner" + D-day 카운터 (큰 숫자, 이탈릭체)
3. **펫 방**: 화면 중앙, 따뜻한 배경의 큰 영역
   - 체크무늬/패턴 배경 (원본의 격자 패턴 참고)
   - 중앙에 하트 캐릭터 (💗 이모지 기반, 큰 사이즈)
   - 말풍선: "Have a great day!" 등 랜덤 메시지
   - 장식 오브제 (작은 이모지들로 표현: 🏕️ 텐트, 🖼️ 액자 등)
4. **하단**: "Collect daily pebbles!" 안내 메시지

### 2. Pet Component 분리
`app/components/pet/PetRoom.tsx`:
- 펫 방 배경 (따뜻한 크림/노란색 체크 패턴)
- 펫 캐릭터 (하트 모양, 간단한 바운스 애니메이션)
- 말풍선 컴포넌트 (랜덤 메시지)
- 장식 오브제 배치

`app/components/pet/PetCharacter.tsx`:
- 하트 캐릭터 표시
- 간단한 idle 애니메이션 (위아래 바운스)
- React Native Reanimated 사용

### 3. D-day 카운터 개선
- 큰 숫자로 표시 (원본처럼 "1102일 째" → "Day 1,102")
- 기념일 미설정 시 날짜 선택 프롬프트
- DateTimePicker 연동 (expo-date-picker 또는 간단한 모달)

### 4. 커플 미연결 상태 화면
- 연결 전: 혼자 있는 펫 + "Find your SumOne" 메시지
- 초대 코드 보내기 버튼
- 따뜻한 온보딩 느낌

### 5. 랜덤 메시지 시스템
펫이 말하는 메시지 20개 (영어):
- "Have a wonderful day!"
- "I love seeing you two together 💕"
- "Don't forget to tell them you love them!"
- 등등...

## 디자인 핵심
- **따뜻한 톤**: 크림, 연노랑, 연분홍
- **격자 패턴**: 원본의 체크무늬 방 배경
- **부드러운 라운드**: 모든 요소 둥글게
- 원본 이미지 10, 11번 스크린샷을 충실하게 참고

## 담당 파일
- `app/app/(tabs)/home.tsx` (재작성)
- `app/components/pet/PetRoom.tsx` (새로 생성)
- `app/components/pet/PetCharacter.tsx` (새로 생성)
- `app/components/pet/SpeechBubble.tsx` (새로 생성)
- `app/constants/messages.ts` (새로 생성 — 펫 랜덤 메시지)

## 작업 완료 후
```bash
git add -A
git commit -m "feat: home screen with pet room, D-day counter, and animations"
git push -u origin feature/home-pet
```
develop 브랜치로 PR 생성.

## 참고
- `reference_page/KakaoTalk_20260323_160634539_10.png` — 홈 화면 (펫 방)
- `reference_page/KakaoTalk_20260323_160634539_11.png` — 홈 화면 2
- `app/stores/coupleStore.ts` — 커플 데이터
- `app/constants/colors.ts` — 색상 팔레트
