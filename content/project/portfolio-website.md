---
title: "포트폴리오 웹사이트"
description: "개인 포트폴리오 웹사이트를 개발한 프로젝트입니다."
period: "2024.01 - 2024.02"
teamSize: "1명"
role: "풀스택 개발"
achievements: "반응형 디자인, SEO 최적화, 다크모드 구현"
image: "image/portfolio-website.svg"
---

# 포트폴리오 웹사이트 프로젝트

## 프로젝트 개요

개인 포트폴리오 웹사이트를 개발한 프로젝트입니다. 모던하고 반응형 디자인을 적용하여 다양한 디바이스에서 최적의 사용자 경험을 제공합니다.

## 주요 기능

### 1. 반응형 디자인
- 모바일, 태블릿, 데스크톱 모든 디바이스 지원
- CSS Grid와 Flexbox를 활용한 레이아웃
- Tailwind CSS를 사용한 스타일링

### 2. 다크/라이트 모드
- 사용자 선호도에 따른 테마 변경
- 시스템 설정 자동 감지
- 로컬 스토리지에 설정 저장

### 3. 검색 기능
- 전체 콘텐츠 검색
- 키보드 단축키 지원 (Ctrl+K)
- 실시간 검색 결과

### 4. 마크다운 지원
- 포스트 작성에 마크다운 사용
- 코드 하이라이팅
- 자동 목차 생성

## 기술 스택

### Frontend
- **React 18**: 최신 React 기능 활용
- **TypeScript**: 타입 안정성 확보
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **Vite**: 빠른 개발 환경

### 마크다운 처리
- **marked.js**: 마크다운 파싱
- **highlight.js**: 코드 하이라이팅

### 배포
- **GitHub Pages**: 정적 사이트 호스팅
- **GitHub Actions**: 자동 배포

## 개발 과정

### 1단계: 기획 및 디자인
- 사용자 요구사항 분석
- 와이어프레임 작성
- 디자인 시스템 구축

### 2단계: 개발 환경 설정
```bash
npm create vite@latest portfolio -- --template react-ts
cd portfolio
npm install
```

### 3단계: 컴포넌트 개발
- 헤더 컴포넌트
- 네비게이션
- 검색 기능
- 포스트 목록
- 포스트 상세 페이지

### 4단계: 마크다운 시스템 구축
- 마크다운 파서 구현
- 프론트매터 처리
- 코드 하이라이팅

### 5단계: 스타일링 및 최적화
- 반응형 디자인 적용
- 성능 최적화
- 접근성 개선

## 주요 코드 예시

### 마크다운 처리
```typescript
class MarkdownProcessor {
  async processMarkdownFile(filePath: string) {
    const response = await fetch(filePath);
    const markdownContent = await response.text();
    
    const { metadata, content } = this.parseFrontMatter(markdownContent);
    const htmlContent = this.markdownToHTML(content);
    
    return {
      ...metadata,
      content: htmlContent,
      rawContent: content
    };
  }
}
```

### 테마 관리
```typescript
class ThemeManager {
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
  }
}
```

## 결과물

### 성능 지표
- **Lighthouse Score**: 95/100
- **First Contentful Paint**: 1.2s
- **Largest Contentful Paint**: 2.1s
- **Cumulative Layout Shift**: 0.05

### 사용자 피드백
- 직관적인 네비게이션
- 빠른 로딩 속도
- 깔끔한 디자인
- 모바일 사용성 우수

## 배운 점

### 1. 마크다운 시스템 구축
- 프론트매터 파싱 방법
- 마크다운을 HTML로 변환하는 과정
- 코드 하이라이팅 구현

### 2. 성능 최적화
- 이미지 최적화
- 코드 스플리팅
- 캐싱 전략

### 3. 사용자 경험
- 접근성 고려사항
- 반응형 디자인 패턴
- 다크 모드 구현

## 향후 개선 계획

- [ ] 댓글 시스템 추가
- [ ] SEO 최적화
- [ ] 다국어 지원
- [ ] PWA 기능 추가
- [ ] 분석 도구 연동

## 마무리

이 프로젝트를 통해 모던 웹 개발의 다양한 기술들을 경험할 수 있었습니다. 특히 마크다운 기반의 콘텐츠 관리 시스템을 구축하면서 정적 사이트 생성의 원리를 이해할 수 있었습니다.

앞으로도 지속적으로 개선하여 더 나은 개발자 경험을 제공하겠습니다.

---

*프로젝트 링크: [GitHub](https://github.com/gaeng02/portfolio) | [데모](https://gaeng02.github.io)* 