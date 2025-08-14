---
title: "Escape Room App"
description: "고등학교 시절 방탈출 카페를 위한 안드로이드 어플리케이션"
period: "2020.01 - 2020.12"
teamSize: "1명"
role: "개발자"
achievements: "Java와 Android Studio 학습, Firebase와 AWS 활용 경험"
image: "image/escape-room-app.svg"
---

# 방탈출 어플리케이션 프로젝트

## 프로젝트 개요

고등학교 2학년~3학년 시절 방탈출 카페를 위한 안드로이드 어플리케이션을 개발한 프로젝트입니다. 당시 처음 떠오르던 방탈출 카페 문화에 맞춰 사용자들이 방탈출 게임을 더욱 즐길 수 있도록 도와주는 앱을 만들었습니다.

## 프로젝트 목표

- 방탈출 카페 이용자들의 편의성 향상
- Java와 Android 개발 학습
- Firebase와 AWS 클라우드 서비스 활용 경험
- 실제 서비스 운영 경험

## 주요 기능

### 1. 방탈출 게임 관리
- 게임 진행 상황 추적
- 힌트 시스템 구현
- 타이머 및 점수 관리
- 게임 결과 저장

### 2. 사용자 인터페이스
- 직관적인 게임 진행 UI
- 힌트 요청 및 확인 기능
- 게임 완료 시 축하 화면
- 이전 게임 기록 조회

### 3. 데이터 관리
- Firebase를 활용한 실시간 데이터 동기화
- 게임 진행 상황 클라우드 저장
- 사용자 프로필 및 성취도 관리

## 기술 스택

### Mobile Development
- **Java**: 주요 개발 언어
- **Android Studio**: 개발 환경
- **Android SDK**: 안드로이드 앱 개발

### Backend & Cloud
- **Firebase**: 실시간 데이터베이스
- **AWS**: 클라우드 인프라 (Free Tier)
- **Google Cloud Platform**: 추가 서비스

### Development Tools
- **Git**: 버전 관리
- **Android Emulator**: 테스트 환경
- **Firebase Console**: 데이터 관리

## 개발 과정

### 1단계: 기획 및 설계
- 방탈출 카페 이용자들의 니즈 분석
- 앱 기능 기획 및 와이어프레임 작성
- 기술 스택 선정 및 아키텍처 설계

### 2단계: 개발 환경 구축
- Android Studio 설치 및 설정
- Firebase 프로젝트 생성
- AWS Free Tier 계정 설정

### 3단계: 핵심 기능 개발
- 게임 진행 관리 시스템 구현
- 타이머 및 힌트 시스템 개발
- 사용자 인터페이스 디자인 및 구현

### 4단계: 데이터베이스 연동
- Firebase Realtime Database 연동
- 사용자 데이터 관리 시스템 구축
- 실시간 데이터 동기화 구현

### 5단계: 테스트 및 배포
- 다양한 안드로이드 기기에서 테스트
- 버그 수정 및 성능 최적화
- Google Play Store 배포 준비

## 주요 기술적 도전과 해결

### 1. Java 학습
**도전**: 처음 접하는 Java 언어와 Android 개발
**해결**: 온라인 튜토리얼과 공식 문서를 통한 체계적 학습

### 2. Firebase 연동
**도전**: 실시간 데이터베이스 연동 및 동기화
**해결**: Firebase 문서와 예제를 참고하여 단계적 구현

### 3. AWS 활용
**도전**: 클라우드 서비스의 이해와 활용
**해결**: AWS Free Tier를 활용한 실습과 학습

## 결과 및 성과

### 정량적 성과
- **개발 완료**: 100% 기능 구현
- **테스트 기기**: 5개 이상의 안드로이드 기기
- **코드 라인**: 약 3,000줄의 Java 코드

### 정성적 성과
- Java 프로그래밍 언어 습득
- Android 앱 개발 경험 축적
- Firebase와 AWS 클라우드 서비스 활용 경험
- 실제 서비스 기획부터 개발까지의 전체 과정 경험

## 주요 코드 예시

### 게임 타이머 구현
```java
public class GameTimer {
    private CountDownTimer timer;
    private long timeLeftInMillis;
    private OnTimerTickListener listener;
    
    public void startTimer(long timeInMillis) {
        timeLeftInMillis = timeInMillis;
        timer = new CountDownTimer(timeLeftInMillis, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                timeLeftInMillis = millisUntilFinished;
                if (listener != null) {
                    listener.onTick(millisUntilFinished);
                }
            }
            
            @Override
            public void onFinish() {
                if (listener != null) {
                    listener.onFinish();
                }
            }
        }.start();
    }
}
```

### Firebase 데이터 저장
```java
public class FirebaseManager {
    private DatabaseReference database;
    
    public void saveGameProgress(GameProgress progress) {
        database = FirebaseDatabase.getInstance().getReference();
        String gameId = database.push().getKey();
        
        database.child("games").child(gameId).setValue(progress)
            .addOnSuccessListener(aVoid -> {
                Log.d("Firebase", "Game progress saved successfully");
            })
            .addOnFailureListener(e -> {
                Log.e("Firebase", "Failed to save game progress", e);
            });
    }
}
```

## 배운 점

### 1. Java 프로그래밍
- 객체지향 프로그래밍의 이해
- Android SDK 활용 방법
- 모바일 앱 개발의 기본 원리

### 2. 클라우드 서비스
- Firebase Realtime Database 활용
- AWS Free Tier 서비스 이해
- 클라우드 기반 데이터 관리

### 3. 프로젝트 관리
- 독립적인 프로젝트 기획 및 실행
- 문제 해결 능력 향상
- 지속적인 학습과 개선

## 프로젝트의 의미

### 개인적 성장
- 프로그래밍에 대한 흥미와 자신감 획득
- 실제 문제를 해결하는 개발 경험
- 지속적인 학습의 중요성 인식

### 기술적 성장
- Java 언어 습득
- Android 개발 환경 이해
- 클라우드 서비스 활용 경험

## 향후 개선 계획

- [ ] React Native로 크로스 플랫폼 확장
- [ ] 더 다양한 게임 모드 추가
- [ ] 소셜 기능 (랭킹, 친구와의 경쟁) 추가
- [ ] AI를 활용한 개인화된 힌트 시스템
- [ ] AR/VR 기술을 활용한 몰입형 경험

## 마무리

이 프로젝트는 제가 프로그래밍에 처음 관심을 갖게 된 계기가 된 의미 있는 프로젝트입니다. 비록 코로나19로 인해 실제 서비스 운영은 어려웠지만, 개발 과정에서 얻은 경험과 지식은 앞으로의 개발자 경력에 큰 도움이 되었습니다.

특히 혼자서 처음부터 끝까지 프로젝트를 완성해본 경험은 문제 해결 능력과 자기주도적 학습 능력을 크게 향상시켰습니다.

---

*프로젝트 링크: [GitHub Repository](https://github.com/username/escape-room-app) | [Live Demo](https://demo-url.com)*
